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
  Heart, 
  Share2, 
  X,
  RotateCcw,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

const isArabic = (text?: string): boolean => {
  if (!text) return false;
  return /[\u0600-\u06FF]/.test(text);
};

export const PalaceDoorsRevealTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [knockCount, setKnockCount] = useState<number>(0);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [isAnimatingOpen, setIsAnimatingOpen] = useState<boolean>(false);
  const [knockVibrate, setKnockVibrate] = useState<boolean>(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpData, setRsvpData] = useState({ name: '', attendance: 'yes', guests: '1', note: '' });

  const singleKnockAudioRef = useRef<HTMLAudioElement | null>(null);
  const doorCreakAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicAudioRef = useRef<HTMLAudioElement | null>(null);

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

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = weddingDate.getTime() - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  // Handle knocking on the doors
  const handleKnock = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpened || isAnimatingOpen) return;

    // Add visual tap ripple
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rippleId = Date.now();
    setRipples(prev => [...prev, { id: rippleId, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 800);

    // Vibrate door
    setKnockVibrate(true);
    setTimeout(() => setKnockVibrate(false), 250);

    const newKnockCount = knockCount + 1;
    setKnockCount(newKnockCount);

    if (newKnockCount < 3) {
      // Play single knock sound
      if (singleKnockAudioRef.current) {
        singleKnockAudioRef.current.currentTime = 0;
        singleKnockAudioRef.current.play().catch(() => {});
      }
    } else {
      // 3rd knock: Open the doors!
      setIsAnimatingOpen(true);
      
      // Play opening creak sound
      if (doorCreakAudioRef.current) {
        doorCreakAudioRef.current.currentTime = 0;
        doorCreakAudioRef.current.play().catch(() => {});
      }

      // Confetti burst
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FAF7F2', '#EADCC5', '#FFD700']
      });

      // After 3D door swing animation completes
      setTimeout(() => {
        setIsOpened(true);
        setIsAnimatingOpen(false);

        // Auto-play background music if available
        if (data.music && bgMusicAudioRef.current && !isPlayingAudio) {
          bgMusicAudioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
        }
      }, 1200);
    }
  };

  // Re-close doors to experience the knock again
  const handleResetDoors = () => {
    setIsOpened(false);
    setIsAnimatingOpen(false);
    setKnockCount(0);
  };

  const toggleMusic = () => {
    if (!bgMusicAudioRef.current) return;
    if (isPlayingAudio) {
      bgMusicAudioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      bgMusicAudioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `دعوة زفاف ${data.groomName} & ${data.brideName}`,
        text: `يسعدنا ويشرفنا دعوتكم لحضور حفل زفافنا المبارك!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ رابط الدعوة بنجاح!');
    }
  };

  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `حفل زفاف ${data.groomName} & ${data.brideName}`
  )}&dates=${weddingDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${weddingDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(
    `يسعدنا حضوركم ومشاركتنا الفرحة في ${data.venueName}`
  )}&location=${encodeURIComponent(data.venueName + (data.venueAddress ? `, ${data.venueAddress}` : ''))}`;

  return (
    <div className="relative min-h-screen w-full bg-[#1A1612] flex items-center justify-center overflow-x-hidden selection:bg-[#EBDCC0] selection:text-[#38260F]">
      
      {/* Audio elements */}
      <audio ref={singleKnockAudioRef} src="/assets/templates/single-knock.mp3" preload="auto" />
      <audio ref={doorCreakAudioRef} src="/assets/templates/door-creak-open.mp3" preload="auto" />
      {data.music?.url && (
        <audio ref={bgMusicAudioRef} src={data.music.url} loop preload="auto" />
      )}

      {/* Luxury Phone Card Container on Desktop, Fullscreen on Mobile */}
      <div 
        className="relative w-full max-w-[430px] h-[100dvh] max-h-[920px] bg-neutral-900 shadow-2xl sm:rounded-[40px] overflow-hidden flex flex-col justify-between border-0 sm:border-4 border-[#8C6D38]/30"
        dir="rtl"
      >

        {/* ========================================================= */}
        {/* BASE LAYER: REVEALED PALACE BALLROOM (Inside View) */}
        {/* ========================================================= */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/templates/palace-ballroom-revealed.jpg" 
            alt="Palace Ballroom"
            className="w-full h-full object-cover select-none"
          />
          {/* Subtle warm overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
        </div>


        {/* ========================================================= */}
        {/* TOP LAYER: CLOSED DOORS & ENTRANCE (Swings open on 3 knocks) */}
        {/* ========================================================= */}
        <AnimatePresence>
          {(!isOpened || isAnimatingOpen) && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              onClick={handleKnock}
              className={`absolute inset-0 z-20 cursor-pointer overflow-hidden select-none transition-transform ${
                knockVibrate ? 'animate-bounce' : ''
              }`}
            >
              {/* Full Closed Doors Background */}
              <img 
                src="/assets/templates/palace-doors-closed.jpg" 
                alt="Palace Entrance"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* 3D Animated Door Panels Swung Inward on 3rd Knock */}
              {isAnimatingOpen && (
                <>
                  {/* Left Door 3D Swing */}
                  <motion.div 
                    initial={{ rotateY: 0, opacity: 1 }}
                    animate={{ rotateY: -95, opacity: 0 }}
                    transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
                    style={{ transformOrigin: 'left center', perspective: 1200 }}
                    className="absolute top-[28%] bottom-[20%] left-[32%] w-[18%] bg-gradient-to-r from-transparent to-black/40 z-30 pointer-events-none"
                  />
                  {/* Right Door 3D Swing */}
                  <motion.div 
                    initial={{ rotateY: 0, opacity: 1 }}
                    animate={{ rotateY: 95, opacity: 0 }}
                    transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
                    style={{ transformOrigin: 'right center', perspective: 1200 }}
                    className="absolute top-[28%] bottom-[20%] right-[32%] w-[18%] bg-gradient-to-l from-transparent to-black/40 z-30 pointer-events-none"
                  />
                </>
              )}

              {/* Center Golden Light Seam Pulse between the doors */}
              <div 
                className={`absolute top-[29%] bottom-[21%] left-1/2 -translate-x-1/2 bg-gradient-to-b from-transparent via-[#FFDF80] to-transparent pointer-events-none transition-all duration-300 ${
                  knockCount === 0 ? 'w-[2px] opacity-75 animate-pulse' :
                  knockCount === 1 ? 'w-[5px] opacity-90 shadow-[0_0_15px_#FFDF80]' :
                  knockCount === 2 ? 'w-[10px] opacity-100 shadow-[0_0_25px_#FFD700]' :
                  'w-[30px] opacity-100 shadow-[0_0_40px_#FFFFFF]'
                }`}
              />

              {/* Radial Light Burst on 3rd Knock */}
              {isAnimatingOpen && (
                <motion.div 
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 3, opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-radial from-white via-[#FFD700]/80 to-transparent z-40 pointer-events-none"
                />
              )}

              {/* Tap Ripples */}
              {ripples.map(r => (
                <motion.span
                  key={r.id}
                  initial={{ scale: 0.1, opacity: 0.8 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  style={{ top: r.y, left: r.x }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-[#FFDF80] bg-[#FFD700]/20 pointer-events-none z-30"
                />
              ))}

              {/* ========================================================= */}
              {/* Top Text Header (Basmala, Couple Names, Date) */}
              {/* ========================================================= */}
              <div className="absolute top-[4.5%] inset-x-4 flex flex-col items-center text-center z-30 pointer-events-none">
                
                {/* Basmala */}
                <p 
                  className="text-xs sm:text-sm text-white font-bold tracking-wider mb-1"
                  style={{ 
                    fontFamily: "'Aref Ruqaa', serif",
                    textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8)' 
                  }}
                >
                  {custom.bismillah || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
                </p>

                {/* Subtitle */}
                <span 
                  className="text-[11px] sm:text-xs text-[#EADCC5] font-semibold tracking-widest mb-1 uppercase"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                >
                  {custom.cardSubtitle || 'دعوة زفاف'}
                </span>

                {/* Couple Names in Grand Calligraphy */}
                <h1 
                  className="text-3xl sm:text-4xl font-extrabold text-white leading-tight flex items-center justify-center gap-2 mb-1"
                  style={{ 
                    fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Alex Brush', cursive",
                    textShadow: '0 2px 6px rgba(0,0,0,0.95), 0 0 12px rgba(212,175,55,0.7)'
                  }}
                >
                  <span>{data.groomName}</span>
                  <span className="text-[#DFBA73] font-serif text-2xl leading-none">&</span>
                  <span>{data.brideName}</span>
                </h1>

                {/* Wedding Date in Header */}
                <p 
                  className="text-xs text-white/95 font-bold tracking-wide"
                  style={{ 
                    fontFamily: "'Aref Ruqaa', serif",
                    textShadow: '0 1px 4px rgba(0,0,0,0.9)'
                  }}
                >
                  {dayName}، {dayNumber} {monthName} {yearNumber}
                </p>

              </div>


              {/* ========================================================= */}
              {/* Bottom Knock Interaction Prompt & 3 Flower Indicators */}
              {/* ========================================================= */}
              <div className="absolute bottom-[6%] inset-x-4 flex flex-col items-center text-center z-30 pointer-events-none">
                
                {/* Knock Instruction text */}
                <motion.div 
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="px-5 py-2 rounded-full bg-black/60 backdrop-blur-md border border-[#E5C987]/60 text-white text-xs sm:text-sm font-bold shadow-xl mb-3 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#DFBA73]" />
                  <span>
                    {knockCount === 0 && (custom.knockInstruction || 'دُقّوا على الباب ثلاث دقّاتٍ ليُفتح')}
                    {knockCount === 1 && 'الدقة الأولى... استمروا بالدق (1 / 3)'}
                    {knockCount === 2 && 'الدقة الثانية... أوشك الباب أن يفتح! (2 / 3)'}
                    {knockCount >= 3 && 'الدقة الثالثة... مرحباً بكم في ليلة العمر ✨'}
                  </span>
                </motion.div>

                {/* 3 Flower Symbols / Knocks Progress */}
                <div className="flex items-center justify-center gap-4 py-1">
                  {[1, 2, 3].map((num) => {
                    const isFilled = knockCount >= num;
                    return (
                      <motion.div
                        key={num}
                        animate={isFilled ? { scale: [0.8, 1.3, 1] } : {}}
                        transition={{ duration: 0.4 }}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isFilled 
                            ? 'bg-gradient-to-tr from-[#8C6D38] via-[#C5A059] to-[#DFBA73] text-white shadow-lg shadow-[#DFBA73]/50 ring-2 ring-white/80' 
                            : 'bg-black/50 border border-white/40 text-white/50 backdrop-blur-sm'
                        }`}
                      >
                        <span className="text-base">🌸</span>
                      </motion.div>
                    );
                  })}
                </div>

                <span className="text-[10px] text-white/80 font-medium mt-2 drop-shadow-md">
                  اضغط في أي مكان على الباب للدق 👆
                </span>

              </div>

            </motion.div>
          )}
        </AnimatePresence>


        {/* ========================================================= */}
        {/* REVEALED INVITATION CARD (Glides up when doors open) */}
        {/* ========================================================= */}
        <AnimatePresence>
          {isOpened && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-30 h-full flex flex-col justify-between p-4 sm:p-5 overflow-y-auto custom-scrollbar"
            >
              
              {/* Top Floating Control Bar */}
              <div className="flex items-center justify-between w-full pt-1 pb-3 px-1">
                {/* Reset / Re-knock Button */}
                <button
                  onClick={handleResetDoors}
                  className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold border border-white/30 flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة إغلاق الباب</span>
                </button>

                {/* Right controls: Share & Music */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/30 flex items-center justify-center shadow-md active:scale-95 transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  {data.music && (
                    <button
                      onClick={toggleMusic}
                      className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/30 flex items-center justify-center shadow-md active:scale-95 transition-all"
                    >
                      {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5 text-[#DFBA73]" /> : <VolumeX className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>


              {/* The Grand Royal Invitation Glass Card */}
              <div className="w-full bg-[#FAF7F2]/95 backdrop-blur-md rounded-[32px] border-2 border-[#D4AF37]/70 shadow-2xl p-5 sm:p-6 text-center text-[#3D2810] my-auto">
                
                {/* Decorative Diamond Flourish */}
                <div className="flex items-center justify-center mb-2">
                  <svg width="80" height="7" viewBox="0 0 100 8" fill="none" className="text-[#8C6D38]">
                    <path d="M0 4H42M58 4H100" stroke="currentColor" strokeWidth="0.8"/>
                    <path d="M50 0.5L54 4L50 7.5L46 4Z" fill="currentColor"/>
                  </svg>
                </div>

                {/* Basmala */}
                <p 
                  className="text-xs font-bold text-[#8C6D38] mb-1"
                  style={{ fontFamily: "'Aref Ruqaa', serif" }}
                >
                  {custom.bismillah || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
                </p>

                {/* Sacred Quote */}
                <p 
                  className="text-[11px] sm:text-xs text-[#6B5338] italic leading-relaxed mb-3 max-w-xs mx-auto"
                  style={{ fontFamily: "'Aref Ruqaa', serif" }}
                >
                  {custom.sacredQuote || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
                </p>

                {/* Intro Line */}
                <p 
                  className="text-xs font-bold text-[#8C6D38] mb-1"
                  style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Alex Brush', cursive" }}
                >
                  {custom.cursiveHeader || (isArabicContent ? 'يسعدنا ويشرفنا دعوتكم لحضور حفل زفاف' : 'The Wedding of')}
                </p>

                {/* Couple Names - Grand Typography */}
                <h2 
                  className="text-3xl sm:text-4xl font-extrabold text-[#4A3210] leading-tight flex items-center justify-center gap-2 mb-2"
                  style={{ 
                    fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Alex Brush', cursive",
                    textShadow: '0 1px 2px rgba(255,255,255,0.95)'
                  }}
                >
                  <span>{data.groomName}</span>
                  <span className="text-[#8C682A] font-serif text-xl leading-none">&</span>
                  <span>{data.brideName}</span>
                </h2>

                {/* Invitation Body Message */}
                <p 
                  className="text-xs text-gray-700 leading-relaxed max-w-xs mx-auto mb-4"
                  style={{ fontFamily: "'Aref Ruqaa', serif" }}
                >
                  {data.weddingMessage || custom.welcomeMessage || 'يسرنا دعوتكم لمشاركتنا فرحة العمر وحضور حفل زفافنا الميمون، لتكتمل سعادتنا بوجودكم معنا.'}
                </p>

                {/* Date & Time Badge */}
                <div className="py-2.5 px-4 rounded-2xl bg-[#F4EDE2] border border-[#E0D1BB] mb-4">
                  <div className="text-xs font-bold text-[#8C6D38] mb-0.5" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
                    {dayName}
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-[#4A3210] my-0.5 font-serif">
                    {dayNumber}
                  </div>
                  <div className="text-xs font-bold text-[#6B5338]" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
                    {monthName} {yearNumber} • {timeFormatted}
                  </div>
                </div>

                {/* Venue Details */}
                <div className="mb-4">
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-[#8C6D38] mb-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>مكان الحفل</span>
                  </div>
                  <h3 className="font-bold text-sm text-[#4A3210]">{data.venueName}</h3>
                  {data.venueAddress && (
                    <p className="text-[11px] text-gray-500 mt-0.5">{data.venueAddress}</p>
                  )}
                </div>

                {/* Countdown Timer */}
                {data.countdownEnabled && (
                  <div className="grid grid-cols-4 gap-1.5 max-w-[280px] mx-auto mb-4">
                    {[
                      { label: 'أيام', val: timeLeft.days },
                      { label: 'ساعات', val: timeLeft.hours },
                      { label: 'دقائق', val: timeLeft.minutes },
                      { label: 'ثوانٍ', val: timeLeft.seconds },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white/90 p-1.5 rounded-xl border border-[#D5C7B2] shadow-xs">
                        <span className="text-sm font-black text-[#4A3210] block font-mono leading-tight">
                          {String(item.val).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] font-bold text-[#8C6D38] block">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons: RSVP, Calendar, Maps */}
                <div className="flex items-center justify-center gap-2 pt-1 border-t border-[#EADBCA]">
                  
                  {/* RSVP Button */}
                  <button
                    onClick={() => setShowRsvpModal(true)}
                    className="flex-1 py-2 px-3 rounded-full bg-gradient-to-r from-[#A67C37] via-[#C5A059] to-[#8C6D38] text-white shadow-md text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition-all"
                    style={{ fontFamily: "'Aref Ruqaa', serif" }}
                  >
                    <Heart className="w-3.5 h-3.5 fill-white shrink-0" />
                    <span>تأكيد الحضور</span>
                  </button>

                  {/* Calendar Button */}
                  <a
                    href={gcalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-full bg-white hover:bg-gray-50 border border-[#D4AF37]/50 text-[#6E4D1D] font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
                    style={{ fontFamily: "'Aref Ruqaa', serif" }}
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                    <span>الموعد</span>
                  </a>

                  {/* Location Map Button */}
                  <a
                    href={data.googleMapsUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-full bg-white hover:bg-gray-50 border border-[#D4AF37]/50 text-[#6E4D1D] font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
                    style={{ fontFamily: "'Aref Ruqaa', serif" }}
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                    <span>الموقع</span>
                  </a>

                </div>

              </div>

              {/* Bottom Graceful Note */}
              <div className="text-center pt-2 pb-1">
                <p className="text-[11px] text-white/90 font-medium drop-shadow-md">
                  {custom.closingMessage || 'بكم تكتمل فرحتنا وتزداد بهجتنا ✨'}
                </p>
              </div>

            </motion.div>
          )}
        </AnimatePresence>


        {/* ========================================================= */}
        {/* RSVP MODAL */}
        {/* ========================================================= */}
        <AnimatePresence>
          {showRsvpModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl border border-[#D4AF37] text-right"
                dir="rtl"
              >
                <div className="flex items-center justify-between pb-3 border-b mb-4">
                  <h3 className="font-bold text-base text-[#4A3210]">تأكيد الحضور (RSVP)</h3>
                  <button onClick={() => setShowRsvpModal(false)} className="text-gray-400 hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {rsvpSent ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">شكراً لك!</h4>
                    <p className="text-xs text-gray-600 mb-4">تم تسجيل تأكيد حضورك بنجاح، ويسعدنا وجودك معنا.</p>
                    <button
                      onClick={() => { setShowRsvpModal(false); setRsvpSent(false); }}
                      className="px-6 py-2 bg-[#8C6D38] text-white rounded-full text-xs font-bold"
                    >
                      إغلاق
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setRsvpSent(true);
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكريم</label>
                      <input
                        required
                        type="text"
                        value={rsvpData.name}
                        onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                        placeholder="اكتب اسمك هنا"
                        className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#8C6D38]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">هل ستشرفنا بالحضور؟</label>
                      <select
                        value={rsvpData.attendance}
                        onChange={(e) => setRsvpData({ ...rsvpData, attendance: e.target.value })}
                        className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#8C6D38]"
                      >
                        <option value="yes">نعم، بكل سرور يشرفني الحضور 🤍</option>
                        <option value="no">أعتذر بكل أسف لعدم التمكن من الحضور</option>
                      </select>
                    </div>

                    {rsvpData.attendance === 'yes' && (
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">عدد المرافقين</label>
                        <select
                          value={rsvpData.guests}
                          onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                          className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#8C6D38]"
                        >
                          <option value="1">شخص واحد (أنا فقط)</option>
                          <option value="2">شخصان (2)</option>
                          <option value="3">3 أشخاص</option>
                          <option value="4">عائلة / 4 أشخاص فأكثر</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">رسالة تهنئة للعروسين (اختياري)</label>
                      <textarea
                        rows={2}
                        value={rsvpData.note}
                        onChange={(e) => setRsvpData({ ...rsvpData, note: e.target.value })}
                        placeholder="أطيب الأمنيات للعروسين..."
                        className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#8C6D38]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-full bg-gradient-to-r from-[#8C6D38] via-[#C5A059] to-[#DFBA73] text-white font-bold text-xs shadow-md mt-2"
                    >
                      إرسال التأكيد
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
};
