import { LocalizedUniversityDetailPage } from '@/components/universities/localized-universities';

export default async function ArabicUniversityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LocalizedUniversityDetailPage locale="ar" id={decodeURIComponent(id)} />;
}
