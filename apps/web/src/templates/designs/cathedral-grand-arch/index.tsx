'use client';

import React, { useState, useRef } from 'react';
import { TemplateRenderContext } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  Send, 
  Check, 
  Heart,
  Share2,
  X,
  Church,
  Wine
} from 'lucide-react';
import confetti from 'canvas-confetti';

const isArabic = (text?: string): boolean => {
  if (!text) return false;
  return /[\u0600-\u06FF]/.test(text);
};

export const CathedralGrandArchTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpData, setRsvpData] = useState({ name: '', attendance: 'yes', guests: '1', note: '' });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const custom = data.customData || {};
  const weddingDate = new Date(data.weddingDate);

  // Formatted date values
  const isArabicContent = isArabic(data.groomName) || isArabic(data.brideName) || isArabic(custom.sacredQuote);
  const dayName = custom.dayName || (isArabicContent
    ? weddingDate.toLocaleDateString('ar-EG', { weekday: 'long' })
    : weddingDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
  );
  const dayNumber = custom.dayNumber || weddingDate.getDate().toString();
  const monthName = custom.monthName || (isArabicContent
    ? weddingDate.toLocaleDateString('ar-EG', { month: 'long' })
    : weddingDate.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()
  );
  const yearNumber = custom.yearNumber || weddingDate.getFullYear().toString();
  const timeFormatted = custom.ceremonyTime || (isArabicContent
    ? weddingDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    : weddingDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  );

  const handleCardClick = () => {
    if (data.music && audioRef.current && !isPlayingAudio) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    confetti({
      particleCount: 50,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#D4AF37', '#FFF8DC', '#FFFFFF', '#E6C687']
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
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#FFF', '#F5E6BE']
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
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Wedding of ${data.groomName} & ${data.brideName}`)}&dates=${weddingDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${weddingDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(data.weddingMessage || 'Joyfully invite you to celebrate our wedding')}&location=${encodeURIComponent(data.venueName || '')}`;

  return (
    <div 
      className="h-[100dvh] w-full flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 font-serif bg-[#181512] selection:bg-[#D4AF37]/40 text-[#43331C] overflow-hidden relative"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 40%, #2A231A 0%, #120F0C 100%)'
      }}
    >
      {/* Background Audio */}
      {data.music && (
        <audio ref={audioRef} src={data.music.url} loop preload="auto" />
      )}

      {/* Floating Controls */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-40 flex items-center gap-2">
        {data.music && (
          <button
            onClick={toggleAudio}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md shadow-lg border border-[#D4AF37]/50 flex items-center justify-center text-[#E6C687] hover:bg-[#8C6D38] hover:text-white transition-all transform hover:scale-105 active:scale-95"
            title={isPlayingAudio ? 'كتم الموسيقى' : 'تشغيل الموسيقى'}
          >
            {isPlayingAudio ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>
        )}
        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md shadow-lg border border-[#D4AF37]/50 flex items-center justify-center text-[#E6C687] hover:bg-[#8C6D38] hover:text-white transition-all transform hover:scale-105 active:scale-95"
          title="مشاركة الدعوة"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Wedding Card (Exact Replicating Pin 2 Layout) */}
      <motion.div
        onClick={handleCardClick}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full h-full sm:w-auto sm:h-full sm:max-h-[92vh] sm:aspect-[9/16] sm:max-w-[480px] relative sm:rounded-[32px] rounded-none overflow-hidden shadow-none sm:shadow-[0_30px_90px_rgba(0,0,0,0.6),0_10px_30px_rgba(212,175,55,0.2)] cursor-pointer select-none group border-0 sm:border border-[#D4AF37]/30"
      >
        {/* Background Archway Image with Chandeliers & Cathedral */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-[1.01]"
          style={{
            backgroundImage: `url(/assets/templates/cathedral-grand-bg.jpg)`
          }}
        />

        {/* Realistic Animated Candlelight Glow for Ground Lanterns */}
        <div className="absolute bottom-6 left-6 w-16 h-16 rounded-full bg-amber-400/25 blur-xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-amber-400/25 blur-xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-12 left-16 w-12 h-12 rounded-full bg-amber-300/20 blur-lg pointer-events-none animate-ping" style={{ animationDuration: '3s' }} />

        {/* Ambient Warm Golden Sunlight Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(255,235,190,0.18) 0%, transparent 75%)'
          }}
        />

        {/* Couple Names (Inside Golden Baroque Cartouche at Top Arch - Raised Safely Inside White Cloud) */}
        <div className="absolute top-[16.5%] left-[18%] right-[18%] h-[12%] flex flex-col items-center justify-center text-center z-10 pointer-events-none px-2">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col items-center justify-center space-y-0"
            dir={isArabic(data.groomName || data.brideName) ? "rtl" : "ltr"}
          >
            {/* Groom Name */}
            <span 
              className="text-xl sm:text-2xl font-normal text-[#5E3F12] leading-tight"
              style={{ 
                fontFamily: isArabic(data.groomName) ? "'Aref Ruqaa', 'Amiri', serif" : "'Alex Brush', 'Great Vibes', cursive",
                textShadow: '0 1px 2px rgba(255,255,255,0.95), 0 0 1px rgba(94,63,18,0.2)'
              }}
            >
              {data.groomName}
            </span>

            {/* Intertwined Gold Wedding Rings SVG */}
            <div className="flex items-center justify-center my-0.5">
              <svg width="18" height="10" viewBox="0 0 20 12" fill="none" className="text-[#967431]">
                <circle cx="7" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
                <circle cx="13" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
            </div>

            {/* Bride Name (Raised Safely Into the White Cloud Medallion) */}
            <span 
              className="text-xl sm:text-2xl font-normal text-[#5E3F12] leading-tight"
              style={{ 
                fontFamily: isArabic(data.brideName) ? "'Aref Ruqaa', 'Amiri', serif" : "'Alex Brush', 'Great Vibes', cursive",
                textShadow: '0 1px 2px rgba(255,255,255,0.95), 0 0 1px rgba(94,63,18,0.2)'
              }}
            >
              {data.brideName}
            </span>
          </motion.div>
        </div>

        {/* Central Arch Data Card (Image 2 - Curved Arch Dome Matching Cathedral Architecture, Ultra-Low Blur Crystal Look) */}
        <div 
          className="absolute max-w-[215px] backdrop-blur-[0.5px] bg-white/20 border border-[#D4AF37]/50 shadow-[0_4px_20px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,0.4)] rounded-t-full rounded-b-2xl pt-3.5 pb-2 px-1.5 sm:px-2 flex flex-col items-center justify-between text-center z-10 pointer-events-none"
          style={{
            top: '39.5%',     // لرفعها لفوق: قلل الرقم (مثلاً 38% أو 37%)
            bottom: '17%',  // للحفاظ على نفس الطول: زوّد الرقم بنفس المقدار (مثلاً 19%)
            left: '33%',    // لتحريكها يميناً: زوّد الرقم (مثلاً 33% أو 33.5%)
            width: '33.5%', // عرض البطاقة
          }}
        >
          
          {/* 1. Invitation Note */}
          <div className="space-y-0.5 w-full px-0.5">
            <p 
              className="text-[9.5px] sm:text-[10px] font-bold text-[#3D2504] tracking-normal font-amiri leading-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]"
              style={{ fontFamily: isArabicContent ? "'Amiri', serif" : "'Cinzel', serif" }}
            >
              {custom.invitationNote1 || (isArabicContent ? 'يسعدنا ويشرفنا دعوتكم لحضور حفل زفافنا' : 'JOYFULLY INVITE YOU TO CELEBRATE')}
            </p>
            <div className="flex items-center justify-center my-0.5">
              <div className="w-8 h-[0.6px] bg-[#967431]/50" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#967431] mx-1" />
              <div className="w-8 h-[0.6px] bg-[#967431]/50" />
            </div>
          </div>

          {/* 2. Ceremony & Date Section */}
          <div className="space-y-0.5 w-full">
            <p 
              className="text-[9.5px] sm:text-[10px] font-bold text-[#6B4B18] tracking-normal font-amiri leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]"
              style={{ fontFamily: isArabicContent ? "'Amiri', serif" : "'Cinzel', serif" }}
            >
              {custom.ceremonyTitle || (isArabicContent ? 'مراسم الزفاف المبارك' : 'WEDDING CEREMONY')}
            </p>

            <p 
              className="text-[10px] sm:text-[11px] font-bold text-[#3D2504] font-amiri leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]"
              style={{ fontFamily: isArabicContent ? "'Amiri', serif" : "'Cinzel', serif" }}
            >
              {dayName}
            </p>

            {/* Date Row */}
            <div className="flex items-center justify-center gap-1.5 py-0.5">
              <span 
                className="text-2xl sm:text-3xl font-extrabold text-[#3D2504] leading-none drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {dayNumber}
              </span>
              <div className="flex flex-col text-center leading-none">
                <span className="text-[10px] sm:text-[11px] font-bold text-[#3D2504] drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">{monthName}</span>
                <span className="text-[8.5px] sm:text-[9px] font-bold text-[#7D5A1E] drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">{yearNumber}</span>
              </div>
            </div>

            <p className="text-[10px] font-bold text-[#3D2504] drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
              {timeFormatted}
            </p>
          </div>

          {/* 3. Reception Section */}
          <div className="space-y-0.5 w-full">
            <div className="w-full border-t border-[#8C682A]/30 my-0.5" />
            <p 
              className="text-[10px] font-bold text-[#3D2504] drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]"
              style={{ fontFamily: isArabicContent ? "'Amiri', serif" : "'Cinzel', serif" }}
            >
              {custom.receptionTitle || (isArabicContent ? 'حفل الاستقبال والعشاء' : 'RECEPTION')}
            </p>
            <p className="text-[9.5px] text-[#3D2504] font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
              {custom.receptionTime || (isArabicContent ? '٠٧:٣٠ م' : '07:30 PM')}
            </p>
            <div className="w-full border-b border-[#8C682A]/30 my-0.5" />
          </div>

          {/* 4. Venue Section */}
          <div className="space-y-0.5 w-full">
            <p 
              className="text-[9px] font-bold text-[#7D5A1E] drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]"
              style={{ fontFamily: isArabicContent ? "'Amiri', serif" : "'Cinzel', serif" }}
            >
              {isArabicContent ? 'المكان' : 'LOCATION'}
            </p>
            <p 
              className="text-xs sm:text-sm font-bold text-[#3D2504] leading-tight font-amiri drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]"
            >
              {data.venueName || (isArabicContent ? 'قاعة اللؤلؤة' : 'ST. MARY\'S CATHEDRAL')}
            </p>
            {(data.venueAddress || custom.venueAddressSub) && (
              <p className="text-[8.5px] text-[#3D2504] leading-tight line-clamp-1 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                {data.venueAddress || custom.venueAddressSub}
              </p>
            )}
          </div>

          {/* 5. Closing Footnote */}
          <div className="pt-0.5">
            <p 
              className="text-[9.5px] sm:text-[10px] text-[#4D320B] italic font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]"
              style={{ fontFamily: isArabicContent ? "'Amiri', serif" : "'Alex Brush', 'Great Vibes', cursive" }}
            >
              {custom.receptionBallroomNote || (isArabicContent ? 'حضوركم يكتمل به فرحنا ومسرتنا' : 'Reception to follow at The Grand Ballroom')}
            </p>
          </div>

        </div>

        {/* Right Parchment Scroll (Image 3 - Strictly Confined Inside the Parchment Boundaries) */}
        <div 
          className="absolute max-w-[95px] flex flex-col items-center justify-evenly text-center z-10 pointer-events-none px-0.5"
          style={{
            top: '44%',
            bottom: '22%',
            left: '67%',
            width: '17%',
          }}
        >
          {/* 1. Basmala Header */}
          <div className="space-y-0.5 w-full">
            <p 
              className="text-[8.5px] sm:text-[9.5px] font-bold text-[#4D3008] tracking-normal font-amiri leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
              style={{ fontFamily: "'Amiri', serif" }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <div className="w-7 h-[0.5px] bg-[#967431]/40 mx-auto my-0.5" />
          </div>

          {/* 2. Holy Quranic Ayah (Strictly Inside the Parchment Written Horizontally) */}
          <div className="w-full px-0.5">
            <p 
              className="text-[7.5px] sm:text-[8px] font-bold text-[#4D3008] tracking-normal font-amiri leading-[1.35] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] break-words"
              dir={isArabic(custom.sacredQuote) || isArabicContent ? "rtl" : "ltr"}
              style={{ fontFamily: isArabic(custom.sacredQuote) || isArabicContent ? "'Amiri', serif" : "'Cinzel', serif" }}
            >
              {custom.sacredQuote || (isArabicContent 
                ? '﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾' 
                : '"SO THEY ARE NO LONGER TWO, BUT ONE FLESH."')}
            </p>
          </div>

          {/* 3. Host Families Blessing */}
          <div className="space-y-0.5 w-full">
            <div className="w-7 h-[0.5px] bg-[#967431]/40 mx-auto my-0.5" />
            <p 
              className="text-[7.5px] sm:text-[8px] font-bold text-[#7A541D] tracking-normal font-amiri leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
              style={{ fontFamily: isArabicContent ? "'Amiri', serif" : "'Cinzel', serif" }}
            >
              {custom.familiesHeader || (isArabicContent ? 'بمباركة الأهل والأحباب' : 'TOGETHER WITH THEIR FAMILIES')}
            </p>
            {/* Small Gold Flourish */}
            <div className="flex items-center justify-center pt-0.5">
              <svg width="20" height="5" viewBox="0 0 50 8" fill="none" className="text-[#8C682A]">
                <path d="M0 4H20M30 4H50" stroke="currentColor" strokeWidth="0.8"/>
                <path d="M25 6C25 6 22 4 22 2.8C22 2 22.6 1.5 23.2 1.5C23.7 1.5 25 2.2 25 2.2C25 2.2 26.3 1.5 26.8 1.5C27.4 1.5 28 2 28 2.8C28 4 25 6 25 6Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>

      </motion.div>

      {/* Floating 3-Pill Luxury Dock (Grid 3-cols: Never wraps or truncates!) */}
      <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-[380px]">
        <div className="backdrop-blur-xl bg-black/85 border border-[#D4AF37]/50 shadow-[0_12px_36px_rgba(0,0,0,0.5)] rounded-full p-1.5 grid grid-cols-3 gap-1.5 items-center">
          {/* 1. Maps Button */}
          <a
            href={data.googleMapsUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-1 rounded-full bg-stone-900/90 hover:bg-stone-800 border border-[#D4AF37]/40 text-[#E6C687] font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="font-cairo truncate">الموقع</span>
          </a>

          {/* 2. Add to Calendar Button */}
          <a
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-1 rounded-full bg-stone-900/90 hover:bg-stone-800 border border-[#D4AF37]/40 text-[#E6C687] font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="font-cairo truncate">الموعد</span>
          </a>

          {/* 3. Primary RSVP Button */}
          <button
            onClick={() => setShowRsvpModal(true)}
            className="w-full py-2 px-1 rounded-full bg-gradient-to-r from-[#967431] via-[#D4AF37] to-[#8C6D38] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1 hover:brightness-110 active:scale-95 transition-all"
          >
            <Heart className="w-3.5 h-3.5 fill-white shrink-0" />
            <span className="font-cairo truncate">تأكيد الحضور</span>
          </button>
        </div>
      </div>

      {/* RSVP Modal Dialog */}
      <AnimatePresence>
        {showRsvpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1C1814] border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative text-right text-stone-200"
              dir="rtl"
            >
              <button 
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-4 left-4 text-stone-400 hover:text-stone-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1 mb-5">
                <h3 
                  className="text-xl font-bold text-[#E6C687]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  تأكيد الحضور
                </h3>
                <p className="text-xs text-stone-400">
                  يسعدنا ويشرفنا حضوركم ومشاركتنا فرحة العمر
                </p>
              </div>

              {rsvpSent ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-amber-900/40 text-amber-300 rounded-full flex items-center justify-center mx-auto border border-amber-500/40">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-amber-200">تم تسجيل حضوركم بنجاح!</h4>
                  <p className="text-xs text-stone-400">شكراً لكم، ننتظر رؤيتكم بكل بهجة وسرور.</p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">الاسم الكريم</label>
                    <input 
                      type="text" 
                      required 
                      value={rsvpData.name}
                      onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-700 focus:outline-none focus:border-[#D4AF37] bg-stone-900 text-stone-100 placeholder-stone-500"
                      placeholder="اكتب اسمك الكريم"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">حالة الحضور</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRsvpData({ ...rsvpData, attendance: 'yes' })}
                        className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                          rsvpData.attendance === 'yes' 
                            ? 'bg-[#967431] text-white border-[#967431]' 
                            : 'bg-stone-900 text-stone-300 border-stone-700 hover:bg-stone-800'
                        }`}
                      >
                        سأحضر بكل سرور ✨
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpData({ ...rsvpData, attendance: 'no' })}
                        className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                          rsvpData.attendance === 'no' 
                            ? 'bg-stone-800 text-stone-300 border-stone-600' 
                            : 'bg-stone-900 text-stone-300 border-stone-700 hover:bg-stone-800'
                        }`}
                      >
                        أعتذر لظروف خاصة
                      </button>
                    </div>
                  </div>

                  {rsvpData.attendance === 'yes' && (
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">عدد الأفراد</label>
                      <select
                        value={rsvpData.guests}
                        onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-700 focus:outline-none focus:border-[#D4AF37] bg-stone-900 text-stone-100"
                      >
                        <option value="1">شخص واحد (أنا فقط)</option>
                        <option value="2">شخصان (2)</option>
                        <option value="3">3 أشخاص</option>
                        <option value="4">4 أشخاص أو أكثر</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">تهنئة خاصة (اختياري)</label>
                    <textarea 
                      rows={2}
                      value={rsvpData.note}
                      onChange={(e) => setRsvpData({ ...rsvpData, note: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-700 focus:outline-none focus:border-[#D4AF37] bg-stone-900 text-stone-100 placeholder-stone-500"
                      placeholder="أجمل التمنيات بحياة سعيدة..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#967431] to-[#B8860B] text-white font-medium text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#967431]/40"
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
