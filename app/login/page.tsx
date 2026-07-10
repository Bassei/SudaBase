"use client";

import { FormEvent, useState } from 'react';
import { ShieldCheck, Sprout, Store, Wrench } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Role = 'farmer' | 'buyer' | 'technician';
type Method = 'phone' | 'email';

const roles = {
  farmer: { label: 'مزارع', icon: Sprout, redirect: '/ar/marketplace' },
  buyer: { label: 'تاجر', icon: Store, redirect: '/ar/marketplace' },
  technician: { label: 'تقني', icon: Wrench, redirect: '/admin/marketplace' },
};

export default function LoginPage() {
  const [role, setRole] = useState<Role>('farmer');
  const [method, setMethod] = useState<Method>('phone');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [pendingPhone, setPendingPhone] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const email = String(form.get('email') || '').trim();
    const token = String(form.get('token') || '').trim();
    const supabase = createSupabaseBrowserClient();

    try {
      if (role === 'technician') {
        const response = await fetch('/api/marketplace/technicians', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name, phone, email }),
        });
        const json = await response.json();
        if (!response.ok || !json.ok) throw new Error(json.error || 'تعذر تسجيل التقني.');
      }

      const redirectTo = `${location.origin}${roles[role].redirect}`;

      if (method === 'phone' && otpSent) {
        const { error } = await supabase.auth.verifyOtp({ phone: pendingPhone || phone, token, type: 'sms' });
        if (error) throw error;
        location.href = roles[role].redirect;
        return;
      }

      const { error } =
        method === 'email'
          ? await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } })
          : await supabase.auth.signInWithOtp({ phone });

      if (error) throw error;

      if (method === 'phone') {
        setOtpSent(true);
        setPendingPhone(phone);
      }

      setMessage(method === 'email' ? 'تم إرسال رابط الدخول إلى البريد.' : 'تم إرسال رمز الدخول إلى الهاتف.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر إكمال التسجيل.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main dir="rtl" className="bg-[#fbfdf8] px-4 py-12">
      <section className="mx-auto max-w-3xl rounded-lg border border-emerald-100 bg-white p-6 shadow-sm">
        <p className="badge">تسجيل الدخول للسوق</p>
        <h1 className="mt-4 text-3xl font-black text-[#173a2b]">ادخل بالطريقة المناسبة</h1>
        <p className="mt-3 leading-7 text-[#60736a]">
          اختر صفتك، ثم استخدم الهاتف أو البريد. التقني يحصل على وصول لوحة الفريق بعد تسجيله.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {(Object.keys(roles) as Role[]).map((key) => {
            const Icon = roles[key].icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setRole(key)}
                className={`rounded-lg border p-4 text-start transition ${
                  role === key ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-100 bg-white hover:bg-emerald-50'
                }`}
              >
                <Icon className="h-6 w-6 text-emerald-700" />
                <span className="mt-3 block font-black text-[#173a2b]">{roles[key].label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {role === 'technician' && (
            <label className="space-y-2 text-sm font-bold text-[#426457]">
              <span>اسم التقني</span>
              <input className="input" name="name" required />
            </label>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMethod('phone')}
              className={`rounded-lg border px-4 py-3 font-black ${
                method === 'phone' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-emerald-100 text-[#60736a]'
              }`}
            >
              الهاتف
            </button>
            <button
              type="button"
              onClick={() => setMethod('email')}
              className={`rounded-lg border px-4 py-3 font-black ${
                method === 'email' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-emerald-100 text-[#60736a]'
              }`}
            >
              البريد
            </button>
          </div>

          {method === 'phone' ? (
            <label className="space-y-2 text-sm font-bold text-[#426457]">
              <span>رقم الهاتف</span>
              <input className="input" name="phone" type="tel" required defaultValue={pendingPhone} />
            </label>
          ) : (
            <label className="space-y-2 text-sm font-bold text-[#426457]">
              <span>البريد الإلكتروني</span>
              <input className="input" name="email" type="email" required />
            </label>
          )}

          {method === 'phone' && otpSent && (
            <label className="space-y-2 text-sm font-bold text-[#426457]">
              <span>رمز التحقق</span>
              <input className="input" name="token" inputMode="numeric" required />
            </label>
          )}

          <button className="btn-primary w-full py-3" disabled={loading}>
            <ShieldCheck className="h-5 w-5" />
            {loading ? 'جاري الإرسال...' : method === 'phone' && otpSent ? 'تأكيد الرمز والدخول' : 'تسجيل ودخول'}
          </button>

          {message && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">{message}</p>}
        </form>
      </section>
    </main>
  );
}
