import { PortalHome } from '@/components/home/portal-home';
import { getMarketIndicators, getStats } from '@/lib/data';

export default async function EnglishHomePage() {
  const [stats, indicators] = await Promise.all([getStats(), getMarketIndicators()]);
  return <PortalHome locale="en" stats={stats} indicators={indicators} />;
}
