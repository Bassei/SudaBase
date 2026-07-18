'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ClipboardList, HandCoins, Loader2, PackageCheck, Sprout, Store } from 'lucide-react';
import Link from 'next/link';
import type { UfProduct } from '@/lib/united-fruit';
import { DEMAND_MINIMUM_JOWAL } from '@/lib/marketplace-constants';

type Locale = 'ar' | 'en';
type ApiState = { type: 'idle' | 'loading' | 'success' | 'error'; message: string };

const copy = {
  ar: {
    dir: 'rtl',
    badge: 'مطابقة موثوقة بإشراف فريق حصاد',
    title: 'بوابة حصاد',
    lead: 'أكمل بيانات هذه البوابة فقط، وسيقوم فريق حصاد بالمراجعة والمطابقة والتنسيق حتى إتمام الصفقة.',
    farmerTitle: 'تسجيل مزارع',
    farmerOfferTitle: 'تسجيل توفر محصول',
    buyerTitle: 'تسجيل تاجر',
    demandTitle: 'تقديم طلب شراء',
    name: 'الاسم',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    contactMethod: 'طريقة التواصل',
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
    choosePortal: 'اختر بوابتك',
    choosePortalHint: 'كل مسار يعرض الخطوات التي تحتاجها فقط.',
    farmerPortal: 'بوابة المزارع',
    farmerPortalHint: 'تسجيل المزارع ثم عرض المحصول',
    buyerPortal: 'بوابة المشتري',
    buyerPortalHint: 'تسجيل النشاط ثم طلب الشراء',
    statusPortal: 'متابعة الطلبات',
    statusPortalHint: 'راجع حالة العروض والطلبات',
  },
  en: {
    dir: 'ltr',
    badge: 'Team-reviewed matching by Hasad',
    title: 'Hasad Portal',
    lead: 'Complete only this portal’s details, and the Hasad team will review, match, and coordinate the deal.',
    farmerTitle: 'Farmer registration',
    farmerOfferTitle: 'Supply listing',
    buyerTitle: 'Buyer registration',
    demandTitle: 'Demand request',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    contactMethod: 'Contact method',
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
    choosePortal: 'Choose your portal',
    choosePortalHint: 'Each journey only shows the steps you need.',
    farmerPortal: 'Farmer portal',
    farmerPortalHint: 'Register, then list crop supply',
    buyerPortal: 'Buyer portal',
    buyerPortalHint: 'Register, then request a purchase',
    statusPortal: 'Request status',
    statusPortalHint: 'Track supply and demand requests',
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

export function MarketplaceClient({
  products,
  locale,
  initialPortal = 'farmer',
  showPortalNav = true,
}: {
  products: UfProduct[];
  locale: Locale;
  initialPortal?: 'farmer' | 'buyer' | 'status';
  showPortalNav?: boolean;
}) {
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
  const [activePortal, setActivePortal] = useState<'farmer' | 'buyer' | 'status'>(initialPortal);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('portal');
    if (requested === 'farmer' || requested === 'buyer' || requested === 'status') {
      setActivePortal(requested);
    }
  }, []);

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
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/login" className="btn-primary px-5 py-3">
              {locale === 'ar' ? 'تسجيل بالهاتف أو البريد' : 'Register by phone or email'}
            </Link>
            <Link href={locale === 'ar' ? '/ar/marketplace/prices' : '/en/marketplace/prices'} className="btn-secondary px-5 py-3">
              {locale === 'ar' ? 'لوحة الأسعار' : 'Price board'}
            </Link>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {products.slice(0, 3).map((product) => (
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

      {showPortalNav && <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="rounded-3xl border border-emerald-950/10 bg-white p-3 shadow-sm">
          <div className="px-3 pb-3 pt-2"><h2 className="text-xl font-black">{t.choosePortal}</h2><p className="mt-1 text-sm text-[#60736a]">{t.choosePortalHint}</p></div>
          <div className="grid gap-2 md:grid-cols-3">
            <PortalButton active={activePortal === 'farmer'} icon={Sprout} title={t.farmerPortal} hint={t.farmerPortalHint} onClick={() => setActivePortal('farmer')} />
            <PortalButton active={activePortal === 'buyer'} icon={Store} title={t.buyerPortal} hint={t.buyerPortalHint} onClick={() => setActivePortal('buyer')} />
            <PortalButton active={activePortal === 'status'} icon={ClipboardList} title={t.statusPortal} hint={t.statusPortalHint} onClick={() => setActivePortal('status')} />
          </div>
        </div>
      </section>}

      <section className="mx-auto max-w-7xl px-4 pb-14">
        {activePortal === 'farmer' && <div className="grid gap-5 lg:grid-cols-2">
          <form onSubmit={submitFarmer} className="rounded-lg border border-emerald-900/10 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <Sprout className="h-6 w-6 text-emerald-700" />
              <h2 className="text-2xl font-black text-[#173a2b]">{t.farmerTitle}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.name}><input className="input" name="name" required /></Field>
              <Field label={t.phone}><input className="input" name="phone" value={farmerPhone} onChange={(e) => setFarmerPhone(e.target.value)} /></Field>
              <Field label={t.email}><input className="input" name="email" type="email" /></Field>
              <Field label={t.contactMethod}><select className="input" name="contact_method" defaultValue="phone"><option value="phone">الهاتف</option><option value="email">البريد</option><option value="whatsapp">واتساب</option></select></Field>
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
        </div>}

        {activePortal === 'buyer' && <div className="grid gap-5 lg:grid-cols-2">
          <form onSubmit={submitBuyer} className="rounded-lg border border-emerald-900/10 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <Store className="h-6 w-6 text-emerald-700" />
              <h2 className="text-2xl font-black text-[#173a2b]">{t.buyerTitle}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.businessName}><input className="input" name="business_name" required /></Field>
              <Field label={t.businessType}><select className="input" name="business_type" required><option>تاجر جملة</option><option>مصنع</option><option>غيره</option></select></Field>
              <Field label={t.phone}><input className="input" name="phone" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} /></Field>
              <Field label={t.email}><input className="input" name="email" type="email" /></Field>
              <Field label={t.contactMethod}><select className="input" name="contact_method" defaultValue="phone"><option value="phone">الهاتف</option><option value="email">البريد</option><option value="whatsapp">واتساب</option></select></Field>
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
        </div>}
      </section>

      {activePortal === 'status' && <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-16 lg:grid-cols-2">
        <StatusPanel title={t.myOffers} phone={farmerPhone} rows={offerRows} empty={t.noRows} lookupLabel={t.lookup} onLookup={() => lookup('farmer', farmerPhone, setOfferRows)} />
        <StatusPanel title={t.myRequests} phone={buyerPhone} rows={requestRows} empty={t.noRows} lookupLabel={t.lookup} onLookup={() => lookup('buyer', buyerPhone, setRequestRows)} />
      </section>}
    </main>
  );
}

function PortalButton({
  active,
  icon: Icon,
  title,
  hint,
  onClick,
}: {
  active: boolean;
  icon: typeof Sprout;
  title: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-4 rounded-2xl p-4 text-start transition ${active ? 'bg-[#173a2b] text-white shadow-lg shadow-emerald-950/10' : 'bg-[#f4f7f5] text-[#173a2b] hover:bg-emerald-50'}`}
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-white/10 text-amber-300' : 'bg-white text-emerald-700 shadow-sm'}`}><Icon className="h-5 w-5" /></span>
      <span><span className="block font-black">{title}</span><span className={`mt-1 block text-xs ${active ? 'text-emerald-100/70' : 'text-[#60736a]'}`}>{hint}</span></span>
    </button>
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
