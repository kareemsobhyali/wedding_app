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
  Heart, 
  MessageCircle, 
  Share2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WaxSilkRevealTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isOpen, setIsOpen] = useState(mode === 'PREVIEW' ? false : false);
  const [isCracking, setIsCracking] = useState(false);
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

  // Countdown timer calculation
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

  const handleOpenEnvelope = () => {
    if (isOpen || isCracking) return;
    setIsCracking(true);

    if (data.music && audioRef.current) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    // Trigger golden sparkles confetti when wax cracks
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#D4AF37', '#FFD700', '#F3E5AB', '#ffffff', '#AA8220']
      });
    }, 700);

    setTimeout(() => {
      setIsOpen(true);
      setIsCracking(false);
    }, 1500);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsCracking(false);
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

  const waxMonogram = custom.waxMonogram || `${data.groomName.charAt(0)} & ${data.brideName.charAt(0)}`;

  return (
    <div 
      className="min-h-screen relative font-cairo bg-[#FAF7F2] text-[#2D2A26] overflow-x-hidden selection:bg-amber-200"
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
            className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-amber-200/80 flex items-center justify-center text-amber-800 hover:scale-105 active:scale-95 transition"
            title={isPlayingAudio ? 'كتم الصوت' : 'تشغيل الموسيقى'}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-5 h-5 text-amber-600 animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-neutral-400" />
            )}
          </button>
        )}

        {isOpen && (
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-neutral-200 text-xs font-bold text-neutral-700 flex items-center gap-1.5 hover:bg-white active:scale-95 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة طي المظروف</span>
          </button>
        )}
      </div>

      {/* STAGE 1: Interactive Wax Seal Envelope */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#1C1612] via-[#2A1F18] to-[#120D0A] text-white"
          >
            {/* Ambient Golden Glows */}
            <div className="absolute w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="text-center mb-8 space-y-2 z-10">
              <span className="text-xs uppercase tracking-[0.35em] text-amber-300/80 font-mono">
                {custom.envelopeTagline || 'ROYAL WEDDING INVITATION'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-wide">
                دعوة خاصة إلى ليلة العمر
              </h2>
              <p className="text-xs text-neutral-400">
                انقر على الختم الشمعي لفتح المظروف الملكي
              </p>
            </div>

            {/* The Physical 3D Silk Envelope with Wax Seal */}
            <div 
              onClick={handleOpenEnvelope}
              className="relative w-full max-w-[380px] sm:max-w-[420px] h-[260px] sm:h-[280px] rounded-2xl cursor-pointer group shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
              style={{
                perspective: '1200px',
                background: 'linear-gradient(135deg, #F9F6F0 0%, #EFEAE1 100%)',
                boxShadow: '0 25px 60px -15px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.8)'
              }}
            >
              {/* Envelope Flap Fold Lines & Silk Textures */}
              <div className="absolute inset-0 rounded-2xl border border-amber-900/10 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black/5 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-full border-t-[140px] border-t-transparent border-b-[140px] border-b-[#E5DFD3] border-l-[190px] sm:border-l-[210px] border-l-[#EAE4D8] border-r-[190px] sm:border-r-[210px] border-r-[#EAE4D8]" />
              </div>

              {/* Top Flap (Triangular Folding Flap) */}
              <motion.div
                animate={isCracking ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 20 }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformOrigin: 'top center' }}
                className="absolute top-0 left-0 right-0 h-[140px] border-l-[190px] sm:border-l-[210px] border-l-transparent border-r-[190px] sm:border-r-[210px] border-r-transparent border-t-[140px] border-t-[#DCD5C5] drop-shadow-md flex items-center justify-center"
              />

              {/* The Wax Seal - Center of Flap */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                <motion.div
                  animate={isCracking ? { scale: [1, 1.15, 0.9], rotate: [0, -5, 5, 0] } : {}}
                  transition={{ duration: 0.8 }}
                  className="relative group-hover:scale-105 transition-transform duration-300"
                >
                  {/* Wax Seal Outer Organic Flange */}
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center p-1 shadow-2xl relative"
                    style={{
                      background: custom.waxColor === 'emerald' 
                        ? 'radial-gradient(circle, #0F5132 0%, #082A1A 100%)'
                        : custom.waxColor === 'gold'
                        ? 'radial-gradient(circle, #D4AF37 0%, #8C6D1F 100%)'
                        : 'radial-gradient(circle, #801313 0%, #4D0909 100%)', // Burgundy Classic Wax
                      boxShadow: '0 8px 25px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -3px 6px rgba(0,0,0,0.6)'
                    }}
                  >
                    {/* Crack effect line when cracking */}
                    {isCracking && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: '100%', opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="absolute w-1 bg-amber-200/90 shadow-[0_0_8px_#ffd700] z-40 rounded-full rotate-45"
                      />
                    )}

                    {/* Wax Inner Ring with Monogram */}
                    <div className="w-16 h-16 rounded-full border-2 border-amber-300/40 flex flex-col items-center justify-center text-amber-200 font-serif drop-shadow-md">
                      <span className="text-xs">⚜️</span>
                      <span className="text-xs font-bold tracking-wider">{waxMonogram}</span>
                    </div>
                  </div>

                  {/* Pulsing Hint Ring */}
                  {!isCracking && (
                    <div className="absolute -inset-2 rounded-full border border-amber-400/40 animate-ping pointer-events-none" />
                  )}
                </motion.div>
              </div>

              {/* Helper text on envelope */}
              <div className="absolute bottom-3 left-0 right-0 text-center z-20 text-[11px] font-mono text-neutral-500 tracking-widest uppercase">
                {custom.envelopeHint || 'CLICK WAX TO BREAK SEAL & OPEN'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 2: Unfolded Invitation Experience */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl mx-auto px-4 py-16 sm:py-24"
        >
          {/* Main Gilded Invitation Card */}
          <div 
            className="bg-white rounded-3xl p-6 sm:p-12 shadow-2xl border border-amber-100 relative overflow-hidden text-center"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 0%, #FFFDF9 0%, #FFFFFF 100%)',
              boxShadow: '0 20px 60px -15px rgba(184, 134, 11, 0.15)'
            }}
          >
            {/* Ornate Gold Border Line */}
            <div className="absolute inset-3 border border-amber-300/40 rounded-2xl pointer-events-none p-2 flex flex-col justify-between">
              <div className="flex justify-between items-center text-amber-400 text-xs px-2">
                <span>⚜️</span>
                <span className="text-[10px] tracking-widest uppercase font-serif">Wedding Invitation</span>
                <span>⚜️</span>
              </div>
              <div className="flex justify-between items-center text-amber-400 text-xs px-2">
                <span>⚜️</span>
                <span>⚜️</span>
              </div>
            </div>

            {/* Quranic Ayah / Opening */}
            <div className="my-6 space-y-3">
              <span className="text-xs tracking-widest text-amber-600 font-bold block">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
              <p className="text-lg sm:text-xl font-serif text-neutral-800 leading-relaxed px-4">
                {custom.introVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
              </p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
            </div>

            {/* Couple Announcement */}
            <div className="my-8 space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-mono">
                {custom.invitationIntro || 'يتشرف العروسان بدعوتكم لحضور حفل زفافهما'}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 my-4">
                <h1 className="text-4xl sm:text-5xl font-serif text-neutral-900 font-bold">
                  {data.groomName}
                </h1>
                <span className="text-2xl font-serif text-amber-600 italic">&</span>
                <h1 className="text-4xl sm:text-5xl font-serif text-neutral-900 font-bold">
                  {data.brideName}
                </h1>
              </div>

              <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed pt-2">
                {data.weddingMessage || custom.invitationNote || 'يسعدنا ويشرفنا حضوركم ومشاركتنا فرحة العمر في هذا اليوم المبارك، لتكتمل سعادتنا برؤيتكم بيننا.'}
              </p>
            </div>

            {/* Date & Time Highlights */}
            <div className="my-8 bg-[#FAF7F2] border border-amber-200/60 rounded-2xl p-6 max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-center gap-2 text-amber-700 font-bold text-sm">
                <Calendar className="w-5 h-5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-neutral-600 text-xs">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{data.weddingTime || 'السابعة والنصف مساءً (07:30 PM)'}</span>
              </div>

              {/* Live Countdown */}
              {data.countdownEnabled && (
                <div className="pt-3 border-t border-amber-200/60">
                  <div className="text-[11px] font-mono text-neutral-500 tracking-wider mb-2">
                    COUNTDOWN TO THE BIG DAY
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center max-w-xs mx-auto">
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-neutral-100">
                      <div className="text-xl font-bold font-mono text-neutral-800">{timeLeft.days}</div>
                      <div className="text-[10px] text-neutral-400">يوم</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-neutral-100">
                      <div className="text-xl font-bold font-mono text-neutral-800">{timeLeft.hours}</div>
                      <div className="text-[10px] text-neutral-400">ساعة</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-neutral-100">
                      <div className="text-xl font-bold font-mono text-neutral-800">{timeLeft.minutes}</div>
                      <div className="text-[10px] text-neutral-400">دقيقة</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-neutral-100">
                      <div className="text-xl font-bold font-mono text-amber-600">{timeLeft.seconds}</div>
                      <div className="text-[10px] text-neutral-400">ثانية</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Event Itinerary / Timeline */}
            <div className="my-8 text-right max-w-md mx-auto">
              <h3 className="text-center font-bold text-lg text-neutral-800 mb-4 font-serif">
                برنامج ومراسم الحفل
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-[#FAF7F2] p-3.5 rounded-2xl border border-neutral-200/60">
                  <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                    {custom.timeline1Time || '07:30 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-800">
                      {custom.timeline1Title || 'استقبال الضيوف الكرام'}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {custom.timeline1Desc || 'الترحيب والمشروبات المنعشة ومراسم البداية'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#FAF7F2] p-3.5 rounded-2xl border border-neutral-200/60">
                  <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                    {custom.timeline2Time || '08:45 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-800">
                      {custom.timeline2Title || 'عقد القران والزفة'}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {custom.timeline2Desc || 'لحظات مباركة البداية وإطلالة العروسين'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#FAF7F2] p-3.5 rounded-2xl border border-neutral-200/60">
                  <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                    {custom.timeline3Time || '10:15 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-800">
                      {custom.timeline3Title || 'العشاء الملكي'}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {custom.timeline3Desc || 'بوفيه عشاء مفتوح واحتفال حتى النهاية'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Venue & Location */}
            <div className="my-8 max-w-md mx-auto space-y-4">
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-amber-200/60 space-y-2">
                <MapPin className="w-6 h-6 text-amber-600 mx-auto" />
                <h4 className="text-lg font-bold text-neutral-800 font-serif">
                  {data.venueName}
                </h4>
                {data.venueAddress && (
                  <p className="text-xs text-neutral-600">{data.venueAddress}</p>
                )}
                {custom.dressCode && (
                  <p className="text-xs text-amber-800 pt-2 border-t border-neutral-200 font-medium">
                    👔 قواعد اللباس: {custom.dressCode}
                  </p>
                )}
              </div>

              {data.googleMapsUrl && (
                <a
                  href={data.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition"
                >
                  <MapPin className="w-4 h-4" />
                  <span>فتح موقع القاعة على خرائط Google Maps</span>
                </a>
              )}
            </div>

            {/* WhatsApp RSVP / Congratulations Buttons */}
            {data.contactButtonsEnabled && (data.groomWhatsapp || data.brideWhatsapp) && (
              <div className="my-8 max-w-md mx-auto pt-6 border-t border-neutral-200">
                <p className="text-xs text-neutral-500 mb-3">تأكيد الحضور أو إرسال تهنئة عبر واتساب:</p>
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
            <div className="mt-8 text-neutral-500 text-xs italic font-serif">
              {custom.closingMessage || 'حضوركم شرف لنا ويزيد ليلتنا بهجة وسروراً 🤍'}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
