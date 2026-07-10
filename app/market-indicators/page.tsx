import { MarketRefreshButton } from '@/components/market/market-refresh-button';
import { MarketTicker } from '@/components/market/market-ticker';
import { getMarketIndicators } from '@/lib/data';

export default async function MarketIndicatorsPage() {
  const indicators = await getMarketIndicators();

  return (
    <main dir="rtl" className="bg-[#fbfdf8] px-4 py-12">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="badge">مؤشرات السوق</p>
            <h1 className="mt-4 text-4xl font-black text-[#173a2b]">أسعار تساعد على القرار</h1>
            <p className="mt-3 max-w-2xl leading-7 text-[#60736a]">
              مؤشرات الصرف والسيولة وأسعار السلع تحفظ في قاعدة البيانات وتظهر للزائرين فور تحديثها.
            </p>
          </div>
          <MarketRefreshButton />
        </div>

        <MarketTicker indicators={indicators} />
      </section>
    </main>
  );
}
