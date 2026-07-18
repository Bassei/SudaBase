import { PortalHome } from '@/components/home/portal-home';
import { getUfProducts } from '@/lib/united-fruit';

export default async function HomePage() {
  const products = await getUfProducts();
  return <PortalHome locale="ar" products={products} />;
}
