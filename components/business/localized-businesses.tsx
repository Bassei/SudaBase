import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import {
  BriefcaseBusiness,
  Building2,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Globe2,
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
  sector_raw: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
  website: string | null;
  social_links: string | null;
  phones: string | null;
  emails: string | null;
  sudan_relevance_score: number | null;
  quality_score: number | null;
  source_url: string | null;
  source_domain: string | null;
  scraped_at: string | null;
  has_phone: boolean | null;
  has_email: boolean | null;
  has_social: boolean | null;
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
    description:
      'استكشف الشركات والقطاعات وجهات التواصل المتاحة من مصادر عامة بعد تنظيف البيانات ومراجعتها.',
    back: 'الرجوع للرئيسية',
    search: 'ابحث باسم الشركة أو القطاع أو المدينة',
    sector: 'القطاع',
    city: 'المدينة',
    contact: 'التواصل',
    allSectors: 'كل القطاعات',
    allContacts: 'كل أنواع التواصل',
    phoneOnly: 'لديها هاتف',
    emailOnly: 'لديها إيميل',
    websiteOnly: 'لديها موقع',
    apply: 'تطبيق الفلاتر',
    showing: 'يتم عرض',
    of: 'من أصل',
    companies: 'شركة',
    phone: 'هاتف',
    email: 'إيميل',
    website: 'الموقع',
    source: 'المصدر',
    noResults: 'لا توجد شركات مطابقة للفلاتر الحالية.',
    unknownCity: 'مدينة غير محددة',
    unknownSector: 'غير مصنف',
    quality: 'جودة البيانات',
    dataNote:
      'هذه البيانات إرشادية ومجمعة من مصادر عامة. قد تحتاج بعض وسائل التواصل إلى تحقق إضافي.',
    statsCompanies: 'الشركات',
    statsContacts: 'وسائل التواصل',
    statsSectors: 'القطاعات',
    statsWithPhone: 'لديها هاتف',
    statsWithEmail: 'لديها إيميل',
    statsWithWebsite: 'لديها موقع',
  },
  en: {
    dir: 'ltr',
    title: 'Sudanese Business Directory',
    description:
      'Explore companies, sectors, and available contact details collected from cleaned public sources.',
    back: 'Back to home',
    search: 'Search by company, sector, or city',
    sector: 'Sector',
    city: 'City',
    contact: 'Contact',
    allSectors: 'All sectors',
    allContacts: 'All contact types',
    phoneOnly: 'Has phone',
    emailOnly: 'Has email',
    websiteOnly: 'Has website',
    apply: 'Apply filters',
    showing: 'Showing',
    of: 'of',
    companies: 'companies',
    phone: 'Phone',
    email: 'Email',
    website: 'Website',
    source: 'Source',
    noResults: 'No companies match the current filters.',
    unknownCity: 'Unknown city',
    unknownSector: 'Unclassified',
    quality: 'Data quality',
    dataNote:
      'This data is indicative and collected from public sources. Some contacts may require additional verification.',
    statsCompanies: 'Companies',
    statsContacts: 'Contacts',
    statsSectors: 'Sectors',
    statsWithPhone: 'With phone',
    statsWithEmail: 'With email',
    statsWithWebsite: 'With website',
  },
};

function normalize(value: string | null | undefined) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
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

function shortText(value: string | null | undefined, max = 180) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function splitList(value: string | null | undefined) {
  return String(value || '')
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);
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

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function BusinessCard({
  business,
  locale,
}: {
  business: BusinessRecord;
  locale: Locale;
}) {
  const label = ui[locale];
  const phones = splitList(business.phones);
  const emails = splitList(business.emails);
  const name = business.company_name || 'Unknown business';

  return (
    <article
      dir={label.dir}
      className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-slate-950" />

      <div className="p-6">
        <header className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white shadow-sm">
            {initials(name)}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-2 break-words text-xl font-black leading-snug text-slate-950 md:text-2xl">
              {name}
            </h2>

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 font-bold text-emerald-700 ring-1 ring-emerald-200">
                <BriefcaseBusiness className="h-4 w-4" />
                {sectorLabel(locale, business)}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 font-semibold text-slate-700 ring-1 ring-slate-200">
                <MapPin className="h-4 w-4 text-slate-500" />
                {business.city || label.unknownCity}
              </span>
            </div>
          </div>
        </header>

        {business.description && (
          <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
            {shortText(business.description)}
          </p>
        )}

        <div className="mt-5 grid gap-2">
          {phones.slice(0, 2).map((phone) => (
            <div
              key={phone}
              className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-100"
              dir="ltr"
            >
              <Phone className="h-4 w-4 text-emerald-600" />
              <span className="truncate">{phone}</span>
            </div>
          ))}

          {emails.slice(0, 2).map((email) => (
            <div
              key={email}
              className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-100"
              dir="ltr"
            >
              <Mail className="h-4 w-4 text-emerald-600" />
              <span className="truncate">{email}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700"
            >
              <Globe2 className="h-4 w-4" />
              {label.website}
            </a>
          )}

          {business.source_url && (
            <a
              href={business.source_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-900 transition hover:bg-slate-50"
            >
              {label.source}
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        <footer className="mt-5 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
          <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-100">
            {label.quality}: {business.quality_score ?? '-'}
          </span>

          {business.source_domain && (
            <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-100">
              {business.source_domain}
            </span>
          )}
        </footer>
      </div>
    </article>
  );
}

export async function LocalizedBusinessPage({
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
        business.description,
        business.phones,
        business.emails,
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
    })
    .slice(0, 60);

  const stats = {
    companies: all.length,
    sectors: sectorRows.length,
    contacts:
      all.filter((business) => business.has_phone).length +
      all.filter((business) => business.has_email).length +
      all.filter((business) => business.has_social).length,
    withPhone: all.filter((business) => business.has_phone).length,
    withEmail: all.filter((business) => business.has_email).length,
    withWebsite: all.filter((business) => business.has_website).length,
  };

  return (
    <section dir={label.dir} className="mx-auto max-w-7xl space-y-8 px-4 py-12">
      <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 to-emerald-950 p-8 text-white">
        <Link
          href={`/${locale}`}
          className="text-sm font-bold text-emerald-200 hover:text-white"
        >
          {label.back}
        </Link>

        <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
          <Building2 className="h-8 w-8 text-emerald-300" />
        </div>

        <h1 className="mt-6 text-4xl font-black md:text-6xl">{label.title}</h1>

        <p className="mt-3 max-w-3xl leading-7 text-slate-200">
          {label.description}
        </p>

        <p className="mt-4 text-sm text-slate-300">
          {label.showing} {filtered.length} {label.of} {all.length} {label.companies}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label={label.statsCompanies} value={stats.companies} />
        <StatCard label={label.statsSectors} value={stats.sectors} />
        <StatCard label={label.statsContacts} value={stats.contacts} />
        <StatCard label={label.statsWithPhone} value={stats.withPhone} />
        <StatCard label={label.statsWithEmail} value={stats.withEmail} />
        <StatCard label={label.statsWithWebsite} value={stats.withWebsite} />
      </div>

      <form className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-5">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder={label.search}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pe-4 ps-12 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <select
            name="sector"
            defaultValue={sector}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
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
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />

          <select
            name="contact"
            defaultValue={contact}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="">{label.allContacts}</option>
            <option value="phone">{label.phoneOnly}</option>
            <option value="email">{label.emailOnly}</option>
            <option value="website">{label.websiteOnly}</option>
          </select>

          <button
            className="rounded-2xl bg-slate-950 px-5 py-3 font-black text-white transition hover:bg-emerald-700 md:col-span-5"
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
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((business) => (
            <BusinessCard
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