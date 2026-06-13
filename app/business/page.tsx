import Link from 'next/link';
import { BriefcaseBusiness, Building2, LineChart, Map, Store } from 'lucide-react';
import { MarketTicker } from '@/components/market/market-ticker';
import { getMarketIndicators, getStats } from '@/lib/data';
import { StatCard } from '@/components/ui/stat-card';

const businessActions = [
  {
    title: 'Market indicators',
    description: 'Track USD, USDT, gold, silver, and other important market prices.',
    href: '/market-indicators',
    icon: LineChart
  },
  {
    title: 'Economic sectors',
    description: 'Explore sectors, competition level, risk, and opportunity score.',
    href: '/sectors',
    icon: Building2
  },
  {
    title: 'Business directory',
    description: 'Browse Sudanese businesses by sector, city, and source confidence.',
    href: '/businesses',
    icon: Store
  },
  {
    title: 'Market map',
    description: 'Future map view for business density and regional opportunity.',
    href: '/businesses',
    icon: Map
  }
];

export default async function BusinessPage() {
  const [stats, indicators] = await Promise.all([
    getStats(),
    getMarketIndicators()
  ]);

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-12">
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-amber-950 p-8 text-white md:p-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
          <BriefcaseBusiness className="h-8 w-8 text-amber-300" />
        </div>

        <h1 className="mt-6 text-4xl font-black md:text-6xl">
          For Businesses
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200">
          A business-focused interface for Sudanese market indicators, sectors,
          businesses, and market opportunity intelligence.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/market-indicators" className="btn bg-white text-slate-950">
            View market indicators
          </Link>

          <Link href="/sectors" className="btn border border-white/20 text-white">
            Explore sectors
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Economic sectors" value={stats.sectors} />
        <StatCard label="Businesses" value={stats.businesses} />
        <StatCard label="Market indicators" value={indicators.length} />
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Live market snapshot</h2>
        <MarketTicker indicators={indicators} />
        <p className="mt-3 text-sm text-slate-500">
          Prices are indicative and may differ from local market rates.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {businessActions.map(({ title, description, href, icon: Icon }) => (
          <Link key={title} href={href} className="card p-6">
            <Icon className="h-8 w-8 text-sudanGreen" />
            <h2 className="mt-4 text-xl font-black">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
