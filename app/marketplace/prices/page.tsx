import { PriceDashboard } from '@/components/marketplace/price-dashboard';
import { getMahsoolCropPrices } from '@/lib/mahsool-prices';

export default async function PriceBoardPage() {
  const prices = await getMahsoolCropPrices();
  return <PriceDashboard prices={prices} locale="ar" />;
}
