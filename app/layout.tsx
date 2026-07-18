import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const tajawal = Tajawal({ 
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700', '800'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'حصاد | HASAD — سوق المحاصيل السودانية',
  description: 'سوق متخصص لعرض وطلب المحاصيل السودانية ومتابعة الأسعار والتنسيق بين المزارعين والمشترين',
  openGraph: {
    title: 'حصاد | HASAD — سوق المحاصيل السودانية',
    description: 'اعرض محصولك، اطلب الكمية التي تحتاجها، وتابع أسعار السوق السوداني.',
    siteName: 'حصاد | HASAD'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} font-sans`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
