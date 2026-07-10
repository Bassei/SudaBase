import Link from 'next/link';
import { getUfProducts } from '@/lib/united-fruit';

function formatRange(min: number | null, max: number | null) {
  if (min === null && max === null) return 'يُدخل لاحقاً';
  if (min !== null && max !== null) return `${min.toLocaleString()} – ${max.toLocaleString()} SDG`;
  return `${(min ?? max)?.toLocaleString()} SDG`;
}

export default async function PriceBoardPage() {
  const products = await getUfProducts();

  return (
    <main dir="rtl" className="bg-[#f7f3ea] px-4 py-12 text-slate-950">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black text-amber-700">United Fruit Company</p>
            <h1 className="mt-2 text-4xl font-black text-emerald-950">لوحة أسعار المحاصيل</h1>
          </div>
          <Link href="/ar/marketplace" className="btn-primary bg-emerald-700 hover:bg-emerald-800">
            دخول السوق
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-emerald-900/10 bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-right">
            <thead className="bg-emerald-950 text-amber-50">
              <tr>
                <th className="px-5 py-4">المنتج</th>
                <th className="px-5 py-4">متوسط سعر المصدر</th>
                <th className="px-5 py-4">متوسط سعر الخرطوم</th>
                <th className="px-5 py-4">منطقة المصدر</th>
                <th className="px-5 py-4">آخر تحديث</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.product_id} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-black text-emerald-950">{product.name_ar}</td>
                  <td className="px-5 py-4 font-bold">{formatRange(product.source_price_min, product.source_price_max)}</td>
                  <td className="px-5 py-4 font-bold">{formatRange(product.khartoum_price_min, product.khartoum_price_max)}</td>
                  <td className="px-5 py-4 text-slate-600">{product.source_region}</td>
                  <td className="px-5 py-4 text-slate-600">
                    {product.last_updated ? new Date(product.last_updated).toLocaleDateString('ar') : 'غير محدد'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
