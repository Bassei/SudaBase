export function BrandLogo({ compact = false, locale = 'ar' }: { compact?: boolean; locale?: 'ar' | 'en' }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#183f2d] shadow-sm ring-1 ring-white/10">
        <svg viewBox="0 0 56 56" aria-hidden="true" className="h-10 w-10">
          <path d="M28 47C28 34 28 20 28 8" fill="none" stroke="#f5c451" strokeLinecap="round" strokeWidth="2.5" />
          <path d="M27.5 35C20 34 15 38 13 45c7 0 12-3 15-8" fill="#5fad62" />
          <path d="M28.5 30c7-1 11 2 14 8-6 0-11-2-14-6" fill="#77bd69" />
          <g fill="#f5c451" stroke="#fff4c7" strokeWidth=".55">
            <ellipse cx="23" cy="13" rx="3.3" ry="5.4" transform="rotate(-38 23 13)" />
            <ellipse cx="33" cy="16" rx="3.3" ry="5.4" transform="rotate(38 33 16)" />
            <ellipse cx="22" cy="21" rx="3.5" ry="5.7" transform="rotate(-42 22 21)" />
            <ellipse cx="34" cy="24" rx="3.5" ry="5.7" transform="rotate(42 34 24)" />
            <ellipse cx="22" cy="29" rx="3.3" ry="5.4" transform="rotate(-46 22 29)" />
            <ellipse cx="33" cy="32" rx="3.3" ry="5.4" transform="rotate(46 33 32)" />
            <ellipse cx="28" cy="8" rx="3.2" ry="5" />
          </g>
        </svg>
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-xl font-black text-[#173a2b] sm:text-2xl">حصاد</span>
          <span className="block text-[11px] font-bold text-emerald-700">
            {locale === 'ar' ? 'بوابة المحاصيل السودانية' : 'Sudan crop marketplace'}
          </span>
        </span>
      )}
    </span>
  );
}
