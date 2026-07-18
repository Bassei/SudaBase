'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BarChart3, CalendarClock, MapPin, Search, ShoppingBasket } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MahsoolCropPrice } from '@/lib/mahsool-prices';

type Locale = 'ar' | 'en';
const WHEAT_IMAGE = 'https://images.unsplash.com/photo-1688902325229-f6f2ad06561d?auto=format&fit=crop&q=85&w=2400';

const copy = {
  ar: {
    dir: 'rtl' as const,
    eyebrow: 'حصاد | HASAD',
    title: 'أسعار المحاصيل في الأسواق السودانية',
    lead: 'أحدث بيانات الأسعار المنشورة عبر منصة محصول، مصنفة حسب المحصول والسوق ونوع البيع ووحدة التداول.',
    market: 'بوابات السوق',
    catalog: 'دليل المحاصيل',
    products: 'المحاصيل المسعّرة',
    markets: 'الأسواق المشمولة',
    average: 'متوسط الأسعار المنشورة',
    latest: 'أحدث تحديث',
    chart: 'مقارنة الأسعار حسب المحصول والسوق',
    chartHint: 'القيم بالجنيه السوداني وفق وحدة التداول الموضحة لكل سجل.',
    search: 'البحث باسم المحصول أو السوق',
    records: 'سجل الأسعار',
    product: 'المحصول',
    marketName: 'السوق',
    pricing: 'نوع البيع',
    unit: 'الوحدة',
    price: 'السعر',
    date: 'تاريخ التحديث',
    noResults: 'لا توجد نتائج مطابقة لمعايير البحث.',
    sdg: 'ج.س',
    source: 'المصدر: منصة محصول — واجهة الأسعار العامة.',
    disclaimer: 'الأسعار استرشادية وتعكس آخر سجل منشور لكل محصول وسوق.',
  },
  en: {
    dir: 'ltr' as const,
    eyebrow: 'HASAD | حصاد',
    title: 'Crop Prices in Sudanese Markets',
    lead: 'The latest public price records published by Mahsool, classified by crop, market, sale type, and trading unit.',
    market: 'Market portals',
    catalog: 'Crop directory',
    products: 'Priced crops',
    markets: 'Covered markets',
    average: 'Average published price',
    latest: 'Latest update',
    chart: 'Price comparison by crop and market',
    chartHint: 'Values are in Sudanese pounds according to the trading unit shown for each record.',
    search: 'Search by crop or market',
    records: 'Price records',
    product: 'Crop',
    marketName: 'Market',
    pricing: 'Sale type',
    unit: 'Unit',
    price: 'Price',
    date: 'Updated',
    noResults: 'No records match the search criteria.',
    sdg: 'SDG',
    source: 'Source: Mahsool public price API.',
    disclaimer: 'Prices are indicative and reflect the latest published record for each crop and market.',
  },
};

export function PriceDashboard({ prices, locale }: { prices: MahsoolCropPrice[]; locale: Locale }) {
  const t = copy[locale];
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;
  const [query, setQuery] = useState('');
  const formatter = useMemo(() => new Intl.NumberFormat(locale === 'ar' ? 'ar-SD' : 'en-US', { maximumFractionDigits: 0 }), [locale]);
  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SD' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' }), [locale]);

  const uniqueProducts = new Set(prices.map((row) => row.product)).size;
  const uniqueMarkets = new Set(prices.map((row) => row.market)).size;
  const averagePrice = prices.length ? prices.reduce((sum, row) => sum + row.price, 0) / prices.length : 0;
  const latestDate = prices.map((row) => new Date(row.date)).sort((a, b) => b.getTime() - a.getTime())[0];
  const chartData = prices.slice(0, 12).map((row) => ({ ...row, label: `${row.product} — ${row.market}` }));
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filtered = prices.filter((row) => `${row.product} ${row.market} ${row.pricing} ${row.unit}`.toLocaleLowerCase().includes(normalizedQuery));

  return (
    <main dir={t.dir} className="min-h-screen bg-[#f6f8f6] text-[#173a2b]">
      <section className="relative overflow-hidden bg-[#173a2b] text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${WHEAT_IMAGE})` }} />
        <div className="absolute inset-0 bg-[#102e22]/90" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-black tracking-wide text-[#f5c451]">{t.eyebrow}</p>
              <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-6xl">{t.title}</h1>
              <p className="mt-5 text-lg leading-8 text-white/75">{t.lead}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={locale === 'ar' ? '/ar/crops' : '/en/crops'} className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15">{t.catalog}</Link>
              <Link href={locale === 'ar' ? '/ar/marketplace' : '/en/marketplace'} className="btn bg-[#f5c451] text-[#173a2b] hover:bg-amber-300">{t.market}<Arrow className="h-4 w-4" /></Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi icon={ShoppingBasket} label={t.products} value={formatter.format(uniqueProducts)} />
            <Kpi icon={MapPin} label={t.markets} value={formatter.format(uniqueMarkets)} />
            <Kpi icon={BarChart3} label={t.average} value={`${formatter.format(averagePrice)} ${t.sdg}`} />
            <Kpi icon={CalendarClock} label={t.latest} value={latestDate ? dateFormatter.format(latestDate) : '—'} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <article className="rounded-[2rem] border border-emerald-950/10 bg-white p-5 shadow-sm sm:p-7">
          <div>
            <h2 className="text-2xl font-black">{t.chart}</h2>
            <p className="mt-2 text-sm leading-6 text-[#60736a]">{t.chartHint}</p>
          </div>
          <div className="mt-7 h-[390px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 88 }}>
                <CartesianGrid stroke="#e7eee9" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#60736a', fontSize: 11 }} axisLine={false} tickLine={false} interval={0} angle={-35} textAnchor="end" />
                <YAxis tickFormatter={(value) => formatter.format(Number(value))} tick={{ fill: '#60736a', fontSize: 11 }} axisLine={false} tickLine={false} width={78} />
                <Tooltip formatter={(value: number) => `${formatter.format(value)} ${t.sdg}`} labelStyle={{ fontWeight: 800 }} contentStyle={{ borderRadius: 16, border: '1px solid #dce7df' }} />
                <Bar dataKey="price" name={t.price} fill="#d49a28" radius={[9, 9, 0, 0]} maxBarSize={52} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><h2 className="text-3xl font-black">{t.records}</h2><p className="mt-2 text-sm font-bold text-[#60736a]">{t.source}</p></div>
          <label className="relative block w-full sm:max-w-sm"><Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#789087]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="input ps-11" placeholder={t.search} /></label>
        </div>

        <div className="mt-5 grid gap-4 md:hidden">
          {filtered.map((row) => <article key={`${row.id}-${row.product}-${row.market}`} className="rounded-2xl border border-emerald-950/10 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-black">{row.product}</h3><p className="mt-1 flex items-center gap-1 text-sm text-[#60736a]"><MapPin className="h-3.5 w-3.5" />{row.market}</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{row.pricing}</span></div><p className="mt-5 text-3xl font-black text-[#9a6b12]">{formatter.format(row.price)} <span className="text-sm">{t.sdg}</span></p><div className="mt-4 flex justify-between gap-3 border-t border-black/[.07] pt-4 text-sm"><span>{row.unit}</span><span>{dateFormatter.format(new Date(row.date))}</span></div></article>)}
        </div>

        <div className="mt-5 hidden overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-start">
              <thead className="bg-[#edf4ef] text-xs font-black text-[#426457]"><tr><th className="px-6 py-4">{t.product}</th><th className="px-6 py-4">{t.marketName}</th><th className="px-6 py-4">{t.pricing}</th><th className="px-6 py-4">{t.unit}</th><th className="px-6 py-4">{t.price}</th><th className="px-6 py-4">{t.date}</th></tr></thead>
              <tbody className="divide-y divide-emerald-950/[.07]">
                {filtered.map((row) => <tr key={`${row.id}-${row.product}-${row.market}`} className="transition hover:bg-emerald-50/40"><td className="px-6 py-5 font-black">{row.product}</td><td className="px-6 py-5 text-sm font-bold text-[#60736a]">{row.market}</td><td className="px-6 py-5 text-sm">{row.pricing}</td><td className="px-6 py-5 text-sm">{row.unit}</td><td className="px-6 py-5 text-lg font-black tabular-nums text-[#8f6517]">{formatter.format(row.price)} {t.sdg}</td><td className="px-6 py-5 text-sm text-[#60736a]">{dateFormatter.format(new Date(row.date))}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
        {!filtered.length && <p className="mt-5 rounded-2xl border border-dashed border-emerald-200 bg-white p-8 text-center font-bold text-[#60736a]">{t.noResults}</p>}
        <p className="mt-5 text-sm leading-7 text-[#60736a]">{t.disclaimer}</p>
      </section>
    </main>
  );
}

function Kpi({ icon: Icon, label, value }: { icon: typeof ShoppingBasket; label: string; value: string }) {
  return <article className="rounded-2xl border border-white/10 bg-white/95 p-5 text-[#173a2b] shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf4ef] text-emerald-700"><Icon className="h-5 w-5" /></div><p className="mt-4 text-sm font-bold text-[#60736a]">{label}</p><p className="mt-1 text-2xl font-black tabular-nums">{value}</p></article>;
}
