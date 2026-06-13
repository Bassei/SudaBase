import Link from 'next/link';
import {
  BriefcaseBusiness,
  Building2,
  LineChart,
  Phone,
  SearchCheck,
  ShieldCheck,
  Store,
} from 'lucide-react';

type Locale = 'ar' | 'en';

const ui = {
  ar: {
    dir: 'rtl',
    title: 'بوابة الأعمال السودانية',
    subtitle:
      'واجهة مخصصة للقطاعات، الشركات، فرص السوق، ومؤشرات الاقتصاد في السودان.',
    description:
      'استكشف بيانات الأعمال بصورة منظمة. الشركات وبيانات التواصل تظهر داخل صفحة الشركات فقط حتى تبقى واجهة الأعمال الرئيسية نظيفة وسهلة القراءة.',
    companies: 'الشركات',
    companiesDesc: 'اعرض الشركات السودانية النظيفة والمؤكدة مع القطاع والمدينة ووسائل التواصل.',
    market: 'مؤشرات السوق',
    marketDesc: 'تابع أسعار الدولار، USDT، الذهب، والفضة كمؤشرات إرشادية.',
    sectors: 'القطاعات',
    sectorsDesc: 'استكشف القطاعات الاقتصادية مثل النقل، الزراعة، الصناعة، التمويل، والخدمات.',
    opportunities: 'الفرص',
    opportunitiesDesc: 'مساحة مستقبلية لتحليل الفرص التجارية حسب القطاع والمدينة.',
    openCompanies: 'فتح دليل الشركات',
    comingSoon: 'قريباً',
    note:
      'بيانات الشركات في هذه المرحلة انتقائية ومراجعة يدوياً بدرجة أعلى. سنضيف المزيد تدريجياً من مصادر موثوقة.',
    statsCompanies: 'شركات مؤكدة',
    statsContacts: 'وسائل تواصل',
    statsSectors: 'قطاعات',
    statsSources: 'مصادر عامة',
  },
  en: {
    dir: 'ltr',
    title: 'Sudanese Business Portal',
    subtitle:
      'A dedicated interface for sectors, companies, market opportunities, and economic indicators in Sudan.',
    description:
      'Explore business data in a structured way. Company records and contact details are shown only inside the companies directory to keep this main business page clean.',
    companies: 'Companies',
    companiesDesc: 'Browse verified Sudanese companies with sector, city, and contact information.',
    market: 'Market indicators',
    marketDesc: 'Track USD, USDT, gold, and silver as indicative market signals.',
    sectors: 'Sectors',
    sectorsDesc: 'Explore economic sectors such as logistics, agriculture, manufacturing, finance, and services.',
    opportunities: 'Opportunities',
    opportunitiesDesc: 'Future space for analyzing opportunities by sector and city.',
    openCompanies: 'Open companies directory',
    comingSoon: 'Coming soon',
    note:
      'The current business dataset is selective and more strictly reviewed. More companies will be added gradually from trusted sources.',
    statsCompanies: 'Verified companies',
    statsContacts: 'Contacts',
    statsSectors: 'Sectors',
    statsSources: 'Public sources',
  },
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  cta,
  disabled,
}: {
  icon: any;
  title: string;
  description: string;
  href?: string;
  cta?: string;
  disabled?: boolean;
}) {
  const content = (
    <article className="h-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
        <Icon className="h-7 w-7" />
      </div>

      <h2 className="mt-5 text-2xl font-black text-slate-950">{title}</h2>

      <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">
        {description}
      </p>

      <span
        className={`mt-5 inline-flex rounded-2xl px-4 py-2 text-sm font-black ${
          disabled
            ? 'bg-slate-100 text-slate-500'
            : 'bg-emerald-600 text-white hover:bg-emerald-700'
        }`}
      >
        {cta}
      </span>
    </article>
  );

  if (disabled || !href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}

export function LocalizedBusinessLandingPage({ locale }: { locale: Locale }) {
  const label = ui[locale];

  return (
    <main dir={label.dir} className="mx-auto max-w-7xl space-y-10 px-4 py-12">
      <section className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white md:p-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
          <BriefcaseBusiness className="h-9 w-9 text-emerald-300" />
        </div>

        <h1 className="mt-8 max-w-4xl text-4xl font-black tracking-tight md:text-7xl">
          {label.title}
        </h1>

        <p className="mt-5 max-w-3xl text-xl font-semibold text-emerald-100">
          {label.subtitle}
        </p>

        <p className="mt-5 max-w-3xl leading-8 text-slate-200">
          {label.description}
        </p>

        <div className="mt-8">
          <Link
            href={`/${locale}/business/companies`}
            className="inline-flex rounded-2xl bg-white px-6 py-3 font-black text-slate-950 transition hover:bg-emerald-100"
          >
            {label.openCompanies}
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label={label.statsCompanies} value="55" />
        <StatCard label={label.statsContacts} value="122" />
        <StatCard label={label.statsSectors} value="6" />
        <StatCard label={label.statsSources} value="Public" />
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <FeatureCard
          icon={Building2}
          title={label.companies}
          description={label.companiesDesc}
          href={`/${locale}/business/companies`}
          cta={label.openCompanies}
        />

        <FeatureCard
          icon={LineChart}
          title={label.market}
          description={label.marketDesc}
          cta={label.comingSoon}
          disabled
        />

        <FeatureCard
          icon={Store}
          title={label.sectors}
          description={label.sectorsDesc}
          cta={label.comingSoon}
          disabled
        />

        <FeatureCard
          icon={SearchCheck}
          title={label.opportunities}
          description={label.opportunitiesDesc}
          cta={label.comingSoon}
          disabled
        />
      </section>

      <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-sm font-semibold leading-7 text-amber-900">
        <ShieldCheck className="mb-3 h-6 w-6" />
        {label.note}
      </section>
    </main>
  );
}