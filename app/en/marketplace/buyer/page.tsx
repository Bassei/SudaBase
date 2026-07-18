import { MarketplaceClient } from '@/components/marketplace/marketplace-client';
import { getUfProducts } from '@/lib/united-fruit';

export default async function EnglishBuyerPortalPage() {
  const products = await getUfProducts();
  return <MarketplaceClient products={products} locale="en" initialPortal="buyer" showPortalNav={false} />;
}
