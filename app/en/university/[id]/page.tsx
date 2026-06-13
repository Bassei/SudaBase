import { LocalizedUniversityDetailPage } from '@/components/universities/localized-universities';

export default function EnglishUniversityDetailPage({ params }: { params: { id: string } }) {
  return <LocalizedUniversityDetailPage locale="en" id={decodeURIComponent(params.id)} />;
}
