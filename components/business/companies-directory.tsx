import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Filter,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

type Locale = 'ar' | 'en';

type SearchParams = {
  q?: string;
  sector?: string;
  city?: string;
  contact?: string;
};

type BusinessRecord = {
  company_id: string;
  company_name: string | null;
  sector: string | null;
  sector_name_ar: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  phones: string | null;
  emails: string | null;
  quality_score: number | null;
  source_domain: string | null;
  has_phone: boolean | null;
  has_email: boolean | null;
  has_website: boolean | null;
};

type SectorRecord = {
  sector_id: string;
  sector_name: string;
  sector_name_ar: string | null;
};

const ui = {
  ar: {
    dir: 'rtl',
    title: 'سودا بيس',
    eyebrow: 'Business Directory',
    description:
      'قائمة أعمال مختصرة ونظيفة. لا تظهر بيانات التواصل هنا؛ افتح صفحة الشركة لعرض التفاصيل.',
    back: 'الرجوع لبوابة الأعمال',
    search: 'ابحث باسم الشركة أو القطاع أو المدينة',
    city: 'المدينة',
    allSectors: 'كل القطاعات',
    allContacts: 'كل أنواع التواصل',
    phoneOnly: 'لديها هاتف',
    emailOnly: 'لديها إيميل',
    websiteOnly: 'لديها موقع',
    apply: 'تطبيق الفلاتر',
    showing: 'يتم عرض',
    of: 'من أصل',
    companies: 'شركة',
    open: 'فتح الملف',
    unknownCity: 'مدينة غير محددة',
    unknownSector: 'غير مصنف',
    verified: 'مؤكد',
    quality: 'جودة',
    source: 'المصدر',
    noResults: 'لا توجد شركات مطابقة للفلاتر الحالية.',
    dataNote:
      'تم إخفاء بيانات التواصل من القائمة لتكون الواجهة نظيفة. التفاصيل تظهر فقط داخل ملف الشركة.',
    filters: 'الفلاتر',
    businessType: 'قطاع الأعمال',
    location: 'الموقع',
  },
  en: {
    dir: 'ltr',
    title: 'Sudanese Companies Directory',
    eyebrow: 'Business Directory',
    description:
      'A clean business listing. Contact details are hidden here; open a company profile to view full details.',
    back: 'Back to business portal',
    search: 'Search by company, sector, or city',
    city: 'City',
    allSectors: 'All sectors',
    allContacts: 'All contact types',
    phoneOnly: 'Has phone',
    emailOnly: 'Has email',
    websiteOnly: 'Has website',
    apply: 'Apply filters',
    showing: 'Showing',
    of: 'of',
    companies: 'companies',
    open: 'Open profile',
    unknownCity: 'Unknown city',
    unknownSector: 'Unclassified',
    verified: 'Verified',
    quality: 'Quality',
    source: 'Source',
    noResults: 'No companies match the current filters.',
    dataNote:
      'Contact details are hidden from the list to keep the interface clean. Full details appear inside each company profile.',
    filters: 'Filters',
    businessType: 'Business sector',
    location: 'Location',
  },
};

function normalize(value: string | null | undefined) {
  return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function normalizeArabic(value: string | null | undefined) {
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

function fieldMatches(value: string | null | undefined, query: string) {
  if (!query) return true;

  return (
    normalize(value).includes(normalize(query)) ||
    normalizeArabic(value).includes(normalizeArabic(query))
  );
}

function sectorLabel(locale: Locale, business: BusinessRecord) {
  if (locale === 'ar') {
    return business.sector_name_ar || business.sector || ui[locale].unknownSector;
  }

  return business.sector || ui[locale].unknownSector;
}

function initials(name: string | null | undefined) {
  const clean = String(name || '').trim();

  if (/[\u0600-\u06FF]/.test(clean)) {
    return clean.replace(/\s+/g, '').slice(0, 2) || 'ش';
  }

  return (
    clean
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'SD'
  );
}

function CompanyRow({
  business,
  locale,
}: {
  business: BusinessRecord;
  locale: Locale;
}) {
  const label = ui[locale];
  const name = business.company_name || 'Unknown business';

  return (
    <Link
      href={`/${locale}/business/companies/${business.company_id}`}
      className="group block rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-xl"
    >
      <div className="grid gap-4 lg:grid-cols-[64px_1.4fr_1fr_0.8fr_120px] lg:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 to-slate-800 text-lg font-black text-white shadow-lg shadow-slate-200">
          {initials(name)}
        </div>

        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {label.verified}
          </div>

          <h2 className="break-words text-xl font-black leading-snug text-slate-950 md:text-2xl">
            {name}
          </h2>

          {business.source_domain && (
            <p className="mt-1 text-xs font-bold text-slate-400">
              {business.source_domain}
            </p>
          )}
        </div>

        <div>
          <p className="mb-1 text-xs font-black uppercase tracking-wide text-slate-400">
            {label.businessType}
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-black text-amber-800 ring-1 ring-amber-200">
            <BriefcaseBusiness className="h-4 w-4" />
            {sectorLabel(locale, business)}
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs font-black uppercase tracking-wide text-slate-400">
            {label.location}
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
            <MapPin className="h-4 w-4 text-slate-500" />
            {business.city || label.unknownCity}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <div className="rounded-2xl bg-slate-50 px-3 py-2 text-center ring-1 ring-slate-100">
            <p className="text-[11px] font-black text-slate-400">{label.quality}</p>
            <p className="text-lg font-black text-slate-950">
              {business.quality_score ?? '-'}
            </p>
          </div>

          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white transition group-hover:bg-amber-600">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export async function LocalizedCompaniesPage({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams?: SearchParams;
}) {
  const label = ui[locale];

  const q = searchParams?.q || '';
  const sector = searchParams?.sector || '';
  const city = searchParams?.city || '';
  const contact = searchParams?.contact || '';

  const [{ data: businesses }, { data: sectors }] = await Promise.all([
    supabase
      .from('businesses_public')
      .select('*')
      .order('quality_score', { ascending: false })
      .limit(1000),
    supabase
      .from('business_sectors')
      .select('*')
      .order('sector_name', { ascending: true }),
  ]);

  const all = (businesses || []) as BusinessRecord[];
  const sectorRows = (sectors || []) as SectorRecord[];

  const filtered = all
    .filter((business) => {
      const searchText = [
        business.company_name,
        business.sector,
        business.sector_name_ar,
        business.city,
        business.website,
      ].join(' ');

      return fieldMatches(searchText, q);
    })
    .filter((business) => !sector || business.sector === sector)
    .filter((business) => fieldMatches(business.city, city))
    .filter((business) => {
      if (!contact) return true;
      if (contact === 'phone') return Boolean(business.has_phone);
      if (contact === 'email') return Boolean(business.has_email);
      if (contact === 'website') return Boolean(business.has_website);
      return true;
    })
    .sort((a, b) => {
      const scoreDiff = Number(b.quality_score || 0) - Number(a.quality_score || 0);
      if (scoreDiff !== 0) return scoreDiff;

      return String(a.company_name || '').localeCompare(String(b.company_name || ''));
    });

  return (
    <section dir={label.dir} className="mx-auto max-w-7xl space-y-8 px-4 py-12">
      <div className="overflow-hidden rounded-[2.5rem] bg-[radial-gradient(circle_at_top_left,_#f59e0b,_transparent_35%),linear-gradient(135deg,#020617,#111827_45%,#0f766e)] p-8 text-white md:p-12">
        <Link
          href={`/${locale}/business`}
          className="text-sm font-bold text-amber-200 hover:text-white"
        >
          {label.back}
        </Link>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-amber-100 ring-1 ring-white/10">
          <Sparkles className="h-4 w-4" />
          {label.eyebrow}
        </div>

        <h1 className="mt-6 max-w-4xl text-4xl font-black md:text-6xl">
          {label.title}
        </h1>

        <p className="mt-4 max-w-3xl leading-8 text-slate-200">
          {label.description}
        </p>

        <p className="mt-6 text-sm font-bold text-slate-300">
          {label.showing} {filtered.length} {label.of} {all.length} {label.companies}
        </p>
      </div>

      <form className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-slate-950">
          <Filter className="h-5 w-5 text-amber-600" />
          <span className="font-black">{label.filters}</span>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder={label.search}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pe-4 ps-12 text-slate-950 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <select
            name="sector"
            defaultValue={sector}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          >
            <option value="">{label.allSectors}</option>
            {sectorRows.map((row) => (
              <option key={row.sector_id} value={row.sector_name}>
                {locale === 'ar'
                  ? row.sector_name_ar || row.sector_name
                  : row.sector_name}
              </option>
            ))}
          </select>

          <input
            name="city"
            defaultValue={city}
            placeholder={label.city}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          />

          <select
            name="contact"
            defaultValue={contact}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          >
            <option value="">{label.allContacts}</option>
            <option value="phone">{label.phoneOnly}</option>
            <option value="email">{label.emailOnly}</option>
            <option value="website">{label.websiteOnly}</option>
          </select>

          <button
            className="rounded-2xl bg-slate-950 px-5 py-3 font-black text-white transition hover:bg-amber-600 md:col-span-5"
            type="submit"
          >
            {label.apply}
          </button>
        </div>
      </form>

      <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 text-sm font-semibold leading-6 text-amber-900">
        <ShieldCheck className="mb-2 h-5 w-5" />
        {label.dataNote}
      </div>

      {!filtered.length ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
          {label.noResults}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((business) => (
            <CompanyRow
              key={business.company_id}
              business={business}
              locale={locale}
            />
          ))}
        </div>
      )}
    </section>
  );
}