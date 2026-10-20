'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, MessageCircle, Heart, ArrowRight } from 'lucide-react';

interface ExpiredInvitationProps {
  data: {
    id?: string;
    groomName?: string;
    brideName?: string;
    weddingDate?: Date | string;
    expiresAt?: Date | string | null;
    customerPhone?: string;
  };
}

export default function ExpiredInvitationScreen({ data }: ExpiredInvitationProps) {
  const formattedExpiry = data.expiresAt 
    ? new Date(data.expiresAt).toLocaleString('ar-EG', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : null;

  const whatsappMessage = encodeURIComponent(
    `مرحباً، أود الاستفسار بخصوص تجديد صلاحية دعوة الزفاف الخاصة بـ: (${data.groomName || 'العريس'} & ${data.brideName || 'العروس'}) 💍`
  );
  const whatsappUrl = `https://wa.me/201000000000?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#EBE2D3] flex items-center justify-center p-4 selection:bg-[#EBDCC0]" dir="rtl">
      
      {/* Background Ornament Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#C5A059]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8C6D38]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur-md rounded-[36px] p-8 sm:p-10 border border-[#E8DFC8] shadow-2xl text-center">
        
        {/* Golden Hourglass Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#8C6D38] via-[#C5A059] to-[#DFBA73] p-1 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#8C6D38]/20">
          <div className="w-full h-full bg-[#FAF7F2] rounded-[22px] flex items-center justify-center">
            <Clock className="w-9 h-9 text-[#8C6D38]" />
          </div>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#FAF0D7] border border-[#E5C987] text-[#8C6D38] text-xs font-bold mb-4">
          <span>⛔ انتهت صلاحية الرابط</span>
        </div>

        {/* Main Title */}
        <h1 
          className="text-2xl sm:text-3xl font-extrabold text-[#38260F] mb-3 leading-tight"
          style={{ fontFamily: "'Aref Ruqaa', serif" }}
        >
          عذراً، انتهت صلاحية هذه الدعوة
        </h1>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed max-w-sm mx-auto">
          نعتذر منكم؛ لقد انتهت الفترة الزمنية المحددة لعرض وتصفح رابط هذه الدعوة الإلكترونية.
        </p>

        {/* Couple Names Box */}
        {(data.groomName || data.brideName) && (
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBCA] mb-6">
            <span className="text-[11px] font-bold text-[#8C6D38] block mb-1">دعوة حفل زفاف</span>
            <div 
              className="text-xl sm:text-2xl font-bold text-[#4A3210] flex items-center justify-center gap-2"
              style={{ fontFamily: "'Aref Ruqaa', serif" }}
            >
              <span>{data.groomName || 'العريس'}</span>
              <Heart className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
              <span>{data.brideName || 'العروس'}</span>
            </div>
            {formattedExpiry && (
              <span className="text-[11px] text-gray-500 mt-1 block">
                تاريخ انتهاء الصلاحية: {formattedExpiry}
              </span>
            )}
          </div>
        )}

        {/* Notice for the owner/host */}
        <p className="text-xs text-gray-500 mb-8 leading-relaxed">
          إذا كنت صاحب الدعوة وترغب في تمديد الصلاحية أو إعادة تفعيل الرابط، يمكنك التواصل معنا مباشرة.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>تواصل لتجديد الصلاحية</span>
          </a>

          <Link
            href="/"
            className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F0E8D9] border border-[#D5C7B2] text-[#4A3210] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <span>زيارة المنصة</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
        </div>

      </div>

    </div>
  );
}
