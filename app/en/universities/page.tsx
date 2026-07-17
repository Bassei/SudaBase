import { LocalizedUniversitiesPage } from '@/components/universities/localized-universities';

export default async function EnglishUniversitiesPage({ searchParams }: { searchParams?: Promise<any> }) {
  return <LocalizedUniversitiesPage locale="en" searchParams={await searchParams} />;
}

