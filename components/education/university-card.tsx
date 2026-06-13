import Link from 'next/link';
import type { University } from '@/lib/types';

export function UniversityCard({ university }: { university: University }) {
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href={`/university/${university.university_id}`} className="text-lg font-bold hover:underline">{university.name_en || 'Unnamed university'}</Link>
          {university.name_ar && <p dir="rtl" className="mt-1 text-sm text-slate-600">{university.name_ar}</p>}
        </div>
        {university.website && <a className="badge" target="_blank" href={university.website}>Website</a>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm"><span className="badge">{university.city || 'Unknown city'}</span><span className="badge">{university.ownership || 'Ownership unknown'}</span></div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-2xl bg-slate-50 p-3"><dt className="text-slate-500">UniRank</dt><dd className="font-bold">{university.rank_unirank_sudan ?? '—'}</dd></div>
        <div className="rounded-2xl bg-slate-50 p-3"><dt className="text-slate-500">EduRank</dt><dd className="font-bold">{university.rank_edurank_sudan ?? '—'}</dd></div>
        <div className="rounded-2xl bg-slate-50 p-3"><dt className="text-slate-500">Web</dt><dd className="font-bold">{university.rank_webometrics_sudan ?? '—'}</dd></div>
      </dl>
    </article>
  );
}

