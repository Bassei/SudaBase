import { ReactNode } from 'react';

export function StatCard({ label, value, icon }: { label: string; value: string | number; icon?: ReactNode }) {
  return <div className="card p-5"><div className="flex items-center justify-between"><p className="text-sm text-slate-500">{label}</p>{icon}</div><p className="mt-3 text-3xl font-bold text-slate-950">{value}</p></div>;
}

