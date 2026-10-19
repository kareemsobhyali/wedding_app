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
  RotateCcw, 
  MessageCircle,
  Gem,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PearlSilkMinimalistTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isOpen, setIsOpen] = useState(mode === 'PREVIEW' ? false : false);
  const [isDraping, setIsDraping] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const custom = data.customData || {};
  const weddingDate = new Date(data.weddingDate);

  const formattedDate = weddingDate.toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  useEffect(() => {
    const calculateTime = () => {
      const diff = weddingDate.getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    };
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  const handleOpenSilk = () => {
    if (isOpen || isDraping) return;
    setIsDraping(true);

    if (data.music && audioRef.current) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#F7F3EE', '#FFFFFF', '#D4AF37', '#E5DDD3', '#C0B7A6']
      });
    }, 600);

    setTimeout(() => {
      setIsOpen(true);
      setIsDraping(false);
    }, 1300);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsDraping(false);
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

  return (
    <div 
      className="min-h-screen relative font-cairo bg-[#FBF9F6] text-[#2D2A26] overflow-x-hidden selection:bg-amber-100"
      dir="rtl"
    >
      {/* Background Music */}
      {data.music && (
        <audio ref={audioRef} src={data.music.url} loop preload="auto" />
      )}

      {/* Floating Audio & Controls Button */}
      <div className="fixed top-5 left-5 z-50 flex items-center gap-2">
        {data.music && (
          <button
            onClick={toggleAudio}
            className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-[#E8E1D7] flex items-center justify-center text-[#5A5248] hover:scale-105 active:scale-95 transition"
            title={isPlayingAudio ? 'كتم الصوت' : 'تشغيل الموسيقى'}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-5 h-5 text-[#9C8262] animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-neutral-400" />
            )}
          </button>
        )}

        {isOpen && (
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-[#E8E1D7] text-xs font-bold text-[#5A5248] flex items-center gap-1.5 hover:bg-white active:scale-95 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>عرض غلاف الحرير واللؤلؤ</span>
          </button>
        )}
      </div>

      {/* Ambient Pearl Glow Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-amber-100/40 via-rose-50/30 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-stone-200/40 via-amber-50/40 to-transparent rounded-full blur-[130px]" />
      </div>

      {/* STAGE 1: Minimalist Pearl Silk Drapes Cover Screen */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#1C1A18] via-[#2A2724] to-[#141312] text-center overflow-hidden"
          >
            {/* Ambient Pearl Glow Behind Card */}
            <div className="absolute w-[420px] h-[420px] bg-amber-200/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="text-center mb-6 space-y-1.5 z-10">
              <span className="text-[11px] uppercase tracking-[0.35em] text-[#D8CEBF] font-mono">
                PEARL & SILK MINIMALIST
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-wide">
                دعوة زفاف حريرية فاخرة
              </h2>
              <p className="text-xs text-[#B5A895]">
                {custom.silkHint || 'المس خاتم اللؤلؤ لفتح طيات الحرير وبدء الدعوة'}
              </p>
            </div>

            {/* Interactive Silk Drape Card Container */}
            <div 
              onClick={handleOpenSilk}
              className="relative w-full max-w-[360px] sm:max-w-[400px] h-[460px] sm:h-[500px] rounded-3xl cursor-pointer group shadow-2xl overflow-hidden flex flex-col justify-between p-6 bg-gradient-to-b from-[#FFFFFF] via-[#FAF7F2] to-[#F2EDE4] text-[#2D2A26] border-2 border-[#EADFCF]"
              style={{
                boxShadow: '0 30px 80px -20px rgba(0,0,0,0.8), 0 0 45px rgba(235, 225, 210, 0.25)'
              }}
            >
              {/* Left & Right Silk Curtains (Fold effect) */}
              <motion.div 
                animate={isDraping ? { x: '-110%', opacity: 0 } : { x: 0, opacity: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#EDE6DB] via-[#F8F5EE] to-[#E5DCCF] border-r border-[#D9CDBE]/60 pointer-events-none z-20"
                style={{
                  backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8), transparent 60%)'
                }}
              />
              <motion.div 
                animate={isDraping ? { x: '110%', opacity: 0 } : { x: 0, opacity: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#EDE6DB] via-[#F8F5EE] to-[#E5DCCF] border-l border-[#D9CDBE]/60 pointer-events-none z-20"
                style={{
                  backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.8), transparent 60%)'
                }}
              />

              {/* Minimalist Inset Frame */}
              <div className="absolute inset-3 border border-[#D5C7B5]/50 rounded-2xl pointer-events-none p-3 flex flex-col justify-between z-10">
                <div className="flex justify-between items-center text-[10px] text-[#A3927C] tracking-widest font-mono uppercase">
                  <span>SILK EDITION</span>
                  <span>⚜</span>
                  <span>PURE PEARL</span>
                </div>
                <div className="flex justify-between text-xs text-[#A3927C]">
                  <span>✨</span>
                  <span>✨</span>
                </div>
              </div>

              {/* Top Details */}
              <div className="pt-4 z-30">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#9C8262] font-mono">
                  CORDIALLY INVITED TO THE UNION OF
                </span>
                <p className="text-xl font-serif text-[#2D2A26] italic mt-1 font-light">
                  «حكاية بدأت بعهد وتكللت بالنقاء»
                </p>
              </div>

              {/* Center Floating Pearl Ring Clasp */}
              <motion.div
                animate={isDraping ? { scale: [1, 1.4, 0], rotate: 45, opacity: [1, 1, 0] } : {}}
                transition={{ duration: 0.9 }}
                className="my-auto z-30 flex flex-col items-center group-hover:scale-105 transition-transform"
              >
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#FFFFFF] via-[#F5EFE6] to-[#E8DEC8] border-2 border-[#D8C7B0] shadow-2xl flex flex-col items-center justify-center p-3 relative">
                  {/* Outer iridescent ring */}
                  <div className="absolute -inset-2.5 rounded-full border border-[#D8C7B0]/50 animate-pulse pointer-events-none" />
                  
                  {/* Floating Gem / Interlocked Ring Icon */}
                  <div className="relative">
                    <Gem className="w-10 h-10 text-[#9C8262] drop-shadow-md" />
                    <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>

                  <span className="text-xs font-serif text-[#4A4237] font-bold mt-1 tracking-widest">
                    {custom.monogramText || `${data.groomName.charAt(0)} & ${data.brideName.charAt(0)}`}
                  </span>
                </div>

                <div className="mt-4 space-y-0.5">
                  <h3 className="text-2xl font-serif text-[#2D2A26] font-bold tracking-wide">
                    {data.groomName} & {data.brideName}
                  </h3>
                  <p className="text-xs text-[#8C7557] font-serif">
                    {formattedDate}
                  </p>
                </div>
              </motion.div>

              {/* Bottom Instruction */}
              <div className="pb-2 z-30 text-[11px] font-mono text-[#8C7557] tracking-wider uppercase">
                TOUCH TO UNVEIL ❯
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 2: Unveiled Silk Minimalist Card */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl mx-auto px-4 py-16 sm:py-24 relative z-10"
        >
          {/* Main Card */}
          <div 
            className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-12 border-2 border-[#E8DEC8]/80 shadow-2xl relative overflow-hidden text-center text-[#2D2A26]"
            style={{
              boxShadow: '0 25px 70px -15px rgba(216, 199, 176, 0.35)'
            }}
          >
            {/* Elegant Silk Texture Inset Border */}
            <div className="absolute inset-3 border border-[#E0D4C3]/70 rounded-2xl pointer-events-none p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[#9C8262] text-xs px-2">
                <span>✦</span>
                <span className="text-[10px] tracking-[0.25em] uppercase font-mono">Pearl Silk Minimalist</span>
                <span>✦</span>
              </div>
              <div className="flex justify-between items-center text-[#9C8262] text-xs px-2">
                <span>⚜</span>
                <span>⚜</span>
              </div>
            </div>

            {/* Holy Verse */}
            <div className="my-6 space-y-3">
              <span className="text-sm tracking-widest text-[#9C8262] font-serif font-bold block">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
              <p className="text-lg sm:text-2xl font-serif text-[#2D2A26] leading-relaxed px-4">
                {custom.introVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
              </p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#9C8262] to-transparent mx-auto" />
            </div>

            {/* Couple Names Section */}
            <div className="my-8 space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-mono">
                {custom.invitationIntro || 'في ليلة من ليالي العمر ينسجها الحرير ويزينها اللؤلؤ'}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 my-4">
                <h1 className="text-4xl sm:text-5xl font-serif text-[#2D2A26] font-bold">
                  {data.groomName}
                </h1>
                <span className="text-2xl font-serif text-[#9C8262] italic">&</span>
                <h1 className="text-4xl sm:text-5xl font-serif text-[#2D2A26] font-bold">
                  {data.brideName}
                </h1>
              </div>

              <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed pt-2 font-serif">
                {data.weddingMessage || custom.invitationNote || 'نتشرف بدعوتكم لمشاركتنا فرحة العمر والاحتفال بزفافنا الميمون، لتكتمل سعادتنا بحضوركم الكريم ومشاركتنا أبهى لحظات البداية.'}
              </p>
            </div>

            {/* Date, Time & Countdown */}
            <div className="my-8 bg-[#FBF9F6] border border-[#E8DEC8] rounded-2xl p-6 max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-center gap-2 text-[#4A4237] font-bold text-sm font-serif">
                <Calendar className="w-5 h-5 text-[#9C8262]" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-neutral-600 text-xs font-serif">
                <Clock className="w-4 h-4 text-[#9C8262]" />
                <span>{data.weddingTime || 'السابعة والنصف مساءً (07:30 PM)'}</span>
              </div>

              {/* Countdown Component */}
              {data.countdownEnabled && (
                <div className="pt-3 border-t border-[#E8DEC8]">
                  <div className="text-[11px] font-mono text-[#9C8262] tracking-wider mb-2">
                    COUNTDOWN TO THE SPECIAL NIGHT
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center max-w-xs mx-auto">
                    <div className="bg-white p-2.5 rounded-xl border border-[#EDE4D5] shadow-sm">
                      <div className="text-xl font-bold font-mono text-[#2D2A26]">{timeLeft.days}</div>
                      <div className="text-[10px] text-neutral-400">يوم</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#EDE4D5] shadow-sm">
                      <div className="text-xl font-bold font-mono text-[#2D2A26]">{timeLeft.hours}</div>
                      <div className="text-[10px] text-neutral-400">ساعة</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#EDE4D5] shadow-sm">
                      <div className="text-xl font-bold font-mono text-[#2D2A26]">{timeLeft.minutes}</div>
                      <div className="text-[10px] text-neutral-400">دقيقة</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#EDE4D5] shadow-sm">
                      <div className="text-xl font-bold font-mono text-[#9C8262]">{timeLeft.seconds}</div>
                      <div className="text-[10px] text-neutral-400">ثانية</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Event Itinerary / Timeline */}
            <div className="my-8 text-right max-w-md mx-auto">
              <h3 className="text-center font-bold text-lg text-[#2D2A26] mb-4 font-serif">
                برنامج ومراسم الحفل ✨
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-[#FBF9F6] p-3.5 rounded-2xl border border-[#E8DEC8]">
                  <span className="text-xs font-mono font-bold text-[#5A5248] bg-[#EFE9DF] px-2.5 py-1 rounded-lg">
                    {custom.timeline1Time || '07:30 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#2D2A26] font-serif">
                      {custom.timeline1Title || 'استقبال الضيوف الكرام'}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {custom.timeline1Desc || 'الترحيب بنسمات الورد وقهوة الضيافة وتوافد الأهل والأحباب'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#FBF9F6] p-3.5 rounded-2xl border border-[#E8DEC8]">
                  <span className="text-xs font-mono font-bold text-[#5A5248] bg-[#EFE9DF] px-2.5 py-1 rounded-lg">
                    {custom.timeline2Time || '08:45 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#2D2A26] font-serif">
                      {custom.timeline2Title || 'زفة العروسين وعقد القران'}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {custom.timeline2Desc || 'إطلالة العروسين الكريمة وتوثيق أجمل لحظات العمر ومباركة البداية'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#FBF9F6] p-3.5 rounded-2xl border border-[#E8DEC8]">
                  <span className="text-xs font-mono font-bold text-[#5A5248] bg-[#EFE9DF] px-2.5 py-1 rounded-lg">
                    {custom.timeline3Time || '10:15 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#2D2A26] font-serif">
                      {custom.timeline3Title || 'مأدبة العشاء الملكي'}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {custom.timeline3Desc || 'بوفيه عشاء فاخر احتفاءً بضيوفنا الأعزاء'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Venue & Location */}
            <div className="my-8 max-w-md mx-auto space-y-4">
              <div className="p-5 rounded-2xl bg-[#FBF9F6] border border-[#E8DEC8] space-y-2">
                <MapPin className="w-6 h-6 text-[#9C8262] mx-auto" />
                <h4 className="text-lg font-bold text-[#2D2A26] font-serif">
                  {data.venueName}
                </h4>
                {data.venueAddress && (
                  <p className="text-xs text-neutral-600 font-serif">{data.venueAddress}</p>
                )}
                {custom.dressCode && (
                  <p className="text-xs text-[#7A6750] pt-2 border-t border-[#E8DEC8] font-serif font-medium">
                    👗 قواعد اللباس: {custom.dressCode}
                  </p>
                )}
              </div>

              {data.googleMapsUrl && (
                <a
                  href={data.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#9C8262] to-[#B3997A] hover:from-[#8A7153] hover:to-[#A3896B] text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition"
                >
                  <MapPin className="w-4 h-4" />
                  <span>فتح موقع القاعة على خرائط Google Maps</span>
                </a>
              )}
            </div>

            {/* WhatsApp RSVP / Congratulations Buttons */}
            {data.contactButtonsEnabled && (data.groomWhatsapp || data.brideWhatsapp) && (
              <div className="my-8 max-w-md mx-auto pt-6 border-t border-neutral-200">
                <p className="text-xs text-neutral-500 mb-3 font-serif">تأكيد الحضور أو إرسال تهنئة عبر واتساب:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.groomWhatsapp && (
                    <a
                      href={`https://wa.me/${data.groomWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.groomName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة! 🎉`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition shadow"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>تهنئة العريس ({data.groomName})</span>
                    </a>
                  )}
                  {data.brideWhatsapp && (
                    <a
                      href={`https://wa.me/${data.brideWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.brideName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة! 🌸`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl bg-[#9C8262] hover:bg-[#8A7153] text-white font-medium text-xs flex items-center justify-center gap-2 transition shadow"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>تهنئة العروس ({data.brideName})</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Closing Note */}
            <div className="mt-8 text-[#9C8262] text-xs italic font-serif">
              {custom.closingMessage || 'حضوركم يضفي على ليلتنا رونقاً وسعادة لا تُنسى 🤍'}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
