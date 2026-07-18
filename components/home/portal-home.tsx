import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  ClipboardCheck,
  CloudSun,
  Handshake,
  PackageSearch,
  Scale,
  ShieldCheck,
  Sprout,
  Store,
  Truck,
} from 'lucide-react';
import type { UfProduct } from '@/lib/united-fruit';

type Locale = 'ar' | 'en';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1764277434161-23d72931335f?auto=format&fit=crop&q=85&w=2400';
const WHEAT_IMAGE = 'https://images.unsplash.com/photo-1723530923751-f9b769238666?auto=format&fit=crop&q=85&w=2400';

const copy = {
  ar: {
    dir: 'rtl' as const,
    eyebrow: 'سوق المحاصيل السودانية',
    title: 'من أرضك إلى السوق، بخطوات أوضح.',
    lead: 'اعرض محصولك، اطلب الكمية التي تحتاجها، وتابع أسعار السوق في منصة واحدة متخصصة في المحاصيل فقط.',
    explore: 'استكشف السوق',
    sell: 'اعرض محصولك',
    secure: 'بياناتك محمية',
    managed: 'مطابقة بإشراف الفريق',
    actionsEyebrow: 'ابدأ الآن',
    actionsTitle: 'ماذا تريد أن تفعل اليوم؟',
    actionsLead: 'اختر خدمة واحدة وانتقل مباشرة إلى النموذج المناسب دون صفحات مشتتة.',
    actionCta: 'ابدأ الخدمة',
    cropsEyebrow: 'المحاصيل المتاحة',
    cropsTitle: 'أسعار السوق في نظرة سريعة',
    cropsLead: 'متوسطات استرشادية حسب آخر تحديث مسجل من الفريق.',
    allPrices: 'عرض كل الأسعار',
    source: 'سعر المصدر',
    khartoum: 'سعر الخرطوم',
    pending: 'قيد التحديث',
    sdg: 'ج.س',
    storyEyebrow: 'سوق مبني حول المحصول',
    storyTitle: 'معلومات أقل تشتتًا، وقرار أسرع.',
    storyText: 'نركز على ما يحتاجه المزارع والمشتري فعلاً: المنتج، الكمية، الموقع، السعر، وموعد التسليم. يتولى الفريق مراجعة الطلب والمطابقة والتنسيق.',
    request: 'اطلب محصولاً',
    track: 'تابع طلبك',
    howEyebrow: 'كيف تعمل المنصة؟',
    howTitle: 'ثلاث خطوات من العرض إلى الاتفاق',
    serviceTitle: 'خدمات تساعد حركة المحصول',
    services: [
      { title: 'النقل والتخزين', text: 'سجل احتياجك اللوجستي ضمن الطلب ليتابعه الفريق.', icon: Truck, href: '/ar/marketplace?portal=buyer', cta: 'اطلب تنسيقاً' },
      { title: 'العروض والطلبات', text: 'اعرض الكميات المتوفرة أو اطلب كمية تجارية واضحة.', icon: Handshake, href: '/ar/marketplace', cta: 'افتح السوق' },
      { title: 'الطقس والتنبيهات', text: 'تابع التنبيهات الزراعية العامة قبل الحصاد أو النقل.', icon: CloudSun, href: 'https://meteosudan.sd/alerts/', cta: 'عرض التنبيهات' },
    ],
    actions: [
      { title: 'أعرض محصولاً', text: 'سجل المحصول والكمية وموقع الحصاد.', icon: Sprout, href: '/ar/marketplace?portal=farmer', tone: 'green' },
      { title: 'أطلب محصولاً', text: 'حدد المنتج والكمية وموعد التسليم.', icon: Store, href: '/ar/marketplace?portal=buyer', tone: 'gold' },
      { title: 'أسعار المحاصيل', text: 'قارن سعر المصدر بسعر الخرطوم.', icon: BadgeDollarSign, href: '/ar/marketplace/prices', tone: 'orange' },
      { title: 'متابعة الطلب', text: 'راجع حالة عروضك وطلباتك برقم الهاتف.', icon: ClipboardCheck, href: '/ar/marketplace?portal=status', tone: 'dark' },
    ],
    steps: [
      ['01', 'سجل العرض أو الطلب', 'أدخل البيانات الأساسية للمحصول والكمية والموقع.'],
      ['02', 'مراجعة ومطابقة', 'يتحقق الفريق من البيانات ويربط العرض بالطلب المناسب.'],
      ['03', 'تنسيق الصفقة', 'يتم تنسيق السعر والتسليم والنقل حتى إغلاق الطلب.'],
    ],
  },
  en: {
    dir: 'ltr' as const,
    eyebrow: 'Sudan crop marketplace',
    title: 'From your field to the market, with a clearer path.',
    lead: 'List crop supply, request the volume you need, and follow market prices in one crop-focused platform.',
    explore: 'Explore the market',
    sell: 'List your crop',
    secure: 'Your data is protected',
    managed: 'Team-managed matching',
    actionsEyebrow: 'Start here',
    actionsTitle: 'What do you need today?',
    actionsLead: 'Choose one service and go directly to the right form—without navigating unrelated pages.',
    actionCta: 'Start service',
    cropsEyebrow: 'Available crops',
    cropsTitle: 'Market prices at a glance',
    cropsLead: 'Indicative averages based on the latest team update.',
    allPrices: 'View all prices',
    source: 'Source price',
    khartoum: 'Khartoum price',
    pending: 'Being updated',
    sdg: 'SDG',
    storyEyebrow: 'Built around the crop',
    storyTitle: 'Less noise. Faster decisions.',
    storyText: 'We focus on what farmers and buyers actually need: product, volume, location, price, and delivery date. The team reviews, matches, and coordinates each request.',
    request: 'Request a crop',
    track: 'Track request',
    howEyebrow: 'How it works',
    howTitle: 'Three steps from listing to agreement',
    serviceTitle: 'Services that move crops',
    services: [
      { title: 'Transport & storage', text: 'Include logistics needs in your request for team follow-up.', icon: Truck, href: '/en/marketplace?portal=buyer', cta: 'Request coordination' },
      { title: 'Offers & requests', text: 'List available supply or request a clear commercial volume.', icon: Handshake, href: '/en/marketplace', cta: 'Open market' },
      { title: 'Weather alerts', text: 'Check public agricultural alerts before harvest or transport.', icon: CloudSun, href: 'https://meteosudan.sd/alerts/', cta: 'View alerts' },
    ],
    actions: [
      { title: 'List crop supply', text: 'Add crop, volume, and harvest location.', icon: Sprout, href: '/en/marketplace?portal=farmer', tone: 'green' },
      { title: 'Request a crop', text: 'Set product, volume, and delivery date.', icon: Store, href: '/en/marketplace?portal=buyer', tone: 'gold' },
      { title: 'Crop prices', text: 'Compare source and Khartoum prices.', icon: BadgeDollarSign, href: '/en/marketplace/prices', tone: 'orange' },
      { title: 'Track request', text: 'Check offers and requests by phone number.', icon: ClipboardCheck, href: '/en/marketplace?portal=status', tone: 'dark' },
    ],
    steps: [
      ['01', 'Submit supply or demand', 'Enter the essential crop, quantity, and location details.'],
      ['02', 'Review and matching', 'The team verifies the record and finds a suitable counterpart.'],
      ['03', 'Deal coordination', 'Price, delivery, and transport are coordinated through closing.'],
    ],
  },
};

const actionTones: Record<string, string> = {
  green: 'bg-[#e6f2e7] text-[#245b35]',
  gold: 'bg-[#fff2c9] text-[#8b5b00]',
  orange: 'bg-[#fde8d7] text-[#9a4d17]',
  dark: 'bg-[#dfe8e2] text-[#173a2b]',
};

function average(min: number | null, max: number | null) {
  if (min === null && max === null) return null;
  if (min !== null && max !== null) return (min + max) / 2;
  return min ?? max;
}

export function PortalHome({ locale, products }: { locale: Locale; products: UfProduct[] }) {
  const t = copy[locale];
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;
  const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-SD' : 'en-US', { maximumFractionDigits: 0 });

  return (
    <main dir={t.dir} className="overflow-hidden bg-[#f7f5ee] text-[#173a2b]">
      <section className="relative min-h-[690px] overflow-hidden bg-[#173a2b] text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,39,27,.96)_0%,rgba(10,39,27,.78)_46%,rgba(10,39,27,.2)_100%)] rtl:bg-[linear-gradient(270deg,rgba(10,39,27,.96)_0%,rgba(10,39,27,.78)_46%,rgba(10,39,27,.2)_100%)]" />
        <div className="relative mx-auto flex min-h-[690px] max-w-7xl items-center px-4 py-20">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-[#f7d16f] backdrop-blur"><Sprout className="h-4 w-4" />{t.eyebrow}</p>
            <h1 className="mt-7 text-5xl font-black leading-[1.12] text-white sm:text-6xl lg:text-7xl">{t.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-white/75 sm:text-xl">{t.lead}</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link href={locale === 'ar' ? '/ar/marketplace' : '/en/marketplace'} className="btn bg-[#f5c451] px-6 py-3.5 text-[#173a2b] hover:bg-amber-300">{t.explore}<Arrow className="h-4 w-4" /></Link><Link href={locale === 'ar' ? '/ar/marketplace?portal=farmer' : '/en/marketplace?portal=farmer'} className="btn border border-white/25 bg-white/10 px-6 py-3.5 text-white backdrop-blur hover:bg-white/15">{t.sell}</Link></div>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold text-white/70"><span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#f5c451]" />{t.secure}</span><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#f5c451]" />{t.managed}</span></div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-16 max-w-7xl px-4">
        <div className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-[0_24px_80px_rgba(31,55,42,.16)] sm:p-8">
          <div className="max-w-2xl"><p className="text-sm font-black text-[#9a6b12]">{t.actionsEyebrow}</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">{t.actionsTitle}</h2><p className="mt-3 leading-7 text-[#66766e]">{t.actionsLead}</p></div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {t.actions.map(({ title, text, icon: Icon, href, tone }) => <Link key={title} href={href} className="group rounded-2xl border border-black/[.07] bg-[#fbfaf6] p-5 transition hover:-translate-y-1 hover:border-[#d5b15b] hover:bg-white hover:shadow-lg"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${actionTones[tone]}`}><Icon className="h-6 w-6" /></div><h3 className="mt-5 text-lg font-black">{title}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-[#66766e]">{text}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#9a6b12]">{t.actionCta}<Arrow className="h-4 w-4 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" /></span></Link>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-2xl"><p className="text-sm font-black text-[#9a6b12]">{t.cropsEyebrow}</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">{t.cropsTitle}</h2><p className="mt-3 leading-7 text-[#66766e]">{t.cropsLead}</p></div><Link href={locale === 'ar' ? '/ar/marketplace/prices' : '/en/marketplace/prices'} className="btn-secondary">{t.allPrices}<Arrow className="h-4 w-4" /></Link></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.slice(0, 8).map((product) => {
            const source = average(product.source_price_min, product.source_price_max);
            const khartoum = average(product.khartoum_price_min, product.khartoum_price_max);
            return <article key={product.product_id} className="rounded-3xl border border-black/[.07] bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf3e8] text-[#356e3f]"><Scale className="h-5 w-5" /></div><span className="rounded-full bg-[#f7f5ee] px-3 py-1 text-xs font-bold text-[#66766e]">{product.unit}</span></div><h3 className="mt-5 text-xl font-black">{locale === 'ar' ? product.name_ar : product.name_en}</h3><p className="mt-1 text-sm text-[#7c887f]">{product.source_region}</p><div className="mt-5 space-y-3 border-t border-black/[.07] pt-4"><PriceRow label={t.source} value={source === null ? t.pending : `${formatter.format(source)} ${t.sdg}`} /><PriceRow label={t.khartoum} value={khartoum === null ? t.pending : `${formatter.format(khartoum)} ${t.sdg}`} strong /></div></article>;
          })}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#173a2b] text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${WHEAT_IMAGE})` }} />
        <div className="absolute inset-0 bg-[#173a2b]/85" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-[1fr_.75fr] lg:items-center">
          <div><p className="text-sm font-black text-[#f5c451]">{t.storyEyebrow}</p><h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">{t.storyTitle}</h2><p className="mt-5 max-w-2xl text-lg leading-9 text-white/70">{t.storyText}</p><div className="mt-8 flex flex-wrap gap-3"><Link href={locale === 'ar' ? '/ar/marketplace?portal=buyer' : '/en/marketplace?portal=buyer'} className="btn bg-[#f5c451] text-[#173a2b] hover:bg-amber-300">{t.request}<Arrow className="h-4 w-4" /></Link><Link href={locale === 'ar' ? '/ar/marketplace?portal=status' : '/en/marketplace?portal=status'} className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15">{t.track}</Link></div></div>
          <div className="grid gap-3">{t.steps.map(([number, title, text]) => <div key={number} className="flex gap-4 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur"><span className="text-2xl font-black text-[#f5c451]">{number}</span><div><h3 className="font-black text-white">{title}</h3><p className="mt-1 text-sm leading-6 text-white/60">{text}</p></div></div>)}</div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-4 py-20"><div className="flex items-center gap-3"><PackageSearch className="h-7 w-7 text-[#9a6b12]" /><h2 className="text-3xl font-black">{t.serviceTitle}</h2></div><div className="mt-7 grid gap-4 md:grid-cols-3">{t.services.map(({ title, text, icon: Icon, href, cta }) => <Link key={title} href={href} target={href.startsWith('http') ? '_blank' : undefined} className="group rounded-3xl border border-black/[.07] bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf3e8] text-[#356e3f]"><Icon className="h-6 w-6" /></div><h3 className="mt-5 text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-[#66766e]">{text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#9a6b12]">{cta}<Arrow className="h-4 w-4" /></span></Link>)}</div></section>

      <p className="mx-auto max-w-7xl px-4 pb-8 text-center text-[11px] text-[#849087]">Photos: <a className="underline" href="https://unsplash.com/photos/tractor-plowing-a-field-at-sunset-Ve4xSwl93pY" target="_blank" rel="noreferrer">Miguel Garcia Jimenez</a> & <a className="underline" href="https://unsplash.com/photos/a-close-up-of-a-field-of-wheat-Yy-cnK2kI5c" target="_blank" rel="noreferrer">Mohamed B.</a> / Unsplash</p>
    </main>
  );
}

function PriceRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className="flex items-center justify-between gap-3 text-sm"><span className="text-[#7c887f]">{label}</span><span className={strong ? 'font-black text-[#2d6a3b]' : 'font-bold'}>{value}</span></div>;
}
