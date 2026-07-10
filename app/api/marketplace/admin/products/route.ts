import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { requireMarketplaceAdmin } from '@/lib/united-fruit';

function nullableNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export async function PATCH(request: Request) {
  const { user, isAdmin } = await requireMarketplaceAdmin();

  if (!user || !isAdmin) {
    return NextResponse.json({ ok: false, error: 'غير مصرح.' }, { status: 403 });
  }

  try {
    const input = await request.json();
    const product_id = String(input.product_id || '').trim();

    if (!product_id) {
      return NextResponse.json({ ok: false, error: 'اختر المنتج.' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('uf_products')
      .update({
        source_price_min: nullableNumber(input.source_price_min),
        source_price_max: nullableNumber(input.source_price_max),
        khartoum_price_min: nullableNumber(input.khartoum_price_min),
        khartoum_price_max: nullableNumber(input.khartoum_price_max),
        last_updated: new Date().toISOString(),
      })
      .eq('product_id', product_id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    await supabase.from('uf_product_price_updates').insert({
      product_id,
      source_price_min: nullableNumber(input.source_price_min),
      source_price_max: nullableNumber(input.source_price_max),
      khartoum_price_min: nullableNumber(input.khartoum_price_min),
      khartoum_price_max: nullableNumber(input.khartoum_price_max),
      updated_by: user.id,
      note: String(input.note || '').trim() || null,
    });

    return NextResponse.json({ ok: true, product: data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'تعذر تحديث السعر.' },
      { status: 500 }
    );
  }
}
