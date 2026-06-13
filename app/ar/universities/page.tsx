import { LocalizedUniversitiesPage } from '@/components/universities/localized-universities';

export default function ArabicUniversitiesPage({ searchParams }: { searchParams?: any }) {
  return <LocalizedUniversitiesPage locale="ar" searchParams={searchParams} />;
}

