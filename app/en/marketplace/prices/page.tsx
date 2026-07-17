import { PriceDashboard } from '@/components/marketplace/price-dashboard';
import { getUfProducts } from '@/lib/united-fruit';

export default async function EnglishPriceBoardPage() {
  const products = await getUfProducts();
  return <PriceDashboard products={products} locale="en" />;
}
