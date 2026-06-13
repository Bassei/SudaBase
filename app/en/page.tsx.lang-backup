import Link from 'next/link';
import { BriefcaseBusiness, GraduationCap, SearchCheck } from 'lucide-react';
import { MarketTicker } from '@/components/market/market-ticker';
import { getMarketIndicators, getStats } from '@/lib/data';
import { StatCard } from '@/components/ui/stat-card';

const audiences = [
  {
    title: 'For Students',
    subtitle: 'Universities, programs, comparison, and student reviews.',
    description:
      'Find Sudanese universities, explore available programs, compare institutions, and read student experiences.',
    href: '/en/students',
    icon: GraduationCap,
    cta: 'Start as student'
  },
  {
    title: 'For Businesses',
    subtitle: 'Market indicators, sectors, businesses, and opportunities.',
    description:
      'Track USD, USDT, gold, and silver indicators, explore sectors, and understand market opportunities.',
    href: '/en/business',
    icon: BriefcaseBusiness,
    cta: 'Explore business data'
  },
  {
    title: 'For Researchers',
    subtitle: 'Structured datasets, sources, methodology, and data quality.',
    description:
      'Access Sudanese education and economic datasets with sources, confidence labels, and update information.',
    href: '/en/research',
    icon: SearchCheck,
    cta: 'Open research portal'
  }
];

export default async function EnglishHomePage() {
  const [stats, indicators] = await Promise.all([
    getStats(),
    getMarketIndicators()
  ]);

  return (
    <div dir="ltr">
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-green-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm">
              Sudan Education & Economic Data Infrastructure
            </p>

            <Link
              href="/ar"
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-white hover:bg-white hover:text-slate-950"
            >
              العربية
            </Link>
          </div>

          <h1 className="max-w-5xl text-5xl font-black tracking-tight md:text-7xl">
            Sudanese Database
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
            A national data platform for students, businesses, researchers,
            universities, organizations, and decision makers. Choose the interface
            that matches your goal.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {audiences.map(({ title, subtitle, description, href, icon: Icon, cta }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur transition hover:bg-white hover:text-slate-950"
              >
                <Icon className="h-10 w-10 text-green-300 group-hover:text-sudanGreen" />

                <h2 className="mt-5 text-2xl font-black">
                  {title}
                </h2>

                <p className="mt-2 font-semibold text-slate-200 group-hover:text-slate-700">
                  {subtitle}
                </p>

                <p className="mt-4 text-sm leading-6 text-slate-300 group-hover:text-slate-600">
                  {description}
                </p>

                <span className="mt-6 inline-flex font-bold underline">
                  {cta}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 py-12">
        <div>
          <h2 className="text-3xl font-black">Platform snapshot</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            The same national database powers different experiences for different users.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <StatCard label="Universities" value={stats.universities} />
          <StatCard label="Programs" value={stats.programs} />
          <StatCard label="Sectors" value={stats.sectors} />
          <StatCard label="Businesses" value={stats.businesses} />
          <StatCard label="Reviews" value={stats.reviews} />
        </div>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Market snapshot</h2>
              <p className="mt-1 text-sm text-slate-500">
                Indicative prices for quick awareness. Full market tools are inside the business interface.
              </p>
            </div>

            <Link href="/business" className="hidden font-bold text-sudanGreen md:inline-flex">
              Open business interface
            </Link>
          </div>

          <MarketTicker indicators={indicators} />

          <p className="mt-3 text-sm text-slate-500">
            Exchange, USDT, gold, and silver prices are indicative and may differ from local Sudanese market prices.
          </p>
        </section>
      </section>
    </div>
  );
}

