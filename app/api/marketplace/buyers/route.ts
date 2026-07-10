import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const input = await request.json();
    const business_name = String(input.business_name || '').trim();
    const business_type = String(input.business_type || '').trim();
    const phone = String(input.phone || '').trim();
    const location = String(input.location || '').trim();

    if (!business_name || !business_type || !phone || !location) {
      return NextResponse.json({ ok: false, error: 'أكمل كل بيانات تسجيل التاجر.' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('uf_buyers')
      .insert({ business_name, business_type, phone, location })
      .select('buyer_id,business_name,business_type,phone,location')
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, buyer: data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'تعذر تسجيل التاجر.' },
      { status: 500 }
    );
  }
}
