-- Sudanese Database schema and RLS policies
create extension if not exists pgcrypto;

create table if not exists public.student_reviews (
  review_id uuid primary key default gen_random_uuid(),
  university_id text references public.universities(university_id) on delete cascade,
  user_id uuid null references auth.users(id) on delete set null,
  reviewer_name text null,
  faculty text,
  study_year text,
  teaching_score integer check (teaching_score between 1 and 5),
  admin_score integer check (admin_score between 1 and 5),
  facilities_score integer check (facilities_score between 1 and 5),
  environment_score integer check (environment_score between 1 and 5),
  value_score integer check (value_score between 1 and 5),
  overall_score numeric generated always as ((teaching_score + admin_score + facilities_score + environment_score + value_score)::numeric / 5) stored,
  comment text,
  verified boolean default false,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now()
);

create table if not exists public.economic_sectors (
  sector_id text primary key,
  sector_name_ar text,
  sector_name_en text,
  description text,
  competition_level text,
  opportunity_score integer check (opportunity_score between 0 and 100),
  risk_level text,
  market_size_estimate text,
  notes text,
  last_updated date
);

create table if not exists public.businesses (
  business_id text primary key,
  name text not null,
  sector_id text references public.economic_sectors(sector_id) on delete set null,
  state text,
  city text,
  address text,
  phone text,
  website text,
  facebook text,
  employees_estimate integer,
  branches_count integer,
  competitor_strength integer check (competitor_strength between 0 and 100),
  source_url text,
  source_name text,
  data_confidence text check (data_confidence in ('high','medium','low') or data_confidence is null),
  last_updated date
);

create table if not exists public.competitor_analysis (
  analysis_id uuid primary key default gen_random_uuid(),
  sector_id text references public.economic_sectors(sector_id) on delete cascade,
  city text,
  total_competitors integer,
  strong_competitors integer,
  medium_competitors integer,
  weak_competitors integer,
  competition_score integer check (competition_score between 0 and 100),
  opportunity_score integer check (opportunity_score between 0 and 100),
  summary text,
  created_at timestamptz default now()
);

create table if not exists public.market_indicators (
  indicator_id uuid primary key default gen_random_uuid(),
  indicator_type text not null,
  name text not null,
  value numeric not null,
  currency text,
  unit text,
  source_name text,
  source_url text,
  fetched_at timestamptz default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz default now()
);

create unique index if not exists one_review_per_user_university on public.student_reviews(user_id, university_id) where user_id is not null;
create index if not exists idx_universities_name_en on public.universities(name_en);
create index if not exists idx_universities_city on public.universities(city);
create index if not exists idx_programs_university_id on public.programs(university_id);
create index if not exists idx_businesses_sector_id on public.businesses(sector_id);
create index if not exists idx_businesses_city on public.businesses(city);
create index if not exists idx_reviews_university_id on public.student_reviews(university_id);
create index if not exists idx_market_type_fetched on public.market_indicators(indicator_type, fetched_at desc);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

alter table public.universities enable row level security;
alter table public.programs enable row level security;
alter table public.student_reviews enable row level security;
alter table public.economic_sectors enable row level security;
alter table public.businesses enable row level security;
alter table public.competitor_analysis enable row level security;
alter table public.market_indicators enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Public read universities" on public.universities;
create policy "Public read universities" on public.universities for select using (true);
drop policy if exists "Admin write universities" on public.universities;
create policy "Admin write universities" on public.universities for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read programs" on public.programs;
create policy "Public read programs" on public.programs for select using (true);
drop policy if exists "Admin write programs" on public.programs;
create policy "Admin write programs" on public.programs for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read approved reviews" on public.student_reviews;
create policy "Public read approved reviews" on public.student_reviews for select using (status = 'approved');
drop policy if exists "Anyone can submit pending reviews" on public.student_reviews;
create policy "Anyone can submit pending reviews" on public.student_reviews for insert with check (status = 'pending' and verified = false and (auth.uid() is null or user_id = auth.uid()));
drop policy if exists "Admin moderate reviews" on public.student_reviews;
create policy "Admin moderate reviews" on public.student_reviews for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read sectors" on public.economic_sectors;
create policy "Public read sectors" on public.economic_sectors for select using (true);
drop policy if exists "Admin write sectors" on public.economic_sectors;
create policy "Admin write sectors" on public.economic_sectors for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read businesses" on public.businesses;
create policy "Public read businesses" on public.businesses for select using (true);
drop policy if exists "Admin write businesses" on public.businesses;
create policy "Admin write businesses" on public.businesses for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read competitor analysis" on public.competitor_analysis;
create policy "Public read competitor analysis" on public.competitor_analysis for select using (true);
drop policy if exists "Admin write competitor analysis" on public.competitor_analysis;
create policy "Admin write competitor analysis" on public.competitor_analysis for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read market indicators" on public.market_indicators;
create policy "Public read market indicators" on public.market_indicators for select using (true);
drop policy if exists "Admin write market indicators" on public.market_indicators;
create policy "Admin write market indicators" on public.market_indicators for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins read admin users" on public.admin_users;
create policy "Admins read admin users" on public.admin_users for select using (public.is_admin());

-- Useful data quality views
create or replace view public.v_duplicate_universities as
select lower(trim(name_en)) as normalized_name, count(*) as duplicate_count, array_agg(university_id) as university_ids
from public.universities where name_en is not null group by lower(trim(name_en)) having count(*) > 1;

create or replace view public.v_missing_university_websites as
select university_id, name_en, city, ownership from public.universities where website is null or trim(website) = '';

create or replace view public.v_suspicious_programs as
select * from public.programs where program_or_faculty is null or length(program_or_faculty) < 3 or confidence = 'low';
