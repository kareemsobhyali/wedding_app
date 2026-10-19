import { getAdminFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <aside className="w-full md:w-64 bg-stone-900 text-white shrink-0 p-4 md:p-6 flex flex-col sm:flex-row md:flex-col items-center md:items-start justify-between gap-4 md:gap-0 z-10">
        <h1 className="text-xl font-bold md:mb-12">Admin Portal</h1>
        <nav className="flex sm:flex-1 md:flex-none flex-row md:flex-col gap-4 md:gap-0 md:space-y-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Link href="/admin" className="block py-2 text-stone-300 hover:text-white transition-colors">Dashboard</Link>
          <Link href="/admin/invitations" className="block py-2 text-stone-300 hover:text-white transition-colors">Invitations</Link>
          <Link href="/admin/settings" className="block py-2 text-stone-300 hover:text-white transition-colors">Site Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
