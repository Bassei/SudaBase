import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { DEMAND_MINIMUM_JOWAL } from '@/lib/marketplace-constants';

export async function POST(request: Request) {
  try {
    const input = await request.json();
    const buyer_id = input.buyer_id || null;
    const buyer_phone = String(input.buyer_phone || '').trim();
    const product_id = String(input.product_id || '').trim();
    const quantity_jowal = Number(input.quantity_jowal);
    const target_price = input.target_price ? Number(input.target_price) : null;
    const requested_delivery_date = String(input.requested_delivery_date || '').trim();

    if (!buyer_phone || !product_id || !quantity_jowal || !requested_delivery_date) {
      return NextResponse.json({ ok: false, error: 'أكمل كل بيانات طلب الشراء.' }, { status: 400 });
    }

    if (!Number.isInteger(quantity_jowal) || quantity_jowal < DEMAND_MINIMUM_JOWAL) {
      return NextResponse.json(
        { ok: false, error: 'الحد الأدنى للصفقة 400 جوال لضمان كفاءة النقل' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('uf_demand_requests')
      .insert({
        buyer_id,
        buyer_phone,
        product_id,
        quantity_jowal,
        target_price,
        requested_delivery_date,
        status: 'قيد المراجعة',
      })
      .select('demand_request_id,status,created_at')
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, demand: data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'تعذر إرسال الطلب.' },
      { status: 500 }
    );
  }
}
