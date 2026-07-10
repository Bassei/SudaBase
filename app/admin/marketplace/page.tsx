import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/marketplace/admin-dashboard';
import { getMarketplaceAdminData, requireMarketplaceAdmin } from '@/lib/united-fruit';

export default async function AdminMarketplacePage() {
  const { user, isAdmin } = await requireMarketplaceAdmin();

  if (!user) {
    redirect('/login');
  }

  if (!isAdmin) {
    return (
      <main dir="rtl" className="mx-auto max-w-2xl px-4 py-12">
        <section className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
          <h1 className="text-2xl font-black text-red-900">غير مصرح</h1>
          <p className="mt-2 font-bold">هذا الحساب غير مضاف إلى جدول مديري المنصة.</p>
        </section>
      </main>
    );
  }

  const data = await getMarketplaceAdminData();
  return <AdminDashboard {...data} />;
}
