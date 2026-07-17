'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, BriefcaseBusiness, GraduationCap, Grid2X2, Handshake, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { BrandLogo } from '@/components/layout/brand-logo';
import { SHOW_UNITED_FRUIT_MARKETPLACE } from '@/lib/features';

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
  const prefix = isEnglish ? '/en' : '/ar';
  const homeHref = isEnglish ? '/en' : '/';

  const navItems = [
    { href: homeHref, label: isEnglish ? 'Portals' : 'البوابات', icon: Grid2X2 },
    { href: `${prefix}/marketplace`, label: isEnglish ? 'Market' : 'السوق الزراعي', icon: Handshake, show: SHOW_UNITED_FRUIT_MARKETPLACE },
    { href: `${prefix}/marketplace/prices`, label: isEnglish ? 'Prices & indicators' : 'الأسعار والمؤشرات', icon: BarChart3, show: SHOW_UNITED_FRUIT_MARKETPLACE },
    { href: `${prefix}/business`, label: isEnglish ? 'Business' : 'الأعمال', icon: BriefcaseBusiness },
    { href: `${prefix}/universities`, label: isEnglish ? 'Knowledge' : 'المعرفة', icon: GraduationCap },
  ].filter((item) => item.show !== false);

  return (
    <header dir={isEnglish ? 'ltr' : 'rtl'} className="sticky top-0 z-50 border-b border-emerald-950/10 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href={homeHref} className="min-w-0" onClick={() => setOpen(false)}><BrandLogo /></Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== homeHref && pathname.startsWith(href));
            return <Link key={href} href={href} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-black transition ${active ? 'bg-[#173a2b] text-white shadow-sm' : 'text-[#426457] hover:bg-[#eef5f0] hover:text-emerald-800'}`}><Icon className="h-4 w-4" />{label}</Link>;
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden rounded-xl border border-emerald-950/10 bg-[#f4f7f5] p-1 sm:flex">
            <Link href={getLanguageHref(pathname, 'ar')} className={`rounded-lg px-3 py-2 text-xs font-black ${!isEnglish ? 'bg-white text-[#173a2b] shadow-sm' : 'text-[#60736a]'}`}>عربي</Link>
            <Link href={getLanguageHref(pathname, 'en')} className={`rounded-lg px-3 py-2 text-xs font-black ${isEnglish ? 'bg-white text-[#173a2b] shadow-sm' : 'text-[#60736a]'}`}>EN</Link>
          </div>
          <Link href="/login" className="hidden items-center gap-2 rounded-xl bg-[#f6b83f] px-4 py-2.5 text-sm font-black text-[#173a2b] transition hover:bg-amber-300 md:inline-flex"><LogIn className="h-4 w-4" />{isEnglish ? 'Sign in' : 'دخول'}</Link>
          <button type="button" onClick={() => setOpen((value) => !value)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-950/10 bg-white text-[#173a2b] lg:hidden" aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>

      {open && (
        <div className="border-t border-emerald-950/10 bg-white px-4 pb-4 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2 py-4 sm:grid-cols-2">
            {navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-2xl bg-[#f4f7f5] px-4 py-3.5 text-sm font-black text-[#173a2b]"><Icon className="h-5 w-5 text-emerald-700" />{label}</Link>)}
          </nav>
          <div className="mx-auto grid max-w-7xl grid-cols-3 gap-2"><Link href={getLanguageHref(pathname, 'ar')} onClick={() => setOpen(false)} className="rounded-xl bg-emerald-50 px-3 py-3 text-center text-sm font-black">العربية</Link><Link href={getLanguageHref(pathname, 'en')} onClick={() => setOpen(false)} className="rounded-xl bg-emerald-50 px-3 py-3 text-center text-sm font-black">English</Link><Link href="/login" onClick={() => setOpen(false)} className="rounded-xl bg-[#f6b83f] px-3 py-3 text-center text-sm font-black">{isEnglish ? 'Sign in' : 'دخول'}</Link></div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
