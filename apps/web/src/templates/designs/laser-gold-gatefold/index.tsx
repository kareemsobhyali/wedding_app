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
  Bookmark
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LaserGoldGatefoldTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isOpen, setIsOpen] = useState(mode === 'PREVIEW' ? false : false);
  const [isUntying, setIsUntying] = useState(false);
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

  const handleUntieRibbon = () => {
    if (isOpen || isUntying) return;
    setIsUntying(true);

    if (data.music && audioRef.current) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#D4AF37', '#FFD700', '#F5E6BF', '#AA8220', '#FFFFFF']
      });
    }, 700);

    setTimeout(() => {
      setIsOpen(true);
      setIsUntying(false);
    }, 1500);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsUntying(false);
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

  const ribbonColor = custom.ribbonColor || 'burgundy';
  const monogram = custom.monogramCrest || `${data.groomName.charAt(0)} & ${data.brideName.charAt(0)}`;

  return (
    <div 
      className="min-h-screen relative font-cairo bg-[#120F0D] text-[#F7EBD4] overflow-x-hidden selection:bg-amber-400/30"
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
            className="w-11 h-11 rounded-full bg-[#1F1A17]/80 backdrop-blur-md shadow-lg border border-amber-400/30 flex items-center justify-center text-amber-300 hover:scale-105 active:scale-95 transition"
            title={isPlayingAudio ? 'كتم الصوت' : 'تشغيل الموسيقى'}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-5 h-5 text-amber-300 animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-neutral-400" />
            )}
          </button>
        )}

        {isOpen && (
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-full bg-[#1F1A17]/80 backdrop-blur-md shadow-lg border border-amber-400/30 text-xs font-bold text-amber-200 flex items-center gap-1.5 hover:bg-[#2A231F] active:scale-95 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة غلق الأبواب الذهبية</span>
          </button>
        )}
      </div>

      {/* STAGE 1: Laser-Cut Gold Filigree Gatefold with Satin Ribbon */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#14100D] via-[#221B16] to-[#0E0B09] text-center"
          >
            {/* Ambient Background Warm Glow */}
            <div className="absolute w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

            <div className="text-center mb-6 space-y-1 z-10">
              <span className="text-[11px] uppercase tracking-[0.3em] text-amber-300/80 font-mono">
                ROYAL GOLD GATEFOLD
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-wide">
                دعوة الفرح الملكية
              </h2>
              <p className="text-xs text-amber-200/60 font-serif">
                {custom.ribbonHint || 'انقر على شريط الساتان لفك عقدة البوابة الذهبية'}
              </p>
            </div>

            {/* The Gatefold Box Container */}
            <div 
              onClick={handleUntieRibbon}
              className="relative w-full max-w-[360px] sm:max-w-[400px] h-[480px] sm:h-[520px] rounded-3xl cursor-pointer group shadow-2xl overflow-hidden flex"
              style={{
                boxShadow: '0 30px 80px -15px rgba(0,0,0,0.8), 0 0 35px rgba(212, 175, 55, 0.2)'
              }}
            >
              {/* Left Laser-Cut Gate Door */}
              <motion.div
                animate={isUntying ? { x: '-110%' } : { x: 0 }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                className="w-1/2 h-full z-20 relative bg-gradient-to-br from-[#2E241E] via-[#3D3028] to-[#1C1613] border-r border-amber-400/40 p-4 flex flex-col justify-between overflow-hidden"
              >
                {/* Laser Filigree Pattern Simulation */}
                <div className="absolute inset-2 border-2 border-amber-400/50 rounded-l-2xl pointer-events-none flex flex-col justify-between p-3 opacity-90">
                  <div className="text-amber-300 text-xs text-right">⚜️</div>
                  <div className="space-y-4 my-auto opacity-70">
                    <div className="w-full h-8 border border-amber-300/30 rounded-full flex items-center justify-center text-[10px] text-amber-200 font-serif">❖ ❖ ❖</div>
                    <div className="w-full h-16 border border-amber-300/30 rounded-2xl flex items-center justify-center text-xs text-amber-200 font-serif">⚜️</div>
                    <div className="w-full h-8 border border-amber-300/30 rounded-full flex items-center justify-center text-[10px] text-amber-200 font-serif">❖ ❖ ❖</div>
                  </div>
                  <div className="text-amber-300 text-xs text-right">⚜️</div>
                </div>
              </motion.div>

              {/* Right Laser-Cut Gate Door */}
              <motion.div
                animate={isUntying ? { x: '110%' } : { x: 0 }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                className="w-1/2 h-full z-20 relative bg-gradient-to-bl from-[#2E241E] via-[#3D3028] to-[#1C1613] border-l border-amber-400/40 p-4 flex flex-col justify-between overflow-hidden"
              >
                {/* Laser Filigree Pattern Simulation */}
                <div className="absolute inset-2 border-2 border-amber-400/50 rounded-r-2xl pointer-events-none flex flex-col justify-between p-3 opacity-90">
                  <div className="text-amber-300 text-xs text-left">⚜️</div>
                  <div className="space-y-4 my-auto opacity-70">
                    <div className="w-full h-8 border border-amber-300/30 rounded-full flex items-center justify-center text-[10px] text-amber-200 font-serif">❖ ❖ ❖</div>
                    <div className="w-full h-16 border border-amber-300/30 rounded-2xl flex items-center justify-center text-xs text-amber-200 font-serif">⚜️</div>
                    <div className="w-full h-8 border border-amber-300/30 rounded-full flex items-center justify-center text-[10px] text-amber-200 font-serif">❖ ❖ ❖</div>
                  </div>
                  <div className="text-amber-300 text-xs text-left">⚜️</div>
                </div>
              </motion.div>

              {/* Center Satin Ribbon Band & Bow */}
              <motion.div
                animate={isUntying ? { scaleY: 0, opacity: 0 } : { scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center pointer-events-none"
              >
                {/* Satin Ribbon Horizontal Strip */}
                <div 
                  className="w-full h-12 shadow-2xl relative flex items-center justify-center"
                  style={{
                    background: ribbonColor === 'emerald'
                      ? 'linear-gradient(90deg, #093826 0%, #15573D 50%, #093826 100%)'
                      : ribbonColor === 'gold'
                      ? 'linear-gradient(90deg, #A67C1E 0%, #D4AF37 50%, #A67C1E 100%)'
                      : 'linear-gradient(90deg, #5C0C1D 0%, #8A172E 50%, #5C0C1D 100%)', // Burgundy
                    boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
                  }}
                >
                  {/* Subtle Satin Sheen lines */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-white/20" />
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-black/30" />

                  {/* Ribbon Bow / Medallion */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 p-1 shadow-2xl flex items-center justify-center border-2 border-white/40 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-[#201712] flex flex-col items-center justify-center text-amber-200 font-serif drop-shadow-md">
                      <span className="text-xs">🎀</span>
                      <span className="text-[11px] font-bold mt-0.5 tracking-wider">{monogram}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Background Card Preview (inside the gatefold) */}
              <div className="absolute inset-0 bg-[#FFFDF9] text-[#2D2A26] p-6 flex flex-col justify-center items-center text-center">
                <span className="text-3xl font-serif text-amber-700">
                  {data.groomName} & {data.brideName}
                </span>
                <p className="text-xs text-neutral-500 mt-2 font-serif">جاري فتح الدعوة الملكية...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 2: Unveiled Royal Gatefold Invitation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl mx-auto px-4 py-16 sm:py-24"
        >
          {/* Main Gilded Invitation Card */}
          <div 
            className="bg-[#1C1613] rounded-3xl p-6 sm:p-12 border-2 border-amber-400/40 shadow-2xl relative overflow-hidden text-center text-[#FDF6E2]"
            style={{
              boxShadow: '0 25px 80px -15px rgba(0,0,0,0.9), 0 0 40px rgba(212, 175, 55, 0.15)'
            }}
          >
            {/* Ornate Gold Laser Filigree Border */}
            <div className="absolute inset-3 border border-amber-400/30 rounded-2xl pointer-events-none p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-amber-400 text-xs px-2">
                <span>⚜️</span>
                <span className="text-[10px] tracking-widest uppercase font-serif text-amber-300">
                  Laser-Cut Royal Invitation
                </span>
                <span>⚜️</span>
              </div>
              <div className="flex justify-between items-center text-amber-400 text-xs px-2">
                <span>⚜️</span>
                <span>⚜️</span>
              </div>
            </div>

            {/* Quranic Ayah / Opening */}
            <div className="my-6 space-y-3">
              <span className="text-sm tracking-widest text-amber-400 font-serif font-bold block">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
              <p className="text-lg sm:text-2xl font-serif text-amber-100 leading-relaxed px-4">
                {custom.introVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
              </p>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
            </div>

            {/* Couple Announcement */}
            <div className="my-8 space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-amber-300/70 font-mono">
                {custom.invitationIntro || 'يتشرف العروسان بدعوتكم لحضور حفل زفافهما الملكي'}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 my-4">
                <h1 className="text-4xl sm:text-5xl font-serif text-white font-bold drop-shadow-[0_2px_12px_rgba(212,175,55,0.4)]">
                  {data.groomName}
                </h1>
                <span className="text-2xl font-serif text-amber-400 italic">&</span>
                <h1 className="text-4xl sm:text-5xl font-serif text-white font-bold drop-shadow-[0_2px_12px_rgba(212,175,55,0.4)]">
                  {data.brideName}
                </h1>
              </div>

              <p className="text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed pt-2 font-serif">
                {data.weddingMessage || custom.invitationNote || 'يسعدنا ويشرفنا حضوركم ومشاركتنا فرحة العمر في هذا اليوم المبارك، لتكتمل سعادتنا برؤيتكم بيننا.'}
              </p>
            </div>

            {/* Date, Time & Countdown */}
            <div className="my-8 bg-[#2A211C]/80 border border-amber-400/30 rounded-2xl p-6 max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-sm font-serif">
                <Calendar className="w-5 h-5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-neutral-300 text-xs font-serif">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{data.weddingTime || 'السابعة والنصف مساءً (07:30 PM)'}</span>
              </div>

              {/* Live Countdown */}
              {data.countdownEnabled && (
                <div className="pt-3 border-t border-amber-400/20">
                  <div className="text-[11px] font-mono text-amber-300/70 tracking-wider mb-2">
                    COUNTDOWN TO THE BIG DAY
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center max-w-xs mx-auto">
                    <div className="bg-[#181310] p-2.5 rounded-xl border border-amber-400/20">
                      <div className="text-xl font-bold font-mono text-white">{timeLeft.days}</div>
                      <div className="text-[10px] text-amber-300/60">يوم</div>
                    </div>
                    <div className="bg-[#181310] p-2.5 rounded-xl border border-amber-400/20">
                      <div className="text-xl font-bold font-mono text-white">{timeLeft.hours}</div>
                      <div className="text-[10px] text-amber-300/60">ساعة</div>
                    </div>
                    <div className="bg-[#181310] p-2.5 rounded-xl border border-amber-400/20">
                      <div className="text-xl font-bold font-mono text-white">{timeLeft.minutes}</div>
                      <div className="text-[10px] text-amber-300/60">دقيقة</div>
                    </div>
                    <div className="bg-[#181310] p-2.5 rounded-xl border border-amber-400/20">
                      <div className="text-xl font-bold font-mono text-amber-400">{timeLeft.seconds}</div>
                      <div className="text-[10px] text-amber-300/60">ثانية</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Event Itinerary / Timeline */}
            <div className="my-8 text-right max-w-md mx-auto">
              <h3 className="text-center font-bold text-lg text-amber-200 mb-4 font-serif">
                برنامج ومراسم الحفل الملكي
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-[#2A211C]/80 p-3.5 rounded-2xl border border-amber-400/20">
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                    {custom.timeline1Time || '07:30 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white font-serif">
                      {custom.timeline1Title || 'استقبال الضيوف الكرام'}
                    </h4>
                    <p className="text-xs text-neutral-400 font-serif">
                      {custom.timeline1Desc || 'مراسم الترحيب وبداية توافد الأهل والأحباب'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#2A211C]/80 p-3.5 rounded-2xl border border-amber-400/20">
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                    {custom.timeline2Time || '08:45 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white font-serif">
                      {custom.timeline2Title || 'الزفة وعقد القران'}
                    </h4>
                    <p className="text-xs text-neutral-400 font-serif">
                      {custom.timeline2Desc || 'لحظات مباركة البداية وبدء مراسم الاحتفال الملكي'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#2A211C]/80 p-3.5 rounded-2xl border border-amber-400/20">
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                    {custom.timeline3Time || '10:15 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white font-serif">
                      {custom.timeline3Title || 'العشاء الملكي'}
                    </h4>
                    <p className="text-xs text-neutral-400 font-serif">
                      {custom.timeline3Desc || 'بوفيه عشاء فاخر احتفاءً بضيوفنا الكرام'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Venue & Location */}
            <div className="my-8 max-w-md mx-auto space-y-4">
              <div className="p-5 rounded-2xl bg-[#2A211C]/80 border border-amber-400/30 space-y-2">
                <MapPin className="w-6 h-6 text-amber-400 mx-auto" />
                <h4 className="text-lg font-bold text-amber-200 font-serif">
                  {data.venueName}
                </h4>
                {data.venueAddress && (
                  <p className="text-xs text-neutral-300 font-serif">{data.venueAddress}</p>
                )}
                {custom.dressCode && (
                  <p className="text-xs text-amber-300 pt-2 border-t border-amber-400/20 font-serif font-medium">
                    👔 قواعد اللباس: {custom.dressCode}
                  </p>
                )}
              </div>

              {data.googleMapsUrl && (
                <a
                  href={data.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-neutral-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition"
                >
                  <MapPin className="w-4 h-4" />
                  <span>فتح موقع القاعة على خرائط Google Maps</span>
                </a>
              )}
            </div>

            {/* WhatsApp RSVP / Congratulations Buttons */}
            {data.contactButtonsEnabled && (data.groomWhatsapp || data.brideWhatsapp) && (
              <div className="my-8 max-w-md mx-auto pt-6 border-t border-amber-400/20">
                <p className="text-xs text-neutral-400 mb-3 font-serif">تأكيد الحضور أو إرسال تهنئة عبر واتساب:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.groomWhatsapp && (
                    <a
                      href={`https://wa.me/${data.groomWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.groomName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة الملكية! 🎉`)}`}
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
                      href={`https://wa.me/${data.brideWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.brideName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة الملكية! 🌸`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition shadow"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>تهنئة العروس ({data.brideName})</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Closing Note */}
            <div className="mt-8 text-amber-200/80 text-xs italic font-serif">
              {custom.closingMessage || 'بكم تدوم الأفراح وتكتمل سعادتنا في هذه الليلة الملكية 🤍'}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
