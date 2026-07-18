import { PortalHome } from '@/components/home/portal-home';
import { getUfProducts } from '@/lib/united-fruit';

export default async function EnglishHomePage() {
  const products = await getUfProducts();
  return <PortalHome locale="en" products={products} />;
}
