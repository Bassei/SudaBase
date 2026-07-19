import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { DEMAND_MINIMUM_JOWAL } from '@/lib/marketplace-constants';

export type UfProduct = {
  product_id: string;
  name_ar: string;
  name_en: string;
  unit: string;
  source_price_min: number | null;
  source_price_max: number | null;
  khartoum_price_min: number | null;
  khartoum_price_max: number | null;
  source_region: string;
  last_updated: string | null;
};

// Keep the public marketplace useful while a new environment is waiting for the
// marketplace migration to be applied. Mutations still require the real tables.
export const fallbackUfProducts: UfProduct[] = [
  {
    product_id: 'feterita',
    name_ar: 'الفتريتة',
    name_en: 'Feterita (Wad Akr)',
    unit: 'جوال 90 كجم',
    source_price_min: 130000,
    source_price_max: 130000,
    khartoum_price_min: 160000,
    khartoum_price_max: 160000,
    source_region: 'الجزيرة',
    last_updated: '2026-07-08T00:00:00.000Z',
  },
  {
    product_id: 'wheat',
    name_ar: 'القمح',
    name_en: 'Wheat',
    unit: 'جوال 90 كجم',
    source_price_min: 165000,
    source_price_max: 170000,
    khartoum_price_min: 210000,
    khartoum_price_max: 250000,
    source_region: 'الجزيرة',
    last_updated: '2026-07-08T00:00:00.000Z',
  },
  {
    product_id: 'onion',
    name_ar: 'البصل',
    name_en: 'Onion',
    unit: 'جوال 90 كجم',
    source_price_min: 65000,
    source_price_max: 80000,
    khartoum_price_min: 110000,
    khartoum_price_max: 120000,
    source_region: 'الدامر',
    last_updated: '2026-07-08T00:00:00.000Z',
  },
  {
    product_id: 'sesame',
    name_ar: 'السمسم',
    name_en: 'Sesame',
    unit: 'قنطار',
    source_price_min: null,
    source_price_max: null,
    khartoum_price_min: null,
    khartoum_price_max: null,
    source_region: 'القضارف',
    last_updated: null,
  },
  {
    product_id: 'groundnut',
    name_ar: 'الفول السوداني',
    name_en: 'Groundnut',
    unit: 'طن',
    source_price_min: null,
    source_price_max: null,
    khartoum_price_min: null,
    khartoum_price_max: null,
    source_region: 'كردفان',
    last_updated: null,
  },
  {
    product_id: 'hibiscus',
    name_ar: 'الكركدي',
    name_en: 'Hibiscus',
    unit: 'قنطار',
    source_price_min: null,
    source_price_max: null,
    khartoum_price_min: null,
    khartoum_price_max: null,
    source_region: 'شمال كردفان',
    last_updated: null,
  },
  {
    product_id: 'gum-arabic',
    name_ar: 'الصمغ العربي',
    name_en: 'Gum Arabic',
    unit: 'قنطار',
    source_price_min: null,
    source_price_max: null,
    khartoum_price_min: null,
    khartoum_price_max: null,
    source_region: 'كردفان',
    last_updated: null,
  },
  {
    product_id: 'millet',
    name_ar: 'الدخن',
    name_en: 'Millet',
    unit: 'جوال 90 كجم',
    source_price_min: null,
    source_price_max: null,
    khartoum_price_min: null,
    khartoum_price_max: null,
    source_region: 'شمال دارفور',
    last_updated: null,
  },
  {
    product_id: 'sorghum-tabat',
    name_ar: 'الذرة الرفيعة - طابت',
    name_en: 'Sorghum (Tabat)',
    unit: 'جوال 90 كجم',
    source_price_min: null,
    source_price_max: null,
    khartoum_price_min: null,
    khartoum_price_max: null,
    source_region: 'الجزيرة',
    last_updated: null,
  },
  {
    product_id: 'cotton-seed',
    name_ar: 'بذرة القطن',
    name_en: 'Cotton Seed',
    unit: 'قنطار',
    source_price_min: null,
    source_price_max: null,
    khartoum_price_min: null,
    khartoum_price_max: null,
    source_region: 'الجزيرة',
    last_updated: null,
  },
  {
    product_id: 'cowpea',
    name_ar: 'اللوبيا',
    name_en: 'Cowpea',
    unit: 'جوال 90 كجم',
    source_price_min: null,
    source_price_max: null,
    khartoum_price_min: null,
    khartoum_price_max: null,
    source_region: 'كردفان',
    last_updated: null,
  },
  {
    product_id: 'chickpea',
    name_ar: 'الحمص',
    name_en: 'Chickpea',
    unit: 'جوال 90 كجم',
    source_price_min: null,
    source_price_max: null,
    khartoum_price_min: null,
    khartoum_price_max: null,
    source_region: 'الشمالية',
    last_updated: null,
  },
  {
    product_id: 'dates',
    name_ar: 'البلح',
    name_en: 'Dates',
    unit: 'جوال',
    source_price_min: null,
    source_price_max: null,
    khartoum_price_min: null,
    khartoum_price_max: null,
    source_region: 'الشمالية',
    last_updated: null,
  },
];

const fallbackById = new Map(fallbackUfProducts.map((product) => [product.product_id, product]));
const brokenText = /[?ØÙ�]/;

function sanitizeProduct(product: UfProduct): UfProduct | null {
  const fallback = fallbackById.get(product.product_id);
  const choose = (value: string, fallbackValue = '') => value && !brokenText.test(value) ? value : fallbackValue;
  const sanitized = {
    ...product,
    name_ar: choose(product.name_ar, fallback?.name_ar),
    name_en: choose(product.name_en, fallback?.name_en),
    unit: choose(product.unit, fallback?.unit),
    source_region: choose(product.source_region, fallback?.source_region),
  };
  return sanitized.name_ar && sanitized.name_en && sanitized.unit ? sanitized : null;
}

export { DEMAND_MINIMUM_JOWAL };

export async function getUfProducts() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('uf_products')
    .select('*')
    .order('product_id');

  if (error) {
    return fallbackUfProducts;
  }

  const products = ((data ?? []) as UfProduct[])
    .map(sanitizeProduct)
    .filter((product): product is UfProduct => product !== null);
  return products.length ? products : fallbackUfProducts;
}

export async function requireMarketplaceAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, isAdmin: false };
  }

  const { data } = await supabase.rpc('is_admin');
  const allowlistedEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const allowlisted = Boolean(
    user.email && allowlistedEmails.includes(user.email.toLowerCase())
  );
  return { user, isAdmin: data === true || allowlisted };
}

export async function getMarketplaceAdminData() {
  const supabase = createSupabaseAdminClient();
  const [products, supply, demand, matches, technicians, lanes] = await Promise.all([
    supabase.from('uf_products').select('*').order('product_id'),
    supabase
      .from('uf_supply_requests')
      .select('*, uf_products(name_ar,name_en), uf_farmers(name,region,primary_crop)')
      .order('created_at', { ascending: false }),
    supabase
      .from('uf_demand_requests')
      .select('*, uf_products(name_ar,name_en), uf_buyers(business_name,business_type,location)')
      .order('created_at', { ascending: false }),
    supabase
      .from('uf_matches')
      .select('*, uf_supply_requests(product_id,quantity_jowal,harvest_location), uf_demand_requests(quantity_jowal,requested_delivery_date)')
      .order('created_at', { ascending: false }),
    supabase.from('uf_technicians').select('*').order('created_at', { ascending: false }),
    supabase.from('uf_transport_lanes').select('*').eq('active', true).order('origin'),
  ]);

  const results = [products, supply, demand, matches, technicians, lanes];
  const databaseReady = results.every((result) => !result.error);

  if (!databaseReady) {
    return {
      products: fallbackUfProducts,
      supply: [],
      demand: [],
      matches: [],
      technicians: [],
      lanes: [],
      databaseReady: false,
    };
  }

  return {
    products: (products.data ?? []) as UfProduct[],
    supply: supply.data ?? [],
    demand: demand.data ?? [],
    matches: matches.data ?? [],
    technicians: technicians.data ?? [],
    lanes: lanes.data ?? [],
    databaseReady: true,
  };
}
