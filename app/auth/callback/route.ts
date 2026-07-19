import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function safeNext(value: string | null) {
  return value?.startsWith('/') && !value.startsWith('//') ? value : '/ar/marketplace';
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = safeNext(url.searchParams.get('next'));
  const authError = url.searchParams.get('error_description') || url.searchParams.get('error');

  if (authError) {
    const loginUrl = new URL('/login', url.origin);
    loginUrl.searchParams.set('error', 'تعذر التحقق من رابط الدخول. يرجى طلب رابط جديد.');
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    const loginUrl = new URL('/login', url.origin);
    loginUrl.searchParams.set('error', 'رابط الدخول غير مكتمل. يرجى طلب رابط جديد.');
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const loginUrl = new URL('/login', url.origin);
    loginUrl.searchParams.set('error', 'انتهت صلاحية رابط الدخول أو سبق استخدامه. يرجى طلب رابط جديد.');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
