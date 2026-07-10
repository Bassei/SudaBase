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

export { DEMAND_MINIMUM_JOWAL };

export async function getUfProducts() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('uf_products')
    .select('*')
    .order('product_id');

  if (error) {
    throw error;
  }

  return (data ?? []) as UfProduct[];
}

export async function requireMarketplaceAdmin() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, isAdmin: false };
  }

  const { data } = await supabase.rpc('is_admin');
  return { user, isAdmin: data === true };
}

export async function getMarketplaceAdminData() {
  const supabase = createSupabaseAdminClient();
  const [products, supply, demand, matches] = await Promise.all([
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
  ]);

  for (const result of [products, supply, demand, matches]) {
    if (result.error) {
      throw result.error;
    }
  }

  return {
    products: (products.data ?? []) as UfProduct[],
    supply: supply.data ?? [],
    demand: demand.data ?? [],
    matches: matches.data ?? [],
  };
}
