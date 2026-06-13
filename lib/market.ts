import { createSupabaseServerClient } from '@/lib/supabase/server';

const CACHE_MINUTES = 60;
export async function latestIndicator(type: string) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from('market_indicators').select('*').eq('indicator_type', type).order('fetched_at', { ascending: false }).limit(1).maybeSingle();
  if (!data) return null;
  const age = Date.now() - new Date(data.fetched_at).getTime();
  return age < CACHE_MINUTES * 60 * 1000 ? data : null;
}

export async function saveIndicator(input: { indicator_type: string; name: string; value: number; currency: string; unit?: string; source_name: string; source_url: string }) {
  const supabase = createSupabaseServerClient();
  await supabase.from('market_indicators').insert(input);
  return input;
}

export async function fetchUsdSdg() {
  const cached = await latestIndicator('usd_sdg');
  if (cached) return cached;
  const key = process.env.CURRENCY_API_KEY;
  if (!key) throw new Error('CURRENCY_API_KEY is not configured.');
  const res = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${key}&base_currency=USD&currencies=SDG`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Currency provider failed.');
  const json = await res.json();
  const value = Number(json?.data?.SDG?.value);
  if (!Number.isFinite(value)) throw new Error('Currency response did not include SDG.');
  return saveIndicator({ indicator_type: 'usd_sdg', name: 'USD to SDG', value, currency: 'SDG', unit: '1 USD', source_name: 'currencyapi.com', source_url: 'https://currencyapi.com' });
}

export async function fetchGold() {
  const key = process.env.GOLD_API_KEY;
  if (!key) throw new Error('GOLD_API_KEY is not configured.');
  const usdSdg = await fetchUsdSdg();
  const res = await fetch('https://www.goldapi.io/api/XAU/USD', { headers: { 'x-access-token': key, 'Content-Type': 'application/json' }, next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Gold provider failed.');
  const json = await res.json();
  const ounceUsd = Number(json.price);
  if (!Number.isFinite(ounceUsd)) throw new Error('Gold response did not include price.');
  const gramUsd = ounceUsd / 31.1034768;
  const rate = Number(usdSdg.value);
  const rows = [
    { indicator_type: 'gold_ounce_usd', name: 'Gold ounce USD', value: ounceUsd, currency: 'USD', unit: 'ounce' },
    { indicator_type: 'gold_gram_usd', name: 'Gold gram USD', value: gramUsd, currency: 'USD', unit: 'gram' },
    { indicator_type: 'gold_ounce_sdg', name: 'Gold ounce SDG', value: ounceUsd * rate, currency: 'SDG', unit: 'ounce' },
    { indicator_type: 'gold_gram_sdg', name: 'Gold gram SDG', value: gramUsd * rate, currency: 'SDG', unit: 'gram' }
  ];
  const supabase = createSupabaseServerClient();
  await supabase.from('market_indicators').insert(rows.map(r => ({ ...r, source_name: 'GoldAPI.io', source_url: 'https://www.goldapi.io' })));
  return rows;
}
