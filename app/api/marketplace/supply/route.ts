import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { marketplaceDatabaseError } from '@/lib/marketplace-api';

export async function POST(request: Request) {
  try {
    const input = await request.json();
    const farmer_id = input.farmer_id || null;
    const farmer_phone = String(input.farmer_phone || '').trim();
    const product_id = String(input.product_id || '').trim();
    const quantity_jowal = Number(input.quantity_jowal);
    const harvest_location = String(input.harvest_location || '').trim();
    const expected_available_date = String(input.expected_available_date || '').trim();

    if (!farmer_phone || !product_id || !quantity_jowal || !harvest_location || !expected_available_date) {
      return NextResponse.json({ ok: false, error: 'أكمل كل بيانات عرض المحصول.' }, { status: 400 });
    }

    if (!Number.isInteger(quantity_jowal) || quantity_jowal <= 0) {
      return NextResponse.json({ ok: false, error: 'الكمية يجب أن تكون رقماً صحيحاً أكبر من صفر.' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('uf_supply_requests')
      .insert({
        farmer_id,
        farmer_phone,
        product_id,
        quantity_jowal,
        harvest_location,
        expected_available_date,
        status: 'قيد المراجعة',
      })
      .select('supply_request_id,status,created_at')
      .single();

    if (error) {
      return marketplaceDatabaseError(error);
    }

    return NextResponse.json({ ok: true, supply: data });
  } catch (error) {
    return marketplaceDatabaseError(error, 'تعذر إرسال العرض. / Unable to submit the supply offer.');
  }
}
