'use client';

import React, { useRef, useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { 
  Printer, 
  Download, 
  Share2, 
  ExternalLink, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Check, 
  Copy,
  ArrowRight
} from 'lucide-react';

interface PrintableQrCardProps {
  slug: string;
  groomName: string;
  brideName: string;
  weddingDate: Date | string;
  weddingTime?: string;
  venueName: string;
  venueAddress?: string;
  guestName?: string;
  language?: 'ar' | 'en';
}

export default function PrintableQrCard({
  slug,
  groomName,
  brideName,
  weddingDate: rawDate,
  weddingTime,
  venueName,
  venueAddress,
  guestName,
  language = 'ar'
}: PrintableQrCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const weddingDate = new Date(rawDate);
  const isAr = language === 'ar' || /[\u0600-\u06FF]/.test(groomName || brideName || '');

  // Format dates
  const formattedDate = isAr
    ? weddingDate.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : weddingDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Full URL for invitation
  const inviteUrl = origin 
    ? `${origin}/${slug}${guestName ? `?to=${encodeURIComponent(guestName)}` : ''}`
    : `/${slug}${guestName ? `?to=${encodeURIComponent(guestName)}` : ''}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = isAr
      ? `يسعدنا ويشرفنا دعوتكم لحضور حفل زفاف ${groomName} & ${brideName} ✨%0A%0Aامسح الرمز أو افتح الرابط لمشاهدة بطاقة الدعوة التفاعلية وتأكيد الحضور:%0A${encodeURIComponent(inviteUrl)}`
      : `We cordially invite you to celebrate the wedding of ${groomName} & ${brideName} ✨%0A%0AScan the QR code or visit the link to view our interactive invitation:%0A${encodeURIComponent(inviteUrl)}`;
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // High-Resolution 1200x1800 PNG Canvas Generation
  const handleDownloadImage = async () => {
    try {
      setIsDownloading(true);

      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1800;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Background (Warm Royal Ivory with radial glow)
      const grad = ctx.createRadialGradient(600, 700, 100, 600, 900, 900);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.5, '#FAF6EE');
      grad.addColorStop(1, '#F3E8D3');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 1800);

      // 2. Double Gold Borders
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 50, 1100, 1700);

      ctx.strokeStyle = '#8C6D38';
      ctx.lineWidth = 2;
      ctx.strokeRect(66, 66, 1068, 1668);

      // Corner Ornaments
      const drawCorner = (x: number, y: number, rot: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 40);
        ctx.lineTo(0, 0);
        ctx.lineTo(40, 0);
        ctx.stroke();

        ctx.fillStyle = '#8C6D38';
        ctx.beginPath();
        ctx.arc(8, 8, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      drawCorner(78, 78, 0);
      drawCorner(1122, 78, Math.PI / 2);
      drawCorner(1122, 1722, Math.PI);
      drawCorner(78, 1722, -Math.PI / 2);

      // 3. Basmala & Top Badge
      ctx.textAlign = 'center';
      ctx.fillStyle = '#8C6D38';
      ctx.font = 'bold 34px "Aref Ruqaa", "Amiri", serif';
      ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', 600, 160);

      ctx.fillStyle = '#A37E36';
      ctx.font = 'bold 24px "Cinzel", "Amiri", serif';
      ctx.fillText(isAr ? '⚜️ دَعْـوَةُ زَفَـافٍ مَلَكِـيَّة ⚜️' : '⚜️ ROYAL WEDDING INVITATION ⚜️', 600, 225);

      // 4. Couple Names
      ctx.fillStyle = '#3E2711';
      ctx.font = 'bold 64px "Aref Ruqaa", "Amiri", "Great Vibes", serif';
      const namesText = isAr 
        ? `${groomName}  &  ${brideName}`
        : `${groomName} & ${brideName}`;
      ctx.fillText(namesText, 600, 330);

      // If guest name is provided
      if (guestName) {
        ctx.fillStyle = '#6E4D1D';
        ctx.font = 'bold 28px "Aref Ruqaa", "Amiri", serif';
        ctx.fillText(isAr ? `يتشرف العروسان بدعوة: ${guestName}` : `Cordially Invited: ${guestName}`, 600, 400);
      }

      // 5. Wedding Date & Venue
      const dateY = guestName ? 465 : 435;
      ctx.fillStyle = '#5A3D18';
      ctx.font = 'bold 30px "Aref Ruqaa", "Amiri", serif';
      ctx.fillText(`📅  ${formattedDate}${weddingTime ? `  |  الساعة ${weddingTime}` : ''}`, 600, dateY);

      ctx.fillStyle = '#735227';
      ctx.font = '26px "Aref Ruqaa", "Amiri", serif';
      ctx.fillText(`📍  ${venueName}${venueAddress ? ` - ${venueAddress}` : ''}`, 600, dateY + 50);

      // 6. Draw QR Code Plaque & Image
      const qrBoxSize = 520;
      const qrBoxX = (1200 - qrBoxSize) / 2;
      const qrBoxY = dateY + 110;

      // QR Plaque White Box
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(140, 109, 56, 0.25)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 8;
      ctx.fillRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);
      ctx.shadowColor = 'transparent';

      // QR Plaque Border
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 3;
      ctx.strokeRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);

      // Convert SVG QR code from DOM to Image
      const svgElement = cardRef.current?.querySelector('svg');
      if (svgElement) {
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        const img = new Image();
        await new Promise((resolve) => {
          img.onload = () => {
            const qrPadding = 36;
            ctx.drawImage(img, qrBoxX + qrPadding, qrBoxY + qrPadding, qrBoxSize - qrPadding * 2, qrBoxSize - qrPadding * 2);
            URL.revokeObjectURL(blobURL);
            resolve(true);
          };
          img.src = blobURL;
        });
      }

      // 7. Scan Instruction Text Under QR Code
      const instrY = qrBoxY + qrBoxSize + 75;
      ctx.fillStyle = '#3E2711';
      ctx.font = 'bold 30px "Aref Ruqaa", "Amiri", serif';
      ctx.fillText(
        isAr ? 'امسحوا رمز الاستجابة السريعة (QR) بكاميرا الهاتف' : 'Scan the QR Code with your mobile camera',
        600,
        instrY
      );

      ctx.fillStyle = '#6E4D1D';
      ctx.font = '24px "Aref Ruqaa", "Amiri", serif';
      ctx.fillText(
        isAr ? 'لفتح بطاقة الدعوة التفاعلية، الاستماع للموسيقى، وتأكيد الحضور' : 'To open the interactive wedding invitation and confirm RSVP',
        600,
        instrY + 45
      );

      // 8. Footer Warm Blessing
      ctx.fillStyle = '#8C6D38';
      ctx.font = 'bold 26px "Aref Ruqaa", "Amiri", serif';
      ctx.fillText(
        isAr ? 'يسعدنا ويشرفنا حضوركم ومشاركتنا فرحتنا ✨' : 'We look forward to celebrating this special day with you ✨',
        600,
        1670
      );

      // 9. Download the created image
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = `دعوة_${groomName}_${brideName}_QR.png`;
      a.href = dataUrl;
      a.click();
    } catch (err) {
      console.error('Failed to generate PNG:', err);
      alert('حدث خطأ أثناء تحميل الصورة، يرجى المحاولة مرة أخرى أو استخدام زر الطباعة.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDE7DD] py-8 px-4 flex flex-col items-center justify-center font-serif text-[#3D2810]">
      
      {/* ========================================================= */}
      {/* SCREEN CONTROLS BAR (Hidden during printing) */}
      {/* ========================================================= */}
      <div className="w-full max-w-xl mb-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-[#D4AF37]/40 flex flex-wrap items-center justify-between gap-3 print:hidden">
        
        {/* Back Link */}
        <a 
          href={`/${slug}${guestName ? `?to=${encodeURIComponent(guestName)}` : ''}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6D38] hover:text-[#5A3D18] transition-colors"
        >
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          <span>{isAr ? 'العودة للدعوة التفاعلية' : 'Back to Invitation'}</span>
        </a>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="px-3 py-1.5 rounded-full bg-[#8C6D38] hover:bg-[#6E4D1D] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-50"
            title="تحميل كصورة عالية الدقة PNG"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? (isAr ? 'جاري التنزيل...' : 'Generating...') : (isAr ? 'تحميل صورة PNG' : 'Download PNG')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            title="طباعة البطاقة مباشرة"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>{isAr ? 'طباعة' : 'Print'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="px-3 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            title="مشاركة عبر واتساب"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            title="نسخ رابط الدعوة"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy Link')}</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* THE LUXURY PHYSICAL INVITATION CARD (4x6 Aspect Ratio) */}
      {/* Optimized for both Screen display and High-Res Printing */}
      {/* ========================================================= */}
      <div 
        ref={cardRef}
        id="printable-card"
        dir={isAr ? 'rtl' : 'ltr'}
        className="w-full max-w-[460px] aspect-[1/1.5] bg-gradient-to-b from-[#FAF7F2] via-[#FFFDF9] to-[#F5ECE0] rounded-[32px] p-6 sm:p-8 shadow-2xl border-4 border-[#D4AF37]/70 relative flex flex-col justify-between text-center select-none print:shadow-none print:border-2 print:m-0 print:w-full print:max-w-none print:rounded-none"
      >
        {/* Inner Ornate Filigree Border */}
        <div className="absolute inset-3 sm:inset-4 border-2 border-[#8C6D38]/40 rounded-[24px] pointer-events-none" />

        {/* 4 Corner Golden Ornaments */}
        <div className="absolute top-5 left-5 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none" />
        <div className="absolute top-5 right-5 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none" />
        <div className="absolute bottom-5 left-5 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none" />
        <div className="absolute bottom-5 right-5 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none" />

        {/* 1. Header (Basmala & Title) */}
        <div className="space-y-1 pt-2">
          <p 
            className="text-sm sm:text-base font-bold text-[#8C6D38] tracking-wide"
            style={{ fontFamily: "'Aref Ruqaa', serif" }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#DFBA73]/20 border border-[#DFBA73]/50 text-[11px] font-bold text-[#6E4D1D]">
            <Sparkles className="w-3 h-3 text-[#8C6D38]" />
            <span>{isAr ? 'دعوة زفاف إلكترونية تفاعلية' : 'Interactive Wedding Invitation'}</span>
          </div>
        </div>

        {/* 2. Couple Names */}
        <div className="space-y-1 my-1">
          <h1 
            className="text-3xl sm:text-4xl font-extrabold text-[#3E2711] leading-tight flex items-center justify-center gap-2"
            style={{ 
              fontFamily: isAr ? "'Aref Ruqaa', serif" : "'Alex Brush', cursive",
              textShadow: '0 1px 2px rgba(255,255,255,0.9)'
            }}
          >
            <span>{groomName}</span>
            <span className="text-[#8C682A] font-serif text-2xl leading-none">&</span>
            <span>{brideName}</span>
          </h1>

          {/* Personalized Guest Badge if provided */}
          {guestName && (
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#8C6D38]/10 border border-[#8C6D38]/30 text-xs font-bold text-[#5A3D18]">
              <span>{isAr ? `يتشرف العروسان بدعوة: ${guestName}` : `Cordially Invited: ${guestName}`}</span>
            </div>
          )}
        </div>

        {/* 3. Event Summary: Date & Venue */}
        <div className="space-y-1 text-xs text-[#5A3D18]">
          <div className="flex items-center justify-center gap-1.5 font-bold">
            <Calendar className="w-3.5 h-3.5 text-[#8C6D38]" />
            <span>{formattedDate}</span>
            {weddingTime && <span>• الساعة {weddingTime}</span>}
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#735227]">
            <MapPin className="w-3.5 h-3.5 text-[#8C6D38]" />
            <span className="font-semibold">{venueName}</span>
            {venueAddress && <span>- {venueAddress}</span>}
          </div>
        </div>

        {/* 4. The Centerpiece - QR Code Box */}
        <div className="my-2 flex flex-col items-center">
          <div className="p-3 bg-white rounded-2xl border-2 border-[#D4AF37] shadow-xl relative group">
            <div className="p-1 bg-white rounded-xl">
              <QRCode
                value={inviteUrl}
                size={180}
                bgColor="#FFFFFF"
                fgColor="#3E2711"
                level="H"
              />
            </div>
            {/* Corner Filigree accents */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#8C6D38]" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#8C6D38]" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#8C6D38]" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#8C6D38]" />
          </div>
        </div>

        {/* 5. Scan Instructions Text */}
        <div className="space-y-1">
          <p 
            className="text-xs sm:text-sm font-bold text-[#3E2711]"
            style={{ fontFamily: "'Aref Ruqaa', serif" }}
          >
            {isAr ? 'امسح الرمز بكاميرا هاتفك' : 'Scan QR code with your phone camera'}
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#6E4D1D] max-w-xs mx-auto leading-relaxed">
            {isAr 
              ? 'للدخول إلى بطاقة الدعوة التفاعلية، الاستماع للموسيقى، وتأكيد الحضور'
              : 'To experience the interactive invitation, music, and confirm your RSVP'}
          </p>
        </div>

        {/* 6. Footer Note */}
        <div className="pt-2 border-t border-[#D4AF37]/40 text-[10px] sm:text-[11px] text-[#8C6D38] font-bold">
          {isAr ? 'يسعدنا ويشرفنا حضوركم ومشاركتنا فرحتنا ✨' : 'We look forward to celebrating together ✨'}
        </div>
      </div>

      {/* Print-specific style */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          #printable-card {
            box-shadow: none !important;
            border: 2px solid #D4AF37 !important;
            width: 100% !important;
            max-width: 500px !important;
            margin: auto !important;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
