import type { MarketIndicator } from '@/lib/types';

export function MarketTicker({ indicators }: { indicators: MarketIndicator[] }) {
  const latest = new Map<string, MarketIndicator>();
  for (const item of indicators) if (!latest.has(item.indicator_type)) latest.set(item.indicator_type, item);
  const list = Array.from(latest.values());
  if (!list.length) return <div className="card p-5 text-sm text-slate-600">Market indicators are not available yet. Use the admin refresh action after adding API keys.</div>;
  return <div className="grid gap-4 md:grid-cols-3">{list.map(i => <div key={i.indicator_id} className="card p-5"><p className="text-sm text-slate-500">{i.name}</p><p className="mt-2 text-2xl font-bold">{Number(i.value).toLocaleString()} {i.currency}</p><p className="mt-1 text-xs text-slate-500">{i.unit || ''} · {i.source_name || 'source'} · {new Date(i.fetched_at).toLocaleString()}</p></div>)}</div>;
}

