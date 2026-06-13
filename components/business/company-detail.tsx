import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

type Locale = 'ar' | 'en';

type BusinessRecord = {
  company_id: string;
  company_name: string | null;
  sector: string | null;
  sector_name_ar: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
  website: string | null;
  phones: string | null;
  emails: string | null;
  quality_score: number | null;
  source_url: string | null;
  source_domain: string | null;
  scraped_at: string | null;
};

const ui = {
  ar: {
    dir: 'rtl',
    notFound: 'لم يتم العثور على الشركة.',
    back: 'الرجوع للشركات',
    sector: 'القطاع',
    city: 'المدينة',
    country: 'الدولة',
    contacts: 'بيانات التواصل',
    phone: 'الهاتف',
    email: 'الإيميل',
    website: 'الموقع الإلكتروني',
    source: 'المصدر',
    quality: 'جودة البيانات',
    updated: 'آخر تحديث',
    noContacts: 'لا توجد بيانات تواصل مباشرة لهذا السجل.',
    unknownCity: 'مدينة غير محددة',
    unknownSector: 'غير مصنف',
  },
  en: {
    dir: 'ltr',
    notFound: 'Company not found.',
    back: 'Back to companies',
    sector: 'Sector',
    city: 'City',
    country: 'Country',
    contacts: 'Contact details',
    phone: 'Phone',
    email: 'Email',
    website: 'Website',
    source: 'Source',
    quality: 'Data quality',
    updated: 'Last updated',
    noContacts: 'No direct contact details are available for this record.',
    unknownCity: 'Unknown city',
    unknownSector: 'Unclassified',
  },
};

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

function sectorLabel(locale: Locale, business: BusinessRecord) {
  if (locale === 'ar') {
    return business.sector_name_ar || business.sector || ui[locale].unknownSector;
  }

  return business.sector || ui[locale].unknownSector;
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 break-words text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

export async function LocalizedCompanyDetailPage({
  locale,
  id,
}: {
  locale: Locale;
  id: string;
}) {
  const label = ui[locale];

  const { data } = await supabase
    .from('businesses_public')
    .select('*')
    .eq('company_id', id)
    .single();

  const business = data as BusinessRecord | null;

  if (!business) {
    return (
      <main dir={label.dir} className="mx-auto max-w-4xl px-4 py-16">
        <Link
          href={`/${locale}/business/companies`}
          className="font-bold text-amber-700 underline"
        >
          {label.back}
        </Link>

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          {label.notFound}
        </div>
      </main>
    );
  }

  const phones = splitList(business.phones);
  const emails = splitList(business.emails);
  const name = business.company_name || 'Unknown business';

  return (
    <main dir={label.dir} className="mx-auto max-w-6xl space-y-8 px-4 py-12">
      <Link
        href={`/${locale}/business/companies`}
        className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-800 ring-1 ring-amber-200"
      >
        <ArrowLeft className="h-4 w-4" />
        {label.back}
      </Link>

      <section className="overflow-hidden rounded-[2.5rem] bg-[radial-gradient(circle_at_top_left,_#f59e0b,_transparent_35%),linear-gradient(135deg,#020617,#111827_50%,#064e3b)] p-8 text-white md:p-12">
        <div className="flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-white/10 text-3xl font-black ring-1 ring-white/10">
          {initials(name)}
        </div>

        <h1 className="mt-8 max-w-4xl break-words text-4xl font-black md:text-6xl">
          {name}
        </h1>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-black text-slate-950">
            <BriefcaseBusiness className="h-4 w-4" />
            {sectorLabel(locale, business)}
          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white ring-1 ring-white/10">
            <MapPin className="h-4 w-4" />
            {business.city || label.unknownCity}
          </span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <InfoBox label={label.sector} value={sectorLabel(locale, business)} />
        <InfoBox label={label.city} value={business.city || label.unknownCity} />
        <InfoBox label={label.quality} value={String(business.quality_score ?? '-')} />
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Building2 className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-950">{label.contacts}</h2>
        </div>

        {!phones.length && !emails.length && !business.website ? (
          <p className="text-slate-600">{label.noContacts}</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {phones.map((phone) => (
              <div
                key={phone}
                dir="ltr"
                className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 font-bold text-slate-800 ring-1 ring-slate-100"
              >
                <Phone className="h-5 w-5 text-emerald-600" />
                {phone}
              </div>
            ))}

            {emails.map((email) => (
              <div
                key={email}
                dir="ltr"
                className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 font-bold text-slate-800 ring-1 ring-slate-100"
              >
                <Mail className="h-5 w-5 text-emerald-600" />
                {email}
              </div>
            ))}

            {business.website && (
              <a
                href={business.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-slate-950 p-4 font-black text-white transition hover:bg-amber-600"
              >
                <Globe2 className="h-5 w-5" />
                {label.website}
              </a>
            )}

            {business.source_url && (
              <a
                href={business.source_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 font-black text-slate-950 transition hover:bg-slate-50"
              >
                <ExternalLink className="h-5 w-5" />
                {label.source}
              </a>
            )}
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 text-sm font-bold text-slate-600">
        {business.source_domain && <span>{business.source_domain}</span>}
        {business.scraped_at && <span> · {label.updated}: {business.scraped_at}</span>}
      </section>
    </main>
  );
}