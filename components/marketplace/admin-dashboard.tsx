'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import type { UfProduct } from '@/lib/united-fruit';

type Props = {
  products: UfProduct[];
  supply: any[];
  demand: any[];
  matches: any[];
};

type State = { type: 'idle' | 'loading' | 'success' | 'error'; message: string };

async function send(path: string, method: 'POST' | 'PATCH', body: Record<string, unknown>) {
  const response = await fetch(path, {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await response.json();

  if (!response.ok || !json.ok) {
    throw new Error(json.error || 'Request failed.');
  }

  return json;
}

export function AdminDashboard({ products, supply, demand, matches }: Props) {
  const [matchState, setMatchState] = useState<State>({ type: 'idle', message: '' });
  const [priceState, setPriceState] = useState<State>({ type: 'idle', message: '' });

  async function createMatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMatchState({ type: 'loading', message: '...' });
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      await send('/api/marketplace/admin/matches', 'POST', data);
      setMatchState({ type: 'success', message: 'تم إنشاء المطابقة وتحديث حالة الطرفين.' });
      window.location.reload();
    } catch (error) {
      setMatchState({ type: 'error', message: error instanceof Error ? error.message : 'Error' });
    }
  }

  async function updatePrice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPriceState({ type: 'loading', message: '...' });
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      await send('/api/marketplace/admin/products', 'PATCH', data);
      setPriceState({ type: 'success', message: 'تم تحديث الأسعار.' });
      window.location.reload();
    } catch (error) {
      setPriceState({ type: 'error', message: error instanceof Error ? error.message : 'Error' });
    }
  }

  return (
    <main dir="rtl" className="bg-[#fbfdf8] px-4 py-10 text-[#173a2b]">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black text-amber-700">لوحة الفريق الداخلية</p>
            <h1 className="mt-2 text-4xl font-black text-[#173a2b]">مطابقة عروض وطلبات United Fruit</h1>
          </div>
          <button onClick={() => window.location.reload()} className="btn-secondary">
            <RefreshCw className="h-4 w-4" />
            تحديث
          </button>
        </div>

        <section className="grid gap-5 lg:grid-cols-3">
          <Metric label="عروض التوفر" value={supply.length} />
          <Metric label="طلبات الشراء" value={demand.length} />
          <Metric label="الصفقات المحتملة" value={matches.length} />
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Panel title="عروض التوفر">
            <RequestList rows={supply} kind="supply" />
          </Panel>
          <Panel title="طلبات الشراء">
            <RequestList rows={demand} kind="demand" />
          </Panel>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <form onSubmit={createMatch} className="rounded-lg border border-emerald-900/10 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-[#173a2b]">إنشاء مطابقة يدوية</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-bold text-slate-700">
                <span>عرض التوفر</span>
                <select className="input" name="supply_request_id" required>
                  <option value="">اختر العرض</option>
                  {supply.map((row) => (
                    <option key={row.supply_request_id} value={row.supply_request_id}>
                      {row.uf_products?.name_ar || row.product_id} - {row.quantity_jowal} جوال
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-bold text-slate-700">
                <span>طلب الشراء</span>
                <select className="input" name="demand_request_id" required>
                  <option value="">اختر الطلب</option>
                  {demand.map((row) => (
                    <option key={row.demand_request_id} value={row.demand_request_id}>
                      {row.uf_products?.name_ar || row.product_id} - {row.quantity_jowal} جوال
                    </option>
                  ))}
                </select>
              </label>
              <Field name="final_price" label="السعر النهائي المتفق عليه" type="number" />
              <Field name="actual_delivery_date" label="تاريخ التسليم الفعلي" type="date" />
              <label className="space-y-2 text-sm font-bold text-slate-700">
                <span>حالة الصفقة</span>
                <select className="input" name="status" defaultValue="قيد التنفيذ">
                  <option>قيد التنفيذ</option>
                  <option>مكتملة</option>
                  <option>ملغاة</option>
                </select>
              </label>
              <Field name="notes" label="ملاحظات" />
            </div>
            <Action state={matchState} label="حفظ المطابقة" />
          </form>

          <form onSubmit={updatePrice} className="rounded-lg border border-emerald-900/10 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-[#173a2b]">تحديث أسعار المنتجات</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-bold text-slate-700 sm:col-span-2">
                <span>المنتج</span>
                <select className="input" name="product_id" required>
                  {products.map((product) => (
                    <option key={product.product_id} value={product.product_id}>
                      {product.name_ar}
                    </option>
                  ))}
                </select>
              </label>
              <Field name="source_price_min" label="سعر المصدر - أدنى" type="number" />
              <Field name="source_price_max" label="سعر المصدر - أعلى" type="number" />
              <Field name="khartoum_price_min" label="سعر الخرطوم - أدنى" type="number" />
              <Field name="khartoum_price_max" label="سعر الخرطوم - أعلى" type="number" />
            </div>
            <Action state={priceState} label="تحديث الأسعار" />
          </form>
        </section>

        <Panel title="سجل الصفقات المحتملة">
          <div className="grid gap-3">
            {matches.length ? (
              matches.map((match) => (
                <article key={match.match_id} className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex flex-wrap justify-between gap-3">
                    <p className="font-black text-[#173a2b]">{match.status}</p>
                    <p className="font-bold text-slate-600">{match.final_price ? `${Number(match.final_price).toLocaleString()} SDG` : 'بدون سعر نهائي'}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{match.notes || 'لا توجد ملاحظات'}</p>
                </article>
              ))
            ) : (
              <p className="rounded-lg bg-emerald-50 p-4 text-sm font-bold text-[#60736a]">لا توجد مطابقات بعد.</p>
            )}
          </div>
        </Panel>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-black text-[#173a2b]">{value}</p>
    </article>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-emerald-900/10 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black text-[#173a2b]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({ name, label, type = 'text' }: { name: string; label: string; type?: string }) {
  return (
    <label className="space-y-2 text-sm font-bold text-slate-700">
      <span>{label}</span>
      <input className="input" name={name} type={type} />
    </label>
  );
}

function Action({ state, label }: { state: State; label: string }) {
  return (
    <div className="mt-5 space-y-3">
      <button className="btn-primary bg-emerald-700 hover:bg-emerald-800" disabled={state.type === 'loading'}>
        {state.type === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
        {label}
      </button>
      {state.type !== 'idle' && (
        <p className={`rounded-lg px-3 py-2 text-sm font-bold ${state.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {state.message}
        </p>
      )}
    </div>
  );
}

function RequestList({ rows, kind }: { rows: any[]; kind: 'supply' | 'demand' }) {
  if (!rows.length) {
    return <p className="rounded-lg bg-emerald-50 p-4 text-sm font-bold text-[#60736a]">لا توجد سجلات بعد.</p>;
  }

  return (
    <div className="grid gap-3">
      {rows.map((row) => (
        <article key={row.supply_request_id || row.demand_request_id} className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-black text-[#173a2b]">{row.uf_products?.name_ar || row.product_id}</p>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-800">{row.status}</span>
          </div>
          <p className="mt-2 text-sm font-bold text-slate-700">{Number(row.quantity_jowal).toLocaleString()} جوال</p>
          <p className="mt-1 text-sm text-slate-600">
            {kind === 'supply'
              ? `${row.uf_farmers?.name || 'مزارع'} - ${row.harvest_location}`
              : `${row.uf_buyers?.business_name || 'تاجر'} - ${row.requested_delivery_date}`}
          </p>
        </article>
      ))}
    </div>
  );
}
