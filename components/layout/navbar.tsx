'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { BrandLogo } from '@/components/layout/brand-logo';
import {
  SHOW_RESEARCHERS,
  SHOW_STUDENTS,
  SHOW_UNITED_FRUIT_MARKETPLACE,
} from '@/lib/features';

function removeLocalePrefix(pathname: string) {
  if (pathname.startsWith('/en')) return pathname.replace(/^\/en/, '') || '/';
  if (pathname.startsWith('/ar')) return pathname.replace(/^\/ar/, '') || '/';
  return pathname || '/';
}

function getLanguageHref(pathname: string, target: 'ar' | 'en') {
  const cleanPath = removeLocalePrefix(pathname);
  if (target === 'en') return cleanPath === '/' ? '/en' : `/en${cleanPath}`;
  return cleanPath === '/' ? '/' : `/ar${cleanPath}`;
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isEnglish = pathname.startsWith('/en');
  const isArabic = !isEnglish;
  const localePrefix = isEnglish ? '/en' : '/ar';
  const homeHref = isEnglish ? '/en' : '/';

  const navItems = [
    { href: homeHref, label: isEnglish ? 'Home' : 'الرئيسية', show: true },
    { href: `${localePrefix}/business`, label: isEnglish ? 'Business' : 'الأعمال', show: true },
    {
      href: `${localePrefix}/marketplace`,
      label: isEnglish ? 'Marketplace' : 'سوق يونايتد فروت',
      show: SHOW_UNITED_FRUIT_MARKETPLACE,
    },
    {
      href: `${localePrefix}/marketplace/prices`,
      label: isEnglish ? 'Prices' : 'الأسعار',
      show: SHOW_UNITED_FRUIT_MARKETPLACE,
    },
    { href: `${localePrefix}/students`, label: isEnglish ? 'Students' : 'للطلاب', show: SHOW_STUDENTS },
    { href: `${localePrefix}/research`, label: isEnglish ? 'Researchers' : 'للباحثين', show: SHOW_RESEARCHERS },
  ].filter((item) => item.show);

  const arabicHref = getLanguageHref(pathname, 'ar');
  const englishHref = getLanguageHref(pathname, 'en');

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href={homeHref} className="min-w-0" onClick={() => setOpen(false)}>
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50/70 p-1 text-sm font-bold lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== homeHref && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-4 py-2 transition ${
                  active ? 'bg-white text-emerald-800 shadow-sm' : 'text-[#426457] hover:bg-white/70 hover:text-emerald-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-lg border border-emerald-100 bg-white p-1 sm:flex">
            <Link
              href={arabicHref}
              className={`rounded-md px-3 py-2 text-sm font-black transition ${
                isArabic ? 'bg-[#f6b83f] text-[#173a2b]' : 'text-[#60736a] hover:bg-emerald-50'
              }`}
            >
              العربية
            </Link>
            <Link
              href={englishHref}
              className={`rounded-md px-3 py-2 text-sm font-black transition ${
                isEnglish ? 'bg-[#f6b83f] text-[#173a2b]' : 'text-[#60736a] hover:bg-emerald-50'
              }`}
            >
              English
            </Link>
          </div>

          <Link
            href="/login"
            className="hidden items-center gap-2 rounded-lg bg-[#f6b83f] px-4 py-2 text-sm font-black text-[#173a2b] shadow-sm transition hover:bg-amber-300 md:inline-flex"
          >
            <LogIn className="h-4 w-4" />
            {isEnglish ? 'Register' : 'تسجيل'}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-emerald-100 bg-white text-[#173a2b] shadow-sm lg:hidden"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-emerald-100 bg-white px-4 pb-4 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-black text-[#173a2b]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2">
            <Link href={arabicHref} onClick={() => setOpen(false)} className="rounded-lg bg-[#f6b83f] px-4 py-3 text-center text-sm font-black text-[#173a2b]">
              العربية
            </Link>
            <Link href={englishHref} onClick={() => setOpen(false)} className="rounded-lg bg-emerald-50 px-4 py-3 text-center text-sm font-black text-[#173a2b]">
              English
            </Link>
          </div>
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mx-auto mt-2 block max-w-7xl rounded-lg bg-[#f6b83f] px-4 py-3 text-center text-sm font-black text-[#173a2b]"
          >
            {isEnglish ? 'Register' : 'تسجيل'}
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;
