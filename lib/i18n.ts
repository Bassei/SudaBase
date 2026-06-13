export const locales = ['ar', 'en'] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const dictionaries = {
  ar: {
    dir: 'rtl',
    langLabel: 'English',
    switchTo: '/en',
    badge: 'منصة بيانات التعليم والاقتصاد في السودان',
    title: 'قاعدة البيانات السودانية',
    description:
      'منصة بيانات وطنية للطلاب، الأعمال، الباحثين، الجامعات، المنظمات، وصناع القرار. اختر الواجهة المناسبة لهدفك.',
    students: {
      title: 'للطلاب',
      subtitle: 'جامعات، تخصصات، مقارنة، وتجارب الطلاب.',
      description:
        'ابحث عن الجامعات السودانية، استكشف البرامج والتخصصات، قارن بين الجامعات، واقرأ تجارب الطلاب.',
      cta: 'ابدأ كطالب'
    },
    business: {
      title: 'للأعمال',
      subtitle: 'مؤشرات السوق، القطاعات، الشركات، والفرص.',
      description:
        'تابع أسعار الدولار، USDT، الذهب والفضة، واستكشف القطاعات والفرص التجارية في السودان.',
      cta: 'استكشف بيانات الأعمال'
    },
    researchers: {
      title: 'للباحثين',
      subtitle: 'بيانات منظمة، مصادر، منهجية، وجودة البيانات.',
      description:
        'استخدم بيانات التعليم والاقتصاد السودانية مع المصادر، مستوى الثقة، وتاريخ التحديث.',
      cta: 'افتح بوابة الباحثين'
    },
    snapshotTitle: 'لمحة عن المنصة',
    snapshotDescription:
      'قاعدة بيانات واحدة تشغّل واجهات مختلفة حسب نوع المستخدم.',
    stats: {
      universities: 'الجامعات',
      programs: 'البرامج',
      sectors: 'القطاعات',
      businesses: 'الأعمال',
      reviews: 'التقييمات'
    },
    marketTitle: 'لمحة السوق',
    marketDescription:
      'أسعار إرشادية سريعة. الأدوات الكاملة موجودة داخل واجهة الأعمال.',
    openBusiness: 'افتح واجهة الأعمال',
    disclaimer:
      'أسعار الصرف، USDT، الذهب والفضة إرشادية وقد تختلف عن أسعار السوق المحلي في السودان.'
  },

  en: {
    dir: 'ltr',
    langLabel: 'العربية',
    switchTo: '/ar',
    badge: 'Sudan Education & Economic Data Infrastructure',
    title: 'Sudanese Database',
    description:
      'A national data platform for students, businesses, researchers, universities, organizations, and decision makers. Choose the interface that matches your goal.',
    students: {
      title: 'For Students',
      subtitle: 'Universities, programs, comparison, and student reviews.',
      description:
        'Find Sudanese universities, explore available programs, compare institutions, and read student experiences.',
      cta: 'Start as student'
    },
    business: {
      title: 'For Businesses',
      subtitle: 'Market indicators, sectors, businesses, and opportunities.',
      description:
        'Track USD, USDT, gold, and silver indicators, explore sectors, and understand market opportunities.',
      cta: 'Explore business data'
    },
    researchers: {
      title: 'For Researchers',
      subtitle: 'Structured datasets, sources, methodology, and data quality.',
      description:
        'Access Sudanese education and economic datasets with sources, confidence labels, and update information.',
      cta: 'Open research portal'
    },
    snapshotTitle: 'Platform snapshot',
    snapshotDescription:
      'The same national database powers different experiences for different users.',
    stats: {
      universities: 'Universities',
      programs: 'Programs',
      sectors: 'Sectors',
      businesses: 'Businesses',
      reviews: 'Reviews'
    },
    marketTitle: 'Market snapshot',
    marketDescription:
      'Indicative prices for quick awareness. Full market tools are inside the business interface.',
    openBusiness: 'Open business interface',
    disclaimer:
      'Exchange, USDT, gold, and silver prices are indicative and may differ from local Sudanese market prices.'
  }
} as const;