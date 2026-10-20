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
  Check,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

const isArabic = (text?: string): boolean => {
  if (!text) return false;
  return /[\u0600-\u06FF]/.test(text);
};

export const PalaceDoorsRevealTemplate: React.FC<TemplateRenderContext> = ({ data, mode, direction }) => {
  const [knockCount, setKnockCount] = useState<number>(0);
  const [isDoorOpen, setIsDoorOpen] = useState<boolean>(false);
  const [isAnimatingDoor, setIsAnimatingDoor] = useState<boolean>(false);
  const [doorVibrate, setDoorVibrate] = useState<boolean>(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  const initialGuestName = data.guestName || '';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpData, setRsvpData] = useState({ name: initialGuestName, attendance: 'yes', guests: '1', note: '' });

  useEffect(() => {
    if (initialGuestName && !rsvpData.name) {
      setRsvpData(prev => ({ ...prev, name: initialGuestName }));
    }
  }, [initialGuestName]);

  const singleKnockAudioRef = useRef<HTMLAudioElement | null>(null);
  const doorCreakAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicAudioRef = useRef<HTMLAudioElement | null>(null);

  const custom = data.customData || {};
  const weddingDate = new Date(data.weddingDate);

  // Formatted date values
  const isArabicContent = custom.language 
    ? custom.language === 'ar' 
    : (direction === 'RTL' || isArabic(data.groomName) || isArabic(data.brideName) || isArabic(custom.sacredQuote));
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
    if (isDoorOpen || isAnimatingDoor) return;

    // Add visual tap ripple
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rippleId = Date.now();
    setRipples(prev => [...prev, { id: rippleId, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 800);

    // Door shake / vibration effect
    setDoorVibrate(true);
    setTimeout(() => setDoorVibrate(false), 260);

    const newKnock = knockCount + 1;
    setKnockCount(newKnock);

    if (newKnock < 3) {
      // Play single knock sound
      if (singleKnockAudioRef.current) {
        singleKnockAudioRef.current.currentTime = 0;
        singleKnockAudioRef.current.play().catch(() => {});
      }
    } else {
      // 3rd knock: The doors physically swing backward into the room!
      setIsAnimatingDoor(true);
      
      // Play opening creak sound
      if (doorCreakAudioRef.current) {
        doorCreakAudioRef.current.currentTime = 0;
        doorCreakAudioRef.current.play().catch(() => {});
      }

      // Confetti burst
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#D4AF37', '#FAF7F2', '#EADCC5', '#FFD700']
      });

      // Swing doors open
      setTimeout(() => {
        setIsDoorOpen(true);
        setIsAnimatingDoor(false);

        // Auto-play background music if available
        if (data.music && bgMusicAudioRef.current && !isPlayingAudio) {
          bgMusicAudioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
        }
      }, 1400);
    }
  };

  // Re-close doors smoothly so the user can experience knocking again
  const handleResetDoors = () => {
    setIsDoorOpen(false);
    setIsAnimatingDoor(false);
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

  const slug = (data as any).slug || (typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : '');

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpData.name.trim()) return;

    try {
      if (slug) {
        await fetch(`/api/v1/public/invitations/${slug}/rsvp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: rsvpData.name,
            attendance: rsvpData.attendance,
            guestsCount: parseInt(rsvpData.guests, 10) || 1,
            notes: rsvpData.note
          })
        });
      }
    } catch (err) {
      console.error('Error submitting RSVP:', err);
    }

    setRsvpSent(true);
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#FFF', '#C5A059']
    });
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
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#FAF7F2] flex items-center justify-center selection:bg-[#EBDCC0] selection:text-[#38260F]">
      
      {/* Audio elements */}
      <audio ref={singleKnockAudioRef} src="/assets/templates/single-knock.mp3" preload="auto" />
      <audio ref={doorCreakAudioRef} src="/assets/templates/door-creak-open.mp3" preload="auto" />
      {data.music?.url && (
        <audio ref={bgMusicAudioRef} src={data.music.url} loop preload="auto" />
      )}

      {/* ========================================================= */}
      {/* AMBIENT EXTENDED PALACE WALLPAPER (ELIMINATES ANY BLACK BARS) */}
      {/* Covers 100% of the screen on all monitor sizes */}
      {/* ========================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <img 
          src="/assets/templates/palace-ballroom-revealed.jpg" 
          alt="Ambient Wallpaper"
          className="w-full h-full object-cover filter blur-2xl scale-110 opacity-75"
        />
        <div className="absolute inset-0 bg-[#FAF7F2]/20 backdrop-blur-sm" />
      </div>

      {/* ========================================================= */}
      {/* MAIN STAGE: EXACT 768:1376 RATIO PALACE ENTRANCE */}
      {/* The background stays 100% static - NEVER lifts or slides up! */}
      {/* ========================================================= */}
      <div 
        className="relative h-full max-h-[100dvh] aspect-[768/1376] shadow-2xl overflow-hidden flex flex-col justify-between z-10 select-none sm:rounded-[36px] sm:border-2 border-[#D4AF37]/50"
        dir="rtl"
        onClick={handleKnock}
      >

        {/* ========================================================= */}
        {/* BASE IMAGE: PALACE BALLROOM INTERIOR (STATIC LAYER) */}
        {/* Shows columns, arch, steps, and revealed room behind doors */}
        {/* ========================================================= */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <img 
            src="/assets/templates/palace-ballroom-revealed.jpg" 
            alt="Palace Architecture"
            className="w-full h-full object-fill select-none pointer-events-none"
          />
          {/* Subtle gradient at the very top for typography contrast */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 via-black/25 to-transparent pointer-events-none" />
        </div>


        {/* ========================================================= */}
        {/* 3D DOOR LEAVES: PUSH BACKWARD INTO DEPTH (AS REQUESTED) */}
        {/* Exact door area: left 31.77%, top 29.07%, width 18.23% each */}
        {/* Left door rotates on left hinge backward: rotateY(-85deg) */}
        {/* Right door rotates on right hinge backward: rotateY(85deg) */}
        {/* ========================================================= */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ perspective: 1200 }}
        >
          
          {/* Left Door Leaf (Swings Backward into Room) */}
          <motion.div
            style={{
              position: 'absolute',
              left: '31.77%',
              top: '29.07%',
              width: '18.23%',
              height: '49.42%',
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
            }}
            animate={
              isDoorOpen || isAnimatingDoor
                ? { 
                    rotateY: -85, 
                    translateZ: -60,
                    opacity: [1, 1, 0.4, 0] 
                  }
                : doorVibrate 
                  ? { x: [-3, 3, -2, 2, 0], rotateY: 0 } 
                  : { x: 0, rotateY: 0, translateZ: 0, opacity: 1 }
            }
            transition={{ 
              duration: isDoorOpen || isAnimatingDoor ? 1.5 : 0.25, 
              ease: [0.25, 1, 0.5, 1] 
            }}
            className="overflow-hidden shadow-2xl"
          >
            <img 
              src="/assets/templates/leaf-left.png" 
              alt="Left Palace Door"
              className="w-full h-full object-fill select-none pointer-events-none"
            />
          </motion.div>

          {/* Right Door Leaf (Swings Backward into Room) */}
          <motion.div
            style={{
              position: 'absolute',
              left: '50.0%',
              top: '29.07%',
              width: '18.23%',
              height: '49.42%',
              transformOrigin: 'right center',
              transformStyle: 'preserve-3d',
            }}
            animate={
              isDoorOpen || isAnimatingDoor
                ? { 
                    rotateY: 85, 
                    translateZ: -60,
                    opacity: [1, 1, 0.4, 0] 
                  }
                : doorVibrate 
                  ? { x: [3, -3, 2, -2, 0], rotateY: 0 } 
                  : { x: 0, rotateY: 0, translateZ: 0, opacity: 1 }
            }
            transition={{ 
              duration: isDoorOpen || isAnimatingDoor ? 1.5 : 0.25, 
              ease: [0.25, 1, 0.5, 1] 
            }}
            className="overflow-hidden shadow-2xl"
          >
            <img 
              src="/assets/templates/leaf-right.png" 
              alt="Right Palace Door"
              className="w-full h-full object-fill select-none pointer-events-none"
            />
          </motion.div>

          {/* Center Vertical Light Seam (Glows brighter on knocks) */}
          {(!isDoorOpen || isAnimatingDoor) && (
            <div 
              style={{
                position: 'absolute',
                left: '50%',
                top: '29.07%',
                height: '49.42%',
                transform: 'translateX(-50%)',
              }}
              className={`bg-gradient-to-b from-transparent via-[#FFDF80] to-transparent pointer-events-none transition-all duration-300 ${
                knockCount === 0 ? 'w-[2px] opacity-75 animate-pulse' :
                knockCount === 1 ? 'w-[5px] opacity-90 shadow-[0_0_15px_#FFDF80]' :
                knockCount === 2 ? 'w-[10px] opacity-100 shadow-[0_0_25px_#FFD700]' :
                'w-[35px] opacity-100 shadow-[0_0_40px_#FFFFFF]'
              }`}
            />
          )}

          {/* Radial Light Flare Burst on 3rd Knock */}
          {isAnimatingDoor && (
            <motion.div 
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 3.2, opacity: [0, 1, 0] }}
              transition={{ duration: 1.3, ease: "easeOut" }}
              className="absolute top-[53%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-radial from-white via-[#FFD700]/90 to-transparent z-30 pointer-events-none"
            />
          )}

        </div>


        {/* ========================================================= */}
        {/* TAP RIPPLES FEEDBACK */}
        {/* ========================================================= */}
        {ripples.map(r => (
          <motion.span
            key={r.id}
            initial={{ scale: 0.1, opacity: 0.8 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            style={{ top: r.y, left: r.x }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-[#FFDF80] bg-[#FFD700]/25 pointer-events-none z-30"
          />
        ))}


        {/* ========================================================= */}
        {/* BEFORE OPENING: TOP HEADER & BOTTOM KNOCK INSTRUCTION */}
        {/* ========================================================= */}
        <AnimatePresence>
          {!isDoorOpen && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col justify-between pointer-events-none z-30 p-4 sm:p-6"
            >
              
              {/* Top Text Header (Basmala, Couple Names, Date) */}
              <div className="flex flex-col items-center text-center pt-2">
                
                {/* Basmala */}
                <p 
                  className="text-xs sm:text-sm text-white font-bold tracking-wider mb-1"
                  style={{ 
                    fontFamily: "'Aref Ruqaa', serif",
                    textShadow: '0 2px 4px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9)' 
                  }}
                >
                  {custom.bismillah || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
                </p>

                {/* Subtitle */}
                <span 
                  className="text-[11px] sm:text-xs text-[#EADCC5] font-semibold tracking-widest mb-1 uppercase"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95)' }}
                >
                  {custom.cardSubtitle || 'دعوة زفاف'}
                </span>

                {/* Couple Names in Grand Calligraphy */}
                <h1 
                  className="text-3xl sm:text-4xl font-extrabold text-white leading-tight flex items-center justify-center gap-2 mb-1"
                  style={{ 
                    fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Alex Brush', cursive",
                    textShadow: '0 2px 8px rgba(0,0,0,0.95), 0 0 15px rgba(212,175,55,0.8)'
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
                    textShadow: '0 1px 4px rgba(0,0,0,0.95)'
                  }}
                >
                  {dayName}، {dayNumber} {monthName} {yearNumber}
                </p>

                {/* Personalized Guest Welcome Badge */}
                {initialGuestName && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#DFBA73] text-[#FFE8A3] text-xs font-bold shadow-xl"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#DFBA73]" />
                    <span style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : undefined }}>
                      {isArabicContent ? `دعوة خاصة لـ: ${initialGuestName}` : `Special Invitation for: ${initialGuestName}`}
                    </span>
                  </motion.div>
                )}

              </div>

              {/* Bottom Knock Interaction Prompt & 3 Flower Indicators */}
              <div className="flex flex-col items-center text-center pb-4">
                
                {/* Knock Instruction text */}
                <motion.div 
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="px-5 py-2 rounded-full bg-black/65 backdrop-blur-md border border-[#E5C987]/70 text-white text-xs sm:text-sm font-bold shadow-xl mb-3 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#DFBA73]" />
                  <span>
                    {knockCount === 0 && (custom.knockInstruction || (isArabicContent ? 'دُقّوا على الباب ثلاث دقّاتٍ ليُفتح' : 'Knock 3 times on the doors to enter'))}
                    {knockCount === 1 && (isArabicContent ? 'الدقة الأولى... استمروا بالدق (1 / 3)' : 'First knock... keep knocking (1 / 3)')}
                    {knockCount === 2 && (isArabicContent ? 'الدقة الثانية... أوشك الباب أن يفتح! (2 / 3)' : 'Second knock... almost open! (2 / 3)')}
                    {knockCount >= 3 && (isArabicContent ? 'الدقة الثالثة... مرحباً بكم في ليلة العمر ✨' : 'Opening doors... Welcome to the Palace ✨')}
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

                <span className="text-[10px] text-white/85 font-semibold mt-2 drop-shadow-md">
                  {isArabicContent ? 'اضغط في أي مكان على الباب للدق 👆' : 'Tap anywhere on the doors to knock 👆'}
                </span>

              </div>

            </motion.div>
          )}
        </AnimatePresence>


        {/* ========================================================= */}
        {/* AFTER OPENING: REVEALED INVITATION DETAILS */}
        {/* Appears smoothly IN PLACE inside the doorway (NO sliding up!) */}
        {/* ========================================================= */}
        <AnimatePresence>
          {isDoorOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-4 overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Top Floating Control Bar */}
              <div className="flex items-center justify-between w-full pt-1 pb-2 px-1">
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
                      {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5 text-[#DFBA73]" /> : <VolumeX className="w-3.5 h-3.5 text-white" />}
                    </button>
                  )}
                </div>
              </div>


              {/* The Grand Royal Invitation Glass Card (Floats inside doorway) */}
              <div className="w-full max-w-[340px] mx-auto bg-white/92 backdrop-blur-md rounded-[28px] border-2 border-[#D4AF37]/70 shadow-2xl p-4 sm:p-5 text-center text-[#3D2810] my-auto">
                
                {/* Decorative Diamond Flourish */}
                <div className="flex items-center justify-center mb-1.5">
                  <svg width="70" height="6" viewBox="0 0 100 8" fill="none" className="text-[#8C6D38]">
                    <path d="M0 4H42M58 4H100" stroke="currentColor" strokeWidth="0.8"/>
                    <path d="M50 0.5L54 4L50 7.5L46 4Z" fill="currentColor"/>
                  </svg>
                </div>

                {/* Basmala */}
                <p 
                  className="text-[11px] font-bold text-[#8C6D38] mb-0.5"
                  style={{ fontFamily: "'Aref Ruqaa', serif" }}
                >
                  {custom.bismillah || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
                </p>

                {/* Sacred Quote */}
                <p 
                  className="text-[10px] sm:text-[11px] text-[#6B5338] italic leading-relaxed mb-2 max-w-xs mx-auto"
                  style={{ fontFamily: "'Aref Ruqaa', serif" }}
                >
                  {custom.sacredQuote || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
                </p>

                {/* Intro Line */}
                <p 
                  className="text-[11px] font-bold text-[#8C6D38] mb-0.5"
                  style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Alex Brush', cursive" }}
                >
                  {custom.cursiveHeader || (isArabicContent ? 'يسعدنا ويشرفنا دعوتكم لحضور حفل زفاف' : 'The Wedding of')}
                </p>

                {/* Couple Names - Grand Typography */}
                <h2 
                  className="text-2xl sm:text-3xl font-extrabold text-[#4A3210] leading-tight flex items-center justify-center gap-2 mb-1.5"
                  style={{ 
                    fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Alex Brush', cursive",
                    textShadow: '0 1px 2px rgba(255,255,255,0.95)'
                  }}
                >
                  <span>{data.groomName}</span>
                  <span className="text-[#8C682A] font-serif text-lg leading-none">&</span>
                  <span>{data.brideName}</span>
                </h2>

                {/* Personalized Guest Invitation Banner inside Glass Card */}
                {initialGuestName && (
                  <div className="my-2 py-1.5 px-3 rounded-full bg-gradient-to-r from-[#DFBA73]/15 via-[#DFBA73]/30 to-[#DFBA73]/15 border border-[#DFBA73]/60 inline-flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#8C6D38]" />
                    <span className="text-xs sm:text-sm font-bold text-[#4A3210]" style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : undefined }}>
                      {isArabicContent ? `يتشرف العروسان بدعوة: ${initialGuestName}` : `Cordially Invited: ${initialGuestName}`}
                    </span>
                  </div>
                )}

                {/* Invitation Body Message */}
                <p 
                  className="text-[11px] text-gray-700 leading-relaxed max-w-xs mx-auto mb-3"
                  style={{ fontFamily: "'Aref Ruqaa', serif" }}
                >
                  {data.weddingMessage || custom.welcomeMessage || 'يسرنا دعوتكم لمشاركتنا فرحة العمر وحضور حفل زفافنا الميمون، لتكتمل سعادتنا بوجودكم معنا.'}
                </p>

                {/* Date & Time Badge */}
                <div className="py-2 px-3 rounded-2xl bg-[#F4EDE2] border border-[#E0D1BB] mb-3">
                  <div className="text-[11px] font-bold text-[#8C6D38] mb-0.5" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
                    {dayName}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-[#4A3210] my-0.5 font-serif">
                    {dayNumber}
                  </div>
                  <div className="text-[11px] font-bold text-[#6B5338]" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
                    {monthName} {yearNumber} • {timeFormatted}
                  </div>
                </div>

                {/* Venue Details */}
                <div className="mb-3">
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C6D38] mb-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>مكان الحفل</span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#4A3210]">{data.venueName}</h3>
                  {data.venueAddress && (
                    <p className="text-[10px] text-gray-500 mt-0.5">{data.venueAddress}</p>
                  )}
                </div>

                {/* Countdown Timer */}
                {data.countdownEnabled && (
                  <div className="grid grid-cols-4 gap-1 max-w-[260px] mx-auto mb-3">
                    {[
                      { label: isArabicContent ? 'أيام' : 'DAYS', val: timeLeft.days },
                      { label: isArabicContent ? 'ساعات' : 'HOURS', val: timeLeft.hours },
                      { label: isArabicContent ? 'دقائق' : 'MINS', val: timeLeft.minutes },
                      { label: isArabicContent ? 'ثوانٍ' : 'SECS', val: timeLeft.seconds },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white/90 p-1 rounded-xl border border-[#D5C7B2] shadow-xs">
                        <span className="text-xs font-black text-[#4A3210] block font-mono leading-tight">
                          {String(item.val).padStart(2, '0')}
                        </span>
                        <span className="text-[8px] font-bold text-[#8C6D38] block">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons: RSVP, Calendar, Maps */}
                <div 
                  className="flex items-center justify-center gap-1.5 pt-1 border-t border-[#EADBCA]"
                  dir={isArabicContent ? "rtl" : "ltr"}
                >
                  
                  {/* RSVP Button */}
                  <button
                    onClick={() => setShowRsvpModal(true)}
                    className="flex-1 py-1.5 px-2 rounded-full bg-gradient-to-r from-[#A67C37] via-[#C5A059] to-[#8C6D38] text-white shadow-md text-xs font-bold flex items-center justify-center gap-1 hover:brightness-110 active:scale-95 transition-all"
                    style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Cinzel', serif" }}
                  >
                    <Heart className="w-3 h-3 fill-white shrink-0" />
                    <span>{isArabicContent ? 'تأكيد الحضور' : 'RSVP'}</span>
                  </button>

                  {/* Calendar Button */}
                  <a
                    href={gcalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-2.5 rounded-full bg-white hover:bg-gray-50 border border-[#D4AF37]/50 text-[#6E4D1D] font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
                    style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Cinzel', serif" }}
                  >
                    <Calendar className="w-3 h-3 text-[#B8860B] shrink-0" />
                    <span>{isArabicContent ? 'الموعد' : 'Calendar'}</span>
                  </a>

                  {/* Location Map Button */}
                  <a
                    href={data.googleMapsUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-2.5 rounded-full bg-white hover:bg-gray-50 border border-[#D4AF37]/50 text-[#6E4D1D] font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
                    style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Cinzel', serif" }}
                  >
                    <MapPin className="w-3 h-3 text-[#B8860B] shrink-0" />
                    <span>{isArabicContent ? 'الموقع' : 'Location'}</span>
                  </a>

                </div>

              </div>

              {/* Bottom Graceful Note */}
              <div className="text-center pt-1 pb-1">
                <p className="text-[10px] text-white/90 font-medium drop-shadow-md">
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
                className={`bg-white rounded-[28px] p-5 max-w-sm w-full shadow-2xl border border-[#D4AF37] ${isArabicContent ? 'text-right' : 'text-left'}`}
                dir={isArabicContent ? "rtl" : "ltr"}
              >
                <div className="flex items-center justify-between pb-3 border-b mb-3">
                  <h3 className="font-bold text-sm text-[#4A3210]">{isArabicContent ? 'تأكيد الحضور (RSVP)' : 'Confirm RSVP'}</h3>
                  <button onClick={() => setShowRsvpModal(false)} className="text-gray-400 hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {rsvpSent ? (
                  <div className="text-center py-5">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Check className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">{isArabicContent ? 'شكراً لك!' : 'Thank you!'}</h4>
                    <p className="text-xs text-gray-600 mb-4">{isArabicContent ? 'تم تسجيل تأكيد حضورك بنجاح، ويسعدنا وجودك معنا.' : 'Your attendance has been confirmed successfully.'}</p>
                    <button
                      type="button"
                      onClick={() => { setShowRsvpModal(false); setRsvpSent(false); }}
                      className="w-full sm:w-auto px-6 py-2 bg-[#8C6D38] hover:bg-[#6E4D1D] text-white rounded-full text-xs font-bold transition-all text-center shadow-sm active:scale-95"
                    >
                      {isArabicContent ? 'إغلاق' : 'Close'}
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleRsvpSubmit}
                    className="space-y-2.5"
                  >
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">{isArabicContent ? 'الاسم الكريم' : 'Full Name'}</label>
                      <input
                        required
                        type="text"
                        value={rsvpData.name}
                        onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                        placeholder={isArabicContent ? "اكتب اسمك هنا" : "Enter your full name"}
                        className="w-full p-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#8C6D38]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">{isArabicContent ? 'هل ستشرفنا بالحضور؟' : 'Attendance'}</label>
                      <select
                        value={rsvpData.attendance}
                        onChange={(e) => setRsvpData({ ...rsvpData, attendance: e.target.value })}
                        className="w-full p-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#8C6D38]"
                      >
                        <option value="yes">{isArabicContent ? 'نعم، بكل سرور يشرفني الحضور 🤍' : 'Yes, attending with pleasure 🤍'}</option>
                        <option value="no">{isArabicContent ? 'أعتذر بكل أسف لعدم التمكن من الحضور' : 'Regretfully Decline'}</option>
                      </select>
                    </div>

                    {rsvpData.attendance === 'yes' && (
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">{isArabicContent ? 'عدد المرافقين' : 'Number of Guests'}</label>
                        <select
                          value={rsvpData.guests}
                          onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                          className="w-full p-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#8C6D38]"
                        >
                          <option value="1">{isArabicContent ? 'شخص واحد (أنا فقط)' : '1 person (myself only)'}</option>
                          <option value="2">{isArabicContent ? 'شخصان (2)' : '2 persons'}</option>
                          <option value="3">{isArabicContent ? '3 أشخاص' : '3 persons'}</option>
                          <option value="4">{isArabicContent ? 'عائلة / 4 أشخاص فأكثر' : 'Family / 4+ persons'}</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">{isArabicContent ? 'رسالة تهنئة للعروسين (اختياري)' : 'Message to the Couple (Optional)'}</label>
                      <textarea
                        rows={2}
                        value={rsvpData.note}
                        onChange={(e) => setRsvpData({ ...rsvpData, note: e.target.value })}
                        placeholder={isArabicContent ? "أطيب الأمنيات للعروسين..." : "Best wishes for a lifetime of love..."}
                        className="w-full p-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#8C6D38]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#8C6D38] via-[#C5A059] to-[#DFBA73] text-white font-bold text-xs shadow-md mt-1"
                    >
                      {isArabicContent ? 'إرسال التأكيد' : 'Confirm RSVP'}
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
