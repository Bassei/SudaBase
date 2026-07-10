export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f6b83f] shadow-sm ring-1 ring-amber-200">
        <svg viewBox="0 0 48 48" aria-hidden="true" className="h-9 w-9">
          <path
            d="M11 30c0-9.4 7.6-17 17-17h9v9c0 9.4-7.6 17-17 17h-9z"
            fill="#1f8a4c"
          />
          <path
            d="M14 34c5.5-7.8 12-12.8 20-16"
            fill="none"
            stroke="#fbfdf8"
            strokeLinecap="round"
            strokeWidth="3.4"
          />
          <circle cx="16" cy="17" r="5" fill="#ef7b45" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-base font-black text-[#173a2b] sm:text-lg">
            United Fruit Company
          </span>
          <span className="block text-xs font-bold text-emerald-700">
            Sudan agri-market
          </span>
        </span>
      )}
    </span>
  );
}
