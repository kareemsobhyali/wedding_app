'use client';

import React, { useState, useRef } from 'react';
import { TemplateRenderContext } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Send, 
  Check, 
  Heart,
  Share2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

const isArabic = (text?: string): boolean => {
  if (!text) return false;
  return /[\u0600-\u06FF]/.test(text);
};

export const SculptedPorcelainArchTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpData, setRsvpData] = useState({ name: '', attendance: 'yes', guests: '1', note: '' });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const custom = data.customData || {};
  const weddingDate = new Date(data.weddingDate);

  // Month and Day formatting
  const isArabicContent = isArabic(data.groomName) || isArabic(custom.welcomeSubtitle1);
  const monthName = custom.dateMonth || (isArabicContent 
    ? weddingDate.toLocaleDateString('ar-EG', { month: 'long' })
    : weddingDate.toLocaleDateString('tr-TR', { month: 'long' }).toUpperCase()
  );
  const dayNumber = custom.dateDay || weddingDate.getDate().toString();
  const timeFormatted = custom.dateTime || (isArabicContent
    ? weddingDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    : weddingDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  );

  // 3D Tilt interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: -(y - 0.5) * 8,
      rotateY: (x - 0.5) * 8,
      sheenX: x * 100,
      sheenY: y * 100
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
  };

  const handleCardClick = () => {
    if (data.music && audioRef.current && !isPlayingAudio) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#D4AF37', '#F5E6BE', '#FFFFFF', '#C5A059']
    });
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSent(true);
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#FFF', '#E6C687']
    });
    setTimeout(() => {
      setShowRsvpModal(false);
      setRsvpSent(false);
    }, 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${data.groomName} & ${data.brideName}`,
        text: `دعوة زفاف ${data.groomName} و ${data.brideName}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ رابط الدعوة بنجاح!');
    }
  };

  // Google Calendar URL
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`حفل زفاف ${data.groomName} & ${data.brideName}`)}&dates=${weddingDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${weddingDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(data.weddingMessage || 'يسعدنا حضوركم')}&location=${encodeURIComponent(data.venueName || '')}`;

  return (
    <div 
      className="h-[100dvh] w-full flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 font-serif bg-[#EAE4DC] selection:bg-[#D4AF37]/30 text-[#4A3E31] overflow-hidden relative"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 40%, #FAF8F5 0%, #E3DCD3 100%)'
      }}
    >
      {/* Background Audio */}
      {data.music && (
        <audio ref={audioRef} src={data.music.url} loop preload="auto" />
      )}

      {/* Floating Header Controls */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-40 flex items-center gap-2">
        {data.music && (
          <button
            onClick={toggleAudio}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-[#D4AF37]/40 flex items-center justify-center text-[#8C6D38] hover:bg-[#8C6D38] hover:text-white transition-all transform hover:scale-105 active:scale-95"
            title={isPlayingAudio ? 'كتم الموسيقى' : 'تشغيل الموسيقى'}
          >
            {isPlayingAudio ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>
        )}
        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-[#D4AF37]/40 flex items-center justify-center text-[#8C6D38] hover:bg-[#8C6D38] hover:text-white transition-all transform hover:scale-105 active:scale-95"
          title="مشاركة الدعوة"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main 3D Card (Seamless Edge-to-Edge on Mobile, Luxury Floating Card on Desktop) */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="w-full h-full sm:w-auto sm:h-full sm:max-h-[92vh] sm:aspect-[9/16] sm:max-w-[480px] relative sm:rounded-[32px] rounded-none overflow-hidden shadow-none sm:shadow-[0_25px_60px_rgba(0,0,0,0.18),0_10px_25px_rgba(140,109,56,0.12)] cursor-pointer select-none group border-0 sm:border border-[#D4AF37]/20"
      >
        {/* Bas-Relief Sculpted Frame Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.008]"
          style={{
            backgroundImage: `url(/assets/templates/sculpted-porcelain-bg.jpg)`
          }}
        />

        {/* Dynamic Specular Sheen Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-soft-light transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 350px at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(255,255,255,0.9), transparent 80%)`
          }}
        />

        {/* Central Cartouche Typography & Layout (STRICTLY INSIDE THE IVORY OVAL) */}
        <div 
          className="absolute top-[27.5%] bottom-[28.5%] left-[10%] right-[10%] flex flex-col items-center justify-between z-10 text-center pointer-events-none select-none max-w-[310px] mx-auto py-0.5"
        >
          {/* 1. Top Opening Blessing / Verses (Lowered safely away from top arch) */}
          <div className="space-y-1 max-w-[270px] w-full">
            {custom.welcomeSubtitle1 && (
              <p 
                className={isArabic(custom.welcomeSubtitle1) 
                  ? "text-base sm:text-lg md:text-xl text-[#7D5A1E] font-bold tracking-normal leading-normal font-amiri" 
                  : "text-xs sm:text-sm uppercase tracking-[0.18em] text-[#8C6D38] font-semibold leading-relaxed font-cinzel"}
                style={{ fontFamily: isArabic(custom.welcomeSubtitle1) ? "'Amiri', 'Aref Ruqaa', serif" : "'Cinzel', serif" }}
              >
                {custom.welcomeSubtitle1}
              </p>
            )}
            {custom.welcomeSubtitle2 && (
              <p 
                className={isArabic(custom.welcomeSubtitle2) 
                  ? "text-sm sm:text-base md:text-lg text-[#7D5A1E] font-bold tracking-normal leading-snug font-amiri" 
                  : "text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#8C6D38] font-medium leading-normal font-cinzel"}
                style={{ fontFamily: isArabic(custom.welcomeSubtitle2) ? "'Amiri', serif" : "'Cinzel', serif" }}
              >
                {custom.welcomeSubtitle2}
              </p>
            )}
            {custom.welcomeSubtitle3 && (
              <p 
                className={isArabic(custom.welcomeSubtitle3) 
                  ? "text-sm sm:text-base md:text-lg text-[#8C6D38] font-semibold tracking-normal leading-snug font-amiri" 
                  : "text-[11px] sm:text-xs uppercase tracking-[0.12em] text-[#8C6D38] font-medium leading-normal font-cinzel"}
                style={{ fontFamily: isArabic(custom.welcomeSubtitle3) ? "'Amiri', serif" : "'Cinzel', serif" }}
              >
                {custom.welcomeSubtitle3}
              </p>
            )}
          </div>

          {/* 2. Couple Names (Centerpiece Grand Calligraphy - Royal & Perfectly Centered) */}
          <div className="my-1 max-w-[310px] w-full">
            <div 
              className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap"
              dir={isArabic(data.groomName || data.brideName) ? "rtl" : "ltr"}
            >
              <span 
                className="text-4xl sm:text-5xl md:text-6xl text-[#6B4B18] font-normal leading-none py-0.5"
                style={{ 
                  fontFamily: isArabic(data.groomName) ? "'Aref Ruqaa', 'Amiri', serif" : "'Alex Brush', 'Great Vibes', cursive",
                  textShadow: '0 1px 2px rgba(255,255,255,0.95), 0 0 1px rgba(107,75,24,0.15)'
                }}
              >
                {data.groomName}
              </span>
              <span 
                className="text-xl sm:text-2xl md:text-3xl text-[#9E7B3A] italic font-serif px-1.5 font-bold"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {custom.connectorText || (isArabic(data.groomName) ? 'و' : 'Ve')}
              </span>
              <span 
                className="text-4xl sm:text-5xl md:text-6xl text-[#6B4B18] font-normal leading-none py-0.5"
                style={{ 
                  fontFamily: isArabic(data.brideName) ? "'Aref Ruqaa', 'Amiri', serif" : "'Alex Brush', 'Great Vibes', cursive",
                  textShadow: '0 1px 2px rgba(255,255,255,0.95), 0 0 1px rgba(107,75,24,0.15)'
                }}
              >
                {data.brideName}
              </span>
            </div>

            {/* Gold Heart Filigree Flourish SVG */}
            <div className="flex items-center justify-center my-1">
              <svg width="120" height="12" viewBox="0 0 120 14" fill="none" className="text-[#8C6D38]">
                <path d="M0 7H46M74 7H120" stroke="currentColor" strokeWidth="1" strokeOpacity="0.8"/>
                <circle cx="48" cy="7" r="1.5" fill="currentColor"/>
                <circle cx="72" cy="7" r="1.5" fill="currentColor"/>
                <path d="M60 11C60 11 54 7 54 4.5C54 3 55.5 2 57 2C58.5 2 60 3.5 60 3.5C60 3.5 61.5 2 63 2C64.5 2 66 3 66 4.5C66 7 60 11 60 11Z" fill="currentColor"/>
              </svg>
            </div>
          </div>

          {/* 3. Host Families Section */}
          <div className="space-y-1 max-w-[280px] w-full">
            <p 
              className={isArabic(custom.hostFamiliesTitle) 
                ? "text-sm sm:text-base md:text-lg text-[#7D5A1E] font-bold tracking-normal font-amiri" 
                : "text-xs sm:text-sm uppercase tracking-[0.16em] text-[#7D5A1E] font-bold font-cinzel"}
              style={{ fontFamily: isArabic(custom.hostFamiliesTitle) ? "'Amiri', 'Aref Ruqaa', serif" : "'Cinzel', serif" }}
            >
              {custom.hostFamiliesTitle || (isArabicContent ? 'بمباركة الأهل والأحباب' : 'ATALAY VE UYSAL AİLESİ')}
            </p>

            {/* Two Family Columns with Vertical Divider */}
            {(custom.family1Father || custom.family2Father) && (
              <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-[#694E23] pt-0.5">
                <div className="text-center font-medium" style={{ fontFamily: isArabic(custom.family1Father) ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>
                  <p className="font-bold">{custom.family1Father}</p>
                  {custom.family1Surname && <p className="text-xs text-[#8C6D38]">{custom.family1Surname}</p>}
                </div>

                {/* Vertical Divider */}
                <div className="h-4 w-[1px] bg-gradient-to-b from-transparent via-[#8C6D38] to-transparent relative flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#8C6D38] absolute" />
                </div>

                <div className="text-center font-medium" style={{ fontFamily: isArabic(custom.family2Father) ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>
                  <p className="font-bold">{custom.family2Father}</p>
                  {custom.family2Surname && <p className="text-xs text-[#8C6D38]">{custom.family2Surname}</p>}
                </div>
              </div>
            )}

            {/* Ceremony Label (e.g. "طلعه ب الحب") */}
            {custom.ceremonyLabel && (
              <p 
                className={isArabic(custom.ceremonyLabel) 
                  ? "text-xs sm:text-sm md:text-base font-bold text-[#7D5A1E] tracking-normal font-amiri pt-0.5" 
                  : "text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-[#7D5A1E] font-cinzel pt-0.5"}
                style={{ fontFamily: isArabic(custom.ceremonyLabel) ? "'Amiri', serif" : "'Cinzel', serif" }}
              >
                {custom.ceremonyLabel}
              </p>
            )}
          </div>

          {/* 4. Signature Calendar Date Section (Slightly Scaled Down & Narrower to never touch frame edges) */}
          <div className="w-full max-w-[185px] sm:max-w-[200px] flex flex-col items-center py-0.5">
            <div className="w-full border-t border-[#8C6D38]/45 my-0.5" />
            
            <div className="w-full flex items-center justify-between px-1.5 py-0.5">
              {/* Month Name */}
              <span 
                className={isArabic(monthName) 
                  ? "text-xs sm:text-sm font-bold text-[#7D5A1E] tracking-normal font-amiri" 
                  : "text-[10px] sm:text-[11px] font-bold tracking-[0.14em] text-[#7D5A1E] uppercase font-cinzel"}
                style={{ fontFamily: isArabic(monthName) ? "'Amiri', serif" : "'Cinzel', serif" }}
              >
                {monthName}
              </span>

              {/* Big Day Number */}
              <span 
                className="text-2xl sm:text-3xl font-bold text-[#6B4B18] px-1.5 leading-none"
                style={{ 
                  fontFamily: "'Cormorant Garamond', serif",
                  textShadow: '0 1px 2px rgba(255,255,255,0.9)'
                }}
              >
                {dayNumber}
              </span>

              {/* Time */}
              <span 
                className={isArabic(timeFormatted) 
                  ? "text-xs sm:text-sm font-bold text-[#7D5A1E] tracking-normal font-amiri" 
                  : "text-[9.5px] sm:text-[10px] font-bold tracking-[0.12em] text-[#7D5A1E] uppercase font-cinzel"}
                style={{ fontFamily: isArabic(timeFormatted) ? "'Amiri', serif" : "'Cinzel', serif" }}
              >
                {timeFormatted}
              </span>
            </div>

            <div className="w-full border-b border-[#8C6D38]/45 my-0.5" />
          </div>

          {/* 5. Venue (YER) Location Section (Raised Safely Above Bottom Sculpted Frame) */}
          <div className="space-y-0.5 max-w-[230px] w-full">
            <p 
              className={isArabic(custom.venueHeader) 
                ? "text-xs sm:text-sm font-bold text-[#7D5A1E] tracking-normal font-amiri" 
                : "text-[9.5px] sm:text-[10px] font-bold tracking-[0.14em] text-[#7D5A1E] uppercase font-cinzel"}
              style={{ fontFamily: isArabic(custom.venueHeader) ? "'Amiri', serif" : "'Cinzel', serif" }}
            >
              {custom.venueHeader || (isArabicContent ? 'المكان :' : 'YER :')}
            </p>
            {data.venueName && (
              <p 
                className={isArabic(data.venueName) 
                  ? "text-xs sm:text-sm font-bold text-[#6B4B18] tracking-normal font-amiri" 
                  : "text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#6B4B18] font-cinzel"}
                style={{ fontFamily: isArabic(data.venueName) ? "'Amiri', serif" : "'Cinzel', serif" }}
              >
                {data.venueName}
              </p>
            )}
            {(data.venueAddress || custom.venueStreet) && (
              <p className="text-[10px] sm:text-xs tracking-normal text-[#694E23] leading-tight line-clamp-1">
                {custom.venueStreet || data.venueAddress}
              </p>
            )}
          </div>

        </div>
      </motion.div>

      {/* Floating 3-Pill Luxury Dock (Grid 3-cols: Never wraps or truncates!) */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-[380px]">
        <div className="backdrop-blur-xl bg-white/95 border border-[#D4AF37]/50 shadow-[0_10px_30px_rgba(0,0,0,0.18)] rounded-full p-1.5 grid grid-cols-3 gap-1.5 items-center">
          {/* 1. Maps Button */}
          <a
            href={data.googleMapsUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-1 rounded-full bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#D4AF37]/30 text-[#7D5A1E] font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
            <span className="font-cairo truncate">الموقع</span>
          </a>

          {/* 2. Calendar Button */}
          <a
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-1 rounded-full bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#D4AF37]/30 text-[#7D5A1E] font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
            <span className="font-cairo truncate">الموعد</span>
          </a>

          {/* 3. Primary RSVP Button */}
          <button
            onClick={() => setShowRsvpModal(true)}
            className="w-full py-2 px-1 rounded-full bg-gradient-to-r from-[#A67C37] via-[#C5A059] to-[#8C6D38] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1 hover:brightness-110 active:scale-95 transition-all"
          >
            <Heart className="w-3.5 h-3.5 fill-white shrink-0" />
            <span className="font-cairo truncate">تأكيد الحضور</span>
          </button>
        </div>
      </div>

      {/* RSVP Modal Dialog */}
      <AnimatePresence>
        {showRsvpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#FAF8F5] border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative text-right"
              dir="rtl"
            >
              <button 
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-4 left-4 text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1 mb-5">
                <h3 
                  className="text-xl font-bold text-[#7D5A1E] font-cairo"
                >
                  تأكيد الحضور
                </h3>
                <p className="text-xs text-stone-600 font-cairo">
                  يسعدنا حضوركم ومشاركتنا فرحتنا الكبرى
                </p>
              </div>

              {rsvpSent ? (
                <div className="py-8 text-center space-y-3 font-cairo">
                  <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-stone-800">تم تسجيل حضوركم بنجاح!</h4>
                  <p className="text-xs text-stone-500">شكراً لكم، ننتظر رؤيتكم بكل ود وسعادة.</p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-3.5 font-cairo">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">الاسم الكريم</label>
                    <input 
                      type="text" 
                      required 
                      value={rsvpData.name}
                      onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#8C6D38] bg-white text-stone-800"
                      placeholder="اكتب اسمك الكريم"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">حالة الحضور</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRsvpData({ ...rsvpData, attendance: 'yes' })}
                        className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                          rsvpData.attendance === 'yes' 
                            ? 'bg-[#8C6D38] text-white border-[#8C6D38]' 
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        سأحضر بكل سرور ✨
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpData({ ...rsvpData, attendance: 'no' })}
                        className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                          rsvpData.attendance === 'no' 
                            ? 'bg-stone-700 text-white border-stone-700' 
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        أعتذر لظروف خاصة
                      </button>
                    </div>
                  </div>

                  {rsvpData.attendance === 'yes' && (
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">عدد المرافقين</label>
                      <select
                        value={rsvpData.guests}
                        onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#8C6D38] bg-white text-stone-800"
                      >
                        <option value="1">شخص واحد (أنا فقط)</option>
                        <option value="2">شخصان (2)</option>
                        <option value="3">3 أشخاص</option>
                        <option value="4">4 أشخاص أو أكثر</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">تهنئة أو رسالة للعروسين (اختياري)</label>
                    <textarea 
                      rows={2}
                      value={rsvpData.note}
                      onChange={(e) => setRsvpData({ ...rsvpData, note: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#8C6D38] bg-white text-stone-800"
                      placeholder="أجمل التمنيات..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#8C6D38] text-white font-medium text-xs hover:bg-[#7D5A1E] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#8C6D38]/30 font-bold"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال التأكيد</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
