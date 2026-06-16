import Link from 'next/link';
import { BriefcaseBusiness, GraduationCap, SearchCheck } from 'lucide-react';
import { MarketTicker } from '@/components/market/market-ticker';
import { getMarketIndicators, getStats } from '@/lib/data';
import { StatCard } from '@/components/ui/stat-card';

const audiences = [
  {
    title: 'للطلاب',
    subtitle: 'جامعات، تخصصات، مقارنة، وتجارب الطلاب.',
    description:
      'ابحث عن الجامعات السودانية، استكشف البرامج والتخصصات، قارن بين الجامعات، واقرأ تجارب الطلاب.',
    href: '/ar/students',
    icon: GraduationCap,
    cta: 'ابدأ كطالب'
  },
  {
    title: 'للأعمال',
    subtitle: 'مؤشرات السوق، القطاعات، الشركات، والفرص.',
    description:
      'تابع أسعار الدولار، USDT، الذهب والفضة، واستكشف القطاعات والفرص التجارية في السودان.',
    href: '/ar/business',
    icon: BriefcaseBusiness,
    cta: 'استكشف بيانات الأعمال'
  },
  {
    title: 'للباحثين',
    subtitle: 'بيانات منظمة، مصادر، منهجية، وجودة البيانات.',
    description:
      'استخدم بيانات التعليم والاقتصاد السودانية مع المصادر، مستوى الثقة، وتاريخ التحديث.',
    href: '/ar/research',
    icon: SearchCheck,
    cta: 'افتح بوابة الباحثين'
  }
];

export default async function HomePage() {
  const [stats, indicators] = await Promise.all([
    getStats(),
    getMarketIndicators()
  ]);

  return (
    <div dir="rtl">
      <section className="bg-[#0a0a0a] bg-hero-mesh text-zinc-100 relative overflow-hidden">
        {/* Decorative elements for the mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/80 via-[#0a0a0a]/90 to-zinc-950/80 pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 py-20 relative z-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="inline-flex rounded-full border border-zinc-800 bg-[#171717]/50 backdrop-blur-md px-4 py-2 text-sm text-zinc-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              منصة بيانات التعليم والاقتصاد في السودان
            </p>

            <Link
              href="/en"
              className="rounded-full border border-zinc-800 bg-[#171717]/50 backdrop-blur-md px-4 py-2 text-sm font-bold text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white"
            >
              English
            </Link>
          </div>

          <h1 className="max-w-5xl text-5xl font-black tracking-wider md:text-7xl drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500">
            سودا بيس
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            منصة بيانات وطنية للطلاب، الأعمال، الباحثين، الجامعات، المنظمات،
            وصناع القرار. اختر الواجهة المناسبة لهدفك.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {audiences.map(({ title, subtitle, description, href, icon: Icon, cta }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-3xl border border-zinc-800 bg-[#171717]/60 p-6 backdrop-blur-[12px] transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-700 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex rounded-xl bg-zinc-900/50 p-3 ring-1 ring-zinc-800 transition-colors group-hover:bg-primary/10 group-hover:ring-primary/30">
                  <Icon className="h-8 w-8 text-zinc-400 group-hover:text-primary transition-colors" />
                </div>

                <h2 className="text-2xl font-black text-zinc-100 group-hover:text-white">
                  {title}
                </h2>

                <p className="mt-2 font-semibold text-zinc-300 group-hover:text-zinc-200">
                  {subtitle}
                </p>

                <p className="mt-4 text-sm leading-6 text-zinc-500 group-hover:text-zinc-400">
                  {description}
                </p>

                <span className="mt-6 inline-flex font-bold text-primary group-hover:text-emerald-400 transition-colors">
                  {cta} ←
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 py-12">
        <div>
          <h2 className="text-3xl font-black">لمحة عن المنصة</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            قاعدة بيانات واحدة تشغّل واجهات مختلفة حسب نوع المستخدم.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <StatCard label="الجامعات" value={stats.universities} />
          <StatCard label="البرامج" value={stats.programs} />
          <StatCard label="القطاعات" value={stats.sectors} />
          <StatCard label="الأعمال" value={stats.businesses} />
          <StatCard label="التقييمات" value={stats.reviews} />
        </div>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">لمحة السوق</h2>
              <p className="mt-1 text-sm text-slate-500">
                أسعار إرشادية سريعة. الأدوات الكاملة موجودة داخل واجهة الأعمال.
              </p>
            </div>

            <Link href="/ar/business" className="hidden font-bold text-sudanGreen md:inline-flex">
              افتح واجهة الأعمال
            </Link>
          </div>

          <MarketTicker indicators={indicators} />

          <p className="mt-3 text-sm text-slate-500">
            أسعار الصرف، USDT، الذهب والفضة إرشادية وقد تختلف عن أسعار السوق المحلي في السودان.
          </p>
        </section>
      </section>
    </div>
  );
}
