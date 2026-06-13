import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

type IndicatorInput = {
  indicator_type: string;
  name: string;
  value: number;
  currency: string;
  unit: string;
  source_name: string;
  source_url: string;
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

function manualOfficialUsdRates(): IndicatorInput[] {
  const buying = Number(process.env.OFFICIAL_USD_BUYING || 0);
  const selling = Number(process.env.OFFICIAL_USD_SELLING || 0);
  const middle = Number(process.env.OFFICIAL_USD_MIDDLE || 0);

  const sourceUrl = 'https://cbos.gov.sd/en/exchange-rates';
  const indicators: IndicatorInput[] = [];

  if (buying > 0) {
    indicators.push({
      indicator_type: 'currency',
      name: 'USD Official Buying Rate',
      value: buying,
      currency: 'SDG',
      unit: '1 USD',
      source_name: 'Central Bank of Sudan - manual daily update',
      source_url: sourceUrl
    });
  }

  if (selling > 0) {
    indicators.push({
      indicator_type: 'currency',
      name: 'USD Official Selling Rate',
      value: selling,
      currency: 'SDG',
      unit: '1 USD',
      source_name: 'Central Bank of Sudan - manual daily update',
      source_url: sourceUrl
    });
  }

  if (middle > 0) {
    indicators.push({
      indicator_type: 'currency',
      name: 'USD Official Middle Rate',
      value: middle,
      currency: 'SDG',
      unit: '1 USD',
      source_name: 'Central Bank of Sudan - manual daily update',
      source_url: sourceUrl
    });
  }

  return indicators;
}

async function fetchBinanceUsdtSdg(): Promise<IndicatorInput[]> {
  const sourceUrl = 'https://p2p.binance.com/en/trade/USDT?fiat=SDG';

  try {
    const response = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'SudaneseDatabase/1.0'
      },
      body: JSON.stringify({
        asset: 'USDT',
        fiat: 'SDG',
        tradeType: 'BUY',
        page: 1,
        rows: 10,
        payTypes: [],
        publisherType: null
      })
    });

    if (!response.ok) {
      return manualUsdtFallback();
    }

    const json = await response.json();
    const rows = Array.isArray(json?.data) ? json.data : [];

    const prices = rows
      .map((row: any) => Number(row?.adv?.price))
      .filter((price: number) => Number.isFinite(price) && price > 0);

    if (!prices.length) {
      return manualUsdtFallback();
    }

    const bestPrice = prices[0];
    const averageTop10 =
      prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length;

    return [
      {
        indicator_type: 'p2p',
        name: 'USDT Binance P2P Best Price',
        value: Number(bestPrice.toFixed(2)),
        currency: 'SDG',
        unit: '1 USDT',
        source_name: 'Binance P2P',
        source_url: sourceUrl
      },
      {
        indicator_type: 'p2p',
        name: 'USDT Binance P2P Average Top 10',
        value: Number(averageTop10.toFixed(2)),
        currency: 'SDG',
        unit: '1 USDT',
        source_name: 'Binance P2P',
        source_url: sourceUrl
      }
    ];
  } catch {
    return manualUsdtFallback();
  }
}

function manualUsdtFallback(): IndicatorInput[] {
  const value = Number(process.env.USDT_SDG_MANUAL || 0);

  if (value <= 0) {
    return [];
  }

  return [
    {
      indicator_type: 'p2p',
      name: 'USDT Manual Market Rate',
      value,
      currency: 'SDG',
      unit: '1 USDT',
      source_name: 'Manual fallback',
      source_url: 'manual'
    }
  ];
}

function manualMetals(): IndicatorInput[] {
  const gold = Number(process.env.GOLD_OUNCE_USD || 0);
  const silver = Number(process.env.SILVER_OUNCE_USD || 0);

  const indicators: IndicatorInput[] = [];

  if (gold > 0) {
    indicators.push({
      indicator_type: 'metal',
      name: 'Gold Ounce USD',
      value: gold,
      currency: 'USD',
      unit: '1 troy ounce',
      source_name: 'Manual daily update',
      source_url: 'manual'
    });
  }

  if (silver > 0) {
    indicators.push({
      indicator_type: 'metal',
      name: 'Silver Ounce USD',
      value: silver,
      currency: 'USD',
      unit: '1 troy ounce',
      source_name: 'Manual daily update',
      source_url: 'manual'
    });
  }

  return indicators;
}

export async function GET() {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { ok: false, error: 'Missing SUPABASE_SERVICE_ROLE_KEY' },
        { status: 500 }
      );
    }

    const indicators = [
      ...manualOfficialUsdRates(),
      ...(await fetchBinanceUsdtSdg()),
      ...manualMetals()
    ];

    if (!indicators.length) {
      return NextResponse.json(
        { ok: false, error: 'No market indicators available. Add values to .env.local.' },
        { status: 502 }
      );
    }

    const { error } = await supabaseAdmin
      .from('market_indicators')
      .insert(indicators);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      saved: indicators.length,
      indicators
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || 'Failed to refresh market indicators' },
      { status: 500 }
    );
  }
}
