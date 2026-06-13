import Link from 'next/link';
import type { Business } from '@/lib/types';

export function BusinessCard({ business }: { business: Business }) {
  return <article className="card p-5"><Link href={`/businesses/${business.business_id}`} className="text-lg font-bold hover:underline">{business.name}</Link><p className="mt-2 text-sm text-slate-600">{[business.city, business.state].filter(Boolean).join(', ') || 'Location not listed'}</p><div className="mt-4 flex flex-wrap gap-2"><span className="badge">Strength: {business.competitor_strength ?? 'n/a'}</span><span className="badge">Confidence: {business.data_confidence || 'unknown'}</span></div>{business.website && <a href={business.website} target="_blank" className="mt-4 inline-block text-sm font-semibold text-sudanGreen">Open website</a>}</article>;
}

