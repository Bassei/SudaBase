import { LocalizedCompanyDetailPage } from '@/components/business/company-detail';

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;

  return <LocalizedCompanyDetailPage locale="en" id={resolvedParams.id} />;
}