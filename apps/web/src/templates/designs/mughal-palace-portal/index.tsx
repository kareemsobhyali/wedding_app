'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MughalPalacePortalTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpData, setRsvpData] = useState({ name: '', attendance: 'yes', guests: '1', note: '' });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const custom = data.customData || {};
  const weddingDate = new Date(data.weddingDate);

  // Month, Day, Year, DayName, Time formatting
  const monthName = custom.dateMonth || weddingDate.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const dayName = custom.dateDayName || weddingDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const dayNumber = custom.dateDayNumber || weddingDate.getDate().toString();
  const yearNumber = custom.dateYearNumber || weddingDate.getFullYear().toString();
  const timeFormatted = custom.dateTime || weddingDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const difference = weddingDate.getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  const handleCardClick = () => {
    if (data.music && audioRef.current && !isPlayingAudio) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    confetti({
      particleCount: 50,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#D4AF37', '#FFFBF0', '#E5BA73', '#FFFFFF']
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
      spread: 85,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#FFF', '#C5A059']
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
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Wedding Details: ${data.groomName} & ${data.brideName}`)}&dates=${weddingDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${weddingDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(data.weddingMessage || 'Wedding Details')}&location=${encodeURIComponent(data.venueName || '')}`;

  return (
    <div 
      className="h-[100dvh] w-full flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 font-serif bg-[#F4EDE4] selection:bg-[#D4AF37]/30 text-[#4A3D2C] overflow-hidden relative"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 40%, #FAF6EE 0%, #E8DFC8 100%)'
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
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-[#D4AF37]/50 flex items-center justify-center text-[#8C6D38] hover:bg-[#8C6D38] hover:text-white transition-all transform hover:scale-105 active:scale-95"
            title={isPlayingAudio ? 'كتم الموسيقى' : 'تشغيل الموسيقى'}
          >
            {isPlayingAudio ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>
        )}
        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-[#D4AF37]/50 flex items-center justify-center text-[#8C6D38] hover:bg-[#8C6D38] hover:text-white transition-all transform hover:scale-105 active:scale-95"
          title="مشاركة الدعوة"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Wedding Portal Card (Exact 100% Replicating Pin 3) */}
      <motion.div
        onClick={handleCardClick}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full h-full sm:w-auto sm:h-full sm:max-h-[92vh] sm:aspect-[9/16] sm:max-w-[480px] relative sm:rounded-[32px] rounded-none overflow-hidden shadow-none sm:shadow-[0_30px_80px_rgba(0,0,0,0.22),0_10px_30px_rgba(180,140,70,0.2)] cursor-pointer select-none group border-0 sm:border border-[#D4AF37]/30"
      >
        {/* Background Mughal Cusped Palace Arch Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-[1.01]"
          style={{
            backgroundImage: `url(/assets/templates/mughal-palace-bg.jpg)`
          }}
        />

        {/* Falling Petals Micro-Animation Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-white/80 rounded-tl-full rounded-br-full shadow-sm"
              initial={{
                top: -20,
                left: `${15 + i * 14}%`,
                rotate: 0,
                opacity: 0.8
              }}
              animate={{
                top: '105%',
                left: `${10 + i * 15 + (i % 2 === 0 ? 8 : -8)}%`,
                rotate: 360,
                opacity: [0.8, 1, 0]
              }}
              transition={{
                duration: 9 + i * 2,
                repeat: Infinity,
                delay: i * 1.5,
                ease: 'linear'
              }}
            />
          ))}
        </div>

        {/* Ambient Warm Sunbeam Flare */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 60%)'
          }}
        />

        {/* Inside Portal Content: Typography & Layout (Matching Pin 3 Details) */}
        <div className="absolute top-[21%] left-[20%] right-[20%] h-[58%] flex flex-col items-center justify-start text-center z-10 pointer-events-none px-2 space-y-4">
          
          {/* Couple Names (Top of Portal) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center space-y-0.5"
          >
            <p 
              className="text-2xl sm:text-3xl text-[#7D5A1E] font-normal leading-tight"
              style={{ fontFamily: "'Alex Brush', 'Great Vibes', cursive" }}
            >
              {data.groomName} & {data.brideName}
            </p>
          </motion.div>

          {/* "The" Cursive Script Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-1"
          >
            <span 
              className="text-3xl sm:text-4xl text-[#8C6D38] font-normal leading-none"
              style={{ fontFamily: "'Alex Brush', 'Great Vibes', cursive" }}
            >
              {custom.cursiveHeader || 'The'}
            </span>
          </motion.div>

          {/* "WEDDING DETAILS" in letterspaced serif caps */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-1.5"
          >
            <h2 
              className="text-[13px] sm:text-[14.5px] uppercase tracking-[0.28em] text-[#694E23] font-bold"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {custom.detailsTitle || 'WEDDING DETAILS'}
            </h2>

            {/* Diamond filigree flourish */}
            <div className="flex items-center justify-center my-1">
              <svg width="100" height="10" viewBox="0 0 100 10" fill="none" className="text-[#8C6D38]">
                <path d="M0 5H42M58 5H100" stroke="currentColor" strokeWidth="0.8"/>
                <path d="M50 1L54 5L50 9L46 5Z" fill="currentColor"/>
              </svg>
            </div>
          </motion.div>

          {/* Architectural Date Display (Month, Day Name, Big Numeral, Time, Year) */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="w-full flex flex-col items-center space-y-1 pt-1"
          >
            {/* Month Name */}
            <p 
              className="text-xs sm:text-[13px] uppercase tracking-[0.3em] font-semibold text-[#8C6D38]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {monthName}
            </p>

            {/* Middle Row: DayName | Big Numeral | Time */}
            <div className="w-full flex items-center justify-between px-2 sm:px-4 py-1">
              {/* Day Name */}
              <span 
                className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#694E23]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {dayName}
              </span>

              {/* Big Gold Numeral Date */}
              <span 
                className="text-4xl sm:text-5xl font-normal text-[#694E23] px-3 leading-none"
                style={{ 
                  fontFamily: "'Cormorant Garamond', serif",
                  textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                }}
              >
                {dayNumber}
              </span>

              {/* Time */}
              <span 
                className="text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase text-[#694E23]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {custom.atTimePrefix || 'AT'} {timeFormatted}
              </span>
            </div>

            {/* Year */}
            <p 
              className="text-xs sm:text-[13px] tracking-[0.3em] font-medium text-[#8C6D38]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {yearNumber}
            </p>

            {/* Little Divider */}
            <div className="w-16 h-[0.7px] bg-[#8C6D38]/50 my-1" />
          </motion.div>

          {/* Venue Section (VENUE INSERTED HERE) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="pt-2 space-y-1 flex flex-col items-center"
          >
            <p 
              className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8C6D38]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {custom.venueHeading || 'VENUE'}
            </p>
            <p 
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#694E23] max-w-[200px] leading-tight"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {data.venueName || custom.venueInsertedText || 'ROYAL PALACE BALLROOM'}
            </p>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#8C6D38] max-w-[220px] leading-snug">
              {data.venueAddress || custom.venueAddressText || 'Grand Avenue, Royal Gardens'}
            </p>
          </motion.div>

          {/* Live Countdown Pills */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="pt-3 flex items-center justify-center gap-2"
          >
            <div className="px-2.5 py-1 rounded-lg bg-white/70 backdrop-blur-sm border border-[#D4AF37]/30 text-center shadow-xs">
              <span className="block text-xs font-bold text-[#694E23] leading-none">{timeLeft.days}</span>
              <span className="text-[7.5px] uppercase tracking-wider text-[#8C6D38]">يوم</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-white/70 backdrop-blur-sm border border-[#D4AF37]/30 text-center shadow-xs">
              <span className="block text-xs font-bold text-[#694E23] leading-none">{timeLeft.hours}</span>
              <span className="text-[7.5px] uppercase tracking-wider text-[#8C6D38]">ساعة</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-white/70 backdrop-blur-sm border border-[#D4AF37]/30 text-center shadow-xs">
              <span className="block text-xs font-bold text-[#694E23] leading-none">{timeLeft.minutes}</span>
              <span className="text-[7.5px] uppercase tracking-wider text-[#8C6D38]">دقيقة</span>
            </div>
          </motion.div>

        </div>

      </motion.div>

      {/* Luxury Glassmorphism Floating Action Dock */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-[440px]"
      >
        <div className="backdrop-blur-xl bg-white/92 border border-[#D4AF37]/50 shadow-[0_12px_36px_rgba(125,90,30,0.22)] rounded-full p-1.5 flex items-center justify-between gap-1.5">
          {/* Google Maps Button */}
          {data.googleMapsUrl && (
            <a
              href={data.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 sm:px-4 rounded-full bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#D4AF37]/30 text-[#7D5A1E] font-medium text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-[#B8860B]" />
              <span className="font-cairo">الموقع</span>
            </a>
          )}

          {/* Add to Calendar Button */}
          <a
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 sm:px-4 rounded-full bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#D4AF37]/30 text-[#7D5A1E] font-medium text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-[#B8860B]" />
            <span className="font-cairo">حفظ الموعد</span>
          </a>

          {/* Primary RSVP Button */}
          <button
            onClick={() => setShowRsvpModal(true)}
            className="flex-1 min-w-[125px] py-2.5 px-3 sm:px-4 rounded-full bg-gradient-to-r from-[#A67C37] via-[#C5A059] to-[#8C6D38] text-white shadow-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition-all"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span className="font-cairo font-bold">تأكيد الحضور (RSVP)</span>
          </button>
        </div>
      </motion.div>

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
                  className="text-xl font-bold text-[#7D5A1E]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  تأكيد الحضور
                </h3>
                <p className="text-xs text-stone-600">
                  يسعدنا حضوركم ومشاركتنا بهجة هذا اليوم الاستثنائي
                </p>
              </div>

              {rsvpSent ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-stone-800">تم تسجيل حضوركم بنجاح!</h4>
                  <p className="text-xs text-stone-500">شكراً لكم، ننتظر تشريفكم بكل سعادة ومودة.</p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-3.5">
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
                      placeholder="أجمل التمنيات بحياة مباركة..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#8C6D38] text-white font-medium text-xs hover:bg-[#7D5A1E] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#8C6D38]/30"
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
