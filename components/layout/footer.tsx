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
    { title: 'Agricultural market', links: [['Farmer & buyer portal', `${prefix}/marketplace`], ['Crop prices', `${prefix}/marketplace/prices`], ['Market indicators', `${prefix}/market-indicators`]] },
    { title: 'Intelligence', links: [['Business portal', `${prefix}/business`], ['Company directory', `${prefix}/business/companies`], ['Universities', `${prefix}/universities`]] },
  ] : [
    { title: 'السوق الزراعي', links: [['بوابة المزارع والمشتري', `${prefix}/marketplace`], ['أسعار المحاصيل', `${prefix}/marketplace/prices`], ['مؤشرات السوق', `${prefix}/market-indicators`]] },
    { title: 'الذكاء والمعرفة', links: [['بوابة الأعمال', `${prefix}/business`], ['دليل الشركات', `${prefix}/business/companies`], ['الجامعات', `${prefix}/universities`]] },
  ];

  return (
    <footer dir={en ? 'ltr' : 'rtl'} className="border-t border-emerald-950/10 bg-[#0c2f23] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div><div className="inline-block rounded-2xl bg-white p-3"><BrandLogo /></div><p className="mt-5 max-w-md text-sm leading-7 text-emerald-50/65">{en ? 'A structured gateway to Sudanese agricultural trade, market intelligence, business data, and university knowledge.' : 'بوابة منظمة للتجارة الزراعية السودانية، معلومات السوق، بيانات الأعمال، والمعرفة الجامعية.'}</p></div>
        {groups.map((group) => <div key={group.title}><p className="font-black text-emerald-200">{group.title}</p><div className="mt-4 space-y-3">{group.links.map(([label, href]) => <Link key={href} href={href} className="flex items-center justify-between gap-3 text-sm font-bold text-white/75 transition hover:text-white"><span>{label}</span><Arrow className="h-4 w-4 text-amber-300" /></Link>)}</div></div>)}
      </div>
      <div className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-emerald-50/50 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} United Fruit Company</p><p>{en ? 'Market prices are indicative and subject to update.' : 'أسعار السوق استرشادية وقابلة للتحديث.'}</p></div></div>
    </footer>
  );
}
