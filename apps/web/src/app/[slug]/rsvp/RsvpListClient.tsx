'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Search, 
  ArrowRight, 
  ArrowLeft,
  Share2, 
  Copy, 
  Check, 
  Printer, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Sparkles,
  Heart,
  QrCode
} from 'lucide-react';
import PersonalizedLinksGenerator from '@/components/PersonalizedLinksGenerator';

interface RsvpItem {
  id: string;
  name: string;
  attendance: string;
  guestsCount: number;
  phone?: string | null;
  notes?: string | null;
  createdAt: string | Date;
}

interface InvitationInfo {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  weddingDate: string | Date;
  venueName: string;
  venueAddress?: string;
  language: string;
}

interface RsvpListClientProps {
  invitation: InvitationInfo;
  initialRsvps: RsvpItem[];
}

export default function RsvpListClient({ invitation, initialRsvps }: RsvpListClientProps) {
  const [rsvps, setRsvps] = useState<RsvpItem[]>(initialRsvps);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [copied, setCopied] = useState(false);
  const [showLinkGen, setShowLinkGen] = useState(false);

  const isArabic = invitation.language !== 'en';
  const weddingDate = new Date(invitation.weddingDate);
  const formattedDate = weddingDate.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Derived metrics
  const attendingList = useMemo(() => rsvps.filter(r => r.attendance === 'yes'), [rsvps]);
  const declinedList = useMemo(() => rsvps.filter(r => r.attendance === 'no'), [rsvps]);
  const totalGuestsCount = useMemo(() => attendingList.reduce((acc, r) => acc + (r.guestsCount || 1), 0), [attendingList]);

  // Filtered items
  const filteredRsvps = useMemo(() => {
    return rsvps.filter(r => {
      const matchFilter = filter === 'all' ? true : r.attendance === filter;
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
        (r.notes && r.notes.toLowerCase().includes(search.toLowerCase()));
      return matchFilter && matchSearch;
    });
  }, [rsvps, filter, search]);

  // Generate clean text summary for WhatsApp or Clipboard
  const generateSummaryText = () => {
    const title = isArabic 
      ? `📋 تقرير حضور حفل زفاف ${invitation.groomName} & ${invitation.brideName}`
      : `📋 RSVP Attendance Report: ${invitation.groomName} & ${invitation.brideName}`;
    
    const stats = isArabic
      ? `\n✨ إجمالي الحاضرين المؤكدين: ${attendingList.length} شخص\n👥 إجمالي الأفراد مع المرافقين: ${totalGuestsCount} فرد\n🤍 المعتذرين: ${declinedList.length}\n📍 المكان: ${invitation.venueName}\n📅 الموعد: ${formattedDate}\n`
      : `\n✨ Confirmed Attendees: ${attendingList.length}\n👥 Total Guests with Companions: ${totalGuestsCount}\n🤍 Declined: ${declinedList.length}\n📍 Venue: ${invitation.venueName}\n📅 Date: ${formattedDate}\n`;

    const attendingNames = attendingList.map((r, i) => `${i + 1}. ${r.name} (${r.guestsCount > 1 ? `${r.guestsCount} أفراد` : 'شخص واحد'})${r.notes ? ` - "${r.notes}"` : ''}`).join('\n');

    return `${title}\n${stats}\nقائمة الحاضرين:\n${attendingNames}`;
  };

  const handleCopySummary = () => {
    const text = generateSummaryText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(generateSummaryText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="min-h-screen bg-[#FAF7F2] text-[#4A3210] font-sans antialiased selection:bg-[#D4AF37]/30"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Decorative Royal Top Border */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#8C6D38] via-[#E5C987] to-[#8C6D38]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EADCC5]/70">
          <Link 
            href={`/${invitation.slug}`}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#8C6D38] hover:text-[#5F451B] bg-white px-3.5 py-2 rounded-full border border-[#D5C7B2]/60 shadow-2xs hover:shadow-xs transition-all active:scale-95"
          >
            {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isArabic ? 'العودة لبطاقة الدعوة' : 'Back to Invitation'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <a 
              href={`/${invitation.slug}/card`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6D38] hover:text-[#5F451B] bg-white px-3.5 py-2 rounded-full border border-[#D5C7B2]/60 shadow-2xs hover:shadow-xs transition-all active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{isArabic ? 'بطاقة QR للطباعة' : 'Printable QR Card'}</span>
            </a>

            <button
              type="button"
              onClick={() => setShowLinkGen(prev => !prev)}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full border transition-all active:scale-95 ${
                showLinkGen 
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-[#F4EDE2] text-[#8C6D38] border-[#D5C7B2]/60 hover:bg-[#ebdcc8]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{isArabic ? 'مولّد روابط المعازيم' : 'Personalized Invites'}</span>
            </button>
          </div>
        </div>

        {/* Personalized Links Generator Drawer */}
        {showLinkGen && (
          <div className="mb-8">
            <PersonalizedLinksGenerator 
              slug={invitation.slug}
              groomName={invitation.groomName}
              brideName={invitation.brideName}
              isArabic={isArabic}
            />
          </div>
        )}

        {/* Header Hero Section */}
        <header className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-[#D5C7B2]/80 shadow-xs mb-1 text-[#8C6D38]">
            <Heart className="w-6 h-6 fill-[#8C6D38]" />
          </div>

          <h1 
            className="text-3xl sm:text-4xl font-extrabold text-[#4A3210] tracking-tight"
            style={{ fontFamily: isArabic ? "'Aref Ruqaa', 'Amiri', serif" : "'Cinzel', serif" }}
          >
            {invitation.groomName} <span className="text-[#C5A059] font-serif font-light">&</span> {invitation.brideName}
          </h1>

          <p className="text-sm sm:text-base font-bold text-[#8C6D38]">
            {isArabic ? 'سجل تأكيدات الحضور والاعتذارات' : 'Wedding RSVP & Attendance Registry'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#785D36] pt-1">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{formattedDate}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{invitation.venueName}</span>
            </span>
          </div>
        </header>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {/* 1. Confirmed Attending */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-bold text-emerald-900">
                {isArabic ? 'المؤكدين للحضور' : 'Attending'}
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 leading-none">
                {attendingList.length}
              </span>
              <span className="text-xs text-emerald-800/70 block mt-1">
                {isArabic ? 'دعوة مؤكدة' : 'Confirmed'}
              </span>
            </div>
          </div>

          {/* 2. Total Heads (Seats / Catering) */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-100/50 to-amber-50 p-4 sm:p-5 rounded-2xl border border-amber-300 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-bold text-[#6E4D1D]">
                {isArabic ? 'إجمالي الأفراد والمرافقين' : 'Total Headcount'}
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-[#8C6D38] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#543914] leading-none">
                {totalGuestsCount}
              </span>
              <span className="text-xs text-[#8C6D38] font-bold block mt-1">
                {isArabic ? 'مقعد / فرد للحفل' : 'Seats / Guests'}
              </span>
            </div>
          </div>

          {/* 3. Declined */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-bold text-stone-700">
                {isArabic ? 'المعتذرين' : 'Declined'}
              </span>
              <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center shrink-0">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-700 leading-none">
                {declinedList.length}
              </span>
              <span className="text-xs text-stone-500 block mt-1">
                {isArabic ? 'اعتذروا عن الحضور' : 'Apologized'}
              </span>
            </div>
          </div>

          {/* 4. Total Responses */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D5C7B2]/70 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-bold text-[#8C6D38]">
                {isArabic ? 'إجمالي الردود' : 'Total Responses'}
              </span>
              <div className="w-8 h-8 rounded-full bg-[#FAF5ED] text-[#8C6D38] flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#4A3210] leading-none">
                {rsvps.length}
              </span>
              <span className="text-xs text-[#8C6D38] block mt-1">
                {isArabic ? 'تم الرد' : 'Responses'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Toolbar: Search + Filter Tabs + Share/Print Buttons */}
        <div className="bg-white p-4 rounded-2xl border border-[#D5C7B2]/70 shadow-xs mb-6 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4 print:hidden">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className={`w-4 h-4 text-stone-400 absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3' : 'left-3'}`} />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isArabic ? 'ابحث باسم الضيف أو بالرسالة...' : 'Search guest name or note...'}
              className={`w-full py-2 ${isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-xs sm:text-sm bg-[#FAF8F5] border border-[#E0D5C1] rounded-xl focus:outline-none focus:border-[#8C6D38] focus:bg-white transition-all`}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-[#8C6D38] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#6E4D1D] hover:bg-[#F0E5D3] border border-[#E0D5C1]/70'
              }`}
            >
              {isArabic ? `الكل (${rsvps.length})` : `All (${rsvps.length})`}
            </button>
            <button
              onClick={() => setFilter('yes')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filter === 'yes'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              {isArabic ? `المؤكدين (${attendingList.length})` : `Attending (${attendingList.length})`}
            </button>
            <button
              onClick={() => setFilter('no')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filter === 'no'
                  ? 'bg-stone-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              {isArabic ? `المعتذرين (${declinedList.length})` : `Declined (${declinedList.length})`}
            </button>
          </div>

          {/* Actions: Copy, WhatsApp, Print */}
          <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
            <button
              onClick={handleShareWhatsApp}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              title={isArabic ? 'مشاركة عبر واتساب' : 'Share via WhatsApp'}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isArabic ? 'واتساب' : 'WhatsApp'}</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#D5C7B2] text-[#6E4D1D] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
              title={isArabic ? 'نسخ التقرير' : 'Copy Summary'}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#8C6D38]" />}
              <span className="hidden sm:inline">{copied ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ' : 'Copy')}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#D5C7B2] text-[#6E4D1D] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
              title={isArabic ? 'طباعة القائمة' : 'Print List'}
            >
              <Printer className="w-3.5 h-3.5 text-[#8C6D38]" />
              <span className="hidden sm:inline">{isArabic ? 'طباعة' : 'Print'}</span>
            </button>
          </div>

        </div>

        {/* Guests List */}
        {filteredRsvps.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-[#D5C7B2]/70 shadow-xs space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#FAF5ED] text-[#8C6D38] flex items-center justify-center mx-auto mb-2 border border-[#E0D5C1]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#543914]">
              {search 
                ? (isArabic ? 'لا توجد نتائج مطابقة لبحثك' : 'No matching results found')
                : (isArabic ? 'لم يتم تسجيل أي ردود حضور حتى الآن' : 'No RSVPs received yet')}
            </h3>
            <p className="text-xs sm:text-sm text-[#8C6D38] max-w-md mx-auto">
              {search
                ? (isArabic ? 'تأكد من كتابة الاسم بصورة صحيحة أو قم بإلغاء الفلترة' : 'Try searching with a different name or clear filters')
                : (isArabic ? 'بمجرد أن يقوم المدعوون بتأكيد حضورهم عبر بطاقة الدعوة ستظهر أسماؤهم وتفاصيلهم هنا مباشرة.' : 'When guests confirm their attendance, their names and details will appear here immediately.')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {filteredRsvps.map((rsvp, idx) => {
              const isAttending = rsvp.attendance === 'yes';
              const createdDate = new Date(rsvp.createdAt);
              const timeString = createdDate.toLocaleTimeString(isArabic ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
              const dateString = createdDate.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' });

              return (
                <div 
                  key={rsvp.id || idx}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 shadow-2xs hover:shadow-xs flex flex-col justify-between ${
                    isAttending ? 'border-emerald-200/90' : 'border-stone-200'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top row: Name + Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Avatar Initial Circle */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isAttending ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {rsvp.name.trim().charAt(0) || 'D'}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm sm:text-base text-[#4A3210] truncate">
                            {rsvp.name}
                          </h4>
                          <span className="text-[10px] text-[#8C6D38]">
                            {dateString} • {timeString}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 flex items-center gap-1 ${
                        isAttending 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}>
                        {isAttending ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{isAttending ? (isArabic ? 'سأحضر' : 'Attending') : (isArabic ? 'معتذر' : 'Declined')}</span>
                      </span>
                    </div>

                    {/* Guests count badge (if attending) */}
                    {isAttending && (
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <span className="bg-[#FAF5ED] text-[#7A5B28] px-2.5 py-0.5 rounded-lg border border-[#E5DAC6] font-semibold flex items-center gap-1">
                          <Users className="w-3 h-3 text-[#A67C37]" />
                          <span>
                            {rsvp.guestsCount === 1 
                              ? (isArabic ? 'شخص واحد (أنا فقط)' : '1 person (myself only)')
                              : rsvp.guestsCount === 2 
                                ? (isArabic ? 'شخصان (2)' : '2 guests')
                                : (isArabic ? `${rsvp.guestsCount} أشخاص` : `${rsvp.guestsCount} guests`)}
                          </span>
                        </span>
                        {rsvp.phone && (
                          <span className="text-stone-500 font-mono text-[11px]">
                            {rsvp.phone}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Note / Wish message if provided */}
                    {rsvp.notes && (
                      <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC5]/60 text-xs text-[#5F451B] leading-relaxed relative italic">
                        &quot;{rsvp.notes}&quot;
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center pt-10 pb-6 text-xs text-[#8C6D38] border-t border-[#EADCC5]/70 mt-10 space-y-1">
          <p>© {invitation.groomName} & {invitation.brideName} — {isArabic ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}</p>
          <p className="text-[10px] text-stone-400">Powered by Luxury Digital Wedding Invitations</p>
        </footer>

      </div>
    </div>
  );
}
