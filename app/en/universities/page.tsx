import { LocalizedUniversitiesPage } from '@/components/universities/localized-universities';

export default function EnglishUniversitiesPage({ searchParams }: { searchParams?: any }) {
  return <LocalizedUniversitiesPage locale="en" searchParams={searchParams} />;
}

