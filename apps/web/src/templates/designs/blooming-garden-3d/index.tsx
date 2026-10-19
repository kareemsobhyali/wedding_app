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
  Flower2,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BloomingGarden3DTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isOpen, setIsOpen] = useState(mode === 'PREVIEW' ? false : false);
  const [isBlooming, setIsBlooming] = useState(false);
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

  const handleBloomAndOpen = () => {
    if (isOpen || isBlooming) return;
    setIsBlooming(true);

    if (data.music && audioRef.current) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    setTimeout(() => {
      confetti({
        particleCount: 85,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#FFB6C1', '#FFD1DC', '#D4AF37', '#FFF0F5', '#98FB98']
      });
    }, 600);

    setTimeout(() => {
      setIsOpen(true);
      setIsBlooming(false);
    }, 1400);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsBlooming(false);
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
      className="min-h-screen relative font-cairo bg-[#FAF6F0] text-[#2C2724] overflow-x-hidden selection:bg-rose-200"
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
            className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-rose-200 flex items-center justify-center text-rose-700 hover:scale-105 active:scale-95 transition"
            title={isPlayingAudio ? 'كتم الصوت' : 'تشغيل الموسيقى'}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-5 h-5 text-rose-600 animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-neutral-400" />
            )}
          </button>
        )}

        {isOpen && (
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-1.5 hover:bg-white active:scale-95 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>عرض الغلاف التفاعلي</span>
          </button>
        )}
      </div>

      {/* Floating Ambient Floral Petals */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-rose-200/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-10 w-80 h-80 bg-amber-200/30 rounded-full blur-[110px]" />
      </div>

      {/* STAGE 1: 3D Blooming Garden Opening Screen */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#2E201B] via-[#3D2C26] to-[#1F1511] text-center"
          >
            <div className="text-center mb-6 space-y-1.5 z-10">
              <span className="text-[11px] uppercase tracking-[0.3em] text-rose-200/80 font-mono">
                3D BLOOMING BOTANICAL GARDEN
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-wide">
                {custom.flowerGreeting || 'بستان الحب والفرح'}
              </h2>
              <p className="text-xs text-rose-200/70">
                {custom.bloomingHint || 'انقر على باقة الزهور لتتفتح البتلات وتبدأ الدعوة'}
              </p>
            </div>

            {/* The Blooming Flower Interactive Emblem */}
            <div 
              onClick={handleBloomAndOpen}
              className="relative w-full max-w-[360px] sm:max-w-[400px] h-[460px] sm:h-[500px] rounded-3xl cursor-pointer group shadow-2xl overflow-hidden flex flex-col justify-between p-6 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#F5ECE3] text-[#2C2724] border-4 border-rose-200/80"
              style={{
                boxShadow: '0 25px 70px -15px rgba(0,0,0,0.7), 0 0 40px rgba(255, 182, 193, 0.25)'
              }}
            >
              {/* Botanical Border Frame */}
              <div className="absolute inset-2 border-2 border-rose-300/40 rounded-2xl pointer-events-none p-3 flex flex-col justify-between">
                <div className="flex justify-between text-xs text-rose-400">
                  <span>🌸</span>
                  <span className="text-[10px] tracking-widest font-serif uppercase">Floral Romance</span>
                  <span>🌸</span>
                </div>
                <div className="flex justify-between text-xs text-rose-400">
                  <span>🌿</span>
                  <span>🌿</span>
                </div>
              </div>

              {/* Top Announcement */}
              <div className="pt-4 z-10">
                <span className="text-[10px] tracking-widest uppercase text-rose-700/80 font-mono">
                  YOU ARE INVITED TO CELEBRATE
                </span>
                <p className="text-xl font-serif text-[#2C2724] italic mt-1">
                  «تلاقت الأرواح في بستان السعادة»
                </p>
              </div>

              {/* Center Blooming Floral Animation */}
              <motion.div
                animate={isBlooming ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : {}}
                transition={{ duration: 0.8 }}
                className="my-auto z-10 flex flex-col items-center group-hover:scale-105 transition-transform"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-rose-100 via-pink-50 to-white border-2 border-rose-300 shadow-xl flex flex-col items-center justify-center p-3 relative">
                  <Flower2 className="w-12 h-12 text-rose-500 animate-spin" style={{ animationDuration: '25s' }} />
                  <span className="text-xs font-serif text-rose-800 font-bold mt-1 tracking-wider">
                    {data.groomName.charAt(0)} & {data.brideName.charAt(0)}
                  </span>
                  {/* Outer Pulsing Petal Halo */}
                  <div className="absolute -inset-2 rounded-full border border-rose-400/40 animate-pulse pointer-events-none" />
                </div>

                <div className="mt-5 space-y-0.5">
                  <h3 className="text-2xl font-serif text-[#2C2724] font-bold">
                    {data.groomName} & {data.brideName}
                  </h3>
                  <p className="text-xs text-rose-700/80 font-serif">
                    {formattedDate}
                  </p>
                </div>
              </motion.div>

              {/* Bottom Instruction Pill */}
              <div className="pb-2 z-10 text-[11px] font-mono text-rose-700 tracking-wider uppercase">
                CLICK TO BLOOM & OPEN ❯
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 2: Unveiled Blooming Botanical Garden Card */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl mx-auto px-4 py-16 sm:py-24 relative z-10"
        >
          {/* Main Glassmorphic Card */}
          <div 
            className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-12 border-2 border-rose-200/80 shadow-2xl relative overflow-hidden text-center text-[#2C2724]"
            style={{
              boxShadow: '0 20px 60px -15px rgba(244, 114, 182, 0.2)'
            }}
          >
            {/* Soft Botanical Inset Border */}
            <div className="absolute inset-3 border border-rose-300/40 rounded-2xl pointer-events-none p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-rose-400 text-xs px-2">
                <span>🌸</span>
                <span className="text-[10px] tracking-widest uppercase font-serif">Blooming Garden Wedding</span>
                <span>🌸</span>
              </div>
              <div className="flex justify-between items-center text-rose-400 text-xs px-2">
                <span>🌿</span>
                <span>🌿</span>
              </div>
            </div>

            {/* Opening Verse */}
            <div className="my-6 space-y-3">
              <span className="text-sm tracking-widest text-rose-700 font-serif font-bold block">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
              <p className="text-lg sm:text-2xl font-serif text-[#2C2724] leading-relaxed px-4">
                {custom.introVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
              </p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto" />
            </div>

            {/* Couple Announcement */}
            <div className="my-8 space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-mono">
                {custom.invitationIntro || 'يسعدنا ويشرفنا دعوتكم لحضور حفل زفافنا الميمون'}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 my-4">
                <h1 className="text-4xl sm:text-5xl font-serif text-[#2C2724] font-bold">
                  {data.groomName}
                </h1>
                <span className="text-2xl font-serif text-rose-600 italic">&</span>
                <h1 className="text-4xl sm:text-5xl font-serif text-[#2C2724] font-bold">
                  {data.brideName}
                </h1>
              </div>

              <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed pt-2 font-serif">
                {data.weddingMessage || custom.invitationNote || 'بين عبق الزهور ونسمات الفرح، يسعدنا أن تشاركونا أجمل لحظات العمر لتكتمل سعادتنا بوجودكم معنا في ليلتنا المنتظرة.'}
              </p>
            </div>

            {/* Date, Time & Countdown */}
            <div className="my-8 bg-[#FAF6F0] border border-rose-200/80 rounded-2xl p-6 max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-center gap-2 text-rose-800 font-bold text-sm font-serif">
                <Calendar className="w-5 h-5 text-rose-600" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-neutral-600 text-xs font-serif">
                <Clock className="w-4 h-4 text-rose-600" />
                <span>{data.weddingTime || 'السابعة والنصف مساءً (07:30 PM)'}</span>
              </div>

              {/* Live Countdown */}
              {data.countdownEnabled && (
                <div className="pt-3 border-t border-rose-200/80">
                  <div className="text-[11px] font-mono text-rose-700/80 tracking-wider mb-2">
                    COUNTDOWN TO OUR SPECIAL DAY
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center max-w-xs mx-auto">
                    <div className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-sm">
                      <div className="text-xl font-bold font-mono text-[#2C2724]">{timeLeft.days}</div>
                      <div className="text-[10px] text-neutral-400">يوم</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-sm">
                      <div className="text-xl font-bold font-mono text-[#2C2724]">{timeLeft.hours}</div>
                      <div className="text-[10px] text-neutral-400">ساعة</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-sm">
                      <div className="text-xl font-bold font-mono text-[#2C2724]">{timeLeft.minutes}</div>
                      <div className="text-[10px] text-neutral-400">دقيقة</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-sm">
                      <div className="text-xl font-bold font-mono text-rose-600">{timeLeft.seconds}</div>
                      <div className="text-[10px] text-neutral-400">ثانية</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Event Itinerary / Timeline */}
            <div className="my-8 text-right max-w-md mx-auto">
              <h3 className="text-center font-bold text-lg text-[#2C2724] mb-4 font-serif">
                برنامج ومراسم الحفل 🌸
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-[#FAF6F0] p-3.5 rounded-2xl border border-rose-200/60">
                  <span className="text-xs font-mono font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-lg">
                    {custom.timeline1Time || '07:30 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#2C2724] font-serif">
                      {custom.timeline1Title || 'استقبال الضيوف الكرام'}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {custom.timeline1Desc || 'مراسم الترحيب بعبق الزهور وبداية توافد الأهل والأحباب'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#FAF6F0] p-3.5 rounded-2xl border border-rose-200/60">
                  <span className="text-xs font-mono font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-lg">
                    {custom.timeline2Time || '08:45 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#2C2724] font-serif">
                      {custom.timeline2Title || 'الزفة وعقد القران'}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {custom.timeline2Desc || 'لحظات مباركة البداية وإطلالة العروسين الكريمة'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#FAF6F0] p-3.5 rounded-2xl border border-rose-200/60">
                  <span className="text-xs font-mono font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-lg">
                    {custom.timeline3Time || '10:15 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#2C2724] font-serif">
                      {custom.timeline3Title || 'العشاء الملكي'}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {custom.timeline3Desc || 'بوفيه عشاء فاخر احتفاءً بضيوفنا الكرام'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Venue & Location */}
            <div className="my-8 max-w-md mx-auto space-y-4">
              <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-rose-200/80 space-y-2">
                <MapPin className="w-6 h-6 text-rose-600 mx-auto" />
                <h4 className="text-lg font-bold text-[#2C2724] font-serif">
                  {data.venueName}
                </h4>
                {data.venueAddress && (
                  <p className="text-xs text-neutral-600 font-serif">{data.venueAddress}</p>
                )}
                {custom.dressCode && (
                  <p className="text-xs text-rose-800 pt-2 border-t border-rose-200/60 font-serif font-medium">
                    👗 قواعد اللباس: {custom.dressCode}
                  </p>
                )}
              </div>

              {data.googleMapsUrl && (
                <a
                  href={data.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition"
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
            <div className="mt-8 text-rose-700 text-xs italic font-serif">
              {custom.closingMessage || 'بوجودكم تكتمل فرحتنا وتزهر أوقاتنا بأجمل الذكريات 🤍'}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
