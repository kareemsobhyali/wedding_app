import { getAdminFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let admin = null;
  try {
    admin = await getAdminFromCookies();
  } catch {
    // If DB is offline during build
  }

  if (!admin) {
    redirect('/admin-login');
  }

  return (
    <div className="min-h-screen bg-[#F7F3EB] font-cairo text-[#38260F] flex flex-col lg:flex-row" dir="rtl">
      {/* Responsive Luxury Sidebar */}
      <AdminSidebar adminEmail={admin?.email} />

      {/* Main Content Viewport */}
      <div className="flex-1 lg:mr-72 min-w-0 flex flex-col">
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
