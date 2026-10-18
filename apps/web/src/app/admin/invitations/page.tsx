import React from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import QuickCreateModal from './QuickCreateModal';

async function fetchInvitations(searchParams: any) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');
  
  const q = new URLSearchParams(searchParams).toString();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000/api/v1';
  const res = await fetch(`${apiUrl}/admin/invitations?${q}`, {
    headers: {
      Cookie: sessionCookie ? `${sessionCookie.name}=${sessionCookie.value}` : '',
    },
    cache: 'no-store'
  });
  
  if (!res.ok) throw new Error('Failed to fetch invitations');
  const responseRaw = await res.json();
  return responseRaw.data || responseRaw;
}

export default async function AdminInvitationsListPage({ searchParams }: { searchParams: any }) {
  const data = await fetchInvitations(searchParams);
  const { items, pagination } = data;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ACTIVE': return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">ACTIVE</span>;
      case 'PENDING_REVIEW': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">PENDING</span>;
      case 'DRAFT': return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">DRAFT</span>;
      default: return <span className="px-2 py-1 bg-stone-100 text-stone-800 text-xs rounded-full">{status}</span>;
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Invitations</h1>
        <QuickCreateModal apiToken={cookies().get('admin_session')?.value || ''} />
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-100 overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <form className="flex-1 flex gap-2">
            <input 
              name="search" 
              defaultValue={searchParams.search}
              placeholder="Search by phone, name, or slug..." 
              className="flex-1 p-2 border rounded"
            />
            <button className="px-4 py-2 bg-stone-900 text-white rounded font-bold">Search</button>
          </form>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[600px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-sm">Couple</th>
              <th className="p-4 font-semibold text-sm">Phone</th>
              <th className="p-4 font-semibold text-sm">Status</th>
              <th className="p-4 font-semibold text-sm">Wedding Date</th>
              <th className="p-4 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((inv: any) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <p className="font-bold">{inv.groomName} & {inv.brideName}</p>
                  <p className="text-xs text-gray-500">/{inv.slugs[0]?.slug}</p>
                </td>
                <td className="p-4 text-sm text-gray-600">{inv.customerPhone}</td>
                <td className="p-4">{getStatusBadge(inv.status)}</td>
                <td className="p-4 text-sm text-gray-600">
                  {inv.weddingDate ? new Date(inv.weddingDate).toISOString().split('T')[0] : 'N/A'}
                </td>
                <td className="p-4">
                  <Link href={`/admin/invitations/${inv.id}`} className="text-blue-600 hover:underline font-semibold text-sm">
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
