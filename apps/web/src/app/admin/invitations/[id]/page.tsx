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
import Link from 'next/link';
import { 
  ArrowRight, 
  ExternalLink, 
  QrCode, 
  Users, 
  Eye, 
  Music, 
  MapPin, 
  Share2, 
  Calendar, 
  Phone, 
  Clock, 
  Sparkles,
  Smartphone
} from 'lucide-react';

export const dynamic = 'force-dynamic';

async function fetchInvitation(id: string) {
  let inv = null;
  try {
    inv = await prisma.invitation.findUnique({
      where: { id },
      include: {
        slugs: { orderBy: { createdAt: 'desc' } },
        template: true,
        media: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } },
        rsvps: { orderBy: { createdAt: 'desc' } }
      }
    });
  } catch (err) {
    console.error('Error fetching invitation:', err);
  }

  if (!inv) {
    notFound();
  }
  return inv;
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
  const apiToken = cookieStore.get("admin_session")?.value || '';
  
  const [inv, analytics] = await Promise.all([
    fetchInvitation(params.id),
    fetchAnalytics(params.id)
  ]);
  
  const registeredTemplate = inv.template ? getTemplateImplementation(inv.template.slug) : null;
  const TemplateComponent = registeredTemplate?.component;
  const metadata = registeredTemplate?.metadata;
  const currentSlug = inv.slugs?.find((s: any) => s.isCurrent)?.slug || inv.slugs?.[0]?.slug || '';

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EADBCA]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/invitations"
            className="w-10 h-10 rounded-xl bg-white border border-[#EADBCA] hover:bg-[#FAF7F2] text-gray-700 flex items-center justify-center transition-colors shadow-2xs"
            title="الرجوع لقائمة الدعوات"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#38260F]" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
                {inv.groomName}  &  {inv.brideName}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                inv.status === 'ACTIVE' 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                  : 'bg-amber-100 text-amber-800 border-amber-200'
              }`}>
                {inv.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              ID: {inv.id}
            </p>
          </div>
        </div>

        {/* Quick External Links (Live Demo & QR Card) */}
        {currentSlug && (
          <div className="flex items-center gap-2">
            <a
              href={`/${currentSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>معاينة الدعوة</span>
            </a>

            <a
              href={`/${currentSlug}/card`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8C6D38] to-[#5C4520] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>كارت QR للطباعة</span>
            </a>
          </div>
        )}
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="flex flex-col xl:flex-row gap-6 sm:gap-8 items-start">
        
        {/* Controls Column (Full width on Mobile, 7/12 on XL) */}
        <div className="w-full xl:w-7/12 space-y-6">

          {/* 1. State Transitions & Actions (With Delete Option) */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#EADBCA] shadow-xs">
            <h2 className="font-extrabold text-base text-[#38260F] mb-3 pb-2 border-b border-[#F2ECE1] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8C6D38]" />
              <span>حالة الدعوة والإجراءات السريعة</span>
            </h2>
            <AdminActionButtons invitationId={inv.id} apiToken={apiToken} />
          </div>

          {/* 2. Customer Info & Summary */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#EADBCA] shadow-xs">
            <h2 className="font-extrabold text-base text-[#38260F] mb-3 pb-2 border-b border-[#F2ECE1]">
              بيانات العميل والتاريخ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500 block mb-1 font-bold">هاتف العميل (واتساب):</span>
                <span className="font-mono text-sm font-extrabold text-[#38260F]" dir="ltr">
                  {inv.customerPhone}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1 font-bold">تاريخ الإنشاء:</span>
                <span className="text-sm font-semibold text-[#38260F]">
                  {new Date(inv.createdAt).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Analytics (If Available) */}
          {analytics && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#EADBCA] shadow-xs">
              <h2 className="font-extrabold text-base text-[#38260F] mb-4 pb-2 border-b border-[#F2ECE1] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#8C6D38]" />
                <span>إحصائيات تفاعل الضيوف</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EADBCA]/60">
                  <span className="text-[11px] text-gray-500 block font-bold">إجمالي الزيارات</span>
                  <span className="text-xl font-black text-[#38260F]">{analytics.totalViews}</span>
                </div>
                <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EADBCA]/60">
                  <span className="text-[11px] text-gray-500 block font-bold">الزوار الفريدون</span>
                  <span className="text-xl font-black text-[#38260F]">{analytics.uniqueVisitors}</span>
                </div>
                <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EADBCA]/60">
                  <span className="text-[11px] text-gray-500 block font-bold">تشغيل الموسيقى</span>
                  <span className="text-xl font-black text-[#8C6D38]">{analytics.musicPlays}</span>
                </div>
                <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EADBCA]/60">
                  <span className="text-[11px] text-gray-500 block font-bold">موقع القاعة</span>
                  <span className="text-xl font-black text-[#8C6D38]">{analytics.mapClicks}</span>
                </div>
                <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EADBCA]/60">
                  <span className="text-[11px] text-gray-500 block font-bold">التواصل المباشر</span>
                  <span className="text-xl font-black text-[#8C6D38]">{analytics.groomContactClicks + analytics.brideContactClicks}</span>
                </div>
                <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EADBCA]/60">
                  <span className="text-[11px] text-gray-500 block font-bold">المشاركات</span>
                  <span className="text-xl font-black text-[#8C6D38]">{analytics.shares}</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. Validity Manager */}
          <AdminValidityManager 
            invitationId={inv.id}
            currentExpiresAt={inv.expiresAt ? (inv.expiresAt instanceof Date ? inv.expiresAt.toISOString() : String(inv.expiresAt)) : null}
            apiToken={apiToken}
          />

          {/* 5. Slug Editor */}
          <SlugEditor 
            invitationId={inv.id} 
            currentSlug={currentSlug} 
            apiToken={apiToken} 
          />

          {/* 6. RSVP Management */}
          {(() => {
            const rsvps = (inv as any).rsvps || [];
            const attending = rsvps.filter((r: any) => r.attendance === 'yes');
            const declined = rsvps.filter((r: any) => r.attendance === 'no');
            const totalGuests = attending.reduce((sum: number, r: any) => sum + (r.guestsCount || 1), 0);

            return (
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-100 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2ECE1] pb-3 mb-4">
                  <div>
                    <h2 className="font-extrabold text-base text-emerald-950 flex items-center gap-2">
                      <span>📋 تأكيدات الحضور (RSVP)</span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      متابعة الردود وتصدير قائمة المدعوين
                    </p>
                  </div>
                  {currentSlug && (
                    <a
                      href={`/${currentSlug}/rsvp`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>فتح شاشة الحضور العامة ↗</span>
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                    <span className="text-xs text-emerald-800 font-bold block">المؤكدين</span>
                    <span className="text-xl font-black text-emerald-700 leading-tight">{attending.length}</span>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                    <span className="text-xs text-[#8C6D38] font-bold block">إجمالي الأفراد</span>
                    <span className="text-xl font-black text-[#543914] leading-tight">{totalGuests}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                    <span className="text-xs text-stone-600 font-bold block">المعتذرين</span>
                    <span className="text-xl font-black text-stone-700 leading-tight">{declined.length}</span>
                  </div>
                </div>

                {rsvps.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-2">
                    لم يسجل أي ضيف رده حتى الآن.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {rsvps.slice(0, 5).map((r: any) => (
                      <div key={r.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-gray-50 border border-gray-100">
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
                  </div>
                )}
              </div>
            );
          })()}

          {/* 7. Personalized Guest Links Generator */}
          {currentSlug && (
            <PersonalizedLinksGenerator 
              slug={currentSlug}
              groomName={inv.groomName}
              brideName={inv.brideName}
              isArabic={true}
              initialAliases={(inv.customData as any)?.guestAliases || {}}
            />
          )}

          {/* 8. Full Edit Data Form */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#EADBCA] shadow-xs">
            <h2 className="font-extrabold text-base text-[#38260F] mb-4 pb-2 border-b border-[#F2ECE1]">
              تعديل بيانات الدعوة والثيم
            </h2>
            <AdminEditForm invitation={inv} apiToken={apiToken} />
          </div>

        </div>

        {/* Preview Column (Full width on Mobile, 5/12 on XL) */}
        <div className="w-full xl:w-5/12 xl:sticky xl:top-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-lg text-[#38260F] flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#8C6D38]" />
              <span>معاينة حية للدعوة</span>
            </h2>
            {currentSlug && (
              <a
                href={`/${currentSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#8C6D38] hover:underline flex items-center gap-1"
              >
                <span>فتح في نافذة كاملة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Smartphone Mockup Frame */}
          <div className="w-full max-w-sm mx-auto bg-stone-900 rounded-[44px] p-3 shadow-2xl border-4 border-stone-800">
            <div className="w-full rounded-[36px] overflow-hidden bg-[#FAF7F2] relative aspect-[9/16] shadow-inner">
              {TemplateComponent ? (() => {
                const customLang = (inv.customData as any)?.language;
                const isAr = customLang 
                  ? customLang === 'ar' 
                  : /[\u0600-\u06FF]/.test(inv.groomName || inv.brideName || '');
                const direction: 'LTR' | 'RTL' = isAr ? 'RTL' : 'LTR';

                return (
                  <div className="w-full h-full overflow-y-auto scrollbar-none">
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
                        galleryImages: (inv.media || [])
                          .filter((m: any) => m.role === 'GALLERY' && (m.publicUrl || m.storageKey) && !m.deletedAt)
                          .map((m: any) => ({ url: (m.publicUrl || m.storageKey) as string, alt: 'Gallery Image' })),
                        music: (() => {
                          const item = (inv.media || []).find((m: any) => m.type === 'AUDIO' && !m.deletedAt);
                          const url = item?.publicUrl || item?.storageKey || (inv.customData as any)?.musicUrl;
                          return url ? { url } : undefined;
                        })(),
                        coverImage: (() => {
                          const item = (inv.media || []).find((m: any) => (m.role === 'COVER' || m.type === 'IMAGE') && !m.deletedAt);
                          const url = item?.publicUrl || item?.storageKey || (inv.customData as any)?.coverImageUrl;
                          return url ? { url, alt: 'Cover Image' } : undefined;
                        })(),
                      }}
                    />
                  </div>
                );
              })() : (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                  <Sparkles className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-xs">لم يتم تحديد ثيم أو الثيم غير متاح</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
