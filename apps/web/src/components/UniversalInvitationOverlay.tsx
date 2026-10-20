'use client';

import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

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

  if (!guestName || !bannerVisible) {
    return null;
  }

  return (
    /* Personalized Floating Greeting Banner (Shown at Top when ?to= is present) */
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
  );
}
