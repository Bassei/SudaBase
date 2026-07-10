import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const input = await request.json();
    const name = String(input.name || '').trim();
    const phone = String(input.phone || '').trim();
    const region = String(input.region || '').trim();
    const primary_crop = String(input.primary_crop || '').trim();

    if (!name || !phone || !region || !primary_crop) {
      return NextResponse.json({ ok: false, error: 'أكمل كل بيانات تسجيل المزارع.' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('uf_farmers')
      .insert({ name, phone, region, primary_crop })
      .select('farmer_id,name,phone,region,primary_crop')
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, farmer: data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'تعذر تسجيل المزارع.' },
      { status: 500 }
    );
  }
}
