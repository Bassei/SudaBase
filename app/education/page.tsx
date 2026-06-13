import Link from 'next/link';
import { getStats } from '@/lib/data';
import { StatCard } from '@/components/ui/stat-card';

export default async function EducationPage() {
  const stats = await getStats();

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-12">
      <div>
        <h1 className="text-4xl font-black">Education data</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Start by browsing universities. Programs and faculties are now shown inside
          each university profile to reduce confusion and keep the education section simple.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Universities" value={stats.universities} />
        <StatCard label="Programs inside universities" value={stats.programs} />
        <StatCard label="Approved reviews" value={stats.reviews} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/universities" className="card p-6 font-bold">
          Browse universities
          <p className="mt-2 text-sm font-normal text-slate-600">
            Open a university profile to see its programs and faculties.
          </p>
        </Link>

        <Link href="/compare-universities" className="card p-6 font-bold">
          Compare universities
          <p className="mt-2 text-sm font-normal text-slate-600">
            Compare rankings, ownership, city, and available data.
          </p>
        </Link>

        <Link href="/reviews" className="card p-6 font-bold">
          Student reviews
          <p className="mt-2 text-sm font-normal text-slate-600">
            Read and submit university reviews.
          </p>
        </Link>
      </div>
    </section>
  );
}

