'use client';
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Search, ShoppingBasket, Sprout } from 'lucide-react';
import { useMemo, useState } from 'react';
import { hasadCrops, type HasadCrop } from '@/lib/hasad-catalog';

type Locale = 'ar' | 'en';
type Category = HasadCrop['category'] | 'all';

const labels = {
  ar: {
    dir: 'rtl' as const,
    eyebrow: 'بيانات موقع محصول',
    title: 'كتالوج المحاصيل',
    lead: 'صورة واضحة واسم ووحدة تداول لكل محصول. ابحث أو اختر التصنيف، ثم انتقل مباشرةً للبيع أو الشراء.',
    search: 'ابحث عن محصول…',
    unit: 'وحدة التداول',
    sell: 'عرض للبيع',
    buy: 'طلب شراء',
    empty: 'لا توجد محاصيل مطابقة.',
    categories: { all: 'الكل', grains: 'الحبوب', oilseeds: 'المحاصيل الزيتية', legumes: 'البقوليات', horticulture: 'الخضر والفاكهة', exports: 'محاصيل الصادر' },
  },
  en: {
    dir: 'ltr' as const,
    eyebrow: 'Mahsool public data',
    title: 'Crop catalog',
    lead: 'A clear image, name, and trading unit for every crop. Search or filter, then go directly to selling or buying.',
    search: 'Search crops…',
    unit: 'Trading unit',
    sell: 'List for sale',
    buy: 'Request to buy',
    empty: 'No matching crops.',
    categories: { all: 'All', grains: 'Grains', oilseeds: 'Oilseeds', legumes: 'Legumes', horticulture: 'Fruit & vegetables', exports: 'Export crops' },
  },
};

export function CropCatalog({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const prefix = locale === 'ar' ? '/ar' : '/en';
  const crops = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return hasadCrops.filter((crop) => (category === 'all' || crop.category === category) && (!normalized || `${crop.nameAr} ${crop.nameEn}`.toLocaleLowerCase().includes(normalized)));
  }, [category, query]);

  return (
    <main dir={t.dir} className="min-h-screen bg-[#f7f5ee]">
      <section className="border-b border-emerald-950/10 bg-[#12382a] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <p className="text-sm font-black text-[#f5c451]">{t.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">{t.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">{t.lead}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl border border-black/[.07] bg-white p-4 shadow-sm sm:p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#738078]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} className="input py-4 ps-12 text-base" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(Object.keys(t.categories) as Category[]).map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${category === item ? 'bg-[#173a2b] text-white' : 'bg-[#f2f5f1] text-[#51655b] hover:bg-emerald-50'}`}>{t.categories[item]}</button>)}
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {crops.map((crop) => (
            <article key={crop.slug} className="group overflow-hidden rounded-[1.75rem] border border-black/[.07] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#edf2e9]">
                <img src={crop.image} alt={locale === 'ar' ? crop.nameAr : crop.nameEn} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute start-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-[#315f42] shadow-sm backdrop-blur">{t.categories[crop.category]}</span>
              </div>
              <div className="p-5">
                <h2 className="text-2xl font-black">{locale === 'ar' ? crop.nameAr : crop.nameEn}</h2>
                <div className="mt-3 flex items-center gap-2 text-sm text-[#66766e]"><ShoppingBasket className="h-4 w-4 text-[#9a6b12]" /><span>{t.unit}:</span><strong className="text-[#173a2b]">{crop.unit}</strong></div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Link href={`${prefix}/marketplace/farmer?crop=${crop.slug}`} className="btn bg-emerald-50 px-3 text-emerald-800 hover:bg-emerald-100"><Sprout className="h-4 w-4" />{t.sell}</Link>
                  <Link href={`${prefix}/marketplace/buyer?crop=${crop.slug}`} className="btn bg-[#fff1c4] px-3 text-[#72500f] hover:bg-amber-100">{t.buy}<Arrow className="h-4 w-4" /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!crops.length && <p className="py-20 text-center text-lg font-bold text-[#738078]">{t.empty}</p>}
      </section>
    </main>
  );
}
