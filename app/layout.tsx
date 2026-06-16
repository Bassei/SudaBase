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
  title: 'SudaBase',
  description: 'Sudan Education & Economic Data Platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${tajawal.variable} font-sans`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

