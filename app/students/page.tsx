import Link from 'next/link';
import { GraduationCap, Search, Star, GitCompare } from 'lucide-react';
import { getStats } from '@/lib/data';
import { StatCard } from '@/components/ui/stat-card';

const studentActions = [
  {
    title: 'Find a university',
    description: 'Search Sudanese universities by name, city, ownership, and available data.',
    href: '/universities',
    icon: Search
  },
  {
    title: 'Compare universities',
    description: 'Compare two or three universities side by side.',
    href: '/compare-universities',
    icon: GitCompare
  },
  {
    title: 'Student reviews',
    description: 'Open a university profile to read or submit student reviews.',
    href: '/universities',
    icon: Star
  }
];

export default async function StudentsPage() {
  const stats = await getStats();

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-12">
      <div className="rounded-3xl bg-gradient-to-br from-green-950 to-slate-950 p-8 text-white md:p-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
          <GraduationCap className="h-8 w-8 text-green-300" />
        </div>

        <h1 className="mt-6 text-4xl font-black md:text-6xl">
          For Students
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200">
          A simple student-focused guide to Sudanese universities, programs,
          comparison, and student experiences.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/universities" className="btn bg-white text-slate-950">
            Browse universities
          </Link>

          <Link href="/compare-universities" className="btn border border-white/20 text-white">
            Compare universities
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Universities" value={stats.universities} />
        <StatCard label="Programs inside universities" value={stats.programs} />
        <StatCard label="Student reviews" value={stats.reviews} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {studentActions.map(({ title, description, href, icon: Icon }) => (
          <Link key={title} href={href} className="card p-6">
            <Icon className="h-8 w-8 text-sudanGreen" />
            <h2 className="mt-4 text-xl font-black">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </Link>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-2xl font-black">How to use this section</h2>
        <p className="mt-3 max-w-3xl text-slate-600">
          Start by searching for a university. Open its profile to see programs,
          faculties, rankings, sources, and student reviews. Reviews are kept inside
          university pages to make the experience easier.
        </p>
      </div>
    </section>
  );
}
