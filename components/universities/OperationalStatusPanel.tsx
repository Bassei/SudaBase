import {
  Activity,
  Wifi,
  MapPin,
  CalendarCheck,
  ShieldCheck,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';

export type Locale = 'ar' | 'en';

export type OperationalStatusData = {
  operational_status?: string | null;
  study_mode?: string | null;
  operational_stability?: string | null;
  current_operating_location?: string | null;
  status_last_verified?: string | null;
  status_source_type?: string | null;
  status_source_url?: string | null;
  status_confidence?: string | null;
  status_evidence_summary?: string | null;
  status_notes?: string | null;
};

const copy = {
  ar: {
    title: 'حالة التشغيل',
    status: 'الحالة',
    studyMode: 'الدراسة',
    stability: 'الاستقرار',
    currentLocation: 'الموقع',
    lastVerified: 'آخر تحقق',
    source: 'المصدر',
    viewSource: 'المصدر',
    notSpecified: 'غير محدد',
    underReview: 'قيد التحقق',
    active: 'تعمل',
    partiallyActive: 'تعمل جزئياً',
    suspended: 'متوقفة',
    inactive: 'غير نشطة',
    online: 'أونلاين',
    inPerson: 'حضوري',
    hybrid: 'هجين',
    remote: 'عن بعد',
    stopped: 'متوقف',
    stable: 'مستقرة',
    moderate: 'متوسطة',
    unstable: 'غير مستقرة',
    high: 'ثقة عالية',
    medium: 'ثقة متوسطة',
    low: 'ثقة منخفضة',
    officialWebsite: 'الموقع الرسمي',
    officialFacebook: 'فيسبوك رسمي',
    officialTelegram: 'تيليجرام رسمي',
    ministry: 'بيان رسمي',
    unknown: 'غير معروف',
    needsReview: 'تحتاج مراجعة'
  },
  en: {
    title: 'Operating status',
    status: 'Status',
    studyMode: 'Study',
    stability: 'Stability',
    currentLocation: 'Location',
    lastVerified: 'Checked',
    source: 'Source',
    viewSource: 'Source',
    notSpecified: 'Not specified',
    underReview: 'Under review',
    active: 'Active',
    partiallyActive: 'Partially active',
    suspended: 'Suspended',
    inactive: 'Inactive',
    online: 'Online',
    inPerson: 'In-person',
    hybrid: 'Hybrid',
    remote: 'Remote',
    stopped: 'Suspended',
    stable: 'Stable',
    moderate: 'Moderate',
    unstable: 'Unstable',
    high: 'High confidence',
    medium: 'Medium confidence',
    low: 'Low confidence',
    officialWebsite: 'Official website',
    officialFacebook: 'Official Facebook',
    officialTelegram: 'Official Telegram',
    ministry: 'Ministry statement',
    unknown: 'Unknown',
    needsReview: 'Needs review'
  },
};

function statusLabel(status: string | null | undefined, locale: Locale) {
  const t = copy[locale];

  switch (status) {
    case 'Active':
      return t.active;
    case 'Partially Active':
      return t.partiallyActive;
    case 'Suspended':
      return t.suspended;
    case 'Inactive':
      return t.inactive;
    default:
      return t.underReview;
  }
}

function modeLabel(mode: string | null | undefined, locale: Locale) {
  const t = copy[locale];

  switch (mode) {
    case 'In-person':
      return t.inPerson;
    case 'Online':
      return t.online;
    case 'Hybrid':
      return t.hybrid;
    case 'Remote':
      return t.remote;
    case 'Suspended':
      return t.stopped;
    default:
      return t.notSpecified;
  }
}

function stabilityLabel(stability: string | null | undefined, locale: Locale) {
  const t = copy[locale];

  switch (stability) {
    case 'Stable':
      return t.stable;
    case 'Moderate':
      return t.moderate;
    case 'Unstable':
      return t.unstable;
    default:
      return locale === 'ar' ? 'قيد المراجعة' : 'Under review';
  }
}

function confidenceLabel(confidence: string | null | undefined, locale: Locale) {
  const t = copy[locale];

  switch (confidence) {
    case 'High':
      return t.high;
    case 'Medium':
      return t.medium;
    default:
      return t.low;
  }
}

function sourceLabel(source: string | null | undefined, locale: Locale) {
  const t = copy[locale];

  if (!source || source === 'Unknown') return t.unknown;
  if (locale === 'en') return source;

  switch (source) {
    case 'Official Website':
      return t.officialWebsite;
    case 'Official Facebook Page':
      return t.officialFacebook;
    case 'Official Telegram Channel':
      return t.officialTelegram;
    case 'Ministry Statement':
      return t.ministry;
    default:
      return source;
  }
}

function statusClass(status?: string | null) {
  switch (status) {
    case 'Active':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case 'Partially Active':
      return 'border-amber-200 bg-amber-50 text-amber-700';
    case 'Suspended':
    case 'Inactive':
      return 'border-red-200 bg-red-50 text-red-700';
    default:
      return 'border-slate-200 bg-slate-50 text-slate-600';
  }
}

function confidenceClass(confidence?: string | null) {
  switch (confidence) {
    case 'High':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case 'Medium':
      return 'border-amber-200 bg-amber-50 text-amber-700';
    default:
      return 'border-slate-200 bg-white text-slate-600';
  }
}

function formatDate(date: string | null | undefined, locale: Locale) {
  if (!date) return copy[locale].notSpecified;

  try {
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function DetailPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">
      <span className="shrink-0 text-slate-400">{icon}</span>
      <span className="text-slate-500">{label}:</span>
      <span className="truncate text-slate-950">{value}</span>
    </span>
  );
}

export default function OperationalStatusPanel({
  data,
  locale = 'ar',
  variant = 'compact',
}: {
  data: OperationalStatusData;
  locale?: Locale;
  variant?: 'compact' | 'full';
}) {
  const t = copy[locale];

  const status = data.operational_status || 'Unknown';
  const mode = data.study_mode || 'Unknown';
  const stability = data.operational_stability || 'Unknown';
  const confidence = data.status_confidence || 'Low';
  const isUnknown = status === 'Unknown';

  return (
    <section className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-700 ring-1 ring-slate-200">
            <Activity size={18} />
          </span>

          <div>
            <p className="text-sm font-black text-slate-950">{t.title}</p>
            <p className="text-xs text-slate-500">
              {formatDate(data.status_last_verified, locale)}
            </p>
          </div>
        </div>

        <span className={`rounded-full border px-3 py-1.5 text-xs font-black ${statusClass(status)}`}>
          {statusLabel(status, locale)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <DetailPill
          icon={<Wifi size={13} />}
          label={t.studyMode}
          value={modeLabel(mode, locale)}
        />

        <DetailPill
          icon={<ShieldCheck size={13} />}
          label={t.stability}
          value={stabilityLabel(stability, locale)}
        />

        <DetailPill
          icon={<MapPin size={13} />}
          label={t.currentLocation}
          value={data.current_operating_location || t.notSpecified}
        />

        <DetailPill
          icon={<CalendarCheck size={13} />}
          label={t.lastVerified}
          value={formatDate(data.status_last_verified, locale)}
        />

        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black ${confidenceClass(confidence)}`}>
          <ShieldCheck size={13} />
          {confidenceLabel(confidence, locale)}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">
          {t.source}: <strong className="text-slate-950">{sourceLabel(data.status_source_type, locale)}</strong>
        </span>

        {data.status_source_url && (
          <a
            href={data.status_source_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-black text-emerald-700 hover:bg-emerald-50"
          >
            {t.viewSource}
            <ExternalLink size={13} />
          </a>
        )}

        {isUnknown && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700">
            <AlertTriangle size={13} />
            {t.needsReview}
          </span>
        )}
      </div>
    </section>
  );
}