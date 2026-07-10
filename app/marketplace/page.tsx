import { MarketplaceClient } from '@/components/marketplace/marketplace-client';
import { getUfProducts } from '@/lib/united-fruit';

export default async function MarketplacePage() {
  const products = await getUfProducts();
  return <MarketplaceClient products={products} locale="ar" />;
}
