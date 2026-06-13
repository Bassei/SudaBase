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
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-green-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm">
              منصة بيانات التعليم والاقتصاد في السودان
            </p>

            <Link
              href="/en"
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-white hover:bg-white hover:text-slate-950"
            >
              English
            </Link>
          </div>

          <h1 className="max-w-5xl text-5xl font-black tracking-tight md:text-7xl">
            قاعدة البيانات السودانية
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
            منصة بيانات وطنية للطلاب، الأعمال، الباحثين، الجامعات، المنظمات،
            وصناع القرار. اختر الواجهة المناسبة لهدفك.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {audiences.map(({ title, subtitle, description, href, icon: Icon, cta }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur transition hover:bg-white hover:text-slate-950"
              >
                <Icon className="h-10 w-10 text-green-300 group-hover:text-sudanGreen" />

                <h2 className="mt-5 text-2xl font-black">
                  {title}
                </h2>

                <p className="mt-2 font-semibold text-slate-200 group-hover:text-slate-700">
                  {subtitle}
                </p>

                <p className="mt-4 text-sm leading-6 text-slate-300 group-hover:text-slate-600">
                  {description}
                </p>

                <span className="mt-6 inline-flex font-bold underline">
                  {cta}
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
