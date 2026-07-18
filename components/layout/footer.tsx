'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import { BrandLogo } from '@/components/layout/brand-logo';

export function Footer() {
  const pathname = usePathname();
  const en = pathname.startsWith('/en');
  const prefix = en ? '/en' : '/ar';
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const groups = en ? [
    { title: 'Crop market', links: [['Browse the market', `${prefix}/marketplace`], ['Crop prices', `${prefix}/marketplace/prices`], ['Offers & requests', `${prefix}/marketplace?portal=status`]] },
    { title: 'Start trading', links: [['List crop supply', `${prefix}/marketplace?portal=farmer`], ['Request a crop', `${prefix}/marketplace?portal=buyer`], ['Sign in', '/login']] },
  ] : [
    { title: 'سوق المحاصيل', links: [['استكشف السوق', `${prefix}/marketplace`], ['أسعار المحاصيل', `${prefix}/marketplace/prices`], ['العروض والطلبات', `${prefix}/marketplace?portal=status`]] },
    { title: 'ابدأ التعامل', links: [['اعرض محصولك', `${prefix}/marketplace?portal=farmer`], ['اطلب محصولاً', `${prefix}/marketplace?portal=buyer`], ['تسجيل الدخول', '/login']] },
  ];

  return (
    <footer dir={en ? 'ltr' : 'rtl'} className="border-t border-emerald-950/10 bg-[#0c2f23] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div><div className="inline-block rounded-2xl bg-white p-3"><BrandLogo locale={en ? 'en' : 'ar'} /></div><p className="mt-5 max-w-md text-sm leading-7 text-emerald-50/65">{en ? 'A focused marketplace for Sudanese crops, connecting farmer supply with verified buyer demand.' : 'سوق متخصص في المحاصيل السودانية يربط عروض المزارعين بطلبات المشترين عبر مسار واضح وآمن.'}</p></div>
        {groups.map((group) => <div key={group.title}><p className="font-black text-emerald-200">{group.title}</p><div className="mt-4 space-y-3">{group.links.map(([label, href]) => <Link key={href} href={href} className="flex items-center justify-between gap-3 text-sm font-bold text-white/75 transition hover:text-white"><span>{label}</span><Arrow className="h-4 w-4 text-amber-300" /></Link>)}</div></div>)}
      </div>
      <div className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-emerald-50/50 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} United Fruit Company</p><p>{en ? 'Market prices are indicative and subject to update.' : 'أسعار السوق استرشادية وقابلة للتحديث.'}</p></div></div>
    </footer>
  );
}
