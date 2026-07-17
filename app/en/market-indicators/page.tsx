import { IndicatorDashboard } from '@/components/market/indicator-dashboard';
import { getMarketIndicators } from '@/lib/data';

export default async function EnglishMarketIndicatorsPage() {
  const indicators = await getMarketIndicators();
  return <IndicatorDashboard indicators={indicators} locale="en" />;
}
