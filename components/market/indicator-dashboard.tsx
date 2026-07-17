'use client';

import Link from 'next/link';
import { Activity, ArrowLeft, ArrowRight, CalendarClock, Database, LineChart as LineChartIcon, Link2, Radio } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MarketIndicator } from '@/lib/types';

type Locale = 'ar' | 'en';

const copy = {
  ar: {
    dir: 'rtl' as const,
    eyebrow: 'بوابة الأسعار والمؤشرات',
    title: 'مؤشرات السوق في لوحة واحدة',
    lead: 'تابع أحدث قيم الصرف والمعادن والمؤشرات المسجلة، مع رسم حركة كل مؤشر عبر التحديثات المتاحة.',
    prices: 'أسعار المحاصيل',
    types: 'أنواع المؤشرات',
    records: 'القراءات المسجلة',
    sources: 'مصادر البيانات',
    latest: 'آخر تحديث',
    history: 'سجل الحركة',
    current: 'القيمة الحالية',
    noHistory: 'تظهر الحركة بمجرد توفر أكثر من قراءة.',
    noData: 'لا توجد مؤشرات منشورة حتى الآن.',
    methodology: 'طريقة القراءة',
    methodologyText: 'كل رسم يعرض القراءات المسجلة للمؤشر نفسه فقط. اختلاف الوحدات والعملات يمنع دمج المؤشرات في مقياس واحد مضلل.',
  },
  en: {
    dir: 'ltr' as const,
    eyebrow: 'Prices & indicators portal',
    title: 'Market indicators in one dashboard',
    lead: 'Track the latest exchange, metals, and market readings, with a chart for each indicator across available updates.',
    prices: 'Crop prices',
    types: 'Indicator types',
    records: 'Recorded readings',
    sources: 'Data sources',
    latest: 'Latest update',
    history: 'Movement history',
    current: 'Current value',
    noHistory: 'Movement appears when more than one reading is available.',
    noData: 'No published indicators yet.',
    methodology: 'How to read this',
    methodologyText: 'Each chart only shows readings for the same indicator. Different units and currencies are kept separate to avoid a misleading shared scale.',
  },
};

const colors = ['#1f8a4c', '#e9a923', '#0ea5e9', '#8b5cf6', '#ef7b45'];

export function IndicatorDashboard({ indicators, locale }: { indicators: MarketIndicator[]; locale: Locale }) {
  const t = copy[locale];
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;
  const grouped = new Map<string, MarketIndicator[]>();
  for (const indicator of indicators) {
    const rows = grouped.get(indicator.indicator_type) ?? [];
    rows.push(indicator);
    grouped.set(indicator.indicator_type, rows);
  }
  const groups = Array.from(grouped.entries()).map(([type, rows]) => ({
    type,
    rows: rows.sort((a, b) => new Date(a.fetched_at).getTime() - new Date(b.fetched_at).getTime()),
  }));
  const sources = new Set(indicators.map((row) => row.source_name).filter(Boolean)).size;
  const latestDate = indicators.map((row) => row.fetched_at).sort().at(-1);
  const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-SD' : 'en-US', { maximumFractionDigits: 2 });

  return (
    <main dir={t.dir} className="min-h-screen bg-[#f6f8f6] text-[#173a2b]">
      <section className="border-b border-emerald-950/10 bg-[#0c2f23] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-4 py-12 lg:flex-row lg:items-end lg:justify-between lg:py-16">
          <div className="max-w-3xl"><p className="text-sm font-black text-emerald-300">{t.eyebrow}</p><h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">{t.title}</h1><p className="mt-4 text-lg leading-8 text-emerald-50/70">{t.lead}</p></div>
          <Link href={locale === 'ar' ? '/ar/marketplace/prices' : '/en/marketplace/prices'} className="btn bg-white text-[#173a2b] hover:bg-emerald-50">{t.prices}<Arrow className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi icon={Activity} label={t.types} value={formatter.format(groups.length)} />
          <Kpi icon={Database} label={t.records} value={formatter.format(indicators.length)} />
          <Kpi icon={Link2} label={t.sources} value={formatter.format(sources)} />
          <Kpi icon={CalendarClock} label={t.latest} value={latestDate ? new Date(latestDate).toLocaleDateString(locale === 'ar' ? 'ar-SD' : 'en-US') : '—'} />
        </div>

        {groups.length ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {groups.map(({ type, rows }, index) => {
              const latest = rows.at(-1)!;
              const chartData = rows.map((row) => ({ date: new Date(row.fetched_at).toLocaleDateString(locale === 'ar' ? 'ar-SD' : 'en-US', { month: 'short', day: 'numeric' }), value: Number(row.value) }));
              return (
                <article key={type} className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm sm:p-7">
                  <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-[#60736a]">{latest.name}</p><p className="mt-2 text-3xl font-black tabular-nums">{formatter.format(Number(latest.value))} <span className="text-sm text-[#60736a]">{latest.currency}</span></p></div><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><LineChartIcon className="h-5 w-5" /></span></div>
                  <div className="mt-6 flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-wider text-[#789087]">{t.history}</p><span className="text-xs font-bold text-[#789087]">{latest.source_name}</span></div>
                  <div className="mt-3 h-52" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 12, right: 12, left: 4, bottom: 0 }}>
                        <CartesianGrid stroke="#e7eee9" strokeDasharray="4 4" vertical={false} />
                        <XAxis dataKey="date" tick={{ fill: '#789087', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={(value) => formatter.format(Number(value))} tick={{ fill: '#789087', fontSize: 10 }} axisLine={false} tickLine={false} width={68} domain={['auto', 'auto']} />
                        <Tooltip formatter={(value: number) => `${formatter.format(value)} ${latest.currency ?? ''}`} contentStyle={{ borderRadius: 14, border: '1px solid #dce7df' }} />
                        <Line type="monotone" dataKey="value" stroke={colors[index % colors.length]} strokeWidth={3} dot={{ r: 4, fill: colors[index % colors.length], strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {rows.length < 2 && <p className="mt-2 text-xs font-bold text-[#789087]">{t.noHistory}</p>}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-emerald-200 bg-white p-12 text-center font-bold text-[#60736a]">{t.noData}</div>
        )}

        <aside className="mt-6 flex flex-col gap-4 rounded-3xl bg-amber-50 p-6 sm:flex-row sm:items-center"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-700"><Radio className="h-5 w-5" /></div><div><h2 className="font-black">{t.methodology}</h2><p className="mt-1 text-sm leading-7 text-[#60736a]">{t.methodologyText}</p></div></aside>
      </section>
    </main>
  );
}

function Kpi({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: string }) {
  return <article className="rounded-2xl border border-emerald-950/10 bg-white p-5 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></div><p className="mt-4 text-sm font-bold text-[#60736a]">{label}</p><p className="mt-1 text-2xl font-black tabular-nums">{value}</p></article>;
}
