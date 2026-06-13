import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import {
  BarChart3,
  GraduationCap,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  TrendingUp
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

type Locale = 'en' | 'ar';

type SearchParams = {
  city?: string;
  compare?: string;
  lang?: string;
};

type University = {
  university_id: string;
  name_en: string | null;
  name_ar?: string | null;
  city: string | null;
  ownership: string | null;
  website?: string | null;
  rank_unirank_sudan?: number | null;
  rank_edurank_sudan?: number | null;
  rank_webometrics_sudan?: number | null;
};

type Metric = {
  university_id: string;
  education_score: number | null;
  research_score: number | null;
  infrastructure_score: number | null;
  administration_score: number | null;
  curriculum_score: number | null;
  schedule_commitment_score: number | null;
  external_ranking_score: number | null;
  programs_score: number | null;
  website_quality_score: number | null;
  data_completeness_score: number | null;
  overall_score: number | null;
  confidence: string | null;
  source_count: number | null;
};

type RankOverride = {
  university_id: string;
  final_rank: number;
  rank_tier?: string | null;
  reason?: string | null;
};

type UniversityWithMetric = University & {
  metric?: Metric;
};

const ui = {
  en: {
    dir: 'ltr',
    title: 'University comparison guide',
    intro:
      'Compare Sudanese universities using a curated academic ranking order, supported by public data indicators such as research visibility, programs, infrastructure, administration, curriculum, and schedule commitment.',
    chooseCity: 'Choose city',
    allCities: 'All cities',
    compareByName: 'Compare by name',
    comparePlaceholder: 'Example: Khartoum, SUST, Gezira',
    apply: 'Apply',
    bestInArea: 'Best universities in this area',
    chartHint:
      'Ranked by the current curated academic order. Scraped/public data is shown as supporting comparison context only.',
    noCityData: 'No universities matched this city yet.',
    comparisonResult: 'Comparison result',
    found: 'Found',
    universities: 'universities',
    quickSummary: 'Quick summary',
    bestOverall: 'Best overall',
    strongestResearch: 'Strongest research signal',
    bestInfrastructure: 'Best infrastructure signal',
    detailedTable: 'Detailed comparison table',
    metric: 'Metric',
    overallIndex: 'Overall academic score',
    weighted: 'Based on the current curated academic ranking policy.',
    openProfile: 'Open profile',
    unknownCity: 'Unknown city',
    unknownOwnership: 'Unknown ownership',
    public: 'Public',
    private: 'Private',
    high: 'High confidence',
    medium: 'Medium confidence',
    low: 'Low confidence',
    topStrength: 'Strongest visible supporting signal',
    noDataEnough: 'Not enough data',
    notFound:
      'No matching university was found. Try part of the name, such as Khartoum, SUST, Gezira, Neelain, or Omdurman.',
    noteTitle: 'Important note about the ranking',
    note:
      'The main order is not an official accreditation ranking. It uses a curated academic ranking policy based primarily on recognized ranking signals and manual correction of duplicate/unclear records. Scraped university pages, website quality, and digital presence are used only as supporting context in the comparison table and should not override the academic order.',
    metrics: {
      education_score: 'Education quality signal',
      research_score: 'Research strength signal',
      infrastructure_score: 'Infrastructure signal',
      administration_score: 'Administration signal',
      curriculum_score: 'Curriculum signal',
      schedule_commitment_score: 'Schedule commitment signal'
    },
    descriptions: {
      education_score: 'Programs, faculties, colleges, teaching, and academic presence.',
      research_score: 'Research, publications, journals, conferences, and research centers.',
      infrastructure_score: 'Libraries, laboratories, facilities, and available campus information.',
      administration_score: 'Admissions, registration, student affairs, services, and contact visibility.',
      curriculum_score: 'Courses, study plans, curriculum pages, and academic program details.',
      schedule_commitment_score: 'Academic calendar, timetables, exams, results, and announcements.'
    }
  },
  ar: {
    dir: 'rtl',
    title: 'دليل اختيار الجامعة',
    intro:
      'قارن الجامعات السودانية باستخدام ترتيب أكاديمي منظم، مع مؤشرات مساعدة من البيانات العامة مثل البحث العلمي، البرامج، البنية التحتية، الإدارة، المنهج، والالتزام بالمواعيد.',
    chooseCity: 'اختر المدينة',
    allCities: 'كل المدن',
    compareByName: 'قارن بالاسم',
    comparePlaceholder: 'مثال: جامعة الخرطوم, جامعة السودان, جامعة الجزيرة',
    apply: 'تطبيق',
    bestInArea: 'أفضل الجامعات في هذه المنطقة',
    chartHint:
      'الترتيب حسب السياسة الأكاديمية الحالية. بيانات الكشط والوجود الرقمي تظهر كمؤشرات مساعدة فقط داخل المقارنة.',
    noCityData: 'لا توجد جامعات مطابقة لهذه المدينة حالياً.',
    comparisonResult: 'نتيجة المقارنة',
    found: 'تم العثور على',
    universities: 'جامعة',
    quickSummary: 'الخلاصة السريعة',
    bestOverall: 'الأفضل إجمالاً',
    strongestResearch: 'أقوى مؤشر بحثي',
    bestInfrastructure: 'أقوى مؤشر بنية تحتية',
    detailedTable: 'جدول المقارنة التفصيلي',
    metric: 'المعيار',
    overallIndex: 'المؤشر الأكاديمي العام',
    weighted: 'يعتمد على سياسة الترتيب الأكاديمي الحالية.',
    openProfile: 'فتح صفحة الجامعة',
    unknownCity: 'مدينة غير معروفة',
    unknownOwnership: 'نوع غير معروف',
    public: 'حكومية',
    private: 'خاصة',
    high: 'ثقة عالية',
    medium: 'ثقة متوسطة',
    low: 'ثقة منخفضة',
    topStrength: 'أقوى مؤشر مساعد ظاهر في البيانات',
    noDataEnough: 'لا توجد بيانات كافية',
    notFound:
      'لم أجد جامعة مطابقة للاسم المدخل. جرّب كتابة جزء من الاسم مثل: الخرطوم، السودان، الجزيرة، النيلين، أم درمان.',
    noteTitle: 'ملاحظة مهمة عن الترتيب',
    note:
      'هذا ليس ترتيب اعتماد رسمي. الترتيب العام يستخدم سياسة أكاديمية منظمة تعتمد أساساً على إشارات التصنيف المعروفة، مع تصحيح يدوي للسجلات المكررة أو غير الواضحة. صفحات الجامعات المكشوطة، وجودة الموقع، والوجود الرقمي تظهر كمؤشرات مقارنة مساعدة فقط ولا يجب أن ترفع جامعة فوق ترتيبها الأكاديمي.',
    metrics: {
      education_score: 'مؤشر جودة التعليم',
      research_score: 'مؤشر قوة البحث العلمي',
      infrastructure_score: 'مؤشر البنية التحتية',
      administration_score: 'مؤشر الإدارة والخدمات',
      curriculum_score: 'مؤشر قوة المنهج',
      schedule_commitment_score: 'مؤشر الالتزام بالمواعيد'
    },
    descriptions: {
      education_score: 'البرامج، الكليات، الأقسام، التدريس، والحضور الأكاديمي.',
      research_score: 'البحوث، المنشورات، المجلات، المؤتمرات، والمراكز البحثية.',
      infrastructure_score: 'المكتبات، المعامل، المرافق، والمعلومات المتاحة عن الحرم الجامعي.',
      administration_score: 'القبول، التسجيل، شؤون الطلاب، الخدمات، ووضوح التواصل.',
      curriculum_score: 'المقررات، الخطط الدراسية، صفحات المناهج، وتفاصيل البرامج الأكاديمية.',
      schedule_commitment_score: 'التقويم الأكاديمي، الجداول، الامتحانات، النتائج، والإعلانات.'
    }
  }
};

const cityAliases: Record<string, string[]> = {
  Khartoum: ['khartoum', 'الخرطوم', 'خرطوم'],
  Omdurman: ['omdurman', 'أم درمان', 'ام درمان', 'امدرمان', 'أمدرمان'],
  Bahri: ['khartoum north', 'bahri', 'بحري'],
  'Port Sudan': ['port sudan', 'portsudan', 'بورتسودان', 'بورسودان'],
  'Al-Fashir': ['al-fashir', 'al fashir', 'الفاشر'],
  Shendi: ['shendi', 'شندي'],
  Kassala: ['kassala', 'كسلا'],
  Dongola: ['dongola', 'دنقلا'],
  Nyala: ['nyala', 'نيالا'],
  Sennar: ['sennar', 'sinnar', 'سنار'],
  Atbara: ['atbara', 'عطبرة'],
  'Wad Madani': ['wad madani', 'wad medani', 'ود مدني', 'مدني'],
  'El-Obeid': ['el-obeid', 'el obeid', 'الأبيض', 'الابيض'],
  'Al-Fulah': ['al-fulah', 'al fulah', 'الفولة', 'الفوله'],
  Berber: ['berber', 'بربر'],
  Gadarif: ['gadarif', 'gedaref', 'القضارف'],
  Zalingei: ['zalingei', 'زالنجي'],
  Kosti: ['kosti', 'كوستي']
};

const cityArabic: Record<string, string> = {
  Khartoum: 'الخرطوم',
  Omdurman: 'أم درمان',
  Bahri: 'بحري',
  'Port Sudan': 'بورتسودان',
  'Al-Fashir': 'الفاشر',
  Shendi: 'شندي',
  Kassala: 'كسلا',
  Dongola: 'دنقلا',
  Nyala: 'نيالا',
  Sennar: 'سنار',
  Atbara: 'عطبرة',
  'Wad Madani': 'ود مدني',
  'El-Obeid': 'الأبيض',
  'Al-Fulah': 'الفولة',
  Berber: 'بربر',
  Gadarif: 'القضارف',
  Zalingei: 'زالنجي',
  Kosti: 'كوستي'
};

const arabicUniversityNames: Record<string, string> = {
  UNI0067: 'جامعة الخرطوم',
  UNI0119: 'جامعة السودان للعلوم والتكنولوجيا',
  UNI0055: 'جامعة الجزيرة',
  UNI0097: 'جامعة أم درمان الإسلامية',
  UNI0087: 'جامعة النيلين',
  UNI0061: 'جامعة أفريقيا العالمية',
  UNI0004: 'جامعة الأحفاد للبنات',
  UNI0070: 'جامعة كردفان',
  UNI0075: 'جامعة العلوم الطبية والتكنولوجيا',
  UNI0102: 'جامعة البحر الأحمر',
  UNI0105: 'جامعة العلوم والتقانة',
  UNI0090: 'جامعة وادي النيل',
  UNI0009: 'جامعة الزعيم الأزهري',
  UNI0065: 'جامعة كسلا',
  UNI0095: 'جامعة أم درمان الأهلية',
  UNI0126: 'جامعة المستقبل',
  UNI0063: 'جامعة كرري',
  UNI0117: 'جامعة السودان العالمية',
  UNI0073: 'جامعة المشرق',
  UNI0047: 'جامعة الشيخ عبد الله البدري',
  UNI0020: 'جامعة السلام',
  UNI0052: 'جامعة القضارف',
  UNI0028: 'جامعة النيل الأزرق',
  UNI0127: 'جامعة القرآن الكريم والعلوم الإسلامية',
  UNI0006: 'جامعة الفاشر'
};

const searchAliases: Record<string, string[]> = {
  UNI0067: ['khartoum', 'university of khartoum', 'جامعة الخرطوم', 'الخرطوم'],
  UNI0119: [
    'sust',
    'sudan university of science and technology',
    'جامعة السودان',
    'جامعة السودان للعلوم والتكنولوجيا',
    'السودان للعلوم'
  ],
  UNI0055: ['gezira', 'jazira', 'university of gezira', 'جامعة الجزيرة', 'الجزيرة'],
  UNI0097: ['omdurman islamic', 'islamic university', 'جامعة أم درمان الإسلامية', 'ام درمان الاسلامية'],
  UNI0087: ['neelain', 'النيلين', 'جامعة النيلين'],
  UNI0061: ['international university of africa', 'africa', 'جامعة أفريقيا العالمية', 'افريقيا العالمية'],
  UNI0004: ['ahfad', 'ahfad university for women', 'الأحفاد', 'الاحفاد'],
  UNI0070: ['kordofan', 'جامعة كردفان', 'كردفان'],
  UNI0075: ['umst', 'medical sciences and technology', 'العلوم الطبية', 'جامعة العلوم الطبية'],
  UNI0102: ['red sea', 'البحر الأحمر', 'البحر الاحمر'],
  UNI0105: ['ust', 'university of science and technology', 'جامعة العلوم والتقانة', 'العلوم والتقانة']
};

const metricKeys = [
  'education_score',
  'research_score',
  'infrastructure_score',
  'administration_score',
  'curriculum_score',
  'schedule_commitment_score'
] as const;

function normalize(value: string | null | undefined) {
  return String(value || '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ـ/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function score(value: number | null | undefined) {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
}

function scorePercent(value: number | null | undefined) {
  return Math.max(0, Math.min(100, score(value) * 20));
}

function isGoodArabic(value: string | null | undefined) {
  const text = String(value || '').trim();
  return Boolean(text) && !/[�ØÃ]/.test(text);
}

function displayName(university: UniversityWithMetric, locale: Locale) {
  const manualAr = arabicUniversityNames[university.university_id];
  const dbAr = String(university.name_ar || '').trim();
  const en = String(university.name_en || '').trim();

  if (locale === 'ar') {
    if (manualAr) return manualAr;
    if (isGoodArabic(dbAr)) return dbAr;
  }

  return en || manualAr || university.university_id;
}

function secondaryName(university: UniversityWithMetric, locale: Locale) {
  const en = String(university.name_en || '').trim();

  if (locale === 'ar') return en;

  return '';
}

function ownershipLabel(value: string | null | undefined, locale: Locale) {
  const t = ui[locale];
  const raw = normalize(value);

  if (!raw) return t.unknownOwnership;
  if (raw.includes('private')) return t.private;
  if (raw.includes('public') || raw.includes('government')) return t.public;

  return value || t.unknownOwnership;
}

function canonicalCity(value: string | null | undefined) {
  const raw = normalize(value);

  for (const [city, aliases] of Object.entries(cityAliases)) {
    if (aliases.some((alias) => raw.includes(normalize(alias)))) {
      return city;
    }
  }

  return String(value || '').trim();
}

function cityLabel(value: string | null | undefined, locale: Locale) {
  const canonical = canonicalCity(value);

  if (!canonical) return ui[locale].unknownCity;

  return locale === 'ar' ? cityArabic[canonical] || canonical : canonical;
}

function cityMatches(universityCity: string | null | undefined, selectedCity: string) {
  if (!selectedCity) return true;

  const canonical = canonicalCity(universityCity);

  if (normalize(canonical) === normalize(selectedCity)) return true;

  const raw = normalize(universityCity);
  const aliases = cityAliases[selectedCity] || [];

  return aliases.some((alias) => raw.includes(normalize(alias)));
}

function nameMatches(university: UniversityWithMetric, query: string, locale: Locale) {
  if (!query) return false;

  const q = normalize(query);
  const manualAr = arabicUniversityNames[university.university_id] || '';
  const aliases = searchAliases[university.university_id] || [];

  return [
    university.university_id,
    university.name_en,
    university.name_ar,
    manualAr,
    displayName(university, locale),
    secondaryName(university, locale),
    university.city,
    university.ownership,
    ...aliases
  ].some((value) => normalize(value).includes(q));
}

function confidenceLabel(value: string | null | undefined, locale: Locale) {
  const t = ui[locale];

  if (value === 'high') return t.high;
  if (value === 'medium') return t.medium;

  return t.low;
}

function confidenceClass(value: string | null | undefined) {
  if (value === 'high') return 'bg-green-50 text-green-700 ring-green-200';
  if (value === 'medium') return 'bg-amber-50 text-amber-700 ring-amber-200';

  return 'bg-slate-50 text-slate-600 ring-slate-200';
}

function getTopStrength(university: UniversityWithMetric, locale: Locale) {
  const metric = university.metric;
  const t = ui[locale];

  if (!metric) return t.noDataEnough;

  const entries = metricKeys.map((key) => ({
    label: t.metrics[key],
    value: score(metric[key])
  }));

  entries.sort((a, b) => b.value - a.value);

  return entries[0]?.label || t.noDataEnough;
}

function sortByRankingWithMap(
  a: UniversityWithMetric,
  b: UniversityWithMetric,
  rankMap: Map<string, number>
) {
  const rankA = rankMap.get(a.university_id) || 9999;
  const rankB = rankMap.get(b.university_id) || 9999;

  if (rankA !== rankB) return rankA - rankB;

  const overallDiff = score(b.metric?.overall_score) - score(a.metric?.overall_score);
  if (overallDiff !== 0) return overallDiff;

  const externalDiff =
    score(b.metric?.external_ranking_score) - score(a.metric?.external_ranking_score);
  if (externalDiff !== 0) return externalDiff;

  return displayName(a, 'en').localeCompare(displayName(b, 'en'));
}

function displayRank(university: UniversityWithMetric, rankMap: Map<string, number>, fallback: number) {
  return rankMap.get(university.university_id) || fallback;
}

function RecommendationCard({
  universities,
  locale,
  rankMap
}: {
  universities: UniversityWithMetric[];
  locale: Locale;
  rankMap: Map<string, number>;
}) {
  const t = ui[locale];

  if (universities.length < 2) return null;

  const bestOverall = [...universities].sort((a, b) =>
    sortByRankingWithMap(a, b, rankMap)
  )[0];

  const bestResearch = [...universities].sort(
    (a, b) => score(b.metric?.research_score) - score(a.metric?.research_score)
  )[0];

  const bestInfrastructure = [...universities].sort(
    (a, b) => score(b.metric?.infrastructure_score) - score(a.metric?.infrastructure_score)
  )[0];

  const cards = [
    {
      label: t.bestOverall,
      university: bestOverall,
      value: bestOverall.metric?.overall_score
    },
    {
      label: t.strongestResearch,
      university: bestResearch,
      value: bestResearch.metric?.research_score
    },
    {
      label: t.bestInfrastructure,
      university: bestInfrastructure,
      value: bestInfrastructure.metric?.infrastructure_score
    }
  ];

  return (
    <section className="rounded-3xl border border-green-200 bg-green-50 p-6">
      <h2 className="text-2xl font-black text-green-900">{t.quickSummary}</h2>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-4">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-1 text-xl font-black">
              {displayName(card.university, locale)}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {score(card.value).toFixed(2)} / 5
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CityChart({
  universities,
  locale,
  rankMap
}: {
  universities: UniversityWithMetric[];
  locale: Locale;
  rankMap: Map<string, number>;
}) {
  const t = ui[locale];

  if (!universities.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
        {t.noCityData}
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-7 w-7 text-green-600" />

        <div>
          <h2 className="text-2xl font-black">{t.bestInArea}</h2>
          <p className="text-sm text-slate-500">{t.chartHint}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {universities.slice(0, 10).map((university, index) => {
          const value = score(university.metric?.overall_score);
          const percent = scorePercent(value);
          const rank = displayRank(university, rankMap, index + 1);

          return (
            <div key={university.university_id} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/${locale}/university/${university.university_id}`}
                    className="font-bold underline decoration-slate-300 underline-offset-4 hover:text-green-700"
                  >
                    {rank}. {displayName(university, locale)}
                  </Link>

                  {secondaryName(university, locale) && (
                    <p className="text-xs text-slate-500">
                      {secondaryName(university, locale)}
                    </p>
                  )}
                </div>

                <span className="rounded-full bg-slate-950 px-3 py-1 text-sm font-bold text-white">
                  {value.toFixed(2)}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-green-600"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function UniversityMiniCard({
  university,
  locale,
  rankMap
}: {
  university: UniversityWithMetric;
  locale: Locale;
  rankMap: Map<string, number>;
}) {
  const t = ui[locale];
  const metric = university.metric;
  const rank = rankMap.get(university.university_id);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black">{displayName(university, locale)}</h3>

          {secondaryName(university, locale) && (
            <p className="mt-1 text-sm text-slate-500">
              {secondaryName(university, locale)}
            </p>
          )}

          {rank && (
            <p className="mt-2 inline-flex rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700 ring-1 ring-green-200">
              #{rank}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-white">
          <p className="text-xs">{t.overallIndex}</p>
          <p className="text-2xl font-black">{score(metric?.overall_score).toFixed(1)}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
          <MapPin className="h-4 w-4" />
          {cityLabel(university.city, locale)}
        </span>

        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
          <ShieldCheck className="h-4 w-4" />
          {ownershipLabel(university.ownership, locale)}
        </span>

        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm ring-1 ${confidenceClass(
            metric?.confidence
          )}`}
        >
          {confidenceLabel(metric?.confidence, locale)}
        </span>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm text-slate-500">{t.topStrength}</p>
        <p className="mt-1 font-black">{getTopStrength(university, locale)}</p>
      </div>

      <Link
        href={`/${locale}/university/${university.university_id}`}
        className="mt-5 inline-flex rounded-2xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
      >
        {t.openProfile}
      </Link>
    </article>
  );
}

function ComparisonTable({
  universities,
  locale
}: {
  universities: UniversityWithMetric[];
  locale: Locale;
}) {
  const t = ui[locale];

  if (universities.length < 2) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
        {locale === 'ar'
          ? 'اكتب اسم جامعتين أو ثلاث في خانة المقارنة لعرض جدول المقارنة.'
          : 'Enter two or three university names to show the comparison table.'}
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">{t.detailedTable}</h2>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="border-b border-slate-200 p-3 text-slate-500">
                {t.metric}
              </th>

              {universities.map((university) => (
                <th
                  key={university.university_id}
                  className="border-b border-slate-200 p-3"
                >
                  {displayName(university, locale)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {metricKeys.map((key) => (
              <tr key={key}>
                <td className="border-b border-slate-100 p-3">
                  <p className="font-bold">{t.metrics[key]}</p>
                  <p className="text-xs text-slate-500">{t.descriptions[key]}</p>
                </td>

                {universities.map((university) => {
                  const value = score(university.metric?.[key]);

                  return (
                    <td
                      key={`${university.university_id}-${key}`}
                      className="border-b border-slate-100 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-12 font-black">{value.toFixed(2)}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-green-600"
                            style={{ width: `${scorePercent(value)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}

            <tr>
              <td className="p-3">
                <p className="font-black">{t.overallIndex}</p>
                <p className="text-xs text-slate-500">{t.weighted}</p>
              </td>

              {universities.map((university) => {
                const value = score(university.metric?.overall_score);

                return (
                  <td key={`${university.university_id}-overall`} className="p-3">
                    <span className="rounded-full bg-slate-950 px-4 py-2 font-black text-white">
                      {value.toFixed(2)} / 5
                    </span>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}


export default async function CompareUniversitiesPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const locale: Locale = searchParams?.lang === 'ar' ? 'ar' : 'en';
  const t = ui[locale];

  const selectedCity = searchParams?.city || '';
  const compareQuery = searchParams?.compare || '';

  const [
    { data: universitiesData, error: universitiesError },
    { data: metricsData, error: metricsError },
    { data: rankData, error: rankError }
  ] = await Promise.all([
    supabase.from('universities').select('*').limit(500),
    supabase
      .from('university_comparison_metrics')
      .select('*')
      .gt('overall_score', 0)
      .limit(500),
    supabase.from('university_rank_overrides').select('*').limit(500)
  ]);

  if (universitiesError || metricsError || rankError) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-bold">Database read error</p>
          <p className="mt-2 text-sm">
            {universitiesError?.message || metricsError?.message || rankError?.message}
          </p>
        </div>
      </main>
    );
  }

  const universities = (universitiesData || []) as University[];
  const metrics = (metricsData || []) as Metric[];
  const ranks = (rankData || []) as RankOverride[];

  const metricMap = new Map(metrics.map((metric) => [metric.university_id, metric]));
  const rankMap = new Map(
    ranks.map((rank) => [rank.university_id, Number(rank.final_rank)])
  );

  const joined: UniversityWithMetric[] = universities
    .map((university) => ({
      ...university,
      metric: metricMap.get(university.university_id)
    }))
    .filter((university) => university.metric)
    .filter((university) => score(university.metric?.overall_score) > 0);

  const cities = Array.from(
    new Set(joined.map((university) => canonicalCity(university.city)).filter(Boolean))
  ).sort();

  const cityUniversities = joined
    .filter((university) => cityMatches(university.city, selectedCity))
    .sort((a, b) => sortByRankingWithMap(a, b, rankMap));

  const compareTerms = compareQuery
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);

  const selectedUniversities: UniversityWithMetric[] = [];

  for (const term of compareTerms) {
    const match = joined
      .filter((university) => nameMatches(university, term, locale))
      .sort((a, b) => sortByRankingWithMap(a, b, rankMap))[0];

    if (match && !selectedUniversities.some((item) => item.university_id === match.university_id)) {
      selectedUniversities.push(match);
    }
  }

  return (
    <main dir={t.dir} className="mx-auto max-w-7xl space-y-8 px-4 py-12">
<section className="rounded-3xl bg-gradient-to-br from-slate-950 to-green-950 p-8 text-white">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
          <GraduationCap className="h-8 w-8 text-green-300" />
        </div>

        <h1 className="mt-6 text-4xl font-black md:text-6xl">{t.title}</h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
          {t.intro}
        </p>
      </section>

      <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <input type="hidden" name="lang" value={locale} />

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="font-bold">{t.chooseCity}</span>

            <select
              name="city"
              defaultValue={selectedCity}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              <option value="">{t.allCities}</option>

              {cities.map((city) => (
                <option key={city} value={city}>
                  {locale === 'ar' ? cityArabic[city] || city : city}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="font-bold">{t.compareByName}</span>

            <div className="flex gap-3">
              <input
                name="compare"
                defaultValue={compareQuery}
                placeholder={t.comparePlaceholder}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              />

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-green-700"
              >
                <Search className="h-5 w-5" />
                {t.apply}
              </button>
            </div>
          </label>
        </div>
      </form>

     {!compareQuery && (
  <CityChart
    universities={cityUniversities}
    locale={locale}
    rankMap={rankMap}
  />
)}

      {selectedUniversities.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-7 w-7 text-green-600" />

            <div>
              <h2 className="text-3xl font-black">{t.comparisonResult}</h2>
              <p className="text-slate-500">
                {t.found} {selectedUniversities.length} {t.universities}.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {selectedUniversities.map((university) => (
              <UniversityMiniCard
                key={university.university_id}
                university={university}
                locale={locale}
                rankMap={rankMap}
              />
            ))}
          </div>

          <RecommendationCard
            universities={selectedUniversities}
            locale={locale}
            rankMap={rankMap}
          />

          <ComparisonTable universities={selectedUniversities} locale={locale} />
        </section>
      )}

      {!selectedUniversities.length && compareQuery && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
          {t.notFound}
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <Star className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-black">{t.noteTitle}</h2>
        </div>

        <p className="mt-3 leading-7 text-slate-600">{t.note}</p>
      </section>
    </main>
  );
}


