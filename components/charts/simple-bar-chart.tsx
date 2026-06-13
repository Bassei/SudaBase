"use client";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function SimpleBarChart({ data, nameKey = 'name', valueKey = 'value' }: { data: Record<string, string | number>[]; nameKey?: string; valueKey?: string }) {
  return <div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><XAxis dataKey={nameKey} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey={valueKey} /></BarChart></ResponsiveContainer></div>;
}

