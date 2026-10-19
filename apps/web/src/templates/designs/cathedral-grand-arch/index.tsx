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

export const CathedralGrandArchTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpData, setRsvpData] = useState({ name: '', attendance: 'yes', guests: '1', note: '' });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const custom = data.customData || {};
  const weddingDate = new Date(data.weddingDate);

  // Formatted date values
  const dayName = custom.dayName || weddingDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const dayNumber = custom.dayNumber || weddingDate.getDate().toString();
  const monthName = custom.monthName || weddingDate.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const yearNumber = custom.yearNumber || weddingDate.getFullYear().toString();

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

        {/* Sacred Quote & Families (Top Center, Above Baroque Cartouche) */}
        <div className="absolute top-[3.5%] left-0 right-0 flex flex-col items-center text-center px-8 z-10 pointer-events-none">
          {/* Sacred Symbol / Cross or Crest */}
          <div className="text-[#8C682A] mb-1">
            <svg width="22" height="26" viewBox="0 0 24 28" fill="none" className="text-[#967431] drop-shadow-sm">
              <path d="M12 2V26M5 9H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Sacred Quote / Holy Verse */}
          <p 
            className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#735422] font-semibold max-w-xs leading-relaxed"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {custom.sacredQuote || '"SO THEY ARE NO LONGER TWO, BUT ONE FLESH."'}
          </p>
          <p 
            className="text-[8px] sm:text-[8.5px] tracking-[0.25em] uppercase text-[#8C682A] font-medium"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {custom.sacredReference || 'MATTHEW 19:6'}
          </p>

          {/* Together With Their Families */}
          <p 
            className="text-[8.5px] sm:text-[9.5px] tracking-[0.3em] uppercase text-[#705220] font-semibold mt-1"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {custom.familiesHeader || 'TOGETHER WITH THEIR FAMILIES'}
          </p>
        </div>

        {/* Couple Names (Inside Golden Baroque Cartouche at Top Arch) */}
        <div className="absolute top-[17%] left-[16%] right-[16%] h-[16%] flex flex-col items-center justify-center text-center z-10 pointer-events-none px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col items-center justify-center space-y-0.5"
          >
            {/* Groom Name */}
            <div className="flex flex-col items-center">
              <span 
                className="text-2xl sm:text-[27px] font-normal text-[#6B4B18] leading-tight"
                style={{ 
                  fontFamily: "'Cormorant Garamond', serif",
                  textShadow: '0 1px 1px rgba(255,255,255,0.7)'
                }}
              >
                {data.groomName}
              </span>
              {custom.groomSurname && (
                <span 
                  className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#8C682A] font-semibold -mt-0.5"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {custom.groomSurname}
                </span>
              )}
            </div>

            {/* Intertwined Gold Wedding Rings SVG */}
            <div className="flex items-center justify-center gap-1.5 my-0.5">
              <div className="h-[0.5px] w-6 bg-[#967431]/60" />
              <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="text-[#8C682A]">
                <circle cx="7" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="13" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              <div className="h-[0.5px] w-6 bg-[#967431]/60" />
            </div>

            {/* Bride Name */}
            <div className="flex flex-col items-center">
              <span 
                className="text-2xl sm:text-[27px] font-normal text-[#6B4B18] leading-tight"
                style={{ 
                  fontFamily: "'Cormorant Garamond', serif",
                  textShadow: '0 1px 1px rgba(255,255,255,0.7)'
                }}
              >
                {data.brideName}
              </span>
              {custom.brideSurname && (
                <span 
                  className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#8C682A] font-semibold -mt-0.5"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {custom.brideSurname}
                </span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Invitation Invite Note (Center Below Arch) */}
        <div className="absolute top-[35.5%] left-0 right-0 flex flex-col items-center text-center px-8 z-10 pointer-events-none">
          <p 
            className="text-[8.5px] sm:text-[9.5px] tracking-[0.22em] uppercase text-[#735422] font-semibold"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {custom.invitationNote1 || 'JOYFULLY INVITE YOU TO CELEBRATE'}
          </p>
          <p 
            className="text-[9.5px] sm:text-[10.5px] tracking-[0.25em] uppercase text-[#5E4114] font-bold"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {custom.invitationNote2 || 'THEIR WEDDING'}
          </p>
          {/* Thin Flourish Rule */}
          <div className="w-16 h-[0.7px] bg-[#967431]/60 my-1" />
        </div>

        {/* Itinerary Column (Right Side of Lower Card, Exactly Matching Pin 2) */}
        <div className="absolute top-[42%] right-[8%] w-[46%] flex flex-col items-center text-center space-y-3 z-10 pointer-events-none">
          
          {/* Wedding Ceremony Section */}
          <div className="flex flex-col items-center space-y-0.5">
            {/* Church / Venue Icon */}
            <div className="text-[#8C682A] mb-0.5">
              <Church className="w-5 h-5 stroke-[1.4]" />
            </div>
            <p 
              className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold text-[#6B4B18]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {custom.ceremonyTitle || 'WEDDING CEREMONY'}
            </p>
            <p 
              className="text-[8px] sm:text-[9px] uppercase tracking-wider text-[#735422]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {dayName}
            </p>
            {/* Day Number and Month Row */}
            <div className="flex items-center justify-center gap-1.5 py-0.5">
              <span 
                className="text-2xl sm:text-3xl font-bold text-[#6B4B18] leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {dayNumber}
              </span>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[9px] font-bold tracking-wider text-[#6B4B18] uppercase">{monthName}</span>
                <span className="text-[8px] font-medium tracking-wider text-[#8C682A]">{yearNumber}</span>
              </div>
            </div>
            <p className="text-[8.5px] sm:text-[9.5px] uppercase tracking-widest text-[#735422] font-semibold">
              {custom.ceremonyTime || '04:00 PM'}
            </p>
            <p className="text-[7.5px] sm:text-[8px] uppercase tracking-wider text-[#8C682A]">
              ONWARDS
            </p>
            <div className="w-14 h-[0.5px] bg-[#967431]/40 my-0.5" />
          </div>

          {/* Reception Section */}
          <div className="flex flex-col items-center space-y-0.5">
            <div className="text-[#8C682A] mb-0.5">
              <Wine className="w-4 h-4 stroke-[1.4]" />
            </div>
            <p 
              className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold text-[#6B4B18]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {custom.receptionTitle || 'RECEPTION'}
            </p>
            <p className="text-[8.5px] sm:text-[9.5px] uppercase tracking-widest text-[#735422] font-semibold">
              {custom.receptionTime || '07:30 PM'}
            </p>
            <p className="text-[7.5px] sm:text-[8px] uppercase tracking-wider text-[#8C682A]">
              ONWARDS
            </p>
            <div className="w-14 h-[0.5px] bg-[#967431]/40 my-0.5" />
          </div>

          {/* Venue & Location Address */}
          <div className="flex flex-col items-center space-y-0.5 max-w-[180px]">
            <p 
              className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase text-[#6B4B18] leading-tight"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {data.venueName || 'ST. MARY\'S CATHEDRAL'}
            </p>
            <p className="text-[7.5px] sm:text-[8.5px] uppercase tracking-wider text-[#735422] leading-tight">
              {data.venueAddress || custom.venueAddressSub || 'Park Street, City Center'}
            </p>
          </div>

          {/* Reception to Follow Footnote in Cursive */}
          <div className="pt-1 flex flex-col items-center">
            <p 
              className="text-xs sm:text-sm text-[#735422] italic font-normal"
              style={{ fontFamily: "'Alex Brush', 'Great Vibes', cursive" }}
            >
              {custom.receptionBallroomNote || 'Reception to follow at The Grand Ballroom'}
            </p>
            {/* Heart flourish */}
            <div className="flex items-center justify-center my-0.5">
              <svg width="50" height="8" viewBox="0 0 50 8" fill="none" className="text-[#8C682A]">
                <path d="M0 4H20M30 4H50" stroke="currentColor" strokeWidth="0.5"/>
                <path d="M25 6C25 6 22 4 22 2.8C22 2 22.6 1.5 23.2 1.5C23.7 1.5 25 2.2 25 2.2C25 2.2 26.3 1.5 26.8 1.5C27.4 1.5 28 2 28 2.8C28 4 25 6 25 6Z" fill="currentColor"/>
              </svg>
            </div>
          </div>

        </div>

        {/* Bottom Banner (Your Presence Will Make Our Day Even More Special) */}
        <div className="absolute bottom-[2.5%] left-0 right-0 flex flex-col items-center text-center px-6 z-10 pointer-events-none">
          <p 
            className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-[#6B4B18] font-semibold"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {custom.closingBannerText || 'YOUR PRESENCE WILL MAKE OUR DAY'}
          </p>
          <p 
            className="text-[7.5px] sm:text-[8.5px] tracking-[0.28em] uppercase text-[#8C682A] font-medium"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            EVEN MORE SPECIAL
          </p>

          <div className="flex items-center justify-center mt-1">
            <svg width="60" height="8" viewBox="0 0 60 8" fill="none" className="text-[#967431]">
              <path d="M0 4H24M36 4H60" stroke="currentColor" strokeWidth="0.6"/>
              <circle cx="26" cy="4" r="1" fill="currentColor"/>
              <circle cx="34" cy="4" r="1" fill="currentColor"/>
              <path d="M30 6C30 6 28 4.2 28 3.2C28 2.5 28.5 2 29.1 2C29.6 2 30 2.6 30 2.6C30 2.6 30.4 2 30.9 2C31.5 2 32 2.5 32 3.2C32 4.2 30 6 30 6Z" fill="currentColor"/>
            </svg>
          </div>
        </div>

      </motion.div>

      {/* Action Controls Bar */}
      {/* Luxury Glassmorphism Floating Action Dock */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-[440px]"
      >
        <div className="backdrop-blur-xl bg-black/80 border border-[#D4AF37]/50 shadow-[0_12px_36px_rgba(0,0,0,0.5)] rounded-full p-1.5 flex items-center justify-between gap-1.5">
          {/* Google Maps Button */}
          {data.googleMapsUrl && (
            <a
              href={data.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 sm:px-4 rounded-full bg-stone-900/90 hover:bg-stone-800 border border-[#D4AF37]/40 text-[#E6C687] font-medium text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-cairo">الموقع</span>
            </a>
          )}

          {/* Add to Calendar Button */}
          <a
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 sm:px-4 rounded-full bg-stone-900/90 hover:bg-stone-800 border border-[#D4AF37]/40 text-[#E6C687] font-medium text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-cairo">حفظ الموعد</span>
          </a>

          {/* Primary RSVP Button */}
          <button
            onClick={() => setShowRsvpModal(true)}
            className="flex-1 min-w-[125px] py-2.5 px-3 sm:px-4 rounded-full bg-gradient-to-r from-[#967431] via-[#D4AF37] to-[#8C6D38] text-white shadow-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition-all"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span className="font-cairo font-bold">تأكيد الحضور (RSVP)</span>
          </button>
        </div>
      </motion.div>

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
