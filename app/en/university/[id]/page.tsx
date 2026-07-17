import { LocalizedUniversityDetailPage } from '@/components/universities/localized-universities';

export default async function EnglishUniversityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LocalizedUniversityDetailPage locale="en" id={decodeURIComponent(id)} />;
}
