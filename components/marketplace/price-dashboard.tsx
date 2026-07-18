'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarClock,
  MapPin,
  Search,
  ShoppingBasket,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { UfProduct } from '@/lib/united-fruit';

type Locale = 'ar' | 'en';
const WHEAT_IMAGE = 'https://images.unsplash.com/photo-1688902325229-f6f2ad06561d?auto=format&fit=crop&q=85&w=2400';

const copy = {
  ar: {
    dir: 'rtl' as const,
    eyebrow: 'بوابة الأسعار والمؤشرات',
    title: 'لوحة أسعار المحاصيل',
    lead: 'مقارنة بصرية واضحة بين متوسط السعر في منطقة المصدر ومتوسط السعر في الخرطوم.',
    market: 'دخول السوق',
    indicators: 'مؤشرات السوق',
    listed: 'المنتجات المدرجة',
    priced: 'منتجات بسعر منشور',
    sourceAvg: 'متوسط أسعار المصدر',
    khartoumAvg: 'متوسط أسعار الخرطوم',
    comparison: 'مقارنة متوسط الأسعار',
    comparisonHint: 'القيم بالجنيه السوداني حسب وحدة كل محصول',
    source: 'متوسط المصدر',
    khartoum: 'متوسط الخرطوم',
    gap: 'فارق النقل والسوق',
    gapHint: 'الفرق التقريبي بين متوسط الخرطوم ومتوسط المصدر للمنتجات المسعّرة.',
    search: 'ابحث عن محصول أو منطقة...',
    allProducts: 'تفاصيل المنتجات',
    product: 'المحصول',
    region: 'منطقة المصدر',
    sourceRange: 'نطاق المصدر',
    khartoumRange: 'نطاق الخرطوم',
    updated: 'آخر تحديث',
    empty: 'السعر قيد التحديث',
    noResults: 'لا توجد منتجات مطابقة للبحث.',
    sdg: 'ج.س',
    open: 'عرض التفاصيل',
  },
  en: {
    dir: 'ltr' as const,
    eyebrow: 'Prices & indicators portal',
    title: 'Crop Price Dashboard',
    lead: 'A clear visual comparison between average source-region and Khartoum market prices.',
    market: 'Open marketplace',
    indicators: 'Market indicators',
    listed: 'Listed products',
    priced: 'Products with prices',
    sourceAvg: 'Average source price',
    khartoumAvg: 'Average Khartoum price',
    comparison: 'Average price comparison',
    comparisonHint: 'Values in Sudanese pounds, based on each crop unit',
    source: 'Source average',
    khartoum: 'Khartoum average',
    gap: 'Market & transport gap',
    gapHint: 'Approximate difference between Khartoum and source averages for priced products.',
    search: 'Search crop or region...',
    allProducts: 'Product details',
    product: 'Product',
    region: 'Source region',
    sourceRange: 'Source range',
    khartoumRange: 'Khartoum range',
    updated: 'Last updated',
    empty: 'Price being updated',
    noResults: 'No products match your search.',
    sdg: 'SDG',
    open: 'View details',
  },
};

function average(min: number | null, max: number | null) {
  if (min === null && max === null) return null;
  if (min !== null && max !== null) return (min + max) / 2;
  return min ?? max;
}

function mean(values: Array<number | null>) {
  const valid = values.filter((value): value is number => value !== null);
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
}

export function PriceDashboard({ products, locale }: { products: UfProduct[]; locale: Locale }) {
  const t = copy[locale];
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;
  const [query, setQuery] = useState('');
  const formatter = useMemo(() => new Intl.NumberFormat(locale === 'ar' ? 'ar-SD' : 'en-US', { maximumFractionDigits: 0 }), [locale]);

  const chartData = useMemo(
    () => products
      .map((product) => ({
        id: product.product_id,
        name: locale === 'ar' ? product.name_ar : product.name_en,
        source: average(product.source_price_min, product.source_price_max),
        khartoum: average(product.khartoum_price_min, product.khartoum_price_max),
      }))
      .filter((row) => row.source !== null || row.khartoum !== null),
    [locale, products]
  );

  const sourceMean = mean(chartData.map((row) => row.source));
  const khartoumMean = mean(chartData.map((row) => row.khartoum));
  const spread = sourceMean ? ((khartoumMean - sourceMean) / sourceMean) * 100 : 0;
  const pricedCount = chartData.length;
  const latestDate = products.map((product) => product.last_updated).filter(Boolean).sort().at(-1);

  const filtered = products.filter((product) => {
    const haystack = `${product.name_ar} ${product.name_en} ${product.source_region}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  const formatValue = (value: number | null) => value === null ? t.empty : `${formatter.format(value)} ${t.sdg}`;
  const formatRange = (min: number | null, max: number | null) => {
    if (min === null && max === null) return t.empty;
    if (min !== null && max !== null && min !== max) return `${formatter.format(min)} – ${formatter.format(max)} ${t.sdg}`;
    return `${formatter.format((min ?? max) as number)} ${t.sdg}`;
  };

  return (
    <main dir={t.dir} className="min-h-screen bg-[#f6f8f6] text-[#173a2b]">
      <section className="relative overflow-hidden border-b border-emerald-950/10 bg-[#173a2b] text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${WHEAT_IMAGE})` }} />
        <div className="absolute inset-0 bg-[#173a2b]/85" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-black text-[#f5c451]">{t.eyebrow}</p>
              <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">{t.title}</h1>
              <p className="mt-4 text-lg leading-8 text-white/70">{t.lead}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={locale === 'ar' ? '/ar/marketplace?portal=status' : '/en/marketplace?portal=status'} className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15">{locale === 'ar' ? 'العروض والطلبات' : 'Offers & requests'}</Link>
              <Link href={locale === 'ar' ? '/ar/marketplace' : '/en/marketplace'} className="btn bg-[#f5c451] text-[#173a2b] hover:bg-amber-300">{t.market}<Arrow className="h-4 w-4" /></Link>
            </div>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi icon={ShoppingBasket} label={t.listed} value={formatter.format(products.length)} tone="emerald" />
            <Kpi icon={BarChart3} label={t.priced} value={formatter.format(pricedCount)} tone="sky" />
            <Kpi icon={TrendingUp} label={t.sourceAvg} value={formatValue(sourceMean || null)} tone="amber" />
            <Kpi icon={MapPin} label={t.khartoumAvg} value={formatValue(khartoumMean || null)} tone="violet" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-8 lg:grid-cols-[1fr_300px]">
        <article className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-xl font-black">{t.comparison}</h2><p className="mt-1 text-sm text-[#60736a]">{t.comparisonHint}</p></div>
            {latestDate && <span className="inline-flex items-center gap-2 rounded-full bg-[#f4f7f5] px-3 py-2 text-xs font-bold text-[#60736a]"><CalendarClock className="h-4 w-4" />{new Date(latestDate).toLocaleDateString(locale === 'ar' ? 'ar-SD' : 'en-US')}</span>}
          </div>
          <div className="mt-6 h-[360px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 24 }} barGap={4}>
                <CartesianGrid stroke="#e7eee9" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#60736a', fontSize: 12 }} axisLine={false} tickLine={false} interval={0} angle={chartData.length > 5 ? -18 : 0} textAnchor={chartData.length > 5 ? 'end' : 'middle'} />
                <YAxis tickFormatter={(value) => formatter.format(Number(value))} tick={{ fill: '#60736a', fontSize: 11 }} axisLine={false} tickLine={false} width={72} />
                <Tooltip formatter={(value: number) => `${formatter.format(value)} ${t.sdg}`} contentStyle={{ borderRadius: 16, border: '1px solid #dce7df', boxShadow: '0 12px 30px rgba(23,58,43,.1)' }} />
                <Legend wrapperStyle={{ paddingTop: 18 }} />
                <Bar dataKey="source" name={t.source} fill="#1f8a4c" radius={[8, 8, 0, 0]} maxBarSize={42} />
                <Bar dataKey="khartoum" name={t.khartoum} fill="#f6b83f" radius={[8, 8, 0, 0]} maxBarSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <aside className="rounded-3xl bg-[#173a2b] p-6 text-white shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-amber-300"><TrendingUp className="h-5 w-5" /></div>
          <p className="mt-6 text-sm font-bold text-emerald-100/70">{t.gap}</p>
          <p className="mt-2 text-5xl font-black text-white" dir="ltr">{spread > 0 ? '+' : ''}{spread.toFixed(1)}%</p>
          <p className="mt-4 text-sm leading-7 text-emerald-50/70">{t.gapHint}</p>
          <div className="mt-8 border-t border-white/10 pt-5">
            <div className="flex justify-between gap-3 text-sm"><span className="text-emerald-100/60">{t.source}</span><strong>{formatValue(sourceMean || null)}</strong></div>
            <div className="mt-3 flex justify-between gap-3 text-sm"><span className="text-emerald-100/60">{t.khartoum}</span><strong>{formatValue(khartoumMean || null)}</strong></div>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-2xl font-black">{t.allProducts}</h2><p className="mt-1 text-sm text-[#60736a]">{filtered.length} / {products.length}</p></div>
          <label className="relative block w-full sm:max-w-sm"><Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#789087]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="input ps-11" placeholder={t.search} /></label>
        </div>

        <div className="mt-5 grid gap-4 md:hidden">
          {filtered.map((product) => (
            <article key={product.product_id} className="rounded-2xl border border-emerald-950/10 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-black">{locale === 'ar' ? product.name_ar : product.name_en}</h3><p className="mt-1 flex items-center gap-1 text-sm text-[#60736a]"><MapPin className="h-3.5 w-3.5" />{product.source_region}</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{product.unit}</span></div>
              <div className="mt-5 grid grid-cols-2 gap-3"><PriceCell label={t.source} value={formatRange(product.source_price_min, product.source_price_max)} /><PriceCell label={t.khartoum} value={formatRange(product.khartoum_price_min, product.khartoum_price_max)} /></div>
            </article>
          ))}
        </div>

        <div className="mt-5 hidden overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-start">
              <thead className="bg-[#edf4ef] text-xs font-black text-[#426457]"><tr><th className="px-6 py-4">{t.product}</th><th className="px-6 py-4">{t.region}</th><th className="px-6 py-4">{t.sourceRange}</th><th className="px-6 py-4">{t.khartoumRange}</th><th className="px-6 py-4">{t.updated}</th></tr></thead>
              <tbody className="divide-y divide-emerald-950/[.07]">
                {filtered.map((product) => (
                  <tr key={product.product_id} className="transition hover:bg-emerald-50/40"><td className="px-6 py-5"><p className="font-black">{locale === 'ar' ? product.name_ar : product.name_en}</p><p className="mt-1 text-xs text-[#789087]">{product.unit}</p></td><td className="px-6 py-5 text-sm font-bold text-[#60736a]">{product.source_region}</td><td className="px-6 py-5 text-sm font-black tabular-nums">{formatRange(product.source_price_min, product.source_price_max)}</td><td className="px-6 py-5 text-sm font-black tabular-nums text-emerald-700">{formatRange(product.khartoum_price_min, product.khartoum_price_max)}</td><td className="px-6 py-5 text-sm text-[#60736a]">{product.last_updated ? new Date(product.last_updated).toLocaleDateString(locale === 'ar' ? 'ar-SD' : 'en-US') : '—'}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {!filtered.length && <p className="mt-5 rounded-2xl border border-dashed border-emerald-200 bg-white p-8 text-center font-bold text-[#60736a]">{t.noResults}</p>}
      </section>
      <p className="pb-6 text-center text-[11px] text-[#849087]">Photo: <a className="underline" href="https://unsplash.com/photos/a-close-up-of-a-bunch-of-wheat-in-a-field-B9KFg8CRoQY" target="_blank" rel="noreferrer">Kateryna Hliznitsova / Unsplash</a></p>
    </main>
  );
}

function Kpi({ icon: Icon, label, value, tone }: { icon: typeof ShoppingBasket; label: string; value: string; tone: 'emerald' | 'sky' | 'amber' | 'violet' }) {
  const colors = { emerald: 'bg-emerald-50 text-emerald-700', sky: 'bg-sky-50 text-sky-700', amber: 'bg-amber-50 text-amber-700', violet: 'bg-violet-50 text-violet-700' };
  return <article className="rounded-2xl border border-emerald-950/10 bg-white p-5 shadow-sm"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[tone]}`}><Icon className="h-5 w-5" /></div><p className="mt-4 text-sm font-bold text-[#60736a]">{label}</p><p className="mt-1 text-2xl font-black tabular-nums">{value}</p></article>;
}

function PriceCell({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-[#f4f7f5] p-3"><p className="text-xs font-bold text-[#789087]">{label}</p><p className="mt-1 text-sm font-black">{value}</p></div>;
}
