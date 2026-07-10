import Link from 'next/link';
import { getUfProducts } from '@/lib/united-fruit';

function formatRange(min: number | null, max: number | null) {
  if (min === null && max === null) return 'To be entered';
  if (min !== null && max !== null) return `${min.toLocaleString()} – ${max.toLocaleString()} SDG`;
  return `${(min ?? max)?.toLocaleString()} SDG`;
}

export default async function EnglishPriceBoardPage() {
  const products = await getUfProducts();

  return (
    <main dir="ltr" className="bg-[#fbfdf8] px-4 py-12 text-[#173a2b]">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black text-amber-700">United Fruit Company</p>
            <h1 className="mt-2 text-4xl font-black text-[#173a2b]">Crop Price Board</h1>
          </div>
          <Link href="/en/marketplace" className="btn-primary bg-emerald-700 hover:bg-emerald-800">
            Open marketplace
          </Link>
        </div>

        <div className="mt-8 overflow-x-auto rounded-lg border border-emerald-100 bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-emerald-700 text-white">
              <tr>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Source average</th>
                <th className="px-5 py-4">Khartoum average</th>
                <th className="px-5 py-4">Source region</th>
                <th className="px-5 py-4">Last update</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.product_id} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-black text-[#173a2b]">{product.name_en}</td>
                  <td className="px-5 py-4 font-bold">{formatRange(product.source_price_min, product.source_price_max)}</td>
                  <td className="px-5 py-4 font-bold">{formatRange(product.khartoum_price_min, product.khartoum_price_max)}</td>
                  <td className="px-5 py-4 text-[#60736a]">{product.source_region}</td>
                  <td className="px-5 py-4 text-[#60736a]">
                    {product.last_updated ? new Date(product.last_updated).toLocaleDateString('en-US') : 'Unset'}
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
