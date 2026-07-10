'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SHOW_RESEARCHERS,
  SHOW_STUDENTS,
  SHOW_UNITED_FRUIT_MARKETPLACE,
} from '@/lib/features';

function removeLocalePrefix(pathname: string) {
  if (pathname.startsWith('/en')) {
    return pathname.replace(/^\/en/, '') || '/';
  }

  if (pathname.startsWith('/ar')) {
    return pathname.replace(/^\/ar/, '') || '/';
  }

  return pathname || '/';
}

function getLanguageHref(pathname: string, target: 'ar' | 'en') {
  const cleanPath = removeLocalePrefix(pathname);

  if (target === 'en') {
    return cleanPath === '/' ? '/en' : `/en${cleanPath}`;
  }

  return cleanPath === '/' ? '/' : `/ar${cleanPath}`;
}

export function Navbar() {
  const pathname = usePathname();

  const isEnglish = pathname.startsWith('/en');
  const isArabic = !isEnglish;

  const localePrefix = isEnglish ? '/en' : '/ar';

  const homeHref = isEnglish ? '/en' : '/';
  const studentsHref = `${localePrefix}/students`;
  const businessHref = `${localePrefix}/business`;
  const marketplaceHref = `${localePrefix}/marketplace`;
  const researchHref = `${localePrefix}/research`;

  const arabicHref = getLanguageHref(pathname, 'ar');
  const englishHref = getLanguageHref(pathname, 'en');

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#0a0a0a]/70 backdrop-blur-[12px] transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href={homeHref} className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            ◉
          </span>

          <span className="text-xl font-black underline">
            United Fruit Company
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
          <Link href={homeHref} className="hover:text-primary transition-colors">
            {isEnglish ? 'Home' : 'الرئيسية'}
          </Link>

          {SHOW_STUDENTS && (
            <Link href={studentsHref} className="hover:text-primary transition-colors">
              {isEnglish ? 'Students' : 'للطلاب'}
            </Link>
          )}

          <Link href={businessHref} className="hover:text-primary transition-colors">
            {isEnglish ? 'Business' : 'للأعمال'}
          </Link>

          {SHOW_UNITED_FRUIT_MARKETPLACE && (
            <Link href={marketplaceHref} className="hover:text-primary transition-colors">
              {isEnglish ? 'Marketplace' : 'سوق يونايتد فروت'}
            </Link>
          )}

          {SHOW_RESEARCHERS && (
            <Link href={researchHref} className="hover:text-primary transition-colors">
              {isEnglish ? 'Researchers' : 'للباحثين'}
            </Link>
          )}

        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={arabicHref}
            className={`rounded-full border border-zinc-800 px-4 py-2 text-sm font-bold transition-all hover:bg-zinc-800 hover:text-white ${
              isArabic ? 'bg-primary text-zinc-950 border-primary' : 'text-zinc-300'
            }`}
          >
            العربية
          </Link>

          <Link
            href={englishHref}
            className={`rounded-full border border-zinc-800 px-4 py-2 text-sm font-bold transition-all hover:bg-zinc-800 hover:text-white ${
              isEnglish ? 'bg-primary text-zinc-950 border-primary' : 'text-zinc-300'
            }`}
          >
            English
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
