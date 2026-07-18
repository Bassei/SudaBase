import { PriceDashboard } from '@/components/marketplace/price-dashboard';
import { getMahsoolCropPrices } from '@/lib/mahsool-prices';

export default async function EnglishPriceBoardPage() {
  const prices = await getMahsoolCropPrices();
  return <PriceDashboard prices={prices} locale="en" />;
}
