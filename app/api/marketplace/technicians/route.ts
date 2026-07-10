import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const input = await request.json();
    const name = String(input.name || '').trim();
    const email = String(input.email || '').trim() || null;
    const phone = String(input.phone || '').trim() || null;

    if (!name || (!email && !phone)) {
      return NextResponse.json({ ok: false, error: 'أدخل اسم التقني ورقم الهاتف أو البريد.' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('uf_technicians')
      .upsert({ name, email, phone, status: 'active' }, { onConflict: email ? 'email' : 'phone' })
      .select('technician_id,name,email,phone,status')
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, technician: data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'تعذر تسجيل التقني.' },
      { status: 500 }
    );
  }
}
