import { PriceDashboard } from '@/components/marketplace/price-dashboard';
import { getUfProducts } from '@/lib/united-fruit';

export default async function PriceBoardPage() {
  const products = await getUfProducts();
  return <PriceDashboard products={products} locale="ar" />;
}
