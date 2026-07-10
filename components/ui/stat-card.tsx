import { ReactNode } from 'react';

export function StatCard({ label, value, icon }: { label: string; value: string | number; icon?: ReactNode }) {
  return <div className="card p-5"><div className="flex items-center justify-between"><p className="text-sm font-bold text-[#60736a]">{label}</p>{icon}</div><p className="mt-3 text-3xl font-black text-[#173a2b]">{value}</p></div>;
}

