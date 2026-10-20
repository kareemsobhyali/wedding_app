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

// 20 Natural Falling Petals & Leaves Data
const PETALS_DATA = [
  { id: 1, left: 6, delay: 0.2, duration: 10, size: 16, type: 'rose', sway: 18 },
  { id: 2, left: 16, delay: 2.5, duration: 12, size: 13, type: 'ivory', sway: -14 },
  { id: 3, left: 26, delay: 4.8, duration: 9.5, size: 18, type: 'rose', sway: 16 },
  { id: 4, left: 36, delay: 1.2, duration: 13, size: 14, type: 'leaf', sway: -18 },
  { id: 5, left: 46, delay: 6.0, duration: 11, size: 17, type: 'rose', sway: 15 },
  { id: 6, left: 56, delay: 3.4, duration: 14, size: 12, type: 'ivory', sway: -12 },
  { id: 7, left: 66, delay: 5.2, duration: 10.5, size: 19, type: 'rose', sway: 19 },
  { id: 8, left: 76, delay: 1.7, duration: 12.5, size: 14, type: 'leaf', sway: -16 },
  { id: 9, left: 86, delay: 3.9, duration: 11.5, size: 16, type: 'rose', sway: 14 },
  { id: 10, left: 94, delay: 7.0, duration: 13, size: 13, type: 'ivory', sway: -15 },
  { id: 11, left: 12, delay: 8.2, duration: 11, size: 15, type: 'rose', sway: 17 },
  { id: 12, left: 32, delay: 5.6, duration: 12, size: 12, type: 'gold', sway: -10 },
  { id: 13, left: 52, delay: 9.1, duration: 13.5, size: 16, type: 'rose', sway: 14 },
  { id: 14, left: 62, delay: 7.7, duration: 10, size: 13, type: 'ivory', sway: -18 },
  { id: 15, left: 72, delay: 2.8, duration: 12.5, size: 18, type: 'rose', sway: 16 },
  { id: 16, left: 82, delay: 8.8, duration: 11, size: 14, type: 'leaf', sway: -14 },
  { id: 17, left: 22, delay: 6.5, duration: 14, size: 15, type: 'rose', sway: 18 },
  { id: 18, left: 42, delay: 4.2, duration: 11, size: 11, type: 'gold', sway: -12 },
  { id: 19, left: 3, delay: 9.7, duration: 12, size: 15, type: 'rose', sway: 13 },
  { id: 20, left: 89, delay: 10.4, duration: 11.5, size: 17, type: 'rose', sway: -16 },
];

// Falling Rose Petals & White Leaves Component
const FallingRosePetals = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[15]">
      {PETALS_DATA.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.35,
          }}
          initial={{
            top: '-8%',
            x: 0,
            rotateZ: 0,
            rotateX: 0,
            rotateY: 0,
            opacity: 0,
          }}
          animate={{
            top: '106%',
            x: [0, p.sway, -p.sway * 0.7, p.sway * 0.5, 0],
            rotateZ: [0, 160, 320, 480],
            rotateX: [0, 180, 360],
            rotateY: [0, 360],
            opacity: [0, 0.9, 0.95, 0.9, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        >
          {p.type === 'rose' && (
            <svg viewBox="0 0 24 30" className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(180,90,90,0.18)]">
              <defs>
                <linearGradient id={`roseGrad-${p.id}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F9A8B6" />
                  <stop offset="60%" stopColor="#F8B4C0" />
                  <stop offset="100%" stopColor="#FCE7EC" />
                </linearGradient>
              </defs>
              <path
                d="M 12 2 C 6 2, 2 8, 3 17 C 4 24, 8 29, 12 29 C 16 29, 20 24, 21 17 C 22 8, 18 2, 12 2 Z"
                fill={`url(#roseGrad-${p.id})`}
              />
            </svg>
          )}

          {p.type === 'ivory' && (
            <svg viewBox="0 0 24 30" className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(120,90,40,0.12)]">
              <defs>
                <linearGradient id={`ivoryGrad-${p.id}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="70%" stopColor="#FDFBF7" />
                  <stop offset="100%" stopColor="#F3E9DA" />
                </linearGradient>
              </defs>
              <path
                d="M 12 3 C 7 3, 3 9, 4 18 C 5 24, 9 28, 12 28 C 15 28, 19 24, 20 18 C 21 9, 17 3, 12 3 Z"
                fill={`url(#ivoryGrad-${p.id})`}
              />
            </svg>
          )}

          {p.type === 'leaf' && (
            <svg viewBox="0 0 24 30" className="w-full h-full filter drop-shadow-[0_2px_3px_rgba(80,100,60,0.1)]">
              <defs>
                <linearGradient id={`leafGrad-${p.id}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FAFDF7" />
                  <stop offset="50%" stopColor="#E2EDE0" />
                  <stop offset="100%" stopColor="#C9DCC6" />
                </linearGradient>
              </defs>
              <path
                d="M 12 2 C 5 8, 4 20, 12 28 C 20 20, 19 8, 12 2 Z"
                fill={`url(#leafGrad-${p.id})`}
              />
            </svg>
          )}

          {p.type === 'gold' && (
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A0] shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
          )}
        </motion.div>
      ))}
    </div>
  );
};

// True-Alpha Canvas Chroma-Key Video Component (100% Transparent Background, Watermark-Free, Mobile Compatible)
const RomanticCoupleVideo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animId: number;
    let isMounted = true;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Canvas internal buffer resolution
    const cw = 140;
    const ch = 190;
    canvas.width = cw;
    canvas.height = ch;

    const render = () => {
      if (!isMounted) return;

      if (video.readyState >= 2 && !video.paused) {
        // Source video is 720 x 1280.
        // We crop out the bottom 13% to cleanly remove the watermark:
        const sw = video.videoWidth || 720;
        const sh = (video.videoHeight || 1280) * 0.87;

        // Draw cropped video frame
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(video, 0, 0, sw, sh, 0, 0, cw, ch);

        try {
          const imgData = ctx.getImageData(0, 0, cw, ch);
          const data = imgData.data;
          const len = data.length;

          for (let i = 0; i < len; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // If pixel is white / light (brightness > 210)
            if (r > 210 && g > 210 && b > 210) {
              data[i + 3] = 0; // 100% Transparent Alpha!
            } else {
              // Tint dark lines into royal bronze to harmonize with palace marble (#4A3210)
              const darkness = (255 - ((r + g + b) / 3)) / 255;
              data[i] = 74;      // Bronze R
              data[i + 1] = 50;  // Bronze G
              data[i + 2] = 16;  // Bronze B
              data[i + 3] = Math.min(255, Math.round(darkness * 320)); // Soft anti-aliased edge
            }
          }
          ctx.putImageData(imgData, 0, 0);
        } catch {
          // Fallback if needed
        }
      }

      animId = requestAnimationFrame(render);
    };

    video.playbackRate = 0.95;
    video.play().catch(() => {});
    animId = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Background Mask strictly contained ABOVE the marble ledge (y >= 6.5%) */}
      <div 
        className="absolute bottom-[6.5%] left-1/2 -translate-x-1/2 w-[85px] h-[75px] rounded-t-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 85%, #FAF5ED 75%, rgba(250,245,237,0.85) 90%, transparent 100%)'
        }}
      />

      {/* Hidden Source Video (Muted for AutoPlay, Decoded in Background) */}
      <video
        ref={videoRef}
        src="/assets/templates/romantic-couple-video-2.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="hidden"
      />

      {/* Left-Aligned True-Alpha Transparent Canvas (Zero White Background, Guaranteed on Mobile) */}
      <div 
        className="absolute bottom-[2%] sm:bottom-[3%] left-[3%] sm:left-[5%] z-20 pointer-events-none flex flex-col items-center justify-end select-none"
      >
        {/* Soft Warm Halo Beneath Dancing Couple */}
        <div 
          className="absolute bottom-1 w-20 h-4 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.2) 0%, transparent 75%)'
          }}
        />

        <canvas
          ref={canvasRef}
          className="w-[115px] sm:w-[135px] h-[155px] sm:h-[185px] pointer-events-none select-none filter drop-shadow-[0_2px_4px_rgba(80,50,20,0.15)]"
        />
      </div>
    </>
  );
};

export const MughalPalacePortalTemplate: React.FC<TemplateRenderContext> = ({ data, mode, direction }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpData, setRsvpData] = useState({ name: '', attendance: 'yes', guests: '1', note: '' });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const custom = data.customData || {};
  const weddingDate = new Date(data.weddingDate);

  const isArabic = (text?: string) => /[\u0600-\u06FF]/.test(text || '');
  const isArabicContent = custom.language 
    ? custom.language === 'ar' 
    : (direction === 'RTL' || isArabic(data.groomName) || isArabic(data.brideName) || isArabic(data.venueName));

  // Month, Day, Year, DayName, Time formatting (Locale-Aware)
  const monthName = custom.dateMonth || (isArabicContent 
    ? weddingDate.toLocaleDateString('ar-EG', { month: 'long' })
    : weddingDate.toLocaleDateString('en-US', { month: 'long' }).toUpperCase());

  const dayName = custom.dateDayName || (isArabicContent
    ? weddingDate.toLocaleDateString('ar-EG', { weekday: 'long' })
    : weddingDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase());

  const dayNumber = custom.dateDayNumber || weddingDate.getDate().toString();
  const yearNumber = custom.dateYearNumber || weddingDate.getFullYear().toString();
  const timeFormatted = custom.dateTime || (isArabicContent
    ? weddingDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    : weddingDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

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
      particleCount: 80,
      spread: 85,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#FFF', '#C5A059']
    });
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
      className="h-[100dvh] w-full flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 font-serif bg-[#F4EDE4] selection:bg-[#D4AF37]/30 text-[#4A3518] overflow-hidden relative"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 40%, #FAF6EE 0%, #E8DFC8 100%)'
      }}
    >
      {/* Background Audio */}
      <audio 
        ref={audioRef} 
        src={data.music?.url || '/assets/templates/romantic-couple-video-2.mp4'} 
        loop 
        preload="auto" 
      />

      {/* Floating Controls */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-40 flex items-center gap-2">
        <button
          onClick={toggleAudio}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-[#D4AF37]/50 flex items-center justify-center text-[#8C6D38] hover:bg-[#8C6D38] hover:text-white transition-all transform hover:scale-105 active:scale-95"
          title={isPlayingAudio ? 'كتم الموسيقى' : 'تشغيل الموسيقى'}
        >
          {isPlayingAudio ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
        </button>
        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-[#D4AF37]/50 flex items-center justify-center text-[#8C6D38] hover:bg-[#8C6D38] hover:text-white transition-all transform hover:scale-105 active:scale-95"
          title="مشاركة الدعوة"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Wedding Portal Card */}
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

        {/* Falling Rose Petals & White Leaves Effect */}
        <FallingRosePetals />

        {/* Ambient Warm Sunbeam Flare */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 60%)'
          }}
        />

        {/* Inside Portal Content: Typography & Layout (Enlarged, Balanced, Harmonious in Portal Center) */}
        <div className="absolute top-[31%] bottom-[7.5%] left-[13%] right-[13%] flex flex-col items-center justify-between text-center z-20 pointer-events-none py-1 px-0.5">
          
          {/* 1. Header & Couple Names */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center w-full space-y-0.5"
          >
            {/* Soft decorative intro */}
            <p 
              className="text-xs sm:text-sm font-bold text-[#8C6D38] tracking-wide"
              style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Alex Brush', cursive" }}
            >
              {custom.cursiveHeader || (isArabicContent ? 'يسعدنا ويشرفنا دعوتكم لحضور حفل زفاف' : 'Together with their families, cordially invite you')}
            </p>

            {/* Couple Names - Grand & Royal */}
            <h1 
              className="text-3xl sm:text-4xl font-bold text-[#4A3210] leading-tight flex items-center justify-center gap-2"
              style={{ 
                fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Alex Brush', 'Great Vibes', cursive",
                textShadow: '0 1px 2px rgba(255,255,255,0.95), 0 0 6px rgba(255,255,255,0.8)'
              }}
              dir={isArabicContent ? "rtl" : "ltr"}
            >
              <span>{data.groomName}</span>
              <span className="text-[#8C682A] font-serif text-xl leading-none">&</span>
              <span>{data.brideName}</span>
            </h1>
          </motion.div>

          {/* 2. "تفاصيل حفل الزفاف" / "WEDDING DETAILS" */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-0.5 w-full"
          >
            <h2 
              className="text-sm sm:text-base text-[#543914] font-bold tracking-wider"
              style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Cinzel', serif" }}
            >
              {custom.detailsTitle || (isArabicContent ? 'تفاصيل حفل الزفاف المبارك' : 'WEDDING DETAILS')}
            </h2>

            {/* Diamond filigree flourish */}
            <div className="flex items-center justify-center my-0.5">
              <svg width="90" height="7" viewBox="0 0 100 8" fill="none" className="text-[#8C6D38]">
                <path d="M0 4H42M58 4H100" stroke="currentColor" strokeWidth="0.8"/>
                <path d="M50 0.5L54 4L50 7.5L46 4Z" fill="currentColor"/>
              </svg>
            </div>
          </motion.div>

          {/* 3. Architectural Date Section */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="w-full flex flex-col items-center space-y-0.5"
          >
            {/* Month Name */}
            <p 
              className="text-sm sm:text-base font-bold text-[#8C6D38] tracking-wide"
              style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Cinzel', serif" }}
            >
              {monthName}
            </p>

            {/* Middle Row: DayName | Big Numeral | Time (Clustered safely in the ivory center) */}
            <div className="flex items-center justify-center gap-3 sm:gap-5 py-0.5">
              {/* Day Name */}
              <span 
                className="text-xs sm:text-sm font-bold text-[#543914] tracking-normal"
                style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Cinzel', serif" }}
              >
                {dayName}
              </span>

              {/* Big Gold Numeral Date */}
              <span 
                className="text-4xl sm:text-5xl font-extrabold text-[#4A3210] px-1 leading-none"
                style={{ 
                  fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Cormorant Garamond', serif",
                  textShadow: '0 1px 3px rgba(255,255,255,0.9)'
                }}
              >
                {dayNumber}
              </span>

              {/* Time */}
              <span 
                className="text-xs sm:text-sm font-bold text-[#543914] tracking-normal"
                style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Cinzel', serif" }}
              >
                {timeFormatted}
              </span>
            </div>

            {/* Year */}
            <p 
              className="text-xs sm:text-sm font-bold text-[#8C6D38] tracking-widest"
              style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Cinzel', serif" }}
            >
              {yearNumber}
            </p>
          </motion.div>

          {/* 4. Venue Section */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="space-y-0.5 flex flex-col items-center w-full"
          >
            <p 
              className="text-[11px] sm:text-xs font-bold text-[#8C6D38] tracking-wider"
              style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Cinzel', serif" }}
            >
              {custom.venueHeading || (isArabicContent ? 'المكان' : 'VENUE')}
            </p>
            <p 
              className="text-sm sm:text-base font-bold text-[#4A3210] max-w-[250px] leading-tight"
              style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Cinzel', serif" }}
            >
              {data.venueName || (isArabicContent ? 'قاعة اللؤلؤة' : 'ROYAL PALACE BALLROOM')}
            </p>
            {(data.venueAddress || custom.venueAddressText) && (
              <p 
                className="text-[10px] sm:text-[11px] text-[#6E4D1D] max-w-[250px] leading-snug line-clamp-1"
                style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Cinzel', serif" }}
              >
                {data.venueAddress || custom.venueAddressText || (isArabicContent ? 'جراند أفينيو، حدائق القصر الملكي' : 'Grand Avenue, Royal Gardens')}
              </p>
            )}
          </motion.div>

          {/* 5. Live Countdown Section (4 Capsules with Seconds, Harmonious & Balanced) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex flex-col items-center justify-center w-full py-0.5"
          >
            <span 
              className="text-[10px] sm:text-[11px] font-bold text-[#8C6D38] tracking-wider mb-1"
              style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Cinzel', serif" }}
            >
              {isArabicContent ? 'العد التنازلي لليوم المنتظر' : 'COUNTDOWN'}
            </span>
            <div 
              className="flex items-center justify-center gap-1.5 sm:gap-2"
              dir={isArabicContent ? "rtl" : "ltr"}
            >
              <div className="px-2.5 py-1 sm:py-1.5 rounded-xl bg-white/92 backdrop-blur-xs border border-[#D4AF37]/50 text-center shadow-xs min-w-[44px] sm:min-w-[48px]">
                <span className="block text-sm sm:text-base font-bold text-[#4A3210] leading-none" style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}>{timeLeft.days}</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-[#8C6D38] block pt-0.5" style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}>{isArabicContent ? 'يوم' : 'DAYS'}</span>
              </div>
              <div className="px-2.5 py-1 sm:py-1.5 rounded-xl bg-white/92 backdrop-blur-xs border border-[#D4AF37]/50 text-center shadow-xs min-w-[44px] sm:min-w-[48px]">
                <span className="block text-sm sm:text-base font-bold text-[#4A3210] leading-none" style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}>{timeLeft.hours}</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-[#8C6D38] block pt-0.5" style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}>{isArabicContent ? 'ساعة' : 'HOURS'}</span>
              </div>
              <div className="px-2.5 py-1 sm:py-1.5 rounded-xl bg-white/92 backdrop-blur-xs border border-[#D4AF37]/50 text-center shadow-xs min-w-[44px] sm:min-w-[48px]">
                <span className="block text-sm sm:text-base font-bold text-[#4A3210] leading-none" style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}>{timeLeft.minutes}</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-[#8C6D38] block pt-0.5" style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}>{isArabicContent ? 'دقيقة' : 'MINS'}</span>
              </div>
              <div className="px-2.5 py-1 sm:py-1.5 rounded-xl bg-white/92 backdrop-blur-xs border border-[#D4AF37]/50 text-center shadow-xs min-w-[44px] sm:min-w-[48px]">
                <span className="block text-sm sm:text-base font-bold text-[#4A3210] leading-none" style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}>{timeLeft.seconds}</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-[#8C6D38] block pt-0.5" style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}>{isArabicContent ? 'ثانية' : 'SECS'}</span>
              </div>
            </div>
          </motion.div>

          {/* 6. Stacked Action Buttons (Occupying Space Elegantly in the Lower Portal Center) */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="flex flex-col items-center gap-1.5 sm:gap-2 w-full max-w-[200px] sm:max-w-[220px] pointer-events-auto"
            dir={isArabicContent ? "rtl" : "ltr"}
          >
            {/* Primary RSVP Button */}
            <button
              onClick={() => setShowRsvpModal(true)}
              className="w-full py-2 sm:py-2.5 px-3.5 rounded-full bg-gradient-to-r from-[#A67C37] via-[#C5A059] to-[#8C6D38] text-white shadow-md text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
              style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Cinzel', serif" }}
            >
              <Heart className="w-3.5 h-3.5 fill-white shrink-0" />
              <span>{isArabicContent ? 'تأكيد الحضور (RSVP)' : 'Confirm RSVP'}</span>
            </button>

            {/* Add to Calendar Button */}
            <a
              href={gcalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 sm:py-2 px-3.5 rounded-full bg-white/92 hover:bg-white border border-[#D4AF37]/60 text-[#6E4D1D] font-bold text-xs sm:text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs backdrop-blur-xs"
              style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Cinzel', serif" }}
            >
              <Calendar className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
              <span>{isArabicContent ? 'إضافة الموعد للتقويم' : 'Add to Calendar'}</span>
            </a>

            {/* Google Maps Button */}
            <a
              href={data.googleMapsUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 sm:py-2 px-3.5 rounded-full bg-white/92 hover:bg-white border border-[#D4AF37]/60 text-[#6E4D1D] font-bold text-xs sm:text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs backdrop-blur-xs"
              style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Cinzel', serif" }}
            >
              <MapPin className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
              <span>{isArabicContent ? 'موقع الحفل على الخريطة' : 'View on Google Maps'}</span>
            </a>
          </motion.div>

        </div>

        {/* Romantic Couple Video (Seamless Background Removal - 100% Unobstructed) */}
        <RomanticCoupleVideo />

      </motion.div>

      {/* RSVP Modal Dialog */}
      <AnimatePresence>
        {showRsvpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`bg-[#FAF8F5] border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative ${isArabicContent ? 'text-right' : 'text-left'}`}
              dir={isArabicContent ? "rtl" : "ltr"}
            >
              <button 
                onClick={() => setShowRsvpModal(false)}
                className={`absolute top-4 ${isArabicContent ? 'left-4' : 'right-4'} text-stone-400 hover:text-stone-700 p-1`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1 mb-5">
                <h3 
                  className="text-xl font-bold text-[#6E4D1D]"
                  style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "'Cinzel', serif" }}
                >
                  {isArabicContent ? 'تأكيد الحضور' : 'RSVP'}
                </h3>
                <p 
                  className="text-xs text-[#785D36]"
                  style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}
                >
                  {isArabicContent ? 'يسعدنا حضوركم ومشاركتنا بهجة هذا اليوم الاستثنائي' : 'We would be honored by your presence'}
                </p>
              </div>

              {rsvpSent ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-stone-800" style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}>{isArabicContent ? 'تم تسجيل حضوركم بنجاح!' : 'Your RSVP has been confirmed!'}</h4>
                  <p className="text-xs text-stone-500" style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}>{isArabicContent ? 'شكراً لكم، ننتظر تشريفكم بكل سعادة ومودة.' : 'Thank you! We look forward to celebrating together.'}</p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                    {slug && (
                      <a
                        href={`/${slug}/rsvp`}
                        className="w-full sm:w-auto px-4 py-2 rounded-full bg-[#8C6D38] hover:bg-[#6E4D1D] text-white text-xs font-bold shadow-xs transition-all text-center"
                      >
                        {isArabicContent ? '📋 عرض قائمة الحضور' : '📋 View Guest List'}
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => { setShowRsvpModal(false); setRsvpSent(false); }}
                      className="w-full sm:w-auto px-4 py-2 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold transition-all text-center"
                    >
                      {isArabicContent ? 'إغلاق' : 'Close'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#543914] mb-1" style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}>{isArabicContent ? 'الاسم الكريم' : 'Full Name'}</label>
                    <input 
                      type="text" 
                      required 
                      value={rsvpData.name}
                      onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#8C6D38] bg-white text-stone-800"
                      placeholder={isArabicContent ? "اكتب اسمك الكريم" : "Enter your full name"}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#543914] mb-1" style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}>{isArabicContent ? 'حالة الحضور' : 'Attendance'}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRsvpData({ ...rsvpData, attendance: 'yes' })}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          rsvpData.attendance === 'yes' 
                            ? 'bg-[#8C6D38] text-white border-[#8C6D38]' 
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                        style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}
                      >
                        {isArabicContent ? 'سأحضر بكل سرور ✨' : 'Attending with pleasure ✨'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpData({ ...rsvpData, attendance: 'no' })}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          rsvpData.attendance === 'no' 
                            ? 'bg-stone-700 text-white border-stone-700' 
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                        style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}
                      >
                        {isArabicContent ? 'أعتذر لظروف خاصة' : 'Regretfully Decline'}
                      </button>
                    </div>
                  </div>

                  {rsvpData.attendance === 'yes' && (
                    <div>
                      <label className="block text-xs font-semibold text-[#543914] mb-1" style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}>{isArabicContent ? 'عدد المرافقين' : 'Number of Guests'}</label>
                      <select
                        value={rsvpData.guests}
                        onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#8C6D38] bg-white text-stone-800"
                      >
                        <option value="1">{isArabicContent ? 'شخص واحد (أنا فقط)' : '1 person (myself only)'}</option>
                        <option value="2">{isArabicContent ? 'شخصان (2)' : '2 persons'}</option>
                        <option value="3">{isArabicContent ? '3 أشخاص' : '3 persons'}</option>
                        <option value="4">{isArabicContent ? '4 أشخاص أو أكثر' : '4+ persons'}</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[#543914] mb-1" style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}>{isArabicContent ? 'تهنئة أو رسالة للعروسين (اختياري)' : 'Message to the Couple (Optional)'}</label>
                    <textarea 
                      rows={2}
                      value={rsvpData.note}
                      onChange={(e) => setRsvpData({ ...rsvpData, note: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#8C6D38] bg-white text-stone-800"
                      placeholder={isArabicContent ? "أجمل التمنيات بحياة مباركة..." : "Best wishes for a lifetime of love and joy..."}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#A67C37] via-[#C5A059] to-[#8C6D38] text-white font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#8C6D38]/30"
                    style={{ fontFamily: isArabicContent ? "'Aref Ruqaa', serif" : "inherit" }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isArabicContent ? 'إرسال التأكيد' : 'Confirm RSVP'}</span>
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
