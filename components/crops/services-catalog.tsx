/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { hasadServices } from '@/lib/hasad-catalog';

export function ServicesCatalog({ locale }: { locale: 'ar' | 'en' }) {
  const ar = locale === 'ar';
  const Arrow = ar ? ArrowLeft : ArrowRight;
  const prefix = ar ? '/ar' : '/en';
  return (
    <main dir={ar ? 'rtl' : 'ltr'} className="min-h-screen bg-[#f7f5ee]">
      <section className="bg-[#12382a] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="text-sm font-black text-[#f5c451]">{ar ? 'حصاد | HASAD' : 'HASAD | حصاد'}</p>
          <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">{ar ? 'الخدمات الزراعية' : 'Agricultural services'}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">{ar ? 'حلول متكاملة لدعم تداول المحاصيل ونقلها وتجهيزها وفق متطلبات السوق.' : 'Integrated solutions supporting crop handling, transport, and market preparation.'}</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {hasadServices.map((service) => <article key={service.nameAr} className="overflow-hidden rounded-[1.75rem] border border-black/[.07] bg-white shadow-sm"><div className="aspect-[4/3] bg-[#edf2e9]"><img src={service.image} alt={ar ? service.nameAr : service.nameEn} className="h-full w-full object-cover" loading="lazy" /></div><div className="p-5"><h2 className="text-xl font-black">{ar ? service.nameAr : service.nameEn}</h2><p className="mt-3 flex items-center gap-2 text-sm leading-6 text-[#66766e]"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />{ar ? 'يتم تنسيق الخدمة مع فريق حصاد بعد تسجيل الطلب.' : 'Coordinated by the Hasad team after request submission.'}</p></div></article>)}
        </div>
        <div className="mt-10 rounded-3xl bg-[#173a2b] p-7 text-white sm:flex sm:items-center sm:justify-between"><div><h2 className="text-2xl font-black text-white">{ar ? 'تحتاج خدمة لمحصولك؟' : 'Need a service for your crop?'}</h2><p className="mt-2 text-white/65">{ar ? 'سجّل طلب الشراء وأضف متطلبات النقل أو التخزين ضمن التفاصيل.' : 'Create a purchase request and include transport or storage requirements.'}</p></div><Link href={`${prefix}/marketplace/buyer`} className="btn mt-5 bg-[#f5c451] text-[#173a2b] sm:mt-0">{ar ? 'فتح بوابة المشتري' : 'Open buyer portal'}<Arrow className="h-4 w-4" /></Link></div>
      </section>
    </main>
  );
}
