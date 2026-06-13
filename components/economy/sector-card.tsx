import Link from 'next/link';
import type { EconomicSector } from '@/lib/types';

export function SectorCard({ sector }: { sector: EconomicSector }) {
  return <article className="card p-5"><Link href={`/sectors/${sector.sector_id}`} className="text-lg font-bold hover:underline">{sector.sector_name_en || sector.sector_id}</Link>{sector.sector_name_ar && <p dir="rtl" className="mt-1 text-sm text-slate-600">{sector.sector_name_ar}</p>}<p className="mt-3 line-clamp-3 text-sm text-slate-600">{sector.description || 'Sector profile is being prepared.'}</p><div className="mt-4 flex gap-2"><span className="badge">Competition: {sector.competition_level || 'n/a'}</span><span className="badge">Opportunity: {sector.opportunity_score ?? 'n/a'}</span></div></article>;
}

