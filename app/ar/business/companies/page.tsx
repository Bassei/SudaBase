import { LocalizedCompaniesPage } from '@/components/business/companies-directory';

type SearchParams = {
  q?: string;
  sector?: string;
  city?: string;
  contact?: string;
};

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const params = await searchParams;

  return <LocalizedCompaniesPage locale="ar" searchParams={params} />;
}