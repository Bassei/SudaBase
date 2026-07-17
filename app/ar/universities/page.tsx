import { LocalizedUniversitiesPage } from '@/components/universities/localized-universities';

export default async function ArabicUniversitiesPage({ searchParams }: { searchParams?: Promise<any> }) {
  return <LocalizedUniversitiesPage locale="ar" searchParams={await searchParams} />;
}

