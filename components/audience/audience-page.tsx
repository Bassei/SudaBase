import Link from 'next/link';
import {
  Lightbulb,
  Target,
  FlaskConical,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Database,
  FileSearch,
  GitCompare,
  GraduationCap,
  LineChart,
  Map,
  Search,
  SearchCheck,
  ShieldCheck,
  Star,
  Store,
  TableProperties
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { MarketTicker } from '@/components/market/market-ticker';
import { getMarketIndicators, getStats } from '@/lib/data';

type Locale = 'ar' | 'en';
type Audience = 'students' | 'business' | 'research';

type AudiencePageProps = {
  locale: Locale;
  audience: Audience;
};

const text = {
  ar: {
    studentsTitle: 'للطلاب',
    studentsDescription:
      'واجهة بسيطة للطلاب تساعدك على البحث عن الجامعات السودانية، معرفة البرامج والتخصصات، المقارنة بين الجامعات، وقراءة تجارب الطلاب.',
    businessTitle: 'للأعمال',
    businessDescription:
      'واجهة مخصصة للتجار، الشركات، المستثمرين، ورواد الأعمال لمتابعة مؤشرات السوق، القطاعات، الشركات، والفرص الاقتصادية في السودان.',
    researchTitle: 'بوابة البحث والابتكار',
    researchDescription:
      'منصة مخصصة للباحثين لنشر أبحاثهم وإبداعاتهم، وللشركات وأصحاب الأعمال لطرح المشاكل والمنتجات التي يريدون من طلاب الجامعات والباحثين العمل عليها لإيجاد حلول مبتكرة.',
    browseUniversities: 'تصفح الجامعات',
    compareUniversities: 'قارن الجامعات',
    marketIndicators: 'مؤشرات السوق',
    exploreSectors: 'استكشف القطاعات',
    methodology: 'اقرأ المنهجية',
    exploreData: 'استكشف البيانات',
    universities: 'الجامعات',
    programs: 'البرامج',
    programsInside: 'البرامج داخل الجامعات',
    reviews: 'تقييمات الطلاب',
    sectors: 'القطاعات الاقتصادية',
    businesses: 'الأعمال',
    marketCount: 'مؤشرات السوق',
    marketSnapshot: 'لمحة السوق',
    marketNote: 'أسعار إرشادية وقد تختلف عن أسعار السوق المحلي في السودان.',
    howTitle: 'كيف تستخدم هذا القسم؟',
    howDescription:
      'ابدأ بالبحث عن جامعة. افتح صفحة الجامعة لمعرفة البرامج، التصنيفات، المصادر، وتقييمات الطلاب. التقييمات موجودة داخل صفحات الجامعات لتقليل التشتت.',
    portalTitle: 'اتجاه بوابة الباحثين',
    portalDescription:
      'لاحقاً ستتضمن هذه الواجهة تنزيل البيانات، فلاتر متقدمة، مستوى الثقة، تاريخ التحديث، وتنبيهات جودة البيانات.',
    actions: {
      findUniversity: 'ابحث عن جامعة',
      findUniversityDesc: 'ابحث في الجامعات السودانية حسب الاسم، المدينة، النوع، والبيانات المتاحة.',
      compare: 'قارن الجامعات',
      compareDesc: 'قارن بين جامعتين أو ثلاث جامعات جنباً إلى جنب.',
      reviews: 'تقييمات الطلاب',
      reviewsDesc: 'افتح صفحة أي جامعة لقراءة أو إضافة تقييم.',
      market: 'مؤشرات السوق',
      marketDesc: 'تابع أسعار الدولار، USDT، الذهب، الفضة، ومؤشرات السوق المهمة.',
      sectors: 'القطاعات الاقتصادية',
      sectorsDesc: 'استكشف القطاعات، مستوى المنافسة، المخاطر، وفرص السوق.',
      directory: 'دليل الأعمال',
      directoryDesc: 'تصفح الشركات والأعمال حسب القطاع، المدينة، ومصدر البيانات.',
      map: 'خريطة السوق',
      mapDesc: 'واجهة مستقبلية لعرض كثافة الأعمال والفرص حسب المدينة والمنطقة.',
      educationData: 'بيانات التعليم',
      educationDataDesc: 'استكشف بيانات الجامعات والبرامج مع معلومات المصادر والتحديث.',
      economyData: 'بيانات الاقتصاد',
      economyDataDesc: 'استكشف القطاعات، الأعمال، مؤشرات السوق، وبيانات السوق.',
      methodology: 'المنهجية',
      methodologyDesc: 'راجع طريقة جمع البيانات، تنظيفها، تصنيفها، وتحديثها.',
      quality: 'جودة البيانات',
      qualityDesc: 'لوحة مستقبلية للتكرارات، النواقص، البيانات القديمة، ومستوى الثقة.',
      addIdea: 'أضف فكرة أو بحث',
      addIdeaDesc: 'شارك مشروعك، بحثك، أو إبداعك مع المجتمع الأكاديمي والشركات لتعزيز الابتكار.',
      addProblem: 'طرح مشكلة أو تطوير منتج',
      addProblemDesc: 'للشركات وأصحاب الأعمال: اطرح التحديات التي تواجهك ليقوم الطلاب بإيجاد حلول لها.',
      researchData: 'البيانات البحثية',
      researchDataDesc: 'بيانات ومعلومات مفتوحة ومخصصة لمساعدة الباحثين في دراساتهم وتحليلاتهم.'
    }
  },
  en: {
    studentsTitle: 'For Students',
    studentsDescription:
      'A simple student-focused guide to Sudanese universities, programs, comparison, and student experiences.',
    businessTitle: 'For Businesses',
    businessDescription:
      'A business-focused interface for Sudanese market indicators, sectors, businesses, and market opportunity intelligence.',
    researchTitle: 'Research & Innovation Portal',
    researchDescription:
      'A dedicated platform for researchers to publish their work, and for companies to post technical problems and product developments for university students to solve.',
    browseUniversities: 'Browse universities',
    compareUniversities: 'Compare universities',
    marketIndicators: 'Market indicators',
    exploreSectors: 'Explore sectors',
    methodology: 'Read methodology',
    exploreData: 'Explore datasets',
    universities: 'Universities',
    programs: 'Programs',
    programsInside: 'Programs inside universities',
    reviews: 'Student reviews',
    sectors: 'Economic sectors',
    businesses: 'Businesses',
    marketCount: 'Market indicators',
    marketSnapshot: 'Live market snapshot',
    marketNote: 'Prices are indicative and may differ from local market rates.',
    howTitle: 'How to use this section',
    howDescription:
      'Start by searching for a university. Open its profile to see programs, rankings, sources, and student reviews. Reviews are kept inside university pages to reduce confusion.',
    portalTitle: 'Research portal direction',
    portalDescription:
      'This section will later include dataset downloads, advanced filters, source confidence, update history, and data quality warnings.',
    actions: {
      findUniversity: 'Find a university',
      findUniversityDesc: 'Search Sudanese universities by name, city, ownership, and available data.',
      compare: 'Compare universities',
      compareDesc: 'Compare two or three universities side by side.',
      reviews: 'Student reviews',
      reviewsDesc: 'Open a university profile to read or submit student reviews.',
      market: 'Market indicators',
      marketDesc: 'Track USD, USDT, gold, silver, and other important market prices.',
      sectors: 'Economic sectors',
      sectorsDesc: 'Explore sectors, competition level, risk, and opportunity score.',
      directory: 'Business directory',
      directoryDesc: 'Browse Sudanese businesses by sector, city, and source confidence.',
      map: 'Market map',
      mapDesc: 'Future map view for business density and regional opportunity.',
      educationData: 'Education datasets',
      educationDataDesc: 'Explore structured university and program datasets with source information.',
      economyData: 'Economic datasets',
      economyDataDesc: 'Explore sectors, businesses, market indicators, and business intelligence records.',
      methodology: 'Methodology',
      methodologyDesc: 'Review how data is collected, cleaned, labeled, and updated.',
      quality: 'Data quality',
      qualityDesc: 'Future dashboard for duplicates, missing fields, outdated records, and confidence labels.',
      addIdea: 'Add an Idea or Research',
      addIdeaDesc: 'Share your project, research, or idea with the academic community and businesses.',
      addProblem: 'Post a Problem or Product',
      addProblemDesc: 'For businesses: post the challenges you face so students and researchers can find solutions.',
      researchData: 'Research Data',
      researchDataDesc: 'Open data and information designed to help researchers with their studies and analysis.'
    }
  }
};

function ActionCard({
  title,
  description,
  href,
  Icon
}: {
  title: string;
  description: string;
  href: string;
  Icon: any;
}) {
  return (
    <Link href={href} className="card p-6">
      <Icon className="h-8 w-8 text-sudanGreen" />
      <h2 className="mt-4 text-xl font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </Link>
  );
}

export async function AudiencePage({ locale, audience }: AudiencePageProps) {
  const t = text[locale];
  const isArabic = locale === 'ar';
  const dir = isArabic ? 'rtl' : 'ltr';

  const [stats, indicators] = await Promise.all([
    getStats(),
    getMarketIndicators()
  ]);

  if (audience === 'students') {
    return (
      <section dir={dir} className="mx-auto max-w-7xl space-y-10 px-4 py-12">
        <div className="rounded-3xl bg-gradient-to-br from-green-950 to-slate-950 p-8 text-white md:p-12">
          <GraduationCap className="h-12 w-12 text-green-300" />
          <h1 className="mt-6 text-4xl font-black md:text-6xl">{t.studentsTitle}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">{t.studentsDescription}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/${locale}/universities`} className="btn bg-white text-slate-950">
              {t.browseUniversities}
            </Link>
            <Link href="/compare-universities" className="btn border border-white/20 text-white">
              {t.compareUniversities}
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label={t.universities} value={stats.universities} />
          <StatCard label={t.programsInside} value={stats.programs} />
          <StatCard label={t.reviews} value={stats.reviews} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <ActionCard title={t.actions.findUniversity} description={t.actions.findUniversityDesc} href={`/${locale}/universities`} Icon={Search} />
          <ActionCard title={t.actions.compare} description={t.actions.compareDesc} href="/compare-universities" Icon={GitCompare} />
          <ActionCard title={t.actions.reviews} description={t.actions.reviewsDesc} href={`/${locale}/universities`} Icon={Star} />
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-black">{t.howTitle}</h2>
          <p className="mt-3 max-w-3xl text-slate-600">{t.howDescription}</p>
        </div>
      </section>
    );
  }

  if (audience === 'business') {
    return (
      <section dir={dir} className="mx-auto max-w-7xl space-y-10 px-4 py-12">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-amber-950 p-8 text-white md:p-12">
          <BriefcaseBusiness className="h-12 w-12 text-amber-300" />
          <h1 className="mt-6 text-4xl font-black md:text-6xl">{t.businessTitle}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">{t.businessDescription}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/market-indicators" className="btn bg-white text-slate-950">
              {t.marketIndicators}
            </Link>
            <Link href="/sectors" className="btn border border-white/20 text-white">
              {t.exploreSectors}
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label={t.sectors} value={stats.sectors} />
          <StatCard label={t.businesses} value={stats.businesses} />
          <StatCard label={t.marketCount} value={indicators.length} />
        </div>

        <section>
          <h2 className="mb-4 text-2xl font-bold">{t.marketSnapshot}</h2>
          <MarketTicker indicators={indicators} />
          <p className="mt-3 text-sm text-slate-500">{t.marketNote}</p>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <ActionCard title={t.actions.market} description={t.actions.marketDesc} href="/market-indicators" Icon={LineChart} />
          <ActionCard title={t.actions.sectors} description={t.actions.sectorsDesc} href="/sectors" Icon={Building2} />
          <ActionCard title={t.actions.directory} description={t.actions.directoryDesc} href="/businesses" Icon={Store} />
          <ActionCard title={t.actions.map} description={t.actions.mapDesc} href="/businesses" Icon={Map} />
        </div>
      </section>
    );
  }

  return (
    <section dir={dir} className="mx-auto max-w-7xl space-y-10 px-4 py-12">
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-indigo-950 p-8 text-white md:p-12">
        <SearchCheck className="h-12 w-12 text-indigo-300" />
        <h1 className="mt-6 text-4xl font-black md:text-6xl">{t.researchTitle}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">{t.researchDescription}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/methodology" className="btn bg-white text-slate-950">
            {t.methodology}
          </Link>
          <Link href={`/${locale}/universities`} className="btn border border-white/20 text-white">
            {t.exploreData}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <StatCard label={t.universities} value={stats.universities} />
        <StatCard label={t.programs} value={stats.programs} />
        <StatCard label={t.sectors} value={stats.sectors} />
        <StatCard label={t.businesses} value={stats.businesses} />
        <StatCard label={t.reviews} value={stats.reviews} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ActionCard title={t.actions.educationData} description={t.actions.educationDataDesc} href={`/${locale}/universities`} Icon={TableProperties} />
        <ActionCard title={t.actions.economyData} description={t.actions.economyDataDesc} href="/economy" Icon={Database} />
        <ActionCard title={t.actions.methodology} description={t.actions.methodologyDesc} href="/methodology" Icon={FileSearch} />
        <ActionCard title={t.actions.quality} description={t.actions.qualityDesc} href="/admin" Icon={ShieldCheck} />
      </div>

      <div className="card p-6">
        <h2 className="text-2xl font-black">{t.portalTitle}</h2>
        <p className="mt-3 max-w-3xl text-slate-600">{t.portalDescription}</p>
      </div>
    </section>
  );
}
