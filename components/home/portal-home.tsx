import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  Boxes,
  ClipboardCheck,
  Sprout,
  Store,
  Truck,
} from 'lucide-react';
import type { UfProduct } from '@/lib/united-fruit';

type Locale = 'ar' | 'en';

const copy = {
  ar: {
    dir: 'rtl' as const,
    eyebrow: 'حصاد | HASAD',
    title: 'سوق حصاد للمحاصيل السودانية',
    lead: 'منصة واضحة تربط المزارع والمشتري بخدمات المحاصيل والأسعار، دون خلط أو صفحات مزدحمة.',
    start: 'اختر بوابتك',
    catalog: 'تصفح المحاصيل',
    sectionEyebrow: 'بوابات حصاد',
    sectionTitle: 'بوابات السوق والخدمات',
    sectionLead: 'اختر البوابة المناسبة للوصول مباشرةً إلى الخدمة المطلوبة.',
    portals: [
      { title: 'بوابة المزارع', text: 'سجّل بياناتك واعرض محصولك وكميته وموقع الحصاد.', href: '/ar/marketplace/farmer', icon: Sprout, tone: 'green', imagePosition: '0% 0%' },
      { title: 'بوابة المشتري', text: 'حدد المحصول والكمية المطلوبة وتاريخ التسليم.', href: '/ar/marketplace/buyer', icon: Store, tone: 'gold', imagePosition: '50% 0%' },
      { title: 'كتالوج المحاصيل', text: 'شاهد صورة كل محصول وتصنيفه ووحدة تداوله.', href: '/ar/crops', icon: Boxes, tone: 'orange', imagePosition: '100% 0%' },
      { title: 'أسعار المحاصيل', text: 'تابع الأسعار المنشورة واتجاهات السوق عبر رسوم بيانية واضحة.', href: '/ar/marketplace/prices', icon: BadgeDollarSign, tone: 'blue', imagePosition: '0% 100%' },
      { title: 'متابعة الطلبات', text: 'راجع حالة عروض البيع وطلبات الشراء برقم الهاتف.', href: '/ar/marketplace/status', icon: ClipboardCheck, tone: 'dark', imagePosition: '50% 100%' },
      { title: 'الخدمات الزراعية', text: 'النقل والتخزين والغربلة والتجفيف والتعبئة والطحن.', href: '/ar/services', icon: Truck, tone: 'olive', imagePosition: '100% 100%' },
    ],
  },
  en: {
    dir: 'ltr' as const,
    eyebrow: 'HASAD | حصاد',
    title: 'HASAD Sudanese Crop Market',
    lead: 'A clear platform connecting farmers and buyers to crop services and prices—without crowded, mixed-purpose pages.',
    start: 'Choose your portal',
    catalog: 'Browse crops',
    sectionEyebrow: 'Hasad portals',
    sectionTitle: 'Market and service portals',
    sectionLead: 'Select the appropriate portal for direct access to the required service.',
    portals: [
      { title: 'Farmer portal', text: 'Register and list your crop, volume, and harvest location.', href: '/en/marketplace/farmer', icon: Sprout, tone: 'green', imagePosition: '0% 0%' },
      { title: 'Buyer portal', text: 'Choose crop, required volume, and delivery date.', href: '/en/marketplace/buyer', icon: Store, tone: 'gold', imagePosition: '50% 0%' },
      { title: 'Crop catalog', text: 'See every crop image, category, and trading unit.', href: '/en/crops', icon: Boxes, tone: 'orange', imagePosition: '100% 0%' },
      { title: 'Crop prices', text: 'Review published prices and market trends through clear charts.', href: '/en/marketplace/prices', icon: BadgeDollarSign, tone: 'blue', imagePosition: '0% 100%' },
      { title: 'Request tracking', text: 'Check sale listings and purchase requests by phone.', href: '/en/marketplace/status', icon: ClipboardCheck, tone: 'dark', imagePosition: '50% 100%' },
      { title: 'Agricultural services', text: 'Transport, storage, screening, drying, packaging, and milling.', href: '/en/services', icon: Truck, tone: 'olive', imagePosition: '100% 100%' },
    ],
  },
};

const tones: Record<string, string> = {
  green: 'bg-emerald-100 text-emerald-800',
  gold: 'bg-amber-100 text-amber-800',
  orange: 'bg-orange-100 text-orange-800',
  blue: 'bg-sky-100 text-sky-800',
  dark: 'bg-slate-200 text-slate-800',
  olive: 'bg-lime-100 text-lime-800',
};

const PORTAL_IMAGE = '/images/portals/portal-sheet.jpg';

export function PortalHome({ locale }: { locale: Locale; products: UfProduct[] }) {
  const t = copy[locale];
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <main dir={t.dir} className="bg-[#f7f5ee] text-[#173a2b]">
      <section className="relative min-h-[640px] overflow-hidden bg-[#102e22] text-white">
        <div className="absolute inset-0 bg-[url('/images/hasad-hero.png')] bg-cover bg-[center_35%]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,31,22,.98)_0%,rgba(8,31,22,.88)_42%,rgba(8,31,22,.22)_100%)] rtl:bg-[linear-gradient(270deg,rgba(8,31,22,.98)_0%,rgba(8,31,22,.88)_42%,rgba(8,31,22,.22)_100%)]" />
        <div className="relative mx-auto flex min-h-[640px] max-w-7xl items-center px-4 py-20">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-black/15 px-4 py-2 text-sm font-black text-[#ffd875] backdrop-blur"><Sprout className="h-4 w-4" />{t.eyebrow}</p>
            <h1 className="mt-7 text-5xl font-black leading-[1.1] text-white sm:text-6xl lg:text-7xl">{t.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-white/80 sm:text-xl">{t.lead}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#portals" className="btn bg-[#f5c451] px-6 py-3.5 text-[#173a2b] hover:bg-amber-300">{t.start}<Arrow className="h-4 w-4" /></Link>
              <Link href={locale === 'ar' ? '/ar/crops' : '/en/crops'} className="btn border border-white/25 bg-white/10 px-6 py-3.5 text-white backdrop-blur hover:bg-white/15">{t.catalog}</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="portals" className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-black text-[#9a6b12]">{t.sectionEyebrow}</p>
          <h2 className="mt-2 text-3xl font-black sm:text-5xl">{t.sectionTitle}</h2>
          <p className="mt-4 text-lg leading-8 text-[#66766e]">{t.sectionLead}</p>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.portals.map(({ title, text, href, icon: Icon, tone, imagePosition }) => (
            <Link key={href} href={href} className="group flex min-h-[26rem] flex-col overflow-hidden rounded-[1.75rem] border border-black/[.07] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#d5b15b] hover:shadow-xl">
              <div className="relative aspect-[16/9] overflow-hidden bg-[#eaf0e8]">
                <div role="img" aria-label={title} className="h-full w-full bg-cover transition duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${PORTAL_IMAGE})`, backgroundPosition: imagePosition, backgroundSize: '300% 200%' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102e22]/50 via-transparent to-transparent" />
                <div className={`absolute bottom-4 start-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ${tones[tone]}`}><Icon className="h-7 w-7" /></div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="mt-3 flex-1 leading-7 text-[#66766e]">{text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#8f6517]">{locale === 'ar' ? 'فتح البوابة' : 'Open portal'}<Arrow className="h-4 w-4 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
