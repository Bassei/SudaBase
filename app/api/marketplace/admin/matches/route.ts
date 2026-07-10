import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { requireMarketplaceAdmin } from '@/lib/united-fruit';

export async function POST(request: Request) {
  const { user, isAdmin } = await requireMarketplaceAdmin();

  if (!user || !isAdmin) {
    return NextResponse.json({ ok: false, error: 'غير مصرح.' }, { status: 403 });
  }

  try {
    const input = await request.json();
    const supply_request_id = String(input.supply_request_id || '').trim();
    const demand_request_id = String(input.demand_request_id || '').trim();
    const final_price = input.final_price ? Number(input.final_price) : null;
    const actual_delivery_date = input.actual_delivery_date || null;
    const status = String(input.status || 'قيد التنفيذ').trim();
    const notes = String(input.notes || '').trim() || null;

    if (!supply_request_id || !demand_request_id) {
      return NextResponse.json({ ok: false, error: 'اختر عرض توفر وطلب شراء.' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('uf_matches')
      .insert({
        supply_request_id,
        demand_request_id,
        final_price,
        actual_delivery_date,
        status,
        notes,
        created_by: user.id,
      })
      .select('match_id')
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    await Promise.all([
      supabase
        .from('uf_supply_requests')
        .update({ status: 'تمت المطابقة، جاري التنسيق', updated_at: new Date().toISOString() })
        .eq('supply_request_id', supply_request_id),
      supabase
        .from('uf_demand_requests')
        .update({ status: 'تمت المطابقة، جاري التنسيق', updated_at: new Date().toISOString() })
        .eq('demand_request_id', demand_request_id),
    ]);

    return NextResponse.json({ ok: true, match: data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'تعذر إنشاء المطابقة.' },
      { status: 500 }
    );
  }
}
