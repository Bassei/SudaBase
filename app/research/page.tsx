import Link from 'next/link';
import { Database, FileSearch, ShieldCheck, TableProperties } from 'lucide-react';
import { getStats } from '@/lib/data';
import { StatCard } from '@/components/ui/stat-card';

const researchActions = [
  {
    title: 'Education datasets',
    description: 'Explore structured university and program datasets with source information.',
    href: '/universities',
    icon: TableProperties
  },
  {
    title: 'Economic datasets',
    description: 'Explore sectors, businesses, market indicators, and business intelligence records.',
    href: '/economy',
    icon: Database
  },
  {
    title: 'Methodology',
    description: 'Review how data is collected, cleaned, labeled, and updated.',
    href: '/methodology',
    icon: FileSearch
  },
  {
    title: 'Data quality',
    description: 'Future dashboard for duplicates, missing fields, outdated records, and confidence labels.',
    href: '/admin',
    icon: ShieldCheck
  }
];

export default async function ResearchPage() {
  const stats = await getStats();

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-12">
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-indigo-950 p-8 text-white md:p-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
          <Database className="h-8 w-8 text-indigo-300" />
        </div>

        <h1 className="mt-6 text-4xl font-black md:text-6xl">
          For Researchers
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
          A structured research interface for Sudanese education and economic data.
          Designed for researchers, universities, organizations, journalists, and analysts.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/methodology" className="btn bg-white text-slate-950">
            Read methodology
          </Link>

          <Link href="/universities" className="btn border border-white/20 text-white">
            Explore datasets
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <StatCard label="Universities" value={stats.universities} />
        <StatCard label="Programs" value={stats.programs} />
        <StatCard label="Sectors" value={stats.sectors} />
        <StatCard label="Businesses" value={stats.businesses} />
        <StatCard label="Reviews" value={stats.reviews} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {researchActions.map(({ title, description, href, icon: Icon }) => (
          <Link key={title} href={href} className="card p-6">
            <Icon className="h-8 w-8 text-sudanGreen" />
            <h2 className="mt-4 text-xl font-black">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </Link>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-2xl font-black">Research portal direction</h2>
        <p className="mt-3 max-w-3xl text-slate-600">
          This section will later include dataset downloads, advanced filters,
          source confidence, update history, and API access. For now, it provides
          a clean entry point to the structured data already available.
        </p>
      </div>
    </section>
  );
}
