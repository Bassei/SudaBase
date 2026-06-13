import { UniversityCard } from '@/components/education/university-card';
import { SearchBar } from '@/components/ui/search-bar';
import { getUniversities } from '@/lib/data';

export default async function UniversitiesPage({ searchParams }: { searchParams: { q?: string; city?: string; ownership?: string; hasWebsite?: string; page?: string } }) {
  const result = await getUniversities({ ...searchParams, page: Number(searchParams.page || 1) });
  return <section className="mx-auto max-w-7xl space-y-6 px-4 py-12"><div><h1 className="text-4xl font-black">Universities</h1><p className="mt-2 text-slate-600">Search and filter Sudanese universities. Showing {result.data.length} of {result.count} records.</p></div><form className="card grid gap-3 p-4 md:grid-cols-5"><div className="md:col-span-2"><SearchBar defaultValue={searchParams.q} placeholder="Search by name or city" /></div><input name="city" className="input" defaultValue={searchParams.city} placeholder="City" /><input name="ownership" className="input" defaultValue={searchParams.ownership} placeholder="Ownership" /><select name="hasWebsite" className="input" defaultValue={searchParams.hasWebsite || ''}><option value="">Any website status</option><option value="yes">Has website</option></select><button className="btn-primary md:col-span-5">Apply filters</button></form><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{result.data.map(u => <UniversityCard key={u.university_id} university={u} />)}</div>{!result.data.length && <div className="card p-8 text-center text-slate-600">No universities found.</div>}</section>;
}

