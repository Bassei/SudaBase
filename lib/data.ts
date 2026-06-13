import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Business, EconomicSector, Program, StudentReview, University, MarketIndicator } from '@/lib/types';

export async function getStats() {
  const supabase = createSupabaseServerClient();
  const [u, p, s, b, r] = await Promise.all([
    supabase.from('universities').select('*', { count: 'exact', head: true }),
    supabase.from('programs').select('*', { count: 'exact', head: true }),
    supabase.from('economic_sectors').select('*', { count: 'exact', head: true }),
    supabase.from('businesses').select('*', { count: 'exact', head: true }),
    supabase.from('student_reviews').select('*', { count: 'exact', head: true }).eq('status', 'approved')
  ]);
  return { universities: u.count ?? 0, programs: p.count ?? 0, sectors: s.count ?? 0, businesses: b.count ?? 0, reviews: r.count ?? 0 };
}

export async function getUniversities(params?: { q?: string; city?: string; ownership?: string; hasWebsite?: string; page?: number }) {
  const supabase = createSupabaseServerClient();
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
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('universities').select('*').eq('university_id', id).single();
  if (error) throw error;
  return data as University;
}

export async function getProgramsByUniversity(universityId: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('programs').select('*').eq('university_id', universityId).order('program_or_faculty');
  if (error) throw error;
  return (data ?? []) as Program[];
}

export async function getApprovedReviews(universityId?: string) {
  const supabase = createSupabaseServerClient();
  let q = supabase.from('student_reviews').select('*').eq('status', 'approved').order('created_at', { ascending: false }).limit(50);
  if (universityId) q = q.eq('university_id', universityId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as StudentReview[];
}

export async function getSectors() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('economic_sectors').select('*').order('sector_name_en');
  if (error) throw error;
  return (data ?? []) as EconomicSector[];
}

export async function getSector(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('economic_sectors').select('*').eq('sector_id', id).single();
  if (error) throw error;
  return data as EconomicSector;
}

export async function getBusinesses(params?: { q?: string; sector?: string; city?: string; page?: number }) {
  const supabase = createSupabaseServerClient();
  const page = params?.page ?? 1;
  const pageSize = 24;
  let query = supabase.from('businesses').select('*', { count: 'exact' }).order('name').range((page - 1) * pageSize, page * pageSize - 1);
  if (params?.q) query = query.or(`name.ilike.%${params.q}%,city.ilike.%${params.q}%,state.ilike.%${params.q}%`);
  if (params?.sector) query = query.eq('sector_id', params.sector);
  if (params?.city) query = query.eq('city', params.city);
  const { data, count, error } = await query;
  if (error) throw error;
  return { data: (data ?? []) as Business[], count: count ?? 0, page, pageSize };
}

export async function getBusiness(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('businesses').select('*').eq('business_id', id).single();
  if (error) throw error;
  return data as Business;
}

export async function getMarketIndicators() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from('market_indicators').select('*').order('fetched_at', { ascending: false }).limit(12);
  return (data ?? []) as MarketIndicator[];
}
