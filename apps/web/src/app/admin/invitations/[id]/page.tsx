import AdminEditForm from './AdminEditForm';
import AdminActionButtons from './AdminActionButtons';
import SlugEditor from './SlugEditor';
import AdminValidityManager from './AdminValidityManager';
import PersonalizedLinksGenerator from '@/components/PersonalizedLinksGenerator';
import React from 'react';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getTemplateImplementation } from '../../../../templates/registry';

export const dynamic = 'force-dynamic';

async function fetchInvitation(id: string) {
  try {
    const inv = await prisma.invitation.findUnique({
      where: { id },
      include: {
        slugs: { orderBy: { createdAt: 'desc' } },
        template: true,
        media: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } },
        rsvps: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!inv) notFound();
    return inv;
  } catch (err) {
    console.error('Error fetching invitation:', err);
    notFound();
  }
}

async function fetchAnalytics(id: string) {
  try {
    const events = await prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      where: { invitationId: id },
      _count: true
    });

    const uniqueVisitorsResult = await prisma.analyticsEvent.findMany({
      where: { invitationId: id },
      select: { visitorId: true },
      distinct: ['visitorId']
    });

    const lastVisitEvent = await prisma.analyticsEvent.findFirst({
      where: { invitationId: id, eventType: 'VIEW' },
      orderBy: { timestamp: 'desc' },
      select: { timestamp: true }
    });

    const metrics = {
      totalViews: 0,
      uniqueVisitors: uniqueVisitorsResult.length,
      musicPlays: 0,
      mapClicks: 0,
      groomContactClicks: 0,
      brideContactClicks: 0,
      shares: 0,
      lastVisit: lastVisitEvent?.timestamp || null
    };

    events.forEach((e: any) => {
      switch (e.eventType) {
        case 'VIEW': metrics.totalViews = e._count; break;
        case 'MUSIC_PLAY': metrics.musicPlays = e._count; break;
        case 'MAP_CLICK': metrics.mapClicks = e._count; break;
        case 'GROOM_CONTACT': metrics.groomContactClicks = e._count; break;
        case 'BRIDE_CONTACT': metrics.brideContactClicks = e._count; break;
        case 'SHARE': metrics.shares = e._count; break;
      }
    });

    return metrics;
  } catch {
    return null;
  }
}

export default async function AdminInvitationDetail({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  
  const [inv, analytics] = await Promise.all([
    fetchInvitation(params.id),
    fetchAnalytics(params.id)
  ]);
  
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

        <AdminValidityManager 
          invitationId={inv.id}
          currentExpiresAt={inv.expiresAt ? inv.expiresAt.toISOString() : null}
          apiToken={cookieStore.get("admin_session")?.value || ''}
        />

        <SlugEditor 
          invitationId={inv.id} 
          currentSlug={inv.slugs?.find((s: any) => s.isCurrent)?.slug || inv.slugs?.[0]?.slug || ''} 
          apiToken={cookieStore.get("admin_session")?.value || ''} 
        />

        {/* RSVP Management & Public Link Card */}
        {(() => {
          const currentSlug = inv.slugs?.find((s: any) => s.isCurrent)?.slug || inv.slugs?.[0]?.slug || '';
          const rsvps = (inv as any).rsvps || [];
          const attending = rsvps.filter((r: any) => r.attendance === 'yes');
          const declined = rsvps.filter((r: any) => r.attendance === 'no');
          const totalGuests = attending.reduce((sum: number, r: any) => sum + (r.guestsCount || 1), 0);

          return (
            <div className="bg-white p-6 shadow rounded border border-emerald-100">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div>
                  <h2 className="font-bold text-lg text-emerald-950 flex items-center gap-2">
                    <span>📋 سجل تأكيدات الحضور (RSVP)</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    متابعة الردود وإجمالي عدد الضيوف المدعوين
                  </p>
                </div>
                {currentSlug && (
                  <a
                    href={`/${currentSlug}/rsvp`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <span>فتح صفحة الحضور العامة ↗</span>
                  </a>
                )}
              </div>

              {/* Quick KPI stats */}
              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <span className="text-xs text-emerald-800 font-bold block">المؤكدين</span>
                  <span className="text-xl font-extrabold text-emerald-700 leading-tight">{attending.length}</span>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <span className="text-xs text-[#8C6D38] font-bold block">إجمالي الأفراد</span>
                  <span className="text-xl font-extrabold text-[#543914] leading-tight">{totalGuests}</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-xs text-stone-600 font-bold block">المعتذرين</span>
                  <span className="text-xl font-extrabold text-stone-700 leading-tight">{declined.length}</span>
                </div>
              </div>

              {/* Recent RSVPs Mini-List */}
              {rsvps.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-2">
                  لم يتم تسجيل أي ردود حضور لهذه الدعوة بعد.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {rsvps.slice(0, 5).map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <div>
                        <span className="font-bold text-gray-800">{r.name}</span>
                        {r.attendance === 'yes' && r.guestsCount > 1 && (
                          <span className="text-gray-500 mr-1.5">({r.guestsCount} أفراد)</span>
                        )}
                        {r.notes && <p className="text-[11px] text-gray-500 italic mt-0.5">&quot;{r.notes}&quot;</p>}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        r.attendance === 'yes' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {r.attendance === 'yes' ? 'حاضر' : 'معتذر'}
                      </span>
                    </div>
                  ))}
                  {rsvps.length > 5 && (
                    <p className="text-[11px] text-center text-gray-500 pt-1">
                      + {rsvps.length - 5} ردود إضافية (اضغط على فتح صفحة الحضور لعرض الكل)
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* Printable Luxury QR Card */}
        {(() => {
          const currentSlug = inv.slugs?.find((s: any) => s.isCurrent)?.slug || inv.slugs?.[0]?.slug || '';
          if (!currentSlug) return null;

          return (
            <div className="bg-white p-5 shadow rounded border border-amber-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
                    🖨️
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-stone-900">بطاقة QR الفاخرة للطباعة والتنزيل</h2>
                    <p className="text-xs text-stone-500">بطاقة 4x6 جاهزة للتنزيل بجودة فائقة (PNG) أو الطباعة الورقية الفورية</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`/${currentSlug}/card`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 bg-[#8C6D38] hover:bg-[#6E4D1D] text-white rounded-lg text-xs font-bold text-center transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>فتح بطاقة QR والطباعة (PNG / Print)</span>
                  <span>↗</span>
                </a>
                <a
                  href={`/${currentSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold text-center transition-all"
                >
                  معاينة الدعوة ↗
                </a>
              </div>
            </div>
          );
        })()}

        {/* Personalized Invites Generator */}
        {(() => {
          const currentSlug = inv.slugs?.find((s: any) => s.isCurrent)?.slug || inv.slugs?.[0]?.slug || '';
          if (!currentSlug) return null;

          return (
            <PersonalizedLinksGenerator 
              slug={currentSlug}
              groomName={inv.groomName}
              brideName={inv.brideName}
              isArabic={true}
              initialAliases={(inv.customData as any)?.guestAliases || {}}
            />
          );
        })()}

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
          {TemplateComponent ? (() => {
            const customLang = (inv.customData as any)?.language;
            const isAr = customLang 
              ? customLang === 'ar' 
              : /[\u0600-\u06FF]/.test(inv.groomName || inv.brideName || '');
            const direction: 'LTR' | 'RTL' = isAr ? 'RTL' : 'LTR';

            return (
              <TemplateComponent 
                mode="PREVIEW"
                direction={direction}
                metadata={metadata!}
                data={{
                groomName: inv.groomName,
                brideName: inv.brideName,
                weddingDate: inv.weddingDate || new Date(),
                weddingTime: (inv.customData as any)?.weddingTime || '',
                venueName: inv.venueName,
                venueAddress: inv.venueAddress || '',
                googleMapsUrl: inv.googleMapsUrl || '',
                caption: inv.caption || '',
                weddingMessage: inv.weddingMessage || '',
                groomPhone: inv.groomPhone || '',
                bridePhone: inv.bridePhone || '',
                countdownEnabled: inv.countdownEnabled,
                contactButtonsEnabled: true,
                customData: (inv.customData as Record<string, any>) || {},
                galleryImages: inv.media
                  .filter((m: any) => m.role === 'GALLERY' && (m.publicUrl || m.storageKey) && !m.deletedAt)
                  .map((m: any) => ({ url: (m.publicUrl || m.storageKey) as string, alt: 'Gallery Image' })),
                music: (() => {
                  const item = inv.media.find((m: any) => m.type === 'AUDIO' && !m.deletedAt);
                  const url = item?.publicUrl || item?.storageKey || (inv.customData as any)?.musicUrl;
                  return url ? { url } : undefined;
                })(),
                coverImage: (() => {
                  const item = inv.media.find((m: any) => (m.role === 'COVER' || m.type === 'IMAGE') && !m.deletedAt);
                  const url = item?.publicUrl || item?.storageKey || (inv.customData as any)?.coverImageUrl;
                  return url ? { url, alt: 'Cover Image' } : undefined;
                })(),
              }}
            />
            );
          })() : (
            <div className="p-12 text-center text-gray-500">No template assigned or template missing</div>
          )}
        </div>
      </div>
    </div>
  );
}
