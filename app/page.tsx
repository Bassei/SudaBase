import { PortalHome } from '@/components/home/portal-home';
import { getMarketIndicators, getStats } from '@/lib/data';

export default async function HomePage() {
  const [stats, indicators] = await Promise.all([getStats(), getMarketIndicators()]);
  return <PortalHome locale="ar" stats={stats} indicators={indicators} />;
}
