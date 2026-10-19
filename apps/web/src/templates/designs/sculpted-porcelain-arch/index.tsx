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
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const monthName = custom.dateMonth || weddingDate.toLocaleDateString('tr-TR', { month: 'long' }).toUpperCase();
  const dayNumber = custom.dateDay || weddingDate.getDate().toString();
  const timeFormatted = custom.dateTime || weddingDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  // 3D Tilt interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: -(y - 0.5) * 10,
      rotateY: (x - 0.5) * 10,
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
      origin: { y: 0.7 },
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
      className="min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-6 md:p-10 font-serif bg-[#EAE4DC] selection:bg-[#D4AF37]/30 text-[#4A3E31] overflow-x-hidden relative"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, #FAF8F5 0%, #E3DCD3 100%)'
      }}
    >
      {/* Background Audio */}
      {data.music && (
        <audio ref={audioRef} src={data.music.url} loop preload="auto" />
      )}

      {/* Floating Music & Share Controls */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        {data.music && (
          <button
            onClick={toggleAudio}
            className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-[#D4AF37]/40 flex items-center justify-center text-[#8C6D38] hover:bg-[#8C6D38] hover:text-white transition-all transform hover:scale-105 active:scale-95"
            title={isPlayingAudio ? 'كتم الموسيقى' : 'تشغيل الموسيقى'}
          >
            {isPlayingAudio ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
          </button>
        )}
        <button
          onClick={handleShare}
          className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-[#D4AF37]/40 flex items-center justify-center text-[#8C6D38] hover:bg-[#8C6D38] hover:text-white transition-all transform hover:scale-105 active:scale-95"
          title="مشاركة الدعوة"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main 3D Interactive Card */}
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
        className="w-full max-w-[480px] aspect-[9/16] min-h-[780px] sm:min-h-[850px] relative rounded-[32px] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.22),0_10px_25px_rgba(140,109,56,0.15)] cursor-pointer select-none group"
      >
        {/* Bas-Relief Sculpted Frame Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.01]"
          style={{
            backgroundImage: `url(/assets/templates/sculpted-porcelain-bg.jpg)`
          }}
        />

        {/* Dynamic Specular Sheen Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-soft-light transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 350px at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(255,255,255,0.9), transparent 80%)`
          }}
        />

        {/* Central Cartouche Typography & Layout (Exact 100% Alignment with Pinterest Pin 1) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 sm:px-12 py-10 z-10 text-center pointer-events-none">
          {/* Inner Oval Safe Area */}
          <div className="w-[84%] sm:w-[78%] h-[58%] sm:h-[62%] flex flex-col items-center justify-between py-2 sm:py-4">
            
            {/* Top Invitation Opening Blessing / Verse */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-1"
            >
              <p 
                className="text-[10px] sm:text-[11.5px] uppercase tracking-[0.22em] text-[#8C6D38] font-semibold leading-relaxed"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {custom.welcomeSubtitle1 || 'BU MUTLU GÜNÜMÜZDE'}
              </p>
              <p 
                className="text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.18em] text-[#8C6D38] font-medium leading-relaxed"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {custom.welcomeSubtitle2 || 'SİZ DEĞERLİ DOST VE AKRABALARIMIZI'}
              </p>
              <p 
                className="text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.18em] text-[#8C6D38] font-medium leading-relaxed"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {custom.welcomeSubtitle3 || 'ARAMIZDA GÖRMEKTEN ONUR DUYARIZ.'}
              </p>
            </motion.div>

            {/* Couple Names (Flowing Opulent Gold Script) */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="my-1 sm:my-2"
            >
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span 
                  className="text-3xl sm:text-4xl text-[#7D5A1E] font-normal leading-none"
                  style={{ 
                    fontFamily: "'Alex Brush', 'Great Vibes', cursive",
                    textShadow: '0 1px 1px rgba(255,255,255,0.8), 0 2px 4px rgba(125,90,30,0.15)'
                  }}
                >
                  {data.groomName}
                </span>
                <span 
                  className="text-sm sm:text-base text-[#9E7B3A] italic font-serif px-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {custom.connectorText || 'Ve'}
                </span>
                <span 
                  className="text-3xl sm:text-4xl text-[#7D5A1E] font-normal leading-none"
                  style={{ 
                    fontFamily: "'Alex Brush', 'Great Vibes', cursive",
                    textShadow: '0 1px 1px rgba(255,255,255,0.8), 0 2px 4px rgba(125,90,30,0.15)'
                  }}
                >
                  {data.brideName}
                </span>
              </div>

              {/* Gold Heart Filigree Flourish SVG */}
              <div className="flex items-center justify-center my-1">
                <svg width="120" height="14" viewBox="0 0 120 14" fill="none" className="text-[#8C6D38]">
                  <path d="M0 7H46M74 7H120" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.7"/>
                  <circle cx="48" cy="7" r="1.5" fill="currentColor"/>
                  <circle cx="72" cy="7" r="1.5" fill="currentColor"/>
                  <path d="M60 11C60 11 54 7 54 4.5C54 3 55.5 2 57 2C58.5 2 60 3.5 60 3.5C60 3.5 61.5 2 63 2C64.5 2 66 3 66 4.5C66 7 60 11 60 11Z" fill="currentColor"/>
                </svg>
              </div>
            </motion.div>

            {/* Host Families Header & Parents Columns */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="space-y-1 w-full"
            >
              <p 
                className="text-[11px] sm:text-[12px] uppercase tracking-[0.25em] text-[#7D5A1E] font-semibold"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {custom.hostFamiliesTitle || 'ATALAY VE UYSAL AİLESİ'}
              </p>

              {/* Little Diamond Ornament */}
              <div className="flex items-center justify-center py-0.5">
                <div className="w-1.5 h-1.5 rotate-45 bg-[#8C6D38]/80" />
              </div>

              {/* Two Family Columns with Vertical Divider */}
              <div className="flex items-center justify-center gap-4 text-[10.5px] sm:text-[11.5px] text-[#694E23]">
                <div className="text-center font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <p className="font-semibold">{custom.family1Father || 'Mustafa & Havva'}</p>
                  <p className="text-[10px] tracking-wider text-[#8C6D38]">{custom.family1Surname || 'Atalay'}</p>
                </div>

                {/* Vertical Divider */}
                <div className="h-6 w-[1px] bg-gradient-to-b from-transparent via-[#8C6D38] to-transparent relative flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#8C6D38] absolute" />
                </div>

                <div className="text-center font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <p className="font-semibold">{custom.family2Father || 'Halis & Meral'}</p>
                  <p className="text-[10px] tracking-wider text-[#8C6D38]">{custom.family2Surname || 'Uysal'}</p>
                </div>
              </div>

              {/* Heart Flourish Divider */}
              <div className="flex items-center justify-center py-0.5">
                <svg width="80" height="10" viewBox="0 0 80 10" fill="none" className="text-[#8C6D38]/70">
                  <path d="M0 5H32M48 5H80" stroke="currentColor" strokeWidth="0.6"/>
                  <path d="M40 8C40 8 36 5.5 36 3.5C36 2.5 37 1.8 38 1.8C39 1.8 40 2.8 40 2.8C40 2.8 41 1.8 42 1.8C43 1.8 44 2.5 44 3.5C44 5.5 40 8 40 8Z" fill="currentColor"/>
                </svg>
              </div>
            </motion.div>

            {/* Ceremony / Kız Alma Row */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-center space-y-0.5"
            >
              <p 
                className="text-[10.5px] sm:text-[11.5px] font-semibold uppercase tracking-[0.2em] text-[#7D5A1E]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {custom.ceremonyLabel || 'KIZ ALMA: 17.00'}
              </p>
              <p className="text-[8.5px] sm:text-[9.5px] uppercase tracking-wider text-[#8C6D38]/90">
                {custom.ceremonyAddress || 'AŞKAN MAH. KALEDİBİ SOK NO:10/1'}
              </p>

              {/* Filigree flourish */}
              <div className="flex items-center justify-center pt-0.5">
                <svg width="60" height="8" viewBox="0 0 60 8" fill="none" className="text-[#8C6D38]/60">
                  <path d="M0 4H60" stroke="currentColor" strokeWidth="0.5"/>
                  <circle cx="30" cy="4" r="1.5" fill="currentColor"/>
                </svg>
              </div>
            </motion.div>

            {/* Iconic Calendar Date Section (Flanked Horizontal Rules, Big Numeral) */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="w-full flex flex-col items-center py-1"
            >
              <div className="w-[85%] border-t border-[#8C6D38]/50 my-0.5" />
              
              <div className="w-full flex items-center justify-around py-0.5">
                {/* Month Name */}
                <span 
                  className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#7D5A1E] uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {monthName}
                </span>

                {/* Huge Day Number */}
                <span 
                  className="text-3xl sm:text-4xl font-bold text-[#7D5A1E] px-2 leading-none"
                  style={{ 
                    fontFamily: "'Cormorant Garamond', serif",
                    textShadow: '0 1px 2px rgba(255,255,255,0.9)'
                  }}
                >
                  {dayNumber}
                </span>

                {/* Time */}
                <span 
                  className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.18em] text-[#7D5A1E] uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {timeFormatted}
                </span>
              </div>

              <div className="w-[85%] border-b border-[#8C6D38]/50 my-0.5" />

              {/* Ornate Divider Flourish */}
              <div className="flex items-center justify-center my-0.5">
                <svg width="100" height="12" viewBox="0 0 100 12" fill="none" className="text-[#8C6D38]">
                  <path d="M0 6C15 6 20 2 30 6C40 10 45 6 50 6C55 6 60 10 70 6C80 2 85 6 100 6" stroke="currentColor" strokeWidth="0.7"/>
                  <circle cx="50" cy="6" r="2" fill="currentColor"/>
                </svg>
              </div>
            </motion.div>

            {/* Venue (YER) Location Block */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="space-y-0.5"
            >
              <p 
                className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-[#7D5A1E] uppercase"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {custom.venueHeader || 'YER :'}
              </p>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#694E23] leading-snug">
                {custom.venueStreet || data.venueAddress || '48. OSMAN GAZİ HATİP ÇAD'}
              </p>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#694E23] leading-snug">
                {custom.venueCity || '42090 MERAM / KONYA'}
              </p>
              <p className="text-[10.5px] sm:text-[11.5px] font-semibold uppercase tracking-wider text-[#7D5A1E] pt-0.5">
                {data.venueName || custom.venueHallName || 'HALİS USTA PİLAV KONAĞI'}
              </p>

              {/* Bottom Heart Flourish */}
              <div className="flex items-center justify-center pt-1">
                <svg width="70" height="10" viewBox="0 0 70 10" fill="none" className="text-[#8C6D38]">
                  <path d="M0 5H28M42 5H70" stroke="currentColor" strokeWidth="0.6"/>
                  <circle cx="30" cy="5" r="1.2" fill="currentColor"/>
                  <circle cx="40" cy="5" r="1.2" fill="currentColor"/>
                  <path d="M35 7.5C35 7.5 32 5.5 32 4C32 3 32.8 2.5 33.5 2.5C34.2 2.5 35 3.2 35 3.2C35 3.2 35.8 2.5 36.5 2.5C37.2 2.5 38 3 38 4C38 5.5 35 7.5 35 7.5Z" fill="currentColor"/>
                </svg>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>

      {/* Floating Action Controls Bar (Bottom of Screen) */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-6 flex items-center justify-center gap-3 flex-wrap max-w-md w-full px-4"
      >
        {/* RSVP Button */}
        <button
          onClick={() => setShowRsvpModal(true)}
          className="flex-1 min-w-[130px] py-3 px-5 rounded-full bg-gradient-to-r from-[#8C6D38] via-[#A67C37] to-[#8C6D38] text-white shadow-lg shadow-[#8C6D38]/30 font-medium text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
        >
          <Heart className="w-4 h-4 fill-white/80" />
          <span>تأكيد الحضور (RSVP)</span>
        </button>

        {/* Google Maps Button */}
        {data.googleMapsUrl && (
          <a
            href={data.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-full bg-white text-[#8C6D38] border border-[#D4AF37]/40 shadow-md font-medium text-xs sm:text-sm flex items-center gap-1.5 hover:bg-[#FAF6EE] active:scale-95 transition-all"
          >
            <MapPin className="w-4 h-4" />
            <span>الموقع</span>
          </a>
        )}

        {/* Add to Calendar Button */}
        <a
          href={gcalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-4 rounded-full bg-white text-[#8C6D38] border border-[#D4AF37]/40 shadow-md font-medium text-xs sm:text-sm flex items-center gap-1.5 hover:bg-[#FAF6EE] active:scale-95 transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span>حفظ الموعد</span>
        </a>
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
                  يسعدنا حضوركم ومشاركتنا فرحتنا الكبرى
                </p>
              </div>

              {rsvpSent ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-stone-800">تم تسجيل حضوركم بنجاح!</h4>
                  <p className="text-xs text-stone-500">شكراً لكم، ننتظر رؤيتكم بكل ود وسعادة.</p>
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
                      placeholder="أجمل التمنيات..."
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
