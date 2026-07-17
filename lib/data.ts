import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Business, EconomicSector, Program, StudentReview, University, MarketIndicator } from '@/lib/types';

type BusinessRow = {
  company_id: string;
  company_name: string | null;
  sector: string | null;
  sector_name_ar: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  social_links: string | null;
  phones: string | null;
  sudan_relevance_score: number | null;
  quality_score: number | null;
  source_url: string | null;
  source_domain: string | null;
  scraped_at: string | null;
};

function toSectorId(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function mapBusiness(row: BusinessRow): Business {
  return {
    business_id: row.company_id,
    name: row.company_name || 'Unnamed business',
    sector_id: row.sector,
    state: row.country,
    city: row.city,
    address: null,
    phone: row.phones,
    website: row.website,
    facebook: row.social_links,
    employees_estimate: null,
    branches_count: null,
    competitor_strength: row.sudan_relevance_score,
    source_url: row.source_url,
    source_name: row.source_domain,
    data_confidence:
      row.quality_score === null ? null : `${Math.round(row.quality_score)}/100`,
    last_updated: row.scraped_at,
  };
}

export async function getStats() {
  const supabase = await createSupabaseServerClient();
  const [u, p, b, r, sectorData] = await Promise.all([
    supabase.from('universities').select('*', { count: 'exact', head: true }),
    supabase.from('programs').select('*', { count: 'exact', head: true }),
    supabase.from('businesses_public').select('*', { count: 'exact', head: true }),
    supabase.from('student_reviews').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('businesses_public').select('sector').limit(1000),
  ]);
  const sectors = new Set(
    (sectorData.data ?? [])
      .map((row) => row.sector)
      .filter((value): value is string => Boolean(value))
  ).size;
  return { universities: u.count ?? 0, programs: p.count ?? 0, sectors, businesses: b.count ?? 0, reviews: r.count ?? 0 };
}

export async function getUniversities(params?: { q?: string; city?: string; ownership?: string; hasWebsite?: string; page?: number }) {
  const supabase = await createSupabaseServerClient();
  const page = params?.page ?? 1;
  const pageSize = 24;
  let query = supabase.from('universities').select('*', { count: 'exact' }).order('name_en').range((page - 1) * pageSize, page * pageSize - 1);
  if (params?.q) query = query.or(`name_en.ilike.%${params.q}%,name_ar.ilike.%${params.q}%,city.ilike.%${params.q}%`);
  if (params?.city) query = query.eq('city', params.city);
  if (params?.ownership) query = query.eq('ownership', params.ownership);
  if (params?.hasWebsite === 'yes') query = query.not('website', 'is', null).neq('website', '');
  const { data, count, error } = await query;
  if (error) throw error;
  return { data: (data ?? []) as University[], count: count ?? 0, page, pageSize };
}

export async function getUniversity(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('universities').select('*').eq('university_id', id).single();
  if (error) throw error;
  return data as University;
}

export async function getProgramsByUniversity(universityId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('programs').select('*').eq('university_id', universityId).order('program_or_faculty');
  if (error) throw error;
  return (data ?? []) as Program[];
}

export async function getApprovedReviews(universityId?: string) {
  const supabase = await createSupabaseServerClient();
  let q = supabase.from('student_reviews').select('*').eq('status', 'approved').order('created_at', { ascending: false }).limit(50);
  if (universityId) q = q.eq('university_id', universityId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as StudentReview[];
}

export async function getSectors() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('businesses_public')
    .select('sector,sector_name_ar')
    .not('sector', 'is', null)
    .limit(1000);
  if (error) throw error;
  const unique = new Map<string, EconomicSector>();
  for (const row of data ?? []) {
    const name = row.sector?.trim();
    if (!name || unique.has(name)) continue;
    unique.set(name, {
      sector_id: toSectorId(name),
      sector_name_ar: row.sector_name_ar,
      sector_name_en: name,
      description: null,
      competition_level: null,
      opportunity_score: null,
      risk_level: null,
      market_size_estimate: null,
      notes: null,
      last_updated: null,
    });
  }
  return Array.from(unique.values()).sort((a, b) =>
    String(a.sector_name_en).localeCompare(String(b.sector_name_en))
  );
}

export async function getSector(id: string) {
  const sectors = await getSectors();
  const sector = sectors.find(
    (item) => item.sector_id === id || item.sector_name_en === decodeURIComponent(id)
  );
  if (!sector) throw new Error('Sector not found.');
  return sector;
}

export async function getBusinesses(params?: { q?: string; sector?: string; city?: string; page?: number }) {
  const supabase = await createSupabaseServerClient();
  const page = params?.page ?? 1;
  const pageSize = 24;
  let query = supabase.from('businesses_public').select('*', { count: 'exact' }).order('company_name').range((page - 1) * pageSize, page * pageSize - 1);
  if (params?.q) {
    const term = params.q.replace(/[,()%]/g, ' ').trim();
    if (term) query = query.or(`company_name.ilike.%${term}%,city.ilike.%${term}%,sector.ilike.%${term}%`);
  }
  if (params?.sector) query = query.eq('sector', params.sector);
  if (params?.city) query = query.eq('city', params.city);
  const { data, count, error } = await query;
  if (error) throw error;
  return { data: ((data ?? []) as BusinessRow[]).map(mapBusiness), count: count ?? 0, page, pageSize };
}

export async function getBusiness(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('businesses_public').select('*').eq('company_id', id).single();
  if (error) throw error;
  return mapBusiness(data as BusinessRow);
}

export async function getMarketIndicators() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from('market_indicators').select('*').order('fetched_at', { ascending: false }).limit(12);
  return (data ?? []) as MarketIndicator[];
}
