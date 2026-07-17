import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Handshake,
  LineChart,
  SearchCheck,
  ShieldCheck,
  Sprout,
  Store,
} from 'lucide-react';
import { MarketTicker } from '@/components/market/market-ticker';
import type { MarketIndicator } from '@/lib/types';

type Locale = 'ar' | 'en';
type Stats = {
  universities: number;
  programs: number;
  sectors: number;
  businesses: number;
  reviews: number;
};

const copy = {
  ar: {
    dir: 'rtl' as const,
    eyebrow: 'منصة القرار الزراعي والتجاري في السودان',
    title: 'كل خدمة في بوابتها. كل قرار يبدأ من بيانات واضحة.',
    lead: 'منصة موحّدة تربط تجارة المحاصيل، أسعار السوق، دليل الأعمال، والمعرفة الجامعية ضمن مسارات قصيرة ومنظمة.',
    primary: 'استكشف البوابات',
    secondary: 'افتح لوحة الأسعار',
    live: 'بيانات السوق الآن',
    liveHint: 'آخر مؤشرات متاحة من قاعدة البيانات',
    portalsEyebrow: 'نظام البوابات',
    portalsTitle: 'اختر وجهتك، ثم نفّذ مهمتك مباشرة',
    portalsLead: 'لا قوائم طويلة ولا خدمات مختلطة. كل بوابة تجمع الأدوات التي تخص هدفًا واحدًا.',
    enter: 'دخول البوابة',
    quick: 'وصول سريع',
    stats: [
      ['شركة ونشاط', 'businesses'],
      ['قطاع اقتصادي', 'sectors'],
      ['جامعة', 'universities'],
      ['برنامج أكاديمي', 'programs'],
    ] as const,
    portals: [
      {
        number: '01',
        title: 'بوابة السوق الزراعي',
        description: 'مساران منفصلان للمزارع والمشتري، مع متابعة حالة العرض أو الطلب.',
        href: '/ar/marketplace',
        icon: Handshake,
        accent: 'emerald',
        links: [
          { label: 'عرض محصول', href: '/ar/marketplace?portal=farmer', icon: Sprout },
          { label: 'طلب شراء', href: '/ar/marketplace?portal=buyer', icon: Store },
        ],
      },
      {
        number: '02',
        title: 'بوابة الأسعار والمؤشرات',
        description: 'لوحات ورسوم لمقارنة أسعار المصدر والخرطوم وقراءة مؤشرات السوق.',
        href: '/ar/marketplace/prices',
        icon: BarChart3,
        accent: 'amber',
        links: [
          { label: 'أسعار المحاصيل', href: '/ar/marketplace/prices', icon: LineChart },
          { label: 'مؤشرات السوق', href: '/ar/market-indicators', icon: BarChart3 },
        ],
      },
      {
        number: '03',
        title: 'بوابة ذكاء الأعمال',
        description: 'اكتشف الشركات والقطاعات والفرص التجارية من مكان واحد.',
        href: '/ar/business',
        icon: BriefcaseBusiness,
        accent: 'sky',
        links: [
          { label: 'دليل الشركات', href: '/ar/business/companies', icon: Building2 },
          { label: 'استكشاف القطاعات', href: '/sectors', icon: SearchCheck },
        ],
      },
      {
        number: '04',
        title: 'بوابة المعرفة',
        description: 'الجامعات والبرامج والمقارنات والأدوات المخصصة للطلاب والباحثين.',
        href: '/ar/universities',
        icon: GraduationCap,
        accent: 'violet',
        links: [
          { label: 'الجامعات', href: '/ar/universities', icon: GraduationCap },
          { label: 'البحث والمقارنة', href: '/ar/research', icon: BookOpenCheck },
        ],
      },
    ],
    trustTitle: 'منصة مرتبة حول القرار، لا حول الصفحات',
    trustText: 'تُعرض بيانات الاتصال الحساسة فقط ضمن مسار الفريق، بينما تبقى الأسعار والمعلومات العامة متاحة بصورة واضحة للزائر.',
  },
  en: {
    dir: 'ltr' as const,
    eyebrow: 'Sudan’s agriculture and business decision platform',
    title: 'One clear portal for every task. Better data for every decision.',
    lead: 'A unified platform for crop trading, market prices, business intelligence, and university knowledge—organized into focused journeys.',
    primary: 'Explore portals',
    secondary: 'Open price dashboard',
    live: 'Market now',
    liveHint: 'Latest indicators available in the database',
    portalsEyebrow: 'Portal system',
    portalsTitle: 'Choose a destination and get straight to work',
    portalsLead: 'No long menus or mixed tasks. Each portal contains the tools for one clear goal.',
    enter: 'Enter portal',
    quick: 'Quick access',
    stats: [
      ['Businesses', 'businesses'],
      ['Economic sectors', 'sectors'],
      ['Universities', 'universities'],
      ['Academic programs', 'programs'],
    ] as const,
    portals: [
      {
        number: '01',
        title: 'Agricultural Market',
        description: 'Separate farmer and buyer journeys, with a focused request-status area.',
        href: '/en/marketplace',
        icon: Handshake,
        accent: 'emerald',
        links: [
          { label: 'List crop supply', href: '/en/marketplace?portal=farmer', icon: Sprout },
          { label: 'Request a purchase', href: '/en/marketplace?portal=buyer', icon: Store },
        ],
      },
      {
        number: '02',
        title: 'Prices & Indicators',
        description: 'Charts comparing source and Khartoum crop prices alongside market indicators.',
        href: '/en/marketplace/prices',
        icon: BarChart3,
        accent: 'amber',
        links: [
          { label: 'Crop prices', href: '/en/marketplace/prices', icon: LineChart },
          { label: 'Market indicators', href: '/en/market-indicators', icon: BarChart3 },
        ],
      },
      {
        number: '03',
        title: 'Business Intelligence',
        description: 'Explore companies, sectors, and commercial opportunities in one place.',
        href: '/en/business',
        icon: BriefcaseBusiness,
        accent: 'sky',
        links: [
          { label: 'Company directory', href: '/en/business/companies', icon: Building2 },
          { label: 'Explore sectors', href: '/sectors', icon: SearchCheck },
        ],
      },
      {
        number: '04',
        title: 'Knowledge Portal',
        description: 'Universities, programs, comparisons, and tools for students and researchers.',
        href: '/en/universities',
        icon: GraduationCap,
        accent: 'violet',
        links: [
          { label: 'Universities', href: '/en/universities', icon: GraduationCap },
          { label: 'Research & compare', href: '/en/research', icon: BookOpenCheck },
        ],
      },
    ],
    trustTitle: 'Organized around decisions—not page count',
    trustText: 'Sensitive contact details remain inside the team workflow, while prices and public intelligence stay clear and accessible.',
  },
};

const accentClasses: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  violet: 'bg-violet-50 text-violet-700 ring-violet-100',
};

export function PortalHome({ locale, stats, indicators }: { locale: Locale; stats: Stats; indicators: MarketIndicator[] }) {
  const t = copy[locale];
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <main dir={t.dir} className="overflow-hidden">
      <section className="relative border-b border-emerald-950/10 bg-[#0c2f23] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(52,211,153,.18),transparent_30%),radial-gradient(circle_at_85%_5%,rgba(246,184,63,.2),transparent_25%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:py-20">
          <div>
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-emerald-100 backdrop-blur">{t.eyebrow}</p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.15] text-white sm:text-5xl lg:text-6xl">{t.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-emerald-50/80">{t.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#portals" className="btn bg-[#f6b83f] px-5 py-3 text-[#173a2b] hover:bg-amber-300">{t.primary}<Arrow className="h-4 w-4" /></a>
              <Link href={locale === 'ar' ? '/ar/marketplace/prices' : '/en/marketplace/prices'} className="btn border border-white/20 bg-white/10 px-5 py-3 text-white hover:bg-white/15">{t.secondary}</Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[.07] p-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="rounded-2xl bg-white p-5 text-[#173a2b] sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-xs font-black uppercase tracking-[.18em] text-emerald-700">{t.live}</p><p className="mt-1 text-sm text-[#60736a]">{t.liveHint}</p></div>
                <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" /></span>
              </div>
              <div className="mt-5"><MarketTicker indicators={indicators} compact locale={locale} /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-950/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-emerald-950/10 px-4 md:grid-cols-4 rtl:divide-x-reverse">
          {t.stats.map(([label, key]) => (
            <div key={key} className="px-4 py-6 text-center sm:py-8"><p className="text-3xl font-black text-[#173a2b]">{Number(stats[key]).toLocaleString(locale === 'ar' ? 'ar' : 'en-US')}</p><p className="mt-1 text-sm font-bold text-[#60736a]">{label}</p></div>
          ))}
        </div>
      </section>

      <section id="portals" className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-black text-emerald-700">{t.portalsEyebrow}</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{t.portalsTitle}</h2>
          <p className="mt-4 text-base leading-8 text-[#60736a]">{t.portalsLead}</p>
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          {t.portals.map(({ number, title, description, href, icon: Icon, accent, links }) => (
            <article key={number} className="group relative overflow-hidden rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-[0_14px_45px_rgba(23,58,43,.06)] transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(23,58,43,.11)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ${accentClasses[accent]}`}><Icon className="h-7 w-7" /></div>
                <span className="text-4xl font-black text-emerald-950/[.06]">{number}</span>
              </div>
              <h3 className="mt-6 text-2xl font-black">{title}</h3>
              <p className="mt-3 max-w-xl leading-7 text-[#60736a]">{description}</p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {links.map(({ label, href: quickHref, icon: QuickIcon }) => (
                  <Link key={label} href={quickHref} className="flex items-center gap-3 rounded-2xl bg-[#f5f8f6] px-4 py-3 text-sm font-black text-[#294e3d] transition hover:bg-emerald-50 hover:text-emerald-800"><QuickIcon className="h-4 w-4" />{label}</Link>
                ))}
              </div>
              <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-black text-emerald-700">{t.enter}<Arrow className="h-4 w-4 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="flex flex-col gap-5 rounded-3xl bg-[#eef7f1] p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm"><ShieldCheck className="h-6 w-6" /></div>
          <div><h2 className="text-xl font-black">{t.trustTitle}</h2><p className="mt-2 max-w-4xl leading-7 text-[#60736a]">{t.trustText}</p></div>
        </div>
      </section>
    </main>
  );
}
