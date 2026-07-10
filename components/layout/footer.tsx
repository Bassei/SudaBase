import Link from 'next/link';
import { BrandLogo } from '@/components/layout/brand-logo';

export function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-[#f3fbf5]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandLogo />
          <p className="mt-4 max-w-md text-sm leading-7 text-[#60736a]">
            منصة فاتحة وحديثة لتنظيم عروض المحاصيل، طلبات الشراء، وأسعار السلع الزراعية في السودان.
          </p>
        </div>

        <div className="text-sm">
          <p className="font-black text-[#173a2b]">البوابات</p>
          <Link href="/ar/business" className="mt-3 block font-bold text-[#60736a] hover:text-emerald-800">
            الأعمال
          </Link>
          <Link href="/ar/marketplace" className="mt-2 block font-bold text-[#60736a] hover:text-emerald-800">
            سوق يونايتد فروت
          </Link>
          <Link href="/ar/marketplace/prices" className="mt-2 block font-bold text-[#60736a] hover:text-emerald-800">
            لوحة الأسعار
          </Link>
        </div>

        <div className="text-sm">
          <p className="font-black text-[#173a2b]">ملاحظة الأسعار</p>
          <p className="mt-3 leading-7 text-[#60736a]">
            الأسعار إرشادية وقابلة للتحديث من لوحة الفريق حسب حركة السوق.
          </p>
        </div>
      </div>
    </footer>
  );
}
