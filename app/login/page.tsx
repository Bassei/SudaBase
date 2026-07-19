'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, Mail, MessageSquareText, ShieldCheck, Sprout, Store, Wrench } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Role = 'farmer' | 'buyer' | 'technician';
type Method = 'phone' | 'email';

const roles = {
  farmer: { label: 'مزارع', description: 'إدارة عروض المحاصيل', icon: Sprout, redirect: '/ar/marketplace/farmer' },
  buyer: { label: 'مشتري', description: 'إدارة طلبات الشراء', icon: Store, redirect: '/ar/marketplace/buyer' },
  technician: { label: 'فني زراعي', description: 'الوصول إلى لوحة الفريق', icon: Wrench, redirect: '/admin/marketplace' },
};

function normalizePhone(value: string) {
  let phone = value.replace(/[\s()-]/g, '');
  if (phone.startsWith('00')) phone = `+${phone.slice(2)}`;
  else if (phone.startsWith('0')) phone = `+249${phone.slice(1)}`;
  else if (phone.startsWith('249')) phone = `+${phone}`;
  return phone;
}

function friendlyError(message: string) {
  const value = message.toLowerCase();
  if (value.includes('invalid phone')) return 'يرجى إدخال رقم هاتف صحيح، مثال: 0912345678.';
  if (value.includes('rate limit')) return 'تم تجاوز عدد المحاولات المسموح. يرجى الانتظار قليلًا ثم المحاولة مجددًا.';
  if (value.includes('sms') || value.includes('phone provider')) return 'تعذر إرسال الرسالة النصية حاليًا. يرجى استخدام البريد الإلكتروني أو المحاولة لاحقًا.';
  if (value.includes('email')) return 'تعذر إرسال رابط الدخول إلى البريد الإلكتروني. يرجى التحقق من العنوان والمحاولة مجددًا.';
  if (value.includes('token') || value.includes('otp')) return 'رمز التحقق غير صحيح أو انتهت صلاحيته.';
  return 'تعذر إكمال عملية التسجيل. يرجى المحاولة مجددًا.';
}

export default function LoginPage() {
  const [role, setRole] = useState<Role>('farmer');
  const [method, setMethod] = useState<Method>('phone');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [pendingPhone, setPendingPhone] = useState('');

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get('error');
    if (error) setErrorMessage(error);
  }, []);

  function changeMethod(next: Method) {
    setMethod(next);
    setMessage('');
    setErrorMessage('');
    setOtpSent(false);
    setPendingPhone('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setErrorMessage('');

    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const rawPhone = String(form.get('phone') || '').trim();
    const phone = normalizePhone(rawPhone);
    const email = String(form.get('email') || '').trim().toLocaleLowerCase();
    const token = String(form.get('token') || '').trim();
    const supabase = createSupabaseBrowserClient();

    try {
      if (method === 'phone' && !/^\+[1-9]\d{7,14}$/.test(phone)) {
        throw new Error('Invalid phone number');
      }

      if (role === 'technician' && !otpSent) {
        const response = await fetch('/api/marketplace/technicians', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name, phone: method === 'phone' ? phone : '', email: method === 'email' ? email : '' }),
        });
        const json = await response.json();
        if (!response.ok || !json.ok) throw new Error(json.error || 'Technician registration failed');
      }

      if (method === 'phone' && otpSent) {
        const { error } = await supabase.auth.verifyOtp({ phone: pendingPhone, token, type: 'sms' });
        if (error) throw error;
        window.location.assign(roles[role].redirect);
        return;
      }

      if (method === 'email') {
        const callback = new URL('/auth/callback', window.location.origin);
        callback.searchParams.set('next', roles[role].redirect);
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: callback.toString(), shouldCreateUser: true },
        });
        if (error) throw error;
        setMessage('أُرسل رابط الدخول إلى بريدك الإلكتروني. افتح الرسالة واضغط على الرابط لإكمال التسجيل.');
      } else {
        const { error } = await supabase.auth.signInWithOtp({ phone, options: { shouldCreateUser: true } });
        if (error) throw error;
        setOtpSent(true);
        setPendingPhone(phone);
        setMessage(`أُرسل رمز التحقق إلى ${phone}.`);
      }
    } catch (error) {
      setErrorMessage(friendlyError(error instanceof Error ? error.message : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main dir="rtl" className="min-h-[75vh] bg-[#f7f5ee] px-4 py-12 sm:py-16">
      <section className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white shadow-xl shadow-emerald-950/5">
        <div className="bg-[#173a2b] px-6 py-8 text-white sm:px-9">
          <p className="text-sm font-black text-[#f5c451]">حصاد | HASAD</p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">إنشاء حساب أو تسجيل الدخول</h1>
          <p className="mt-3 max-w-2xl leading-7 text-white/70">اختر نوع الحساب وطريقة التحقق المناسبة. تُستخدم بيانات الاتصال لتأمين الحساب ومتابعة المعاملات.</p>
        </div>

        <div className="p-6 sm:p-9">
          <div className="grid gap-3 sm:grid-cols-3">
            {(Object.keys(roles) as Role[]).map((key) => {
              const Icon = roles[key].icon;
              return <button key={key} type="button" onClick={() => setRole(key)} className={`rounded-2xl border p-4 text-start transition ${role === key ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-100' : 'border-emerald-950/10 bg-white hover:bg-[#f7faf7]'}`}><Icon className="h-6 w-6 text-emerald-700" /><span className="mt-3 block font-black text-[#173a2b]">{roles[key].label}</span><span className="mt-1 block text-xs text-[#60736a]">{roles[key].description}</span></button>;
            })}
          </div>

          <form onSubmit={submit} className="mt-7 space-y-5">
            {role === 'technician' && <label className="block space-y-2 text-sm font-bold text-[#426457]"><span>الاسم الكامل</span><input className="input" name="name" required /></label>}

            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => changeMethod('phone')} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-black ${method === 'phone' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-emerald-950/10 text-[#60736a]'}`}><MessageSquareText className="h-5 w-5" />رقم الهاتف</button>
              <button type="button" onClick={() => changeMethod('email')} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-black ${method === 'email' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-emerald-950/10 text-[#60736a]'}`}><Mail className="h-5 w-5" />البريد الإلكتروني</button>
            </div>

            {method === 'phone' ? <label className="block space-y-2 text-sm font-bold text-[#426457]"><span>رقم الهاتف</span><input className="input" name="phone" type="tel" inputMode="tel" required defaultValue={pendingPhone} disabled={otpSent} placeholder="0912345678 أو +249912345678" dir="ltr" /><span className="block text-xs font-medium text-[#789087]">تُقبل الأرقام السودانية المحلية والدولية.</span></label> : <label className="block space-y-2 text-sm font-bold text-[#426457]"><span>البريد الإلكتروني</span><input className="input" name="email" type="email" required autoComplete="email" placeholder="name@example.com" dir="ltr" /></label>}

            {method === 'phone' && otpSent && <label className="block space-y-2 text-sm font-bold text-[#426457]"><span>رمز التحقق</span><input className="input text-center text-xl tracking-[.35em]" name="token" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required dir="ltr" /></label>}

            <button className="btn-primary w-full py-3.5" disabled={loading}><ShieldCheck className="h-5 w-5" />{loading ? 'جارٍ التنفيذ...' : method === 'phone' && otpSent ? 'تأكيد الرمز والدخول' : method === 'phone' ? 'إرسال رمز التحقق' : 'إرسال رابط الدخول'}</button>
            {otpSent && <button type="button" onClick={() => changeMethod('phone')} className="w-full text-sm font-black text-[#60736a] hover:text-emerald-800">استخدام رقم هاتف آخر</button>}

            {message && <p className="flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-800"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{message}</p>}
            {errorMessage && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700">{errorMessage}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}
