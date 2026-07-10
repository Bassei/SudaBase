import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const input = await request.json();
    const name = String(input.name || '').trim();
    const phone = String(input.phone || '').trim();
    const email = String(input.email || '').trim() || null;
    const region = String(input.region || '').trim();
    const primary_crop = String(input.primary_crop || '').trim();
    const contact_method = String(input.contact_method || 'phone').trim();

    if (!name || (!phone && !email) || !region || !primary_crop) {
      return NextResponse.json({ ok: false, error: 'أكمل كل بيانات تسجيل المزارع.' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('uf_farmers')
      .insert({ name, phone, email, region, primary_crop, contact_method })
      .select('farmer_id,name,phone,email,region,primary_crop,contact_method')
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
