import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Handshake,
  LineChart,
  ShieldCheck,
  Sprout,
  Store,
  Truck,
  Wrench,
} from 'lucide-react';

type Locale = 'ar' | 'en';

const content = {
  ar: {
    dir: 'rtl',
    eyebrow: 'United Fruit Company',
    title: 'بوابة السوق الزراعي',
    subtitle:
      'بيع وشراء المحاصيل بكميات تجارية عبر فريق يراجع العروض والطلبات وينسق الصفقة حتى الإغلاق.',
    primary: 'ابدأ التسجيل',
    secondary: 'عرض الأسعار',
    minLabel: 'حد طلب الشراء',
    minValue: '400 جوال',
    productsLabel: 'المنتجات',
    productsValue: 'فتريتة، قمح، بصل ومحاصيل أخرى',
    flowLabel: 'المطابقة',
    flowValue: 'من خلال الفريق',
    privacy:
      'لا تظهر بيانات التواصل بين المزارع والتاجر مباشرة. فريق United Fruit يدير المطابقة والتنسيق.',
    portalsTitle: 'اختر بوابتك',
    portals: [
      {
        title: 'مزارع',
        description: 'سجل بياناتك وأرسل عرض محصول مع الكمية وموقع الحصاد.',
        href: '/login',
        cta: 'تسجيل مزارع',
        icon: Sprout,
      },
      {
        title: 'تاجر أو مشتري',
        description: 'أرسل طلب شراء بالجملة، وسيتم ربطه بالعروض المناسبة.',
        href: '/login',
        cta: 'تسجيل تاجر',
        icon: Store,
      },
      {
        title: 'سوق يونايتد فروت',
        description: 'قدّم عرض توفر أو طلب شراء وتابع حالة الطلب من نفس الصفحة.',
        href: '/ar/marketplace',
        cta: 'دخول السوق',
        icon: Handshake,
      },
      {
        title: 'تقني الفريق',
        description: 'دخول مخصص للفريق لمراجعة البيانات، ربط الصفقات، وتحديث الأسعار.',
        href: '/login',
        cta: 'تسجيل تقني',
        icon: Wrench,
      },
    ],
    toolsTitle: 'أدوات التشغيل',
    tools: [
      { title: 'أسعار المحاصيل', href: '/ar/marketplace/prices', icon: LineChart },
      { title: 'مؤشرات السوق', href: '/market-indicators', icon: BriefcaseBusiness },
      { title: 'مسارات الترحيل', href: '/admin/marketplace', icon: Truck },
    ],
  },
  en: {
    dir: 'ltr',
    eyebrow: 'United Fruit Company',
    title: 'Agricultural Market Portal',
    subtitle:
      'Buy and sell commercial crop volumes through a team-reviewed flow from request to deal coordination.',
    primary: 'Start registration',
    secondary: 'View prices',
    minLabel: 'Minimum demand',
    minValue: '400 jowal',
    productsLabel: 'Products',
    productsValue: 'Feterita, wheat, onion, and more',
    flowLabel: 'Matching',
    flowValue: 'Team managed',
    privacy:
      'Farmer and buyer contact details are not exposed directly. United Fruit manages matching and coordination.',
    portalsTitle: 'Choose your portal',
    portals: [
      {
        title: 'Farmer',
        description: 'Register and submit crop supply with quantity and harvest location.',
        href: '/login',
        cta: 'Register farmer',
        icon: Sprout,
      },
      {
        title: 'Buyer',
        description: 'Submit wholesale demand and let the team match it with suitable supply.',
        href: '/login',
        cta: 'Register buyer',
        icon: Store,
      },
      {
        title: 'United Fruit Market',
        description: 'Submit supply or demand and track request status from one page.',
        href: '/en/marketplace',
        cta: 'Open market',
        icon: Handshake,
      },
      {
        title: 'Team technician',
        description: 'Review records, create matches, and update prices from the team dashboard.',
        href: '/login',
        cta: 'Register technician',
        icon: Wrench,
      },
    ],
    toolsTitle: 'Operating tools',
    tools: [
      { title: 'Crop prices', href: '/en/marketplace/prices', icon: LineChart },
      { title: 'Market indicators', href: '/market-indicators', icon: BriefcaseBusiness },
      { title: 'Transport lanes', href: '/admin/marketplace', icon: Truck },
    ],
  },
};

export function LocalizedBusinessLandingPage({ locale }: { locale: Locale }) {
  const t = content[locale];
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <main dir={t.dir} className="bg-[#fbfdf8]">
      <section className="border-b border-emerald-100 bg-[linear-gradient(135deg,#f4fbf5_0%,#fff7df_100%)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="badge">{t.eyebrow}</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-[#173a2b] md:text-6xl">
              {t.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#426457]">
              {t.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className="btn-primary px-5 py-3">
                {t.primary}
                <Arrow className="h-4 w-4" />
              </Link>
              <Link href={locale === 'ar' ? '/ar/marketplace/prices' : '/en/marketplace/prices'} className="btn-secondary px-5 py-3">
                {t.secondary}
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-3">
              <Info label={t.minLabel} value={t.minValue} />
              <Info label={t.productsLabel} value={t.productsValue} />
              <Info label={t.flowLabel} value={t.flowValue} />
            </div>
            <div className="mt-4 rounded-lg bg-emerald-50 p-4">
              <div className="flex gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
                <p className="text-sm font-bold leading-7 text-[#426457]">{t.privacy}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="text-3xl font-black text-[#173a2b]">{t.portalsTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {t.portals.map(({ title, description, href, cta, icon: Icon }) => (
            <Link key={title} href={href} className="group rounded-lg border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-black text-[#173a2b]">{title}</h3>
              <p className="mt-3 min-h-[84px] text-sm leading-7 text-[#60736a]">{description}</p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#f6b83f] px-4 py-2 text-sm font-black text-[#173a2b]">
                {cta}
                <Arrow className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-emerald-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="text-2xl font-black text-[#173a2b]">{t.toolsTitle}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {t.tools.map(({ title, href, icon: Icon }) => (
              <Link key={title} href={href} className="flex items-center justify-between rounded-lg border border-emerald-100 bg-[#fbfdf8] p-5 font-black text-[#173a2b] transition hover:bg-emerald-50">
                <span className="inline-flex items-center gap-3">
                  <Icon className="h-5 w-5 text-emerald-700" />
                  {title}
                </span>
                <Arrow className="h-4 w-4 text-[#ef7b45]" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-[#fbfdf8] p-4">
      <p className="text-xs font-bold text-[#60736a]">{label}</p>
      <p className="mt-1 text-lg font-black text-[#173a2b]">{value}</p>
    </div>
  );
}
