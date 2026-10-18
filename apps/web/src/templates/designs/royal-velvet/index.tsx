'use client';

import React, { useState, useRef, useEffect } from "react";
import { TemplateRenderContext } from "../../types";
import { TrackedLink } from "../../utils/TrackedLink";
import { RevealWrapper } from "../../utils/useScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export const RoyalVelvetTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const custom = data.customData || {};
  const groomInitial = (data.groomName || 'أ').charAt(0);
  const brideInitial = (data.brideName || 'ف').charAt(0);
  const defaultMonogram = `${groomInitial} & ${brideInitial}`;

  const ribbonText = custom.ribbonText || 'انقر لفتح الدعوة الملكية ✨';
  const monogram = custom.monogramText || defaultMonogram;
  const introVerse = custom.introVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»';
  const invitationNote = custom.invitationNote || 'يتشرف العروسان بدعوتكم لمشاركتهما أجمل لحظات العمر وتتويج قصة حبهما بفرحة تكتمل بوجودكم.';
  const dressCode = custom.dressCode || 'ملابس رسمية / Formal Black Tie';
  const closingMessage = custom.closingMessage || 'حضوركم شرف لنا ويزيد ليلتنا بهجة وسروراً 🤍';

  const t1Title = custom.timeline1Title || 'استقبال الضيوف الكرام';
  const t1Time = custom.timeline1Time || '07:30 PM';
  const t1Desc = custom.timeline1Desc || 'مراسم الترحيب وبداية توافد الأهل والأحباب';

  const t2Title = custom.timeline2Title || 'الزفة الملكية وعقد القران';
  const t2Time = custom.timeline2Time || '08:45 PM';
  const t2Desc = custom.timeline2Desc || 'لحظات مباركة البداية وبدء مراسم الاحتفال';

  const t3Title = custom.timeline3Title || 'العشاء الملكي';
  const t3Time = custom.timeline3Time || '10:15 PM';
  const t3Desc = custom.timeline3Desc || 'بوفيه عشاء فاخر احتفاءً بضيوفنا الأعزاء';

  // Date formatting
  const weddingDate = new Date(data.weddingDate || '2026-11-20T19:00:00Z');
  const validDate = isNaN(weddingDate.getTime()) ? new Date('2026-11-20T19:00:00Z') : weddingDate;
  const dateArabic = validDate.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeArabic = data.weddingTime || validDate.toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit', hour12: true });

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  useEffect(() => {
    if (!data.countdownEnabled) return;
    const timer = setInterval(() => {
      const diff = validDate.getTime() - new Date().getTime();
      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }
      setTimeLeft({
        days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
        hours: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
        minutes: String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0'),
        seconds: String(Math.floor((diff / 1000) % 60)).padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [validDate, data.countdownEnabled]);

  const handleOpen = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);

    if (data.music && audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#FFD700', '#F5E6BE', '#FFFFFF', '#0B251F']
      });
    }, 600);

    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
    }, 1400);
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

  return (
    <div className="relative min-h-screen bg-[#071713] text-[#F3E5AB] font-serif overflow-x-hidden select-none" dir="rtl">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.15)_0%,_transparent_70%)]" />

      {/* Audio Element */}
      {data.music && (
        <>
          <audio ref={audioRef} src={data.music.url} loop />
          <button 
            onClick={toggleAudio}
            className="fixed top-5 left-5 z-50 p-3 bg-black/60 backdrop-blur-md rounded-full border border-[#D4AF37]/50 text-[#D4AF37] shadow-xl hover:scale-110 transition-transform"
            aria-label="Toggle Music"
          >
            {isPlaying ? '🔊' : '🔇'}
          </button>
        </>
      )}

      {/* Floating Replay Button */}
      {isOpen && (
        <button 
          onClick={handleReset}
          className="fixed bottom-6 left-6 z-50 px-4 py-2 bg-[#0B251F]/90 backdrop-blur-md border border-[#D4AF37]/70 text-[#F5E6BE] text-xs font-bold rounded-full shadow-2xl hover:bg-[#D4AF37] hover:text-[#0B251F] transition-all flex items-center gap-2"
        >
          <span>↺</span>
          <span>إعادة الفتح</span>
        </button>
      )}

      {/* UNOPENED STATE: Royal Velvet Card & Satin Ribbon Bow */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-gradient-to-b from-[#040C0A] via-[#071713] to-[#040C0A]"
          >
            <motion.div 
              onClick={handleOpen}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full max-w-sm sm:max-w-md aspect-[3/4.2] rounded-3xl p-6 shadow-2xl cursor-pointer border-2 border-[#D4AF37]/60 overflow-hidden flex flex-col items-center justify-between text-center transition-all"
              style={{
                background: 'linear-gradient(135deg, #09201A 0%, #0F332A 50%, #061713 100%)',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), inset 0 0 40px rgba(0, 0, 0, 0.7)'
              }}
            >
              {/* Velvet Grain Texture */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#F5E6BE_1px,transparent_1px)] [background-size:12px_12px]" />

              {/* Ornate Gold Border Inner Frame */}
              <div className="absolute inset-3 rounded-2xl border border-[#D4AF37]/40 pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between text-[#D4AF37] text-lg opacity-80">
                  <span>⚜</span><span>⚜</span>
                </div>
                <div className="flex justify-between text-[#D4AF37] text-lg opacity-80">
                  <span>⚜</span><span>⚜</span>
                </div>
              </div>

              {/* Top Monogram Crest */}
              <div className="relative z-10 pt-4 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37] flex items-center justify-center bg-black/40 backdrop-blur-sm shadow-xl shadow-[#D4AF37]/20 mb-3">
                  <span className="text-xl font-bold tracking-widest text-[#FFD700] drop-shadow-md">
                    {monogram}
                  </span>
                </div>
                <span className="text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-sans">
                  ROYAL WEDDING INVITATION
                </span>
              </div>

              {/* Center Names */}
              <div className="relative z-10 my-auto">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#FFFFFF] drop-shadow-lg mb-2">
                  {data.groomName} <span className="text-[#D4AF37] font-normal">&</span> {data.brideName}
                </h1>
                <p className="text-xs text-[#EADBC8] max-w-xs mx-auto leading-relaxed opacity-90">
                  في رحاب المحبة والمودة نحتفل بزفافنا
                </p>
              </div>

              {/* Gold Satin Ribbon & Wax Seal in Middle */}
              <div className="relative z-20 w-full flex flex-col items-center my-4">
                {/* Horizontal Ribbon Banner */}
                <motion.div 
                  animate={isOpening ? { scaleX: 0, opacity: 0 } : { scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-12 bg-gradient-to-r from-[#B38728] via-[#FBF5B7] to-[#AA771C] flex items-center justify-center shadow-lg relative border-y border-[#FFD700]"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#3B2C04] tracking-wider animate-pulse">
                    {ribbonText}
                  </span>
                </motion.div>

                {/* Wax Seal / Bow Tie */}
                <motion.div 
                  animate={isOpening ? { scale: 0, rotate: 180, opacity: 0 } : { scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute w-14 h-14 -top-1 rounded-full bg-gradient-to-br from-[#0B251F] via-[#051410] to-[#0B251F] border-2 border-[#FFD700] shadow-2xl flex items-center justify-center cursor-pointer"
                >
                  <span className="text-[#FFD700] text-sm font-black">⚜</span>
                </motion.div>
              </div>

              {/* Bottom Date & Touch Prompt */}
              <div className="relative z-10 pb-4">
                <p className="text-sm text-[#FFD700] font-bold tracking-wider mb-1">
                  {dateArabic}
                </p>
                <span className="text-[11px] text-[#A3B899] font-sans">
                  اضغط للمشاهدة
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OPENED STATE: Full Royal Velvet Experience */}
      {isOpen && (
        <main className="relative z-20 max-w-2xl mx-auto px-4 py-16 sm:py-24 space-y-16">
          {/* Header Monogram & Quranic Verse */}
          <section className="text-center space-y-6">
            <RevealWrapper>
              <div className="w-24 h-24 mx-auto rounded-full border-2 border-[#D4AF37] flex items-center justify-center bg-black/40 backdrop-blur-md shadow-2xl shadow-[#D4AF37]/30">
                <span className="text-2xl font-bold tracking-widest text-[#FFD700]">
                  {monogram}
                </span>
              </div>
            </RevealWrapper>

            <RevealWrapper delay={0.15}>
              <div className="p-6 rounded-2xl bg-black/30 border border-[#D4AF37]/30 backdrop-blur-sm max-w-lg mx-auto shadow-inner">
                <p className="text-base sm:text-lg leading-relaxed text-[#F5E6BE] font-arabic">
                  {introVerse}
                </p>
              </div>
            </RevealWrapper>
          </section>

          {/* Groom & Bride Royal Banner */}
          <section className="text-center py-6 space-y-4">
            <RevealWrapper delay={0.25}>
              <span className="text-xs text-[#D4AF37] tracking-[0.3em] uppercase block">
                THE WEDDING OF
              </span>
              <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-wide drop-shadow-2xl my-3">
                {data.groomName} <span className="text-[#D4AF37] font-light">&</span> {data.brideName}
              </h1>
              <p className="text-sm sm:text-base text-[#D1D5DB] max-w-md mx-auto leading-relaxed">
                {invitationNote}
              </p>
            </RevealWrapper>
          </section>

          {/* Countdown Section */}
          {data.countdownEnabled && (
            <RevealWrapper delay={0.35}>
              <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0F332A]/80 to-[#071C17]/90 border border-[#D4AF37]/40 shadow-2xl text-center space-y-6">
                <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
                  العد التنازلي لليلتنا المميزة
                </span>
                <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto font-sans">
                  {[
                    { label: 'أيام', val: timeLeft.days },
                    { label: 'ساعات', val: timeLeft.hours },
                    { label: 'دقائق', val: timeLeft.minutes },
                    { label: 'ثوانٍ', val: timeLeft.seconds }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-black/50 p-3 sm:p-4 rounded-xl border border-[#D4AF37]/30 shadow-md">
                      <span className="text-2xl sm:text-3xl font-black text-[#FFD700] block">{item.val}</span>
                      <span className="text-[10px] sm:text-xs text-gray-300 block mt-1">{item.label}</span>
                    </div>
                  ))}
                </div>
              </section>
            </RevealWrapper>
          )}

          {/* Timeline of Events */}
          <RevealWrapper delay={0.45}>
            <section className="space-y-6">
              <div className="text-center">
                <span className="text-xs text-[#D4AF37] tracking-widest uppercase block mb-1">PROGRAM</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">جدول برنامج الحفل</h2>
              </div>

              <div className="space-y-4">
                {[
                  { title: t1Title, time: t1Time, desc: t1Desc, icon: '🥂' },
                  { title: t2Title, time: t2Time, desc: t2Desc, icon: '💍' },
                  { title: t3Title, time: t3Time, desc: t3Desc, icon: '🍽️' }
                ].map((ev, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-black/40 border border-[#D4AF37]/30 backdrop-blur-sm shadow-md hover:border-[#D4AF37] transition-all">
                    <span className="text-3xl p-3 bg-[#0F332A] rounded-xl border border-[#D4AF37]/40">{ev.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-base sm:text-lg text-[#F5E6BE]">{ev.title}</h3>
                        <span className="text-xs font-bold text-[#FFD700] bg-[#D4AF37]/20 px-2.5 py-1 rounded-full">{ev.time}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-300">{ev.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </RevealWrapper>

          {/* Venue & Location Details */}
          <RevealWrapper delay={0.55}>
            <section className="p-8 rounded-3xl bg-[#09201A] border-2 border-[#D4AF37]/40 shadow-2xl text-center space-y-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-2xl text-[#FFD700] border border-[#D4AF37]">
                📍
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{data.venueName}</h3>
                <p className="text-sm text-gray-300 max-w-sm mx-auto">{data.venueAddress}</p>
                <div className="mt-3 inline-block px-3 py-1 bg-black/40 rounded-full border border-[#D4AF37]/30 text-xs text-[#FFD700]">
                  {dateArabic} — {timeArabic}
                </div>
              </div>

              {data.googleMapsUrl && (
                <div className="pt-2">
                  <TrackedLink
                    href={data.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    eventType="MAP_CLICK"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B38728] text-[#071713] rounded-full font-bold text-sm shadow-xl hover:scale-105 transition-transform"
                  >
                    <span>فتح موقع القاعة على الخريطة</span>
                    <span>🗺️</span>
                  </TrackedLink>
                </div>
              )}

              {dressCode && (
                <div className="pt-4 border-t border-[#D4AF37]/20 text-xs text-gray-400">
                  <span className="text-[#FFD700] font-bold">قواعد اللباس (Dress Code):</span> {dressCode}
                </div>
              )}
            </section>
          </RevealWrapper>

          {/* RSVP / Contact Section */}
          <RevealWrapper delay={0.65}>
            <section className="text-center space-y-6 p-8 rounded-3xl bg-black/40 border border-[#D4AF37]/30 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white">تأكيد الحضور (RSVP)</h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
                يسعدنا تأكيد حضوركم لمشاركتنا فرحتنا عبر رسالة مباشرة على الواتساب:
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                {data.groomPhone && (
                  <TrackedLink
                    href={`https://wa.me/${data.groomPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك زفاف ${data.groomName} و${data.brideName}! يسرني تأكيد الحضور.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    eventType="GROOM_CONTACT"
                    className="px-6 py-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-full text-xs font-bold border border-emerald-500 shadow-md transition-all flex items-center gap-2"
                  >
                    <span>واتساب العريس ({data.groomName})</span>
                    <span>💬</span>
                  </TrackedLink>
                )}
                {data.bridePhone && (
                  <TrackedLink
                    href={`https://wa.me/${data.bridePhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك زفاف ${data.groomName} و${data.brideName}! يسرني تأكيد الحضور.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    eventType="BRIDE_CONTACT"
                    className="px-6 py-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-full text-xs font-bold border border-emerald-500 shadow-md transition-all flex items-center gap-2"
                  >
                    <span>واتساب العروس ({data.brideName})</span>
                    <span>💬</span>
                  </TrackedLink>
                )}
              </div>

              <div className="pt-6 border-t border-[#D4AF37]/20">
                <p className="text-base font-bold text-[#FFD700]">
                  {closingMessage}
                </p>
              </div>
            </section>
          </RevealWrapper>
        </main>
      )}
    </div>
  );
};
