import { MarketplaceClient } from '@/components/marketplace/marketplace-client';
import { getUfProducts } from '@/lib/united-fruit';

export default async function ArabicFarmerPortalPage() {
  const products = await getUfProducts();
  return <MarketplaceClient products={products} locale="ar" initialPortal="farmer" showPortalNav={false} />;
}
