'use client';

import React, { useState, useRef, useEffect } from "react";
import { TemplateRenderContext } from "../../types";
import { TrackedLink } from "../../utils/TrackedLink";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Heart, 
  MapPin, 
  Clock, 
  Calendar, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Sparkles, 
  Navigation,
  RotateCcw
} from "lucide-react";

// ========================================================
// PHOTOREALISTIC 3D BUTTERFLY COMPONENT
// ========================================================
const RealisticButterfly: React.FC<{ size?: number; isFlying?: boolean; className?: string }> = ({ 
  size = 80, 
  isFlying = false, 
  className = '' 
}) => {
  const halfSize = size / 2;
  return (
    <div 
      dir="ltr"
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size, perspective: 900 }}
    >
      <div 
        className="relative flex items-center justify-center pointer-events-none" 
        style={{ width: size, height: size, transformStyle: 'preserve-3d' }}
      >
        {/* Left Wing (Natural Left side of butterfly: 0 to halfSize) */}
        <div 
          className="relative h-full overflow-hidden" 
          style={{ 
            width: halfSize,
            transformOrigin: 'right center',
            animation: isFlying 
              ? 'flapLeftRealistic 0.28s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate' 
              : 'subtleFlapLeft 2.2s ease-in-out infinite alternate' 
          }}
        >
          <img 
            src="/assets/templates/butterfly-transparent.png" 
            alt="Butterfly Left Wing"
            className="absolute top-0 max-w-none h-full object-cover pointer-events-none drop-shadow-sm"
            style={{ width: size, height: size, left: 0 }}
          />
        </div>

        {/* Right Wing (Natural Right side of butterfly: halfSize to size) */}
        <div 
          className="relative h-full overflow-hidden" 
          style={{ 
            width: halfSize,
            transformOrigin: 'left center',
            animation: isFlying 
              ? 'flapRightRealistic 0.28s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate' 
              : 'subtleFlapRight 2.2s ease-in-out infinite alternate' 
          }}
        >
          <img 
            src="/assets/templates/butterfly-transparent.png" 
            alt="Butterfly Right Wing"
            className="absolute top-0 max-w-none h-full object-cover pointer-events-none drop-shadow-sm"
            style={{ width: size, height: size, left: -halfSize }}
          />
        </div>
      </div>
    </div>
  );
};

export const ButterflyEleganceTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const groom = data.groomName?.trim() || "محمد";
  const bride = data.brideName?.trim() || "سارة";
  const venue = data.venueName?.trim() || "فندق الفورسيزونز - قاعة اللؤلؤة";
  const address = data.venueAddress?.trim() || "كورنيش النيل، القاهرة";

  // Format date in Arabic
  const weddingDate = new Date(data.weddingDate || '2026-11-20T19:00:00Z');
  const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const dateArabic = weddingDate.toLocaleDateString('ar-EG', dateOptions);
  
  const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
  const timeArabic = weddingDate.toLocaleTimeString('ar-EG', timeOptions);

  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const difference = weddingDate.getTime() - new Date().getTime();
      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'),
        minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0'),
        seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  const handleOpenEnvelope = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);

    if (data.music && audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }

    // Sparkle confetti effect
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 75,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#F3E5AB', '#ffffff', '#E6C687']
      });
    }, 950);

    // Switch to opened full invitation smoothly
    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
    }, 1850);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsOpening(false);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const custom = data.customData || {};
  const timelineEvents = [
    {
      time: custom.timeline1Time || '07:30 PM',
      title: custom.timeline1Title || 'استقبال الضيوف',
      desc: custom.timeline1Desc || 'يسعدنا حضوركم ومشاركتكم فرحتنا'
    },
    {
      time: custom.timeline2Time || '08:30 PM',
      title: custom.timeline2Title || 'عقد القران والزفة',
      desc: custom.timeline2Desc || 'لحظات البداية ومباركة الجمع الكريم'
    },
    {
      time: custom.timeline3Time || '10:00 PM',
      title: custom.timeline3Title || 'العشاء الملكي',
      desc: custom.timeline3Desc || 'بوفيه عشاء فاخر احتفاءً بكم'
    }
  ];

  return (
    <div className="butterfly-elegance-root min-h-screen relative font-cairo bg-[#F7F4EE] text-[#42382F] overflow-x-hidden selection:bg-[#D4AF37] selection:text-white" dir="rtl">
      
      {/* Styles & Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
        
        .font-amiri { font-family: 'Amiri', serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-cairo { font-family: 'Cairo', sans-serif; }

        .linen-texture {
          background-color: #F8F5EE;
          background-image: radial-gradient(#D6CABA 0.75px, transparent 0.75px), radial-gradient(#D6CABA 0.75px, #F8F5EE 0.75px);
          background-size: 30px 30px;
          background-position: 0 0, 15px 15px;
        }

        /* 3D Realistic Wing Flapping Keyframes */
        @keyframes flapLeftRealistic {
          0% { transform: rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateY(-65deg) rotateZ(-4deg); }
        }
        @keyframes flapRightRealistic {
          0% { transform: rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateY(65deg) rotateZ(4deg); }
        }

        @keyframes subtleFlapLeft {
          0% { transform: rotateY(-5deg); }
          100% { transform: rotateY(-28deg); }
        }
        @keyframes subtleFlapRight {
          0% { transform: rotateY(5deg); }
          100% { transform: rotateY(28deg); }
        }

        /* Ambient background butterflies */
        @keyframes ambientFlyPath {
          0% { transform: translateY(105vh) translateX(0) scale(0.6) rotate(6deg); opacity: 0; }
          20% { opacity: 0.7; }
          50% { transform: translateY(50vh) translateX(55px) scale(0.85) rotate(-10deg); opacity: 0.85; }
          80% { opacity: 0.7; }
          100% { transform: translateY(-10vh) translateX(-35px) scale(0.6) rotate(15deg); opacity: 0; }
        }

        .ambient-butterfly-item {
          position: fixed;
          pointer-events: none;
          z-index: 8;
          animation: ambientFlyPath 16s ease-in-out infinite;
        }

        .luxury-card-shadow {
          box-shadow: 0 25px 60px -15px rgba(66, 56, 47, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.2);
        }
      `}} />

      {/* Background Music Audio */}
      {data.music && (
        <audio ref={audioRef} src={data.music.url} loop preload="auto" />
      )}

      {/* Ambient Floating Photorealistic Butterflies in Background */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="ambient-butterfly-item"
            style={{
              left: `${12 + i * 20}%`,
              animationDelay: `${i * 3.4}s`,
              animationDuration: `${15 + (i % 3) * 3}s`
            }}
          >
            <RealisticButterfly size={50} isFlying={true} className="opacity-80 drop-shadow-md" />
          </div>
        ))}
      </div>

      {/* Floating Audio Toggle (Always accessible when music is available) */}
      {data.music && (
        <button
          onClick={toggleAudio}
          className="fixed top-6 left-6 z-50 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-[#D4AF37]/50 shadow-md flex items-center justify-center text-[#967426] hover:scale-105 transition-all cursor-pointer"
          aria-label="Toggle music"
          title={isPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
        >
          {isPlaying ? <Volume2 className="w-5 h-5 animate-pulse text-[#D4AF37]" /> : <VolumeX className="w-5 h-5" />}
        </button>
      )}

      {/* Reset Animation Button for Preview / Edit Mode */}
      {isOpen && (
        <button
          onClick={handleReset}
          title="إعادة غلق المظروف لتجربة الحركة مجدداً"
          className="fixed top-6 right-6 z-50 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#D4AF37]/30 text-xs font-semibold text-gray-700 shadow-sm hover:bg-white flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-md"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>إعادة تجربة الفتح</span>
        </button>
      )}

      {/* ======================================================== */}
      {/* 1. LUXURY ENVELOPE OPENING REVEAL (Interactive Cover)    */}
      {/* ======================================================== */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.1, ease: "easeInOut" } }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center p-4 bg-[#F4EFE6] linen-texture select-none"
          >
            <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
              
              {/* Couple Header Monogram above envelope */}
              <motion.div 
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8 text-center"
              >
                <span className="text-xs tracking-[0.3em] uppercase text-[#9C824E] font-medium block mb-2">
                  {custom.welcomeSubtitle || 'WEDDING INVITATION'}
                </span>
                <h2 className="font-amiri text-3xl font-bold text-[#42382F] tracking-wide">
                  {groom} & {bride}
                </h2>
              </motion.div>

              {/* 3D Envelope Container */}
              <div 
                onClick={handleOpenEnvelope}
                className="relative w-80 h-56 cursor-pointer group"
                style={{ perspective: 1200 }}
              >
                {/* Envelope Base Shadow */}
                <div className="absolute -inset-2 bg-[#42382F]/15 rounded-2xl blur-xl group-hover:bg-[#42382F]/20 transition-all duration-500" />

                {/* Envelope Body (Pocket) */}
                <div className="absolute inset-0 bg-[#FFFDF9] rounded-xl border border-[#E8DFC8] overflow-hidden shadow-2xl flex items-center justify-center">
                  
                  {/* Subtle inner gold rim border */}
                  <div className="absolute inset-2 border border-[#D4AF37]/25 rounded-lg pointer-events-none" />
                  
                  {/* Card tucked inside the envelope - slides up when opened */}
                  <motion.div 
                    animate={isOpening ? { y: -95, opacity: 1 } : { y: 35, opacity: 0 }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                    className="w-[90%] h-[85%] bg-white rounded-md shadow-md border border-[#EFE5D0] p-4 text-center flex flex-col items-center justify-center pointer-events-none"
                  >
                    <p className="font-amiri text-xs text-[#8F7745] mb-1">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                    <h3 className="font-amiri text-lg font-bold text-[#42382F] mb-1">
                      {groom} & {bride}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-cairo">{custom.envelopeMessage || 'يسعدنا حضوركم ومشاركتنا الفرحة'}</p>
                    <div className="w-12 h-0.5 bg-[#D4AF37]/40 mt-2" />
                  </motion.div>
                </div>

                {/* Envelope Triangular Top Flap */}
                <motion.div
                  animate={isOpening ? { rotateX: -180, zIndex: 1 } : { rotateX: 0, zIndex: 20 }}
                  transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                  style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
                  className="absolute top-0 left-0 right-0 h-32"
                >
                  <svg viewBox="0 0 320 130" className="w-full h-full drop-shadow-md">
                    <polygon 
                      points="0,0 320,0 160,130" 
                      fill="#FAF7F0" 
                      stroke="#E5DCBF" 
                      strokeWidth="1.5"
                    />
                    <polygon 
                      points="10,4 310,4 160,122" 
                      fill="none" 
                      stroke="#D4AF37" 
                      strokeWidth="0.75" 
                      strokeDasharray="4 3"
                      opacity="0.4"
                    />
                  </svg>
                </motion.div>

                {/* Golden Wax Seal with Realistic Butterfly Stamp */}
                <motion.div 
                  animate={isOpening ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-[88px] left-1/2 -translate-x-1/2 z-30 w-16 h-16 drop-shadow-xl group-hover:scale-105 transition-transform"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="44" fill="url(#waxGrad)" stroke="#B38728" strokeWidth="2" />
                    <circle cx="50" cy="50" r="36" fill="none" stroke="#FFF1B8" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 2" />
                    <defs>
                      <radialGradient id="waxGrad" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#FEECA1" />
                        <stop offset="35%" stopColor="#D4AF37" />
                        <stop offset="75%" stopColor="#AA8220" />
                        <stop offset="100%" stopColor="#7A590F" />
                      </radialGradient>
                    </defs>
                  </svg>
                  {/* Center realistic butterfly on wax */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <RealisticButterfly size={36} isFlying={false} className="opacity-90" />
                  </div>
                </motion.div>

                {/* Realistic Fluttering Butterfly Taking Flight upon Opening */}
                {isOpening && (
                  <motion.div
                    initial={{ y: 70, x: 0, scale: 0.85, opacity: 1 }}
                    animate={{ 
                      y: -320, 
                      x: [0, 52, -58, 30, 0], 
                      scale: [0.85, 1.45, 1.25, 0.9],
                      opacity: [1, 1, 1, 0.9, 0]
                    }}
                    transition={{ duration: 1.9, ease: "easeOut" }}
                    className="absolute top-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex items-center justify-center"
                  >
                    {/* Golden magical aura halo */}
                    <div className="absolute inset-0 rounded-full bg-radial from-[#FEECA1]/40 to-transparent blur-md animate-pulse pointer-events-none scale-150" />
                    <RealisticButterfly 
                      size={105} 
                      isFlying={true} 
                      className="filter drop-shadow-[0_0_18px_rgba(212,175,55,0.85)] drop-shadow-[0_15px_25px_rgba(0,0,0,0.25)]" 
                    />
                  </motion.div>
                )}
              </div>

              {/* Call-to-action Hint Text */}
              <motion.div 
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="mt-10 flex flex-col items-center gap-1.5 cursor-pointer text-center"
                onClick={handleOpenEnvelope}
              >
                <div className="flex items-center gap-2 text-[#9C824E] text-sm font-bold tracking-wide">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>انقر لفتح الدعوة</span>
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <span className="text-xs text-gray-400 tracking-wider">TAP TO OPEN INVITATION</span>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 2. MAIN REVEALED INVITATION CARD (Luxury Minimalist)     */}
      {/* ======================================================== */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl mx-auto px-4 py-16"
      >
        {/* Main Aesthetic Card */}
        <div className="bg-[#FFFDF9] rounded-[2.5rem] p-8 sm:p-14 luxury-card-shadow border border-[#EFE5D0] relative overflow-hidden text-center">
          
          {/* Inner Double Gold Border */}
          <div className="absolute inset-4 rounded-[2rem] border border-[#D4AF37]/30 pointer-events-none" />
          <div className="absolute inset-5 rounded-[1.8rem] border border-[#D4AF37]/15 pointer-events-none" />

          {/* Header Photorealistic Butterfly Ornament */}
          <div className="flex justify-center mb-6">
            <RealisticButterfly size={85} isFlying={false} className="drop-shadow-md" />
          </div>

          {/* Bismillah */}
          <p className="font-amiri text-lg text-[#947738] mb-4">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>

          {/* Quranic Verse */}
          <p className="font-amiri text-base sm:text-lg text-[#5E5042] mb-8 leading-relaxed max-w-md mx-auto italic">
            {data.weddingMessage || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
          </p>

          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-8" />

          {/* Badge */}
          <span className="inline-block px-5 py-1.5 rounded-full bg-[#FAF5EB] text-[#8F7435] text-xs font-bold tracking-widest uppercase mb-8 border border-[#E8DFC8]">
            {data.caption || 'دعوة زفاف خاصة'}
          </span>

          {/* Couple Names */}
          <div className="space-y-3 my-6">
            <h1 className="font-amiri text-4xl sm:text-6xl font-bold text-[#3B3024] tracking-wide">
              {groom}
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-[#D4AF37]">
              <div className="h-px w-10 bg-[#D4AF37]/40" />
              <span className="font-amiri text-2xl text-[#8F7435]">&</span>
              <div className="h-px w-10 bg-[#D4AF37]/40" />
            </div>

            <h1 className="font-amiri text-4xl sm:text-6xl font-bold text-[#3B3024] tracking-wide">
              {bride}
            </h1>
          </div>

          <p className="text-gray-600 font-cairo text-sm sm:text-base mt-6 max-w-md mx-auto leading-relaxed">
            {custom.invitationNote || 'يسرنا دعوتكم لحضور حفل زفافنا ومشاركتنا فرحة هذا اليوم المميز، لتكتمل سعادتنا بوجودكم معنا.'}
          </p>

          {/* Date & Time Badge */}
          <div className="mt-10 bg-[#FAF7F0] p-6 rounded-2xl border border-[#E8DEC7] max-w-sm mx-auto">
            <div className="flex items-center justify-center gap-2 text-[#947738] text-xs font-bold uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>موعد الزفاف</span>
            </div>
            <p className="font-amiri text-2xl font-bold text-[#3B3024]">{dateArabic}</p>
            <p className="text-xs text-gray-500 mt-1">{timeArabic}</p>
          </div>

          {/* COUNTDOWN */}
          <div className="mt-10 pt-10 border-t border-[#EFE7D5]">
            <h3 className="font-amiri text-xl text-[#524434] mb-6 font-bold flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              العد التنازلي لليوم المنتظر
            </h3>

            <div className="grid grid-cols-4 gap-2.5 max-w-sm mx-auto">
              {[
                { label: 'أيام', val: timeLeft.days },
                { label: 'ساعات', val: timeLeft.hours },
                { label: 'دقائق', val: timeLeft.minutes },
                { label: 'ثواني', val: timeLeft.seconds }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#FAF7F0] rounded-xl p-3 border border-[#E8DEC7] flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-bold text-[#3B3024] font-amiri">{item.val}</span>
                  <span className="text-[11px] text-[#8F7435] font-semibold mt-0.5">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TIMELINE */}
          <div className="mt-12 pt-10 border-t border-[#EFE7D5]">
            <span className="text-xs text-[#947738] font-bold uppercase tracking-widest block mb-2">برنامج الحفل</span>
            <h3 className="font-amiri text-2xl font-bold text-[#3B3024] mb-8">
              جدول فقرات المناسبة
            </h3>

            <div className="space-y-4 max-w-md mx-auto text-right">
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="bg-[#FAF7F0] p-4 rounded-xl border border-[#EAE1CC] flex items-start gap-4">
                  <span className="shrink-0 px-2.5 py-1 bg-white text-[#947738] rounded-md text-xs font-bold border border-[#E2D5BA]">
                    {event.time}
                  </span>
                  <div>
                    <h4 className="font-amiri text-base font-bold text-[#3B3024]">{event.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{event.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VENUE & LOCATION */}
          <div className="mt-12 pt-10 border-t border-[#EFE7D5]">
            <div className="w-12 h-12 bg-[#FAF7F0] rounded-full flex items-center justify-center mx-auto mb-4 text-[#D4AF37] border border-[#E8DEC7]">
              <MapPin className="w-6 h-6" />
            </div>

            <span className="text-xs text-[#947738] font-bold uppercase tracking-widest block mb-1">مكان الحفل</span>
            <h3 className="font-amiri text-2xl font-bold text-[#3B3024] mb-2">{venue}</h3>
            {address && <p className="text-xs text-gray-500 mb-6">{address}</p>}

            {data.googleMapsUrl && (
              <TrackedLink
                href={data.googleMapsUrl}
                eventType="MAP_CLICK"
                target="_blank"
                className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B38728] text-white rounded-full font-bold shadow-md hover:scale-105 transition-all text-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                عرض الموقع على خرائط جوجل
              </TrackedLink>
            )}
          </div>

          {/* RSVP */}
          <div className="mt-12 pt-10 border-t border-[#EFE7D5]">
            <CheckCircle2 className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
            <h3 className="font-amiri text-2xl font-bold text-[#3B3024] mb-2">تأكيد الحضور</h3>
            <p className="text-xs text-gray-500 mb-6">يسعدنا تأكيد حضوركم لمشاركتنا فرحة هذا اليوم</p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              {data.groomPhone && (
                <a
                  href={`https://wa.me/${data.groomPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`بارك الله لكما! يشرفني تأكيد حضور حفل زفاف ${groom} و ${bride}`)}`}
                  target="_blank"
                  className="px-5 py-2.5 bg-[#25D366] text-white rounded-full font-bold text-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  تأكيد الحضور (أهل العريس)
                </a>
              )}
              {data.bridePhone && (
                <a
                  href={`https://wa.me/${data.bridePhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك! يشرفني تأكيد حضور حفل زفاف ${groom} و ${bride}`)}`}
                  target="_blank"
                  className="px-5 py-2.5 bg-[#E1306C] text-white rounded-full font-bold text-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  تأكيد الحضور (أهل العروس)
                </a>
              )}
            </div>
          </div>

          {/* CLOSING */}
          <div className="mt-12 pt-8 border-t border-[#EFE7D5]">
            <p className="font-amiri text-xl text-[#3B3024] font-bold mb-1">
              {custom.closingMessage || 'بكم تكتمل فرحتنا وتزداد سعادتنا ✨'}
            </p>
            <p className="text-xs text-[#947738] tracking-widest uppercase">
              {groom} & {bride}
            </p>
          </div>

        </div>
      </motion.div>

    </div>
  );
};
