import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

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
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, requests: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'تعذر جلب الحالات.' },
      { status: 500 }
    );
  }
}
