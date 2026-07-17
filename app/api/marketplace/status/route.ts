import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { marketplaceDatabaseError } from '@/lib/marketplace-api';

export async function POST(request: Request) {
  try {
    const input = await request.json();
    const phone = String(input.phone || '').trim();
    const role = String(input.role || '').trim();

    if (!phone || !['farmer', 'buyer'].includes(role)) {
      return NextResponse.json({ ok: false, error: 'أدخل رقم الهاتف ونوع الحساب.' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const query =
      role === 'farmer'
        ? supabase
            .from('uf_supply_requests')
            .select('supply_request_id,product_id,quantity_jowal,status,created_at,uf_products(name_ar,name_en)')
            .eq('farmer_phone', phone)
            .order('created_at', { ascending: false })
        : supabase
            .from('uf_demand_requests')
            .select('demand_request_id,product_id,quantity_jowal,status,created_at,uf_products(name_ar,name_en)')
            .eq('buyer_phone', phone)
            .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      return marketplaceDatabaseError(error);
    }

    return NextResponse.json({ ok: true, requests: data ?? [] });
  } catch (error) {
    return marketplaceDatabaseError(error, 'تعذر جلب الحالات. / Unable to load request statuses.');
  }
}
