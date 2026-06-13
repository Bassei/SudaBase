import { SectorCard } from '@/components/economy/sector-card';
import { getSectors } from '@/lib/data';
export default async function SectorsPage() { const sectors = await getSectors(); return <section className="mx-auto max-w-7xl space-y-6 px-4 py-12"><h1 className="text-4xl font-black">Economic sectors</h1><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{sectors.map(s => <SectorCard key={s.sector_id} sector={s} />)}</div>{!sectors.length && <div className="card p-8 text-center text-slate-600">No sectors yet. Add sector records from the admin panel or SQL seed.</div>}</section>; }

