import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { 
  Mail, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Users, 
  Music, 
  MapPin, 
  Share2, 
  Plus, 
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Settings
} from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getDashboardSummary() {
  const fallback = {
    summary: { TOTAL: 0, DRAFT: 0, PENDING_REVIEW: 0, ACTIVE: 0, DISABLED: 0, EXPIRED: 0, ARCHIVED: 0 },
    recentSubmissions: [],
    analytics: { TOTAL_VIEWS: 0, UNIQUE_VISITORS: 0, MUSIC_PLAYS: 0, MAP_CLICKS: 0, CONTACT_CLICKS: 0, SHARES: 0 }
  };

  try {
    const counts = await prisma.invitation.groupBy({
      by: ['status'],
      _count: true,
      where: { deletedAt: null }
    });

    const summary: Record<string, number> = {
      TOTAL: 0,
      DRAFT: 0,
      PENDING_REVIEW: 0,
      ACTIVE: 0,
      DISABLED: 0,
      EXPIRED: 0,
      ARCHIVED: 0,
    };

    counts.forEach((c: any) => {
      summary[c.status] = c._count;
      summary.TOTAL += c._count;
    });

    const recentSubmissions = await prisma.invitation.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { 
        id: true, 
        groomName: true, 
        brideName: true, 
        customerPhone: true, 
        status: true, 
        createdAt: true,
        slugs: { where: { isCurrent: true }, select: { slug: true } }
      }
    });

    const events = await prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      _count: true
    });

    const uniqueVisitorsResult = await prisma.analyticsEvent.findMany({
      select: { visitorId: true },
      distinct: ['visitorId']
    });

    const analytics = {
      TOTAL_VIEWS: 0,
      UNIQUE_VISITORS: uniqueVisitorsResult.length,
      MUSIC_PLAYS: 0,
      MAP_CLICKS: 0,
      CONTACT_CLICKS: 0,
      SHARES: 0
    };

    events.forEach((e: any) => {
      switch (e.eventType) {
        case 'VIEW': analytics.TOTAL_VIEWS = e._count; break;
        case 'MUSIC_PLAY': analytics.MUSIC_PLAYS = e._count; break;
        case 'MAP_CLICK': analytics.MAP_CLICKS = e._count; break;
        case 'GROOM_CONTACT':
        case 'BRIDE_CONTACT':
          analytics.CONTACT_CLICKS += e._count;
          break;
        case 'SHARE': analytics.SHARES = e._count; break;
      }
    });

    return { summary, recentSubmissions, analytics };
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return fallback;
  }
}

export default async function AdminDashboardPage() {
  const data = await getDashboardSummary();
  const { summary, recentSubmissions, analytics } = data;

  return (
    <div className="space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#2A1D0E] via-[#38260F] to-[#24170A] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-[#DFBA73]/30">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#DFBA73] text-xs font-bold mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>لوحة التحكم الرئيسية ⚜️</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#FAF0D7] mb-2" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
              مرحباً بك في منصة دعـوتـي
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
              متابعة مباشرة لجميع الدعوات الإلكترونية، عدد الزوار، وتأكيد الحضور بدقة واحترافية.
            </p>
          </div>

          <Link
            href="/admin/invitations"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#8C6D38] to-[#C5A059] hover:brightness-110 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>إدارة وتجهيز الدعوات</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total */}
        <div className="bg-white p-5 rounded-3xl border border-[#EADBCA] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <span className="text-xs font-extrabold text-[#5C4520]">إجمالي الدعوات</span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF0D7] text-[#8C6D38] flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#38260F]">{summary.TOTAL}</p>
        </div>

        {/* Active */}
        <div className="bg-white p-5 rounded-3xl border border-[#EADBCA] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <span className="text-xs font-extrabold text-emerald-800">دعوات نشطة</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600">{summary.ACTIVE}</p>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-3xl border border-[#EADBCA] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <span className="text-xs font-extrabold text-amber-800">قيد المراجعة</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-amber-600">{summary.PENDING_REVIEW}</p>
        </div>

        {/* Total Views */}
        <div className="bg-white p-5 rounded-3xl border border-[#EADBCA] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <span className="text-xs font-extrabold text-sky-800">المشاهدات والزيارات</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-sky-700">{analytics.TOTAL_VIEWS}</p>
        </div>

      </div>

      {/* Engagement Analytics Grid */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADBCA] shadow-xs">
        <h2 className="text-lg font-extrabold text-[#38260F] mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#8C6D38]" />
          <span>تفاعل الضيوف مع الدعوات (إحصائيات شاملة)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBCA]/60 text-center">
            <Users className="w-5 h-5 text-[#8C6D38] mx-auto mb-2" />
            <span className="text-xs text-gray-500 block mb-1">الزوار الفريدون</span>
            <span className="text-xl font-extrabold text-[#38260F]">{analytics.UNIQUE_VISITORS}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBCA]/60 text-center">
            <Music className="w-5 h-5 text-[#8C6D38] mx-auto mb-2" />
            <span className="text-xs text-gray-500 block mb-1">تشغيل الموسيقى</span>
            <span className="text-xl font-extrabold text-[#38260F]">{analytics.MUSIC_PLAYS}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBCA]/60 text-center">
            <MapPin className="w-5 h-5 text-[#8C6D38] mx-auto mb-2" />
            <span className="text-xs text-gray-500 block mb-1">نقرات موقع القاعة</span>
            <span className="text-xl font-extrabold text-[#38260F]">{analytics.MAP_CLICKS}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBCA]/60 text-center">
            <Share2 className="w-5 h-5 text-[#8C6D38] mx-auto mb-2" />
            <span className="text-xs text-gray-500 block mb-1">مشاركات الدعوة</span>
            <span className="text-xl font-extrabold text-[#38260F]">{analytics.SHARES}</span>
          </div>
        </div>
      </div>

      {/* Recent Invitations */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADBCA] shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F2ECE1]">
          <h2 className="text-lg font-extrabold text-[#38260F] flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#8C6D38]" />
            <span>أحدث الدعوات المسجلة</span>
          </h2>
          <Link
            href="/admin/invitations"
            className="text-xs font-bold text-[#8C6D38] hover:underline flex items-center gap-1"
          >
            <span>عرض كل الدعوات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {recentSubmissions.map((inv) => (
            <div 
              key={inv.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBCA]/60 flex items-center justify-between gap-3 hover:border-[#DFBA73] transition-colors"
            >
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-[#38260F]">
                  {inv.groomName}  &  {inv.brideName}
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5" dir="ltr">
                  {inv.customerPhone} • {inv.slugs[0]?.slug ? `/${inv.slugs[0].slug}` : 'بدون رابط'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/invitations/${inv.id}`}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#D5C7B2] text-[#8C6D38] font-bold text-xs hover:bg-[#FAF0D7] transition-colors shadow-2xs"
                >
                  إدارة وتعديل
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
