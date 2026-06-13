import { LocalizedUniversityDetailPage } from '@/components/universities/localized-universities';

export default function ArabicUniversityDetailPage({ params }: { params: { id: string } }) {
  return <LocalizedUniversityDetailPage locale="ar" id={decodeURIComponent(params.id)} />;
}
