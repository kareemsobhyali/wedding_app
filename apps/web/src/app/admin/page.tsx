import React from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { formatEventDate } from '../../templates/utils/date';

async function getDashboardSummary() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');
  
  const headers = { Cookie: sessionCookie ? `${sessionCookie.name}=${sessionCookie.value}` : '' };
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000/api/v1';
  
  const [summaryRes, analyticsRes] = await Promise.all([
    fetch(`${apiUrl}/admin/dashboard/summary`, { headers, cache: 'no-store' }),
    fetch(`${apiUrl}/admin/analytics/global`, { headers, cache: 'no-store' })
  ]);
  
  if (!summaryRes.ok) throw new Error('Failed to fetch summary');
  const summaryRaw = await summaryRes.json();
  const analyticsRaw = analyticsRes.ok ? await analyticsRes.json() : null;

  const summary = summaryRaw.data || summaryRaw;
  const analytics = analyticsRaw?.data || analyticsRaw;

  return { ...summary, analytics };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardSummary();
  const { summary, recentSubmissions, analytics } = data;

  return (
    <div className="p-4 sm:p-8 max-w-full overflow-hidden">
      <h1 className="text-3xl font-bold mb-8">Overview</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 shadow rounded-lg border border-gray-100">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Total</p>
          <p className="text-4xl font-light">{summary.TOTAL}</p>
        </div>
        <div className="bg-white p-6 shadow rounded-lg border border-yellow-100">
          <p className="text-sm text-yellow-600 uppercase tracking-wide">Pending Review</p>
          <p className="text-4xl font-light">{summary.PENDING_REVIEW}</p>
        </div>
        <div className="bg-white p-6 shadow rounded-lg border border-green-100">
          <p className="text-sm text-green-600 uppercase tracking-wide">Active</p>
          <p className="text-4xl font-light">{summary.ACTIVE}</p>
        </div>
        <div className="bg-white p-6 shadow rounded-lg border border-gray-100">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Drafts</p>
          <p className="text-4xl font-light">{summary.DRAFT}</p>
        </div>
      </div>

      {analytics && (
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4">Global Analytics (All Time)</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white p-4 shadow rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-900 uppercase tracking-wide font-bold">Total Views</p>
              <p className="text-2xl">{analytics.TOTAL_VIEWS}</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-900 uppercase tracking-wide font-bold">Unique Visitors</p>
              <p className="text-2xl">{analytics.UNIQUE_VISITORS}</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-900 uppercase tracking-wide font-bold">Music Plays</p>
              <p className="text-2xl">{analytics.MUSIC_PLAYS}</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-900 uppercase tracking-wide font-bold">Map Clicks</p>
              <p className="text-2xl">{analytics.MAP_CLICKS}</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-900 uppercase tracking-wide font-bold">Contacts</p>
              <p className="text-2xl">{analytics.CONTACT_CLICKS}</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-900 uppercase tracking-wide font-bold">Shares</p>
              <p className="text-2xl">{analytics.SHARES}</p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Recent Submissions</h2>
      <div className="bg-white shadow rounded-lg border border-gray-100 divide-y">
        {recentSubmissions.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">No recent submissions</p>
        ) : (
          recentSubmissions.map((sub: any) => (
            <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="font-bold">{sub.groomName} & {sub.brideName}</p>
                <p className="text-sm text-gray-500">{sub.customerPhone}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">{formatEventDate(sub.updatedAt)}</p>
                <Link href={`/admin/invitations/${sub.id}`} className="text-sm text-blue-600 font-semibold hover:underline">
                  Review
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
