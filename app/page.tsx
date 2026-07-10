import Link from 'next/link';
import { ArrowLeft, BriefcaseBusiness, Handshake, LineChart, ShieldCheck, Sprout, Store } from 'lucide-react';
import { MarketTicker } from '@/components/market/market-ticker';
import { getMarketIndicators, getStats } from '@/lib/data';
import { StatCard } from '@/components/ui/stat-card';
import { BrandLogo } from '@/components/layout/brand-logo';

const portals = [
  {
    title: 'بوابة المزارع',
    subtitle: 'سجل محصولك وتابع حالة العرض',
    description: 'نموذج واضح لتسجيل بيانات المزارع وتوفر الفتريتة أو القمح أو البصل، ثم متابعة الحالة من نفس الرقم.',
    href: '/ar/marketplace',
    icon: Sprout,
    tone: 'bg-emerald-50 text-emerald-800',
  },
  {
    title: 'بوابة التاجر',
    subtitle: 'طلبات شراء بالجملة مع حد نقل واضح',
    description: 'طلب شراء يبدأ من 400 جوال لضمان كفاءة النقل، ثم يراجعه فريق United Fruit قبل المطابقة.',
    href: '/ar/marketplace',
    icon: Store,
    tone: 'bg-[#fff4d8] text-amber-800',
  },
  {
    title: 'لوحة الأسعار',
    subtitle: 'أسعار عامة قابلة للتحديث',
    description: 'جدول سريع لأسعار المصدر والخرطوم وآخر تحديث، مناسب للقراءة من الهاتف أو الحاسوب.',
    href: '/ar/marketplace/prices',
    icon: LineChart,
    tone: 'bg-[#e7f7fb] text-cyan-800',
  },
  {
    title: 'بوابة الأعمال',
    subtitle: 'قطاعات وشركات ومؤشرات',
    description: 'مدخل منظم لبيانات الأعمال الحالية مع الحفاظ على وظيفة القسم كما هي.',
    href: '/ar/business',
    icon: BriefcaseBusiness,
    tone: 'bg-[#ffece4] text-orange-800',
  },
];

export default async function HomePage() {
  const [stats, indicators] = await Promise.all([getStats(), getMarketIndicators()]);

  return (
    <main dir="rtl" className="overflow-hidden">
      <section className="border-b border-emerald-100 bg-[linear-gradient(135deg,#fbfdf8_0%,#eef9f0_46%,#fff7e3_100%)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:py-16 lg:grid-cols-[1fr_0.82fr] lg:items-center">
          <div>
            <p className="badge">منصة سودانية للسلع الزراعية</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-[#173a2b] sm:text-5xl lg:text-7xl">
              United Fruit Company
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#426457]">
              واجهة خفيفة وواضحة لكل الفئات السودانية: المزارع، التاجر، فريق المطابقة، وزائر الأسعار. كل بوابة تقود المستخدم مباشرة للخطوة المناسبة على الهاتف أو الحاسوب.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/ar/marketplace" className="btn-primary px-5 py-3">
                افتح السوق
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link href="/ar/marketplace/prices" className="btn-secondary px-5 py-3">
                عرض الأسعار
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-emerald-100 bg-white p-5 shadow-lg shadow-emerald-900/5">
            <div className="flex items-center justify-between gap-4 border-b border-emerald-100 pb-4">
              <BrandLogo />
              <span className="rounded-lg bg-[#f6b83f] px-3 py-2 text-sm font-black text-[#173a2b]">
                مباشر
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Info label="طلبات تمر عبر الفريق" value="خصوصية كاملة" />
              <Info label="حد طلب الشراء" value="400 جوال" />
              <Info label="المنتجات" value="فتريتة، قمح، بصل" />
              <Info label="الواجهات" value="هاتف وحاسوب" />
            </div>
            <div className="mt-5 rounded-lg bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
                <p className="text-sm font-bold leading-7 text-[#426457]">
                  لا تظهر بيانات التواصل بين المزارع والتاجر مباشرة. المطابقة والتنسيق يتمان من لوحة الفريق الداخلية.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black text-emerald-700">البوابات الرئيسية</p>
            <h2 className="mt-2 text-3xl font-black">اختر المسار المناسب</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {portals.map(({ title, subtitle, description, href, icon: Icon, tone }) => (
            <Link key={title} href={href} className="group rounded-lg border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${tone}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-black text-[#173a2b]">{title}</h3>
              <p className="mt-2 text-sm font-black text-emerald-700">{subtitle}</p>
              <p className="mt-3 text-sm leading-7 text-[#60736a]">{description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#ef7b45]">
                دخول البوابة
                <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-emerald-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-3">
          <StatCard label="القطاعات" value={stats.sectors} />
          <StatCard label="الأعمال" value={stats.businesses} />
          <StatCard label="مؤشرات السوق" value={indicators.length} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black text-emerald-700">لمحة السوق</p>
            <h2 className="mt-2 text-2xl font-black">مؤشرات سريعة للمتابعة</h2>
          </div>
          <Link href="/ar/marketplace/prices" className="btn-secondary">
            لوحة أسعار المحاصيل
          </Link>
        </div>
        <MarketTicker indicators={indicators} />
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
