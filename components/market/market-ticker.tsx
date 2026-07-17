import { Banknote, CircleDollarSign, Gem, TrendingUp } from 'lucide-react';
import type { MarketIndicator } from '@/lib/types';

const icons = [CircleDollarSign, Banknote, Gem, TrendingUp];

export function MarketTicker({
  indicators,
  compact = false,
  locale = 'ar',
}: {
  indicators: MarketIndicator[];
  compact?: boolean;
  locale?: 'ar' | 'en';
}) {
  const latest = new Map<string, MarketIndicator>();
  for (const item of indicators) {
    if (!latest.has(item.indicator_type)) latest.set(item.indicator_type, item);
  }
  const list = Array.from(latest.values()).slice(0, compact ? 3 : 6);

  if (!list.length) {
    return (
      <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-5 text-sm font-bold text-[#60736a]">
        {locale === 'ar' ? 'لا توجد مؤشرات منشورة حتى الآن.' : 'No published market indicators yet.'}
      </div>
    );
  }

  return (
    <div className={`grid gap-3 ${compact ? 'sm:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
      {list.map((indicator, index) => {
        const Icon = icons[index % icons.length];
        return (
          <article
            key={indicator.indicator_id}
            className={`${compact ? 'bg-[#f4f8f5] p-4' : 'border border-emerald-950/10 bg-white p-5 shadow-sm'} rounded-2xl`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Icon className="h-4 w-4" /></div>
              <span className="text-[11px] font-black text-[#7a8d84]">{indicator.source_name || (locale === 'ar' ? 'المصدر' : 'Source')}</span>
            </div>
            <p className="mt-4 truncate text-xs font-bold text-[#60736a]">{indicator.name}</p>
            <p className="mt-1 text-xl font-black tabular-nums text-[#173a2b]">
              {Number(indicator.value).toLocaleString(locale === 'ar' ? 'ar' : 'en-US')}
              <span className="ms-1 text-xs text-[#60736a]">{indicator.currency}</span>
            </p>
          </article>
        );
      })}
    </div>
  );
}
