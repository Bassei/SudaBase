import { MarketTicker } from '@/components/market/market-ticker';
import { getMarketIndicators } from '@/lib/data';
export default async function MarketIndicatorsPage() { const indicators = await getMarketIndicators(); return <section className="mx-auto max-w-7xl space-y-6 px-4 py-12"><h1 className="text-4xl font-black">Market indicators</h1><p className="max-w-2xl text-slate-600">USD/SDG and gold price indicators are cached in Supabase to reduce API limits. Values are indicative and may differ from local Sudanese market prices.</p><MarketTicker indicators={indicators} /></section>; }

