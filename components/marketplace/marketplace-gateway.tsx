import Link from 'next/link';
import { ArrowLeft, ArrowRight, ClipboardCheck, Sprout, Store } from 'lucide-react';

export function MarketplaceGateway({ locale }: { locale: 'ar' | 'en' }) {
  const ar = locale === 'ar';
  const Arrow = ar ? ArrowLeft : ArrowRight;
  const prefix = ar ? '/ar' : '/en';
  const portals = [
    { href: `${prefix}/marketplace/farmer`, icon: Sprout, title: ar ? 'بوابة المزارع' : 'Farmer portal', text: ar ? 'تسجيل بيانات المنتج وإدارة عروض المحاصيل.' : 'Register producer information and manage crop listings.', color: 'bg-emerald-100 text-emerald-800' },
    { href: `${prefix}/marketplace/buyer`, icon: Store, title: ar ? 'بوابة المشتري' : 'Buyer portal', text: ar ? 'تسجيل بيانات المشتري وإدارة طلبات الشراء.' : 'Register buyer information and manage purchase requests.', color: 'bg-amber-100 text-amber-800' },
    { href: `${prefix}/marketplace/status`, icon: ClipboardCheck, title: ar ? 'بوابة المتابعة' : 'Tracking portal', text: ar ? 'متابعة حالة العروض والطلبات المسجلة.' : 'Track the status of registered listings and requests.', color: 'bg-sky-100 text-sky-800' },
  ];
  return <main dir={ar ? 'rtl' : 'ltr'} className="min-h-[70vh] bg-[#f7f5ee]"><section className="mx-auto max-w-7xl px-4 py-16"><p className="text-sm font-black text-[#9a6b12]">{ar ? 'حصاد | HASAD' : 'HASAD | حصاد'}</p><h1 className="mt-3 text-4xl font-black sm:text-6xl">{ar ? 'بوابات السوق الزراعي' : 'Agricultural Market Portals'}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[#66766e]">{ar ? 'خدمات متخصصة لإدارة عروض المحاصيل وطلبات الشراء ومتابعة المعاملات.' : 'Dedicated services for managing crop listings, purchase requests, and transaction status.'}</p><div className="mt-10 grid gap-5 md:grid-cols-3">{portals.map(({ href, icon: Icon, title, text, color }) => <Link key={href} href={href} className="group flex min-h-72 flex-col rounded-[2rem] border border-black/[.07] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}><Icon className="h-7 w-7" /></div><h2 className="mt-8 text-2xl font-black">{title}</h2><p className="mt-3 flex-1 leading-7 text-[#66766e]">{text}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#8f6517]">{ar ? 'فتح البوابة' : 'Open portal'}<Arrow className="h-4 w-4" /></span></Link>)}</div></section></main>;
}
