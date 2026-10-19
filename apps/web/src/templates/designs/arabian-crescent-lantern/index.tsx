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
  Moon,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ArabianCrescentLanternTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isOpen, setIsOpen] = useState(mode === 'PREVIEW' ? false : false);
  const [isIgniting, setIsIgniting] = useState(false);
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

  const handleIgniteAndOpen = () => {
    if (isOpen || isIgniting) return;
    setIsIgniting(true);

    if (data.music && audioRef.current) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    // Trigger golden starburst confetti
    setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FFD700', '#F3E5AB', '#D4AF37', '#ffffff']
      });
    }, 600);

    setTimeout(() => {
      setIsOpen(true);
      setIsIgniting(false);
    }, 1400);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsIgniting(false);
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
      className="min-h-screen relative font-cairo bg-[#040810] text-[#F3E5AB] overflow-x-hidden selection:bg-amber-500/30"
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
            className="w-11 h-11 rounded-full bg-[#0B1528]/80 backdrop-blur-md shadow-lg border border-amber-400/30 flex items-center justify-center text-amber-300 hover:scale-105 active:scale-95 transition"
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
            className="px-3.5 py-2 rounded-full bg-[#0B1528]/80 backdrop-blur-md shadow-lg border border-amber-400/30 text-xs font-bold text-amber-200 flex items-center gap-1.5 hover:bg-[#0B1528] active:scale-95 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>عرض الغلاف التفاعلي</span>
          </button>
        )}
      </div>

      {/* Ambient Celestial Background (Twinkling Stars) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      {/* STAGE 1: Interactive Celestial Lanterns & Crescent Opening */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#03060C] via-[#07101E] to-[#040810] text-center"
          >
            {/* Hanging Ornate Lanterns (Left & Right) with gentle swinging animation */}
            <div className="w-full max-w-lg flex justify-between px-6 pt-4 pointer-events-none">
              {/* Left Lantern */}
              <motion.div 
                animate={{ rotate: [-2, 2, -2] }} 
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: 'top center' }}
                className="flex flex-col items-center"
              >
                <div className="w-0.5 h-24 bg-gradient-to-b from-amber-200/60 to-amber-400" />
                <div className="w-10 h-14 bg-gradient-to-b from-amber-400/30 to-amber-500/10 border border-amber-400/60 rounded-t-lg rounded-b-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                  <Flame className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
              </motion.div>

              {/* Right Lantern */}
              <motion.div 
                animate={{ rotate: [2, -2, 2] }} 
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: 'top center' }}
                className="flex flex-col items-center"
              >
                <div className="w-0.5 h-32 bg-gradient-to-b from-amber-200/60 to-amber-400" />
                <div className="w-12 h-16 bg-gradient-to-b from-amber-400/30 to-amber-500/10 border border-amber-400/60 rounded-t-lg rounded-b-xl flex items-center justify-center shadow-[0_0_25px_rgba(255,215,0,0.35)]">
                  <Flame className="w-6 h-6 text-amber-300 animate-pulse" />
                </div>
              </motion.div>
            </div>

            {/* Glowing 3D Golden Crescent & Medallion */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={handleIgniteAndOpen}
              className="my-auto cursor-pointer group flex flex-col items-center"
            >
              {/* The Glowing Moon & Arabesque Frame */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full flex items-center justify-center p-3">
                {/* Rotating Celestial Glow */}
                <div className="absolute inset-0 rounded-full border border-amber-400/30 animate-[spin_30s_linear_infinite]" />
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-amber-400/20 animate-[spin_40s_linear_infinite_reverse]" />

                {/* Golden Crescent Icon / Center Element */}
                <motion.div
                  animate={isIgniting ? { scale: [1, 1.25, 1], rotate: [0, 15, 0] } : {}}
                  transition={{ duration: 0.8 }}
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-[#0F1C33] to-[#0A1324] border-2 border-amber-300/60 shadow-[0_0_40px_rgba(255,215,0,0.35)] flex flex-col items-center justify-center text-amber-300 group-hover:scale-105 transition-transform duration-300"
                >
                  <Moon className="w-12 h-12 text-amber-300 fill-amber-300 drop-shadow-[0_0_12px_#ffd700]" />
                  <span className="text-xs font-serif text-amber-200 mt-2 tracking-widest uppercase">
                    {custom.crescentBadge || 'ROYAL CELEBRATION'}
                  </span>
                  <span className="text-sm font-bold text-white mt-0.5">
                    {data.groomName.charAt(0)} & {data.brideName.charAt(0)}
                  </span>
                </motion.div>
              </div>

              {/* Title & Call-to-action */}
              <div className="mt-8 space-y-2">
                <p className="text-xs font-serif tracking-[0.3em] uppercase text-amber-300/80">
                  {custom.bismillahText || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
                </p>
                <h1 className="text-3xl sm:text-4xl font-serif text-white font-bold tracking-wide">
                  {data.groomName} & {data.brideName}
                </h1>
                <p className="text-xs text-amber-200/70 pt-1 flex items-center justify-center gap-1.5 font-serif">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>انقر على الهلال لإضاءة فوانيس الفرح وفتح الدعوة</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </p>
              </div>
            </motion.div>

            {/* Bottom Footer Quote */}
            <div className="pb-4 text-[11px] text-neutral-400 font-serif">
              {custom.crescentQuote || '«تلاقت الأرواح تحت سماء كُتبت تفاصيل حبها بنور النجوم»'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 2: The Unveiled Arabian Night Royal Experience */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="max-w-2xl mx-auto px-4 py-16 sm:py-24 relative z-10"
        >
          {/* Main Ornate Royal Card with Islamic Arch Architecture */}
          <div 
            className="bg-[#0A1324]/90 backdrop-blur-xl rounded-t-[60px] sm:rounded-t-[80px] rounded-b-3xl p-6 sm:p-12 border-2 border-amber-400/40 shadow-2xl relative overflow-hidden text-center"
            style={{
              boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.8), 0 0 50px rgba(255, 215, 0, 0.12)'
            }}
          >
            {/* Ornate Gold Border Line */}
            <div className="absolute inset-3 border border-amber-400/30 rounded-t-[50px] sm:rounded-t-[70px] rounded-b-2xl pointer-events-none p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-amber-400 text-xs px-3">
                <span>⚜️</span>
                <span className="text-[10px] tracking-widest font-serif text-amber-300/80">ليلة العمر المباركة</span>
                <span>⚜️</span>
              </div>
              <div className="flex justify-between items-center text-amber-400 text-xs px-3">
                <span>❖</span>
                <span>❖</span>
              </div>
            </div>

            {/* Opening Bismillah & Quranic Ayah */}
            <div className="my-6 space-y-3">
              <span className="text-sm tracking-widest text-amber-300 font-serif font-bold block">
                {custom.bismillahText || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
              </span>
              <p className="text-lg sm:text-2xl font-serif text-amber-100 leading-relaxed px-4">
                {custom.introVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
              </p>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
            </div>

            {/* The Couple Names */}
            <div className="my-8 space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-amber-300/70 font-mono">
                {custom.invitationIntro || 'يتشرف العروسان بدعوتكم لحضور حفل زفافهما المبارك'}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 my-4">
                <h1 className="text-4xl sm:text-5xl font-serif text-white font-bold drop-shadow-[0_2px_10px_rgba(255,215,0,0.3)]">
                  {data.groomName}
                </h1>
                <span className="text-2xl font-serif text-amber-400 italic">و</span>
                <h1 className="text-4xl sm:text-5xl font-serif text-white font-bold drop-shadow-[0_2px_10px_rgba(255,215,0,0.3)]">
                  {data.brideName}
                </h1>
              </div>

              <p className="text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed pt-2 font-serif">
                {data.weddingMessage || custom.invitationNote || 'عندما تشرق أنوار هذه الليلة المباركة، نتشرف بدعوتكم لمشاركتنا فرحة العمر وتتويج مسيرة الحب في ليلتنا المنتظرة.'}
              </p>
            </div>

            {/* Date, Time & Lantern Countdown */}
            <div className="my-8 bg-[#0E1A30]/80 border border-amber-400/30 rounded-2xl p-6 max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-sm font-serif">
                <Calendar className="w-5 h-5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-neutral-300 text-xs font-serif">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{data.weddingTime || 'تبدأ المراسم في تمام الساعة 08:00 مساءً'}</span>
              </div>

              {/* Live Countdown in Lantern Frames */}
              {data.countdownEnabled && (
                <div className="pt-3 border-t border-amber-400/20">
                  <div className="text-[11px] font-mono text-amber-300/70 tracking-wider mb-2">
                    COUNTDOWN TO THE ROYAL WEDDING
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center max-w-xs mx-auto">
                    <div className="bg-[#070D18] p-2.5 rounded-xl border border-amber-400/30">
                      <div className="text-xl font-bold font-mono text-white">{timeLeft.days}</div>
                      <div className="text-[10px] text-amber-300/60">يوم</div>
                    </div>
                    <div className="bg-[#070D18] p-2.5 rounded-xl border border-amber-400/30">
                      <div className="text-xl font-bold font-mono text-white">{timeLeft.hours}</div>
                      <div className="text-[10px] text-amber-300/60">ساعة</div>
                    </div>
                    <div className="bg-[#070D18] p-2.5 rounded-xl border border-amber-400/30">
                      <div className="text-xl font-bold font-mono text-white">{timeLeft.minutes}</div>
                      <div className="text-[10px] text-amber-300/60">دقيقة</div>
                    </div>
                    <div className="bg-[#070D18] p-2.5 rounded-xl border border-amber-400/30">
                      <div className="text-xl font-bold font-mono text-amber-400">{timeLeft.seconds}</div>
                      <div className="text-[10px] text-amber-300/60">ثانية</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Program & Schedule */}
            <div className="my-8 text-right max-w-md mx-auto">
              <h3 className="text-center font-bold text-lg text-amber-200 mb-4 font-serif">
                مراسم وبرنامج الحفل
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-[#0E1A30]/80 p-3.5 rounded-2xl border border-amber-400/30">
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                    {custom.timeline1Time || '07:30 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white font-serif">
                      {custom.timeline1Title || 'توافد الضيوف الكرام'}
                    </h4>
                    <p className="text-xs text-neutral-400 font-serif">
                      {custom.timeline1Desc || 'مراسم الاستقبال الفاخرة بالبخور والعود والمشروبات'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#0E1A30]/80 p-3.5 rounded-2xl border border-amber-400/30">
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                    {custom.timeline2Time || '08:45 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white font-serif">
                      {custom.timeline2Title || 'الزفة وعقد القران المبارك'}
                    </h4>
                    <p className="text-xs text-neutral-400 font-serif">
                      {custom.timeline2Desc || 'لحظات مباركة البداية وإطلالة العروسين الكريمة'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#0E1A30]/80 p-3.5 rounded-2xl border border-amber-400/30">
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                    {custom.timeline3Time || '10:15 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white font-serif">
                      {custom.timeline3Title || 'العشاء الملكي'}
                    </h4>
                    <p className="text-xs text-neutral-400 font-serif">
                      {custom.timeline3Desc || 'بوفيه عشاء فاخر احتفاءً بكم واحتفال حتى النهاية'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Venue & Location Details */}
            <div className="my-8 max-w-md mx-auto space-y-4">
              <div className="p-5 rounded-2xl bg-[#0E1A30]/80 border border-amber-400/30 space-y-2">
                <MapPin className="w-6 h-6 text-amber-400 mx-auto" />
                <h4 className="text-lg font-bold text-amber-100 font-serif">
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
                      href={`https://wa.me/${data.groomWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.groomName}، يسعدني ويشرفني تأكيد الحضور لمشاركتكم الفرحة! 🎉`)}`}
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
                      href={`https://wa.me/${data.brideWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.brideName}، يسعدني ويشرفني تأكيد الحضور لمشاركتكم الفرحة! 🌸`)}`}
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

            {/* Closing Blessing Duaa */}
            <div className="mt-8 text-amber-200/80 text-xs italic font-serif">
              {custom.closingDuaa || '«بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ» ✨'}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
