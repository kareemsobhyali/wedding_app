'use client';

import React, { useState } from 'react';
import { Sparkles, QrCode, CheckCircle2, X } from 'lucide-react';

interface UniversalInvitationOverlayProps {
  slug: string;
  guestName?: string;
  isArabic?: boolean;
}

export default function UniversalInvitationOverlay({
  slug,
  guestName,
  isArabic = true
}: UniversalInvitationOverlayProps) {
  const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <>
      {/* 1. Personalized Floating Greeting Banner (Shown at Top when ?to= is present) */}
      {guestName && bannerVisible && (
        <div 
          className="fixed top-3 inset-x-0 mx-auto w-fit max-w-[90vw] z-50 pointer-events-auto animate-fade-in"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/75 hover:bg-black/85 backdrop-blur-md border border-[#D4AF37]/80 text-[#FFE8A3] text-xs sm:text-sm font-bold shadow-2xl transition-all">
            <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse shrink-0" />
            <span className="truncate">
              {isArabic ? `دعوة خاصة لـ: ${guestName}` : `Special Invitation for: ${guestName}`}
            </span>
            <button
              onClick={() => setBannerVisible(false)}
              className="mr-1 sm:mr-2 p-1 text-white/60 hover:text-white rounded-full transition-colors"
              title={isArabic ? 'إغلاق' : 'Close'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Floating Discreet Quick Access Bar (Bottom-Right / Left) */}
      <div 
        className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 flex items-center gap-2 pointer-events-auto print:hidden"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <a
          href={`/${slug}/card${guestName ? `?to=${encodeURIComponent(guestName)}` : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          title={isArabic ? 'عرض بطاقة QR للطباعة والتنزيل' : 'Printable QR Card'}
          className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-md text-[#8C6D38] border border-[#D4AF37]/60 shadow-lg text-xs font-bold flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95"
        >
          <QrCode className="w-3.5 h-3.5 text-[#8C6D38]" />
          <span className="hidden sm:inline">{isArabic ? 'بطاقة QR' : 'QR Card'}</span>
        </a>

        <a
          href={`/${slug}/rsvp`}
          target="_blank"
          rel="noopener noreferrer"
          title={isArabic ? 'عرض قائمة الحضور وتأكيد الحضور' : 'RSVP Guest List'}
          className="px-3 py-1.5 rounded-full bg-[#8C6D38] hover:bg-[#6E4D1D] text-white shadow-lg text-xs font-bold flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#FFE8A3]" />
          <span className="hidden sm:inline">{isArabic ? 'قائمة الحضور' : 'RSVP'}</span>
        </a>
      </div>
    </>
  );
}
