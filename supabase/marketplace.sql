-- United Fruit marketplace add-on for the existing Sudanese Database project.
-- Safe to run more than once from the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.uf_products (
  product_id text primary key,
  name_ar text not null,
  name_en text not null,
  unit text not null default 'جوال 90 كجم',
  source_price_min numeric null,
  source_price_max numeric null,
  khartoum_price_min numeric null,
  khartoum_price_max numeric null,
  source_region text not null,
  category text not null default 'crop',
  active boolean not null default true,
  transport_status text null,
  evidence_level text null,
  pilot_status text null,
  key_caveat text null,
  source_date date null,
  last_updated timestamptz not null default now()
);

create table if not exists public.uf_farmers (
  farmer_id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null default '',
  email text null,
  contact_method text not null default 'phone'
    check (contact_method in ('phone', 'email', 'whatsapp')),
  region text not null,
  primary_crop text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.uf_buyers (
  buyer_id uuid primary key default gen_random_uuid(),
  business_name text not null,
  business_type text not null,
  phone text not null default '',
  email text null,
  contact_method text not null default 'phone'
    check (contact_method in ('phone', 'email', 'whatsapp')),
  location text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.uf_supply_requests (
  supply_request_id uuid primary key default gen_random_uuid(),
  farmer_id uuid null references public.uf_farmers(farmer_id) on delete set null,
  farmer_phone text not null,
  product_id text not null references public.uf_products(product_id) on delete restrict,
  quantity_jowal integer not null check (quantity_jowal > 0),
  harvest_location text not null,
  expected_available_date date not null,
  status text not null default 'قيد المراجعة'
    check (status in ('قيد المراجعة', 'تم التواصل', 'تمت المطابقة مع مشترٍ', 'تمت المطابقة، جاري التنسيق', 'مكتملة', 'ملغاة')),
  notes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.uf_demand_requests (
  demand_request_id uuid primary key default gen_random_uuid(),
  buyer_id uuid null references public.uf_buyers(buyer_id) on delete set null,
  buyer_phone text not null,
  product_id text not null references public.uf_products(product_id) on delete restrict,
  quantity_jowal integer not null check (quantity_jowal >= 400),
  target_price numeric null,
  requested_delivery_date date not null,
  status text not null default 'قيد المراجعة'
    check (status in ('قيد المراجعة', 'تم التواصل', 'تمت المطابقة، جاري التنسيق', 'مكتملة', 'ملغاة')),
  notes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.uf_matches (
  match_id uuid primary key default gen_random_uuid(),
  supply_request_id uuid not null references public.uf_supply_requests(supply_request_id) on delete cascade,
  demand_request_id uuid not null references public.uf_demand_requests(demand_request_id) on delete cascade,
  final_price numeric null,
  actual_delivery_date date null,
  status text not null default 'قيد التنفيذ'
    check (status in ('قيد التنفيذ', 'مكتملة', 'ملغاة')),
  notes text null,
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (supply_request_id, demand_request_id)
);

create table if not exists public.uf_technicians (
  technician_id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique null,
  phone text unique null,
  status text not null default 'active'
    check (status in ('active', 'pending', 'disabled')),
  created_at timestamptz not null default now(),
  check (email is not null or phone is not null)
);

create table if not exists public.uf_transport_lanes (
  lane_id uuid primary key default gen_random_uuid(),
  origin text not null,
  destination text not null,
  distance_km numeric null,
  truck_type text not null default 'شاحنة',
  min_jowal integer not null default 400,
  estimated_cost_min numeric null,
  estimated_cost_max numeric null,
  notes text null,
  active boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (origin, destination, truck_type)
);

create table if not exists public.uf_price_sources (
  source_id uuid primary key default gen_random_uuid(),
  name text unique not null,
  source_url text null,
  source_type text not null default 'manual'
    check (source_type in ('manual', 'exchange', 'p2p', 'commodity', 'sheet')),
  notes text null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.uf_product_price_updates (
  update_id uuid primary key default gen_random_uuid(),
  product_id text not null references public.uf_products(product_id) on delete cascade,
  source_price_min numeric null,
  source_price_max numeric null,
  khartoum_price_min numeric null,
  khartoum_price_max numeric null,
  source_id uuid null references public.uf_price_sources(source_id) on delete set null,
  updated_by uuid null references auth.users(id) on delete set null,
  note text null,
  created_at timestamptz not null default now()
);

create table if not exists public.uf_market_evidence (
  evidence_id uuid primary key default gen_random_uuid(),
  evidence_key text unique null,
  evidence_date date not null,
  evidence_type text not null,
  product text not null,
  actor_source text null,
  location text null,
  quantity_scope text null,
  price_quote text null,
  lead_time_days integer null,
  classification text null,
  pitch_use text null,
  key_insight text null,
  critical_caveat text null,
  created_at timestamptz not null default now()
);

create index if not exists idx_uf_supply_status_created on public.uf_supply_requests(status, created_at desc);
create index if not exists idx_uf_demand_status_created on public.uf_demand_requests(status, created_at desc);
create index if not exists idx_uf_supply_farmer_phone on public.uf_supply_requests(farmer_phone);
create index if not exists idx_uf_demand_buyer_phone on public.uf_demand_requests(buyer_phone);
create index if not exists idx_uf_price_updates_product_created on public.uf_product_price_updates(product_id, created_at desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid())
    or exists (
      select 1 from public.uf_technicians
      where status = 'active'
        and (
          (email is not null and lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')))
          or (phone is not null and phone = coalesce(auth.jwt() ->> 'phone', ''))
        )
    );
$$;

alter table public.admin_users enable row level security;
alter table public.uf_products enable row level security;
alter table public.uf_farmers enable row level security;
alter table public.uf_buyers enable row level security;
alter table public.uf_supply_requests enable row level security;
alter table public.uf_demand_requests enable row level security;
alter table public.uf_matches enable row level security;
alter table public.uf_technicians enable row level security;
alter table public.uf_transport_lanes enable row level security;
alter table public.uf_price_sources enable row level security;
alter table public.uf_product_price_updates enable row level security;
alter table public.uf_market_evidence enable row level security;

drop policy if exists "Public read United Fruit products" on public.uf_products;
create policy "Public read United Fruit products" on public.uf_products for select using (active = true);
drop policy if exists "Admins read admin users" on public.admin_users;
create policy "Admins read admin users" on public.admin_users for select using (public.is_admin());
drop policy if exists "Admin manage United Fruit products" on public.uf_products;
create policy "Admin manage United Fruit products" on public.uf_products for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin manage United Fruit farmers" on public.uf_farmers;
create policy "Admin manage United Fruit farmers" on public.uf_farmers for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin manage United Fruit buyers" on public.uf_buyers;
create policy "Admin manage United Fruit buyers" on public.uf_buyers for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin manage United Fruit supply" on public.uf_supply_requests;
create policy "Admin manage United Fruit supply" on public.uf_supply_requests for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin manage United Fruit demand" on public.uf_demand_requests;
create policy "Admin manage United Fruit demand" on public.uf_demand_requests for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin manage United Fruit matches" on public.uf_matches;
create policy "Admin manage United Fruit matches" on public.uf_matches for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin manage United Fruit technicians" on public.uf_technicians;
create policy "Admin manage United Fruit technicians" on public.uf_technicians for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Public read active transport lanes" on public.uf_transport_lanes;
create policy "Public read active transport lanes" on public.uf_transport_lanes for select using (active = true);
drop policy if exists "Admin manage transport lanes" on public.uf_transport_lanes;
create policy "Admin manage transport lanes" on public.uf_transport_lanes for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Public read active price sources" on public.uf_price_sources;
create policy "Public read active price sources" on public.uf_price_sources for select using (active = true);
drop policy if exists "Admin manage price sources" on public.uf_price_sources;
create policy "Admin manage price sources" on public.uf_price_sources for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin manage product price updates" on public.uf_product_price_updates;
create policy "Admin manage product price updates" on public.uf_product_price_updates for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin manage market evidence" on public.uf_market_evidence;
create policy "Admin manage market evidence" on public.uf_market_evidence for all using (public.is_admin()) with check (public.is_admin());

grant usage on schema public to anon, authenticated, service_role;
grant select on public.uf_products, public.uf_transport_lanes, public.uf_price_sources to anon, authenticated;
grant all on public.admin_users, public.uf_products, public.uf_farmers, public.uf_buyers,
  public.uf_supply_requests, public.uf_demand_requests, public.uf_matches,
  public.uf_technicians, public.uf_transport_lanes, public.uf_price_sources,
  public.uf_product_price_updates, public.uf_market_evidence to service_role;
grant execute on function public.is_admin() to authenticated, service_role;

insert into public.uf_products (
  product_id, name_ar, name_en, unit, source_price_min, source_price_max,
  khartoum_price_min, khartoum_price_max, source_region, transport_status,
  evidence_level, pilot_status, key_caveat, source_date
) values
  ('feterita', 'الفتريتة', 'Feterita (Wad Akr)', 'جوال 90 كجم', 130000, 130000, 160000, 160000, 'الجزيرة', 'Verified: Wad Madani → Khartoum', 'Verified prices and transport', 'Secondary pilot candidate', 'Buyer demand and quality specifications need validation.', '2026-07-08'),
  ('wheat', 'القمح', 'Wheat', 'جوال 90 كجم', 165000, 170000, 210000, 250000, 'الجزيرة', 'Verified: Wad Madani → Khartoum', 'Verified prices and transport', 'Best first pilot candidate', 'Stored stock only; outside harvest season.', '2026-07-08'),
  ('onion', 'البصل', 'Onion', 'جوال 90 كجم', 65000, 80000, 110000, 120000, 'الدامر', 'Logistics not verified', 'Verified prices only', 'Not ready for delivered-price pitch', 'Transport and spoilage risk need verification.', '2026-07-08'),
  ('sesame', 'السمسم', 'Sesame', 'قنطار', null, null, null, null, 'القضارف', null, null, 'Future candidate', 'Needs field price and logistics validation.', null),
  ('groundnut', 'الفول السوداني', 'Groundnut', 'طن', null, null, null, null, 'كردفان', null, null, 'Future candidate', 'Needs field price and logistics validation.', null),
  ('hibiscus', 'الكركدي', 'Hibiscus', 'قنطار', null, null, null, null, 'شمال كردفان', null, null, 'Future candidate', 'Needs field price and logistics validation.', null),
  ('gum-arabic', 'الصمغ العربي', 'Gum Arabic', 'قنطار', null, null, null, null, 'كردفان', null, null, 'Future candidate', 'Needs field price and logistics validation.', null)
on conflict (product_id) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  unit = excluded.unit,
  source_price_min = excluded.source_price_min,
  source_price_max = excluded.source_price_max,
  khartoum_price_min = excluded.khartoum_price_min,
  khartoum_price_max = excluded.khartoum_price_max,
  source_region = excluded.source_region,
  transport_status = excluded.transport_status,
  evidence_level = excluded.evidence_level,
  pilot_status = excluded.pilot_status,
  key_caveat = excluded.key_caveat,
  source_date = excluded.source_date,
  last_updated = now();

notify pgrst, 'reload schema';
