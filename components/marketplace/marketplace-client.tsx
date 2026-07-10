'use client';

import { FormEvent, useMemo, useState } from 'react';
import { CheckCircle2, HandCoins, Loader2, PackageCheck, Sprout, Store } from 'lucide-react';
import type { UfProduct } from '@/lib/united-fruit';
import { DEMAND_MINIMUM_JOWAL } from '@/lib/marketplace-constants';

type Locale = 'ar' | 'en';
type ApiState = { type: 'idle' | 'loading' | 'success' | 'error'; message: string };

const copy = {
  ar: {
    dir: 'rtl',
    badge: 'مطابقة داخلية بإشراف United Fruit',
    title: 'سوق يونايتد فروت',
    lead: 'سجل عرض محصول أو طلب شراء بالجملة. كل مطابقة تمر عبر الفريق قبل التنسيق، ولا تظهر بيانات التواصل لأي طرف آخر.',
    farmerTitle: 'تسجيل مزارع',
    farmerOfferTitle: 'تسجيل توفر محصول',
    buyerTitle: 'تسجيل تاجر',
    demandTitle: 'تقديم طلب شراء',
    name: 'الاسم',
    phone: 'رقم الهاتف',
    region: 'المنطقة / الولاية',
    crop: 'المحصول الرئيسي',
    product: 'المنتج',
    quantity: 'الكمية بالجوال',
    harvestLocation: 'منطقة / موقع الحصاد',
    availableDate: 'تاريخ التوفر المتوقع',
    submitFarmer: 'حفظ المزارع',
    submitSupply: 'إرسال العرض',
    businessName: 'اسم النشاط',
    businessType: 'نوع النشاط',
    buyerLocation: 'الموقع',
    targetPrice: 'السعر المستهدف (اختياري)',
    deliveryDate: 'تاريخ التسليم المطلوب',
    submitBuyer: 'حفظ التاجر',
    submitDemand: 'إرسال الطلب',
    myOffers: 'عروضي',
    myRequests: 'طلباتي',
    lookup: 'عرض الحالة',
    minimum: 'الحد الأدنى للصفقة 400 جوال لضمان كفاءة النقل',
    farmerSaved: 'تم حفظ بيانات المزارع.',
    buyerSaved: 'تم حفظ بيانات التاجر.',
    supplySaved: 'تم إرسال العرض بحالة قيد المراجعة.',
    demandSaved: 'تم إرسال الطلب بحالة قيد المراجعة.',
    noRows: 'لا توجد سجلات لهذا الرقم.',
  },
  en: {
    dir: 'ltr',
    badge: 'Team-reviewed matching by United Fruit',
    title: 'United Fruit Marketplace',
    lead: 'Submit crop supply or wholesale demand. Every match is reviewed by the team before coordination, and contact details are not exposed between parties.',
    farmerTitle: 'Farmer registration',
    farmerOfferTitle: 'Supply listing',
    buyerTitle: 'Buyer registration',
    demandTitle: 'Demand request',
    name: 'Name',
    phone: 'Phone',
    region: 'Region / state',
    crop: 'Primary crop',
    product: 'Product',
    quantity: 'Quantity in jowal',
    harvestLocation: 'Harvest location',
    availableDate: 'Expected availability date',
    submitFarmer: 'Save farmer',
    submitSupply: 'Submit supply',
    businessName: 'Business name',
    businessType: 'Business type',
    buyerLocation: 'Location',
    targetPrice: 'Target price (optional)',
    deliveryDate: 'Requested delivery date',
    submitBuyer: 'Save buyer',
    submitDemand: 'Submit demand',
    myOffers: 'My offers',
    myRequests: 'My requests',
    lookup: 'View status',
    minimum: 'Minimum deal size is 400 jowal to keep transport efficient',
    farmerSaved: 'Farmer saved.',
    buyerSaved: 'Buyer saved.',
    supplySaved: 'Supply submitted for review.',
    demandSaved: 'Demand submitted for review.',
    noRows: 'No records for this phone number.',
  },
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2 text-sm font-bold text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Notice({ state }: { state: ApiState }) {
  if (state.type === 'idle') return null;

  return (
    <p
      className={`rounded-lg px-3 py-2 text-sm font-bold ${
        state.type === 'error'
          ? 'bg-red-50 text-red-700'
          : state.type === 'success'
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-amber-50 text-amber-700'
      }`}
    >
      {state.message}
    </p>
  );
}

async function postJson(path: string, body: Record<string, unknown>) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await response.json();

  if (!response.ok || !json.ok) {
    throw new Error(json.error || 'Request failed.');
  }

  return json;
}

export function MarketplaceClient({ products, locale }: { products: UfProduct[]; locale: Locale }) {
  const t = copy[locale];
  const firstProduct = products[0]?.product_id ?? '';
  const [farmerId, setFarmerId] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [buyerId, setBuyerId] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [farmerState, setFarmerState] = useState<ApiState>({ type: 'idle', message: '' });
  const [supplyState, setSupplyState] = useState<ApiState>({ type: 'idle', message: '' });
  const [buyerState, setBuyerState] = useState<ApiState>({ type: 'idle', message: '' });
  const [demandState, setDemandState] = useState<ApiState>({ type: 'idle', message: '' });
  const [offerRows, setOfferRows] = useState<any[]>([]);
  const [requestRows, setRequestRows] = useState<any[]>([]);

  const productOptions = useMemo(
    () =>
      products.map((product) => (
        <option key={product.product_id} value={product.product_id}>
          {locale === 'ar' ? product.name_ar : product.name_en}
        </option>
      )),
    [locale, products]
  );

  async function submitFarmer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFarmerState({ type: 'loading', message: '...' });
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const json = await postJson('/api/marketplace/farmers', data);
      setFarmerId(json.farmer.farmer_id);
      setFarmerPhone(json.farmer.phone);
      setFarmerState({ type: 'success', message: t.farmerSaved });
    } catch (error) {
      setFarmerState({ type: 'error', message: error instanceof Error ? error.message : 'Error' });
    }
  }

  async function submitSupply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSupplyState({ type: 'loading', message: '...' });
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      await postJson('/api/marketplace/supply', { ...data, farmer_id: farmerId, farmer_phone: data.farmer_phone || farmerPhone });
      setSupplyState({ type: 'success', message: t.supplySaved });
      await lookup('farmer', String(data.farmer_phone || farmerPhone), setOfferRows);
    } catch (error) {
      setSupplyState({ type: 'error', message: error instanceof Error ? error.message : 'Error' });
    }
  }

  async function submitBuyer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBuyerState({ type: 'loading', message: '...' });
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const json = await postJson('/api/marketplace/buyers', data);
      setBuyerId(json.buyer.buyer_id);
      setBuyerPhone(json.buyer.phone);
      setBuyerState({ type: 'success', message: t.buyerSaved });
    } catch (error) {
      setBuyerState({ type: 'error', message: error instanceof Error ? error.message : 'Error' });
    }
  }

  async function submitDemand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDemandState({ type: 'loading', message: '...' });
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const quantity = Number(data.quantity_jowal);

    if (!Number.isInteger(quantity) || quantity < DEMAND_MINIMUM_JOWAL) {
      setDemandState({ type: 'error', message: t.minimum });
      return;
    }

    try {
      await postJson('/api/marketplace/demand', { ...data, buyer_id: buyerId, buyer_phone: data.buyer_phone || buyerPhone });
      setDemandState({ type: 'success', message: t.demandSaved });
      await lookup('buyer', String(data.buyer_phone || buyerPhone), setRequestRows);
    } catch (error) {
      setDemandState({ type: 'error', message: error instanceof Error ? error.message : 'Error' });
    }
  }

  async function lookup(role: 'farmer' | 'buyer', phone: string, setter: (rows: any[]) => void) {
    if (!phone) return;
    const json = await postJson('/api/marketplace/status', { role, phone });
    setter(json.requests ?? []);
  }

  return (
    <main dir={t.dir} className="bg-[#fbfdf8] text-[#173a2b]">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-full bg-emerald-900 px-4 py-2 text-sm font-black text-amber-100">
            {t.badge}
          </p>
          <h1 className="mt-6 text-4xl font-black text-[#173a2b] md:text-6xl">{t.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">{t.lead}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {products.map((product) => (
            <article key={product.product_id} className="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-500">{product.source_region}</p>
              <h2 className="mt-2 text-2xl font-black text-[#173a2b]">
                {locale === 'ar' ? product.name_ar : product.name_en}
              </h2>
              <p className="mt-2 text-sm font-bold text-amber-700">{product.unit}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-14 lg:grid-cols-2">
        <div className="space-y-5">
          <form onSubmit={submitFarmer} className="rounded-lg border border-emerald-900/10 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <Sprout className="h-6 w-6 text-emerald-700" />
              <h2 className="text-2xl font-black text-[#173a2b]">{t.farmerTitle}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.name}><input className="input" name="name" required /></Field>
              <Field label={t.phone}><input className="input" name="phone" required value={farmerPhone} onChange={(e) => setFarmerPhone(e.target.value)} /></Field>
              <Field label={t.region}><input className="input" name="region" required /></Field>
              <Field label={t.crop}><input className="input" name="primary_crop" required /></Field>
            </div>
            <button className="btn-primary mt-5 bg-emerald-700 hover:bg-emerald-800" disabled={farmerState.type === 'loading'}>
              {farmerState.type === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {t.submitFarmer}
            </button>
            <div className="mt-4"><Notice state={farmerState} /></div>
          </form>

          <form onSubmit={submitSupply} className="rounded-lg border border-emerald-900/10 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <PackageCheck className="h-6 w-6 text-emerald-700" />
              <h2 className="text-2xl font-black text-[#173a2b]">{t.farmerOfferTitle}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.phone}><input className="input" name="farmer_phone" required value={farmerPhone} onChange={(e) => setFarmerPhone(e.target.value)} /></Field>
              <Field label={t.product}><select className="input" name="product_id" defaultValue={firstProduct} required>{productOptions}</select></Field>
              <Field label={t.quantity}><input className="input" name="quantity_jowal" type="number" min="1" step="1" required /></Field>
              <Field label={t.harvestLocation}><input className="input" name="harvest_location" required /></Field>
              <Field label={t.availableDate}><input className="input" name="expected_available_date" type="date" required /></Field>
            </div>
            <button className="btn-primary mt-5 bg-[#f6b83f] text-[#173a2b] hover:bg-amber-300" disabled={supplyState.type === 'loading'}>
              {supplyState.type === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackageCheck className="h-4 w-4" />}
              {t.submitSupply}
            </button>
            <div className="mt-4"><Notice state={supplyState} /></div>
          </form>
        </div>

        <div className="space-y-5">
          <form onSubmit={submitBuyer} className="rounded-lg border border-emerald-900/10 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <Store className="h-6 w-6 text-emerald-700" />
              <h2 className="text-2xl font-black text-[#173a2b]">{t.buyerTitle}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.businessName}><input className="input" name="business_name" required /></Field>
              <Field label={t.businessType}><select className="input" name="business_type" required><option>تاجر جملة</option><option>مصنع</option><option>غيره</option></select></Field>
              <Field label={t.phone}><input className="input" name="phone" required value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} /></Field>
              <Field label={t.buyerLocation}><input className="input" name="location" required /></Field>
            </div>
            <button className="btn-primary mt-5 bg-emerald-700 hover:bg-emerald-800" disabled={buyerState.type === 'loading'}>
              {buyerState.type === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {t.submitBuyer}
            </button>
            <div className="mt-4"><Notice state={buyerState} /></div>
          </form>

          <form onSubmit={submitDemand} className="rounded-lg border border-emerald-900/10 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <HandCoins className="h-6 w-6 text-emerald-700" />
              <h2 className="text-2xl font-black text-[#173a2b]">{t.demandTitle}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.phone}><input className="input" name="buyer_phone" required value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} /></Field>
              <Field label={t.product}><select className="input" name="product_id" defaultValue={firstProduct} required>{productOptions}</select></Field>
              <Field label={t.quantity}><input className="input" name="quantity_jowal" type="number" min={DEMAND_MINIMUM_JOWAL} step="1" required /></Field>
              <Field label={t.targetPrice}><input className="input" name="target_price" type="number" min="0" step="1" /></Field>
              <Field label={t.deliveryDate}><input className="input" name="requested_delivery_date" type="date" required /></Field>
            </div>
            <p className="mt-3 text-sm font-bold text-amber-700">{t.minimum}</p>
            <button className="btn-primary mt-5 bg-[#f6b83f] text-[#173a2b] hover:bg-amber-300" disabled={demandState.type === 'loading'}>
              {demandState.type === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <HandCoins className="h-4 w-4" />}
              {t.submitDemand}
            </button>
            <div className="mt-4"><Notice state={demandState} /></div>
          </form>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-16 lg:grid-cols-2">
        <StatusPanel title={t.myOffers} phone={farmerPhone} rows={offerRows} empty={t.noRows} lookupLabel={t.lookup} onLookup={() => lookup('farmer', farmerPhone, setOfferRows)} />
        <StatusPanel title={t.myRequests} phone={buyerPhone} rows={requestRows} empty={t.noRows} lookupLabel={t.lookup} onLookup={() => lookup('buyer', buyerPhone, setRequestRows)} />
      </section>
    </main>
  );
}

function StatusPanel({
  title,
  phone,
  rows,
  empty,
  lookupLabel,
  onLookup,
}: {
  title: string;
  phone: string;
  rows: any[];
  empty: string;
  lookupLabel: string;
  onLookup: () => void;
}) {
  return (
    <section className="rounded-lg border border-emerald-900/10 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-black text-[#173a2b]">{title}</h2>
        <button className="btn-secondary" type="button" disabled={!phone} onClick={onLookup}>
          {lookupLabel}
        </button>
      </div>
      <div className="mt-5 space-y-3">
        {rows.length ? (
          rows.map((row) => (
            <article key={row.supply_request_id || row.demand_request_id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-black text-[#173a2b]">{row.uf_products?.name_ar || row.uf_products?.name_en || row.product_id}</p>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-800">{row.status}</span>
              </div>
              <p className="mt-2 text-sm font-bold text-slate-600">{Number(row.quantity_jowal).toLocaleString()} جوال</p>
            </article>
          ))
        ) : (
          <p className="rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-500">{empty}</p>
        )}
      </div>
    </section>
  );
}
