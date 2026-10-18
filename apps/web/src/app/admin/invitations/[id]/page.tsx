import AdminEditForm from './AdminEditForm';
import AdminActionButtons from './AdminActionButtons';
import SlugEditor from './SlugEditor';
import React from 'react';
import { cookies } from 'next/headers';
import { getTemplateImplementation } from '../../../../templates/registry';

async function fetchInvitation(id: string) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/admin/invitations/${id}`, {
    headers: {
      Cookie: sessionCookie ? `${sessionCookie.name}=${sessionCookie.value}` : '',
    },
    cache: 'no-store'
  });
  
  if (!res.ok) throw new Error('Failed to fetch invitation details');
  const raw = await res.json();
  return raw.data || raw;
}

async function fetchAnalytics(id: string) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/admin/invitations/${id}/analytics`, {
    headers: { Cookie: sessionCookie ? `${sessionCookie.name}=${sessionCookie.value}` : '' },
    cache: 'no-store'
  });
  if (!res.ok) return null;
  const raw = await res.json();
  return raw.data || raw;
}

export default async function AdminInvitationDetail({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  
  const [inv, analytics] = await Promise.all([
    fetchInvitation(params.id),
    fetchAnalytics(params.id)
  ]);
  
  // We can render the Template UI directly inline or in an iframe. Inline is easier for Phase 10 context.
  const registeredTemplate = inv.template ? getTemplateImplementation(inv.template.slug) : null;
  const TemplateComponent = registeredTemplate?.component;
  const metadata = registeredTemplate?.metadata;

  return (


    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 overflow-hidden">
      {/* Admin Controls Panel */}
      <div className="w-full lg:w-1/2 space-y-6 max-w-full overflow-hidden">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold">Manage Invitation</h1>
          <span className="px-3 py-1 bg-gray-200 rounded-full font-semibold text-sm">{inv.status}</span>
        </div>

        {analytics && (
          <div className="bg-white p-6 shadow rounded border border-indigo-100">
            <h2 className="font-bold text-lg border-b pb-2 mb-4 text-indigo-900">Analytics (All Time)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Views</p>
                <p className="text-2xl font-bold">{analytics.totalViews}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Unique Visitors</p>
                <p className="text-2xl font-bold">{analytics.uniqueVisitors}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Music Plays</p>
                <p className="text-xl font-bold text-stone-700">{analytics.musicPlays}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Map Clicks</p>
                <p className="text-xl font-bold text-stone-700">{analytics.mapClicks}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Contacts</p>
                <p className="text-xl font-bold text-stone-700">{analytics.groomContactClicks + analytics.brideContactClicks}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Shares</p>
                <p className="text-xl font-bold text-stone-700">{analytics.shares}</p>
              </div>
            </div>
            {analytics.lastVisit && (
              <p className="text-xs text-gray-400 mt-4">Last Visit: {new Date(analytics.lastVisit).toLocaleString()}</p>
            )}
          </div>
        )}

        <div className="bg-white p-6 shadow rounded border">
          <h2 className="font-bold text-lg border-b pb-2 mb-4">Customer Info</h2>
          <p><strong>Phone:</strong> {inv.customerPhone}</p>
          <p><strong>Created:</strong> {new Date(inv.createdAt).toLocaleString()}</p>
        </div>

        
        <SlugEditor 
          invitationId={inv.id} 
          currentSlug={inv.slugs?.find((s: any) => s.isCurrent)?.slug || inv.slugs?.[0]?.slug || ''} 
          apiToken={cookieStore.get("admin_session")?.value || ''} 
        />


        <div className="bg-white p-6 shadow rounded border">
          <h2 className="font-bold text-lg border-b pb-2 mb-4">State Transitions</h2>
          <AdminActionButtons invitationId={inv.id} apiToken={cookieStore.get("admin_session")?.value || ''} />
        </div>

        <div className="bg-white p-6 shadow rounded border">
          <h2 className="font-bold text-lg border-b pb-2 mb-4">Edit Data</h2>
          <AdminEditForm invitation={inv} apiToken={cookieStore.get("admin_session")?.value || ''} />
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-1/2">
        <h2 className="font-bold text-xl mb-4">Preview</h2>
        <div className="bg-white shadow rounded border overflow-hidden relative" style={{ height: '800px', transform: 'scale(1)', transformOrigin: 'top left' }}>
          {TemplateComponent ? (
            <TemplateComponent 
              mode="PREVIEW"
              direction="LTR"
              metadata={metadata!}
              data={{
                groomName: inv.groomName,
                brideName: inv.brideName,
                weddingDate: inv.weddingDate,
                weddingTime: inv.weddingTime,
                venueName: inv.venueName,
                venueAddress: inv.venueAddress,
                googleMapsUrl: inv.googleMapsUrl,
                caption: inv.caption,
                weddingMessage: inv.weddingMessage,
                groomPhone: inv.groomPhone,
                bridePhone: inv.bridePhone,
                countdownEnabled: inv.countdownEnabled,
                contactButtonsEnabled: true,
                galleryImages: inv.media.filter((m: any) => m.role === 'GALLERY').map((m: any) => ({ url: m.publicUrl || m.storageKey, alt: 'Gallery Image' })),
                music: inv.media.find((m: any) => m.type === 'AUDIO') ? { url: inv.media.find((m: any) => m.type === 'AUDIO').publicUrl } : undefined,
                coverImage: inv.media.find((m: any) => m.role === 'COVER') ? { url: inv.media.find((m: any) => m.role === 'COVER').publicUrl, alt: 'Cover Image' } : undefined,
              }}
            />
          ) : (
            <div className="p-12 text-center text-gray-500">No template assigned or template missing</div>
          )}
        </div>
      </div>
    </div>
  );
}
