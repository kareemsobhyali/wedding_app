'use client';

import React, { useState, useRef, useEffect } from "react";
import { TemplateRenderContext } from "../../types";
import { TrackedLink } from "../../utils/TrackedLink";
import { RevealWrapper } from "../../utils/useScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export const PalaceGatesTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const custom = data.customData || {};

  const gateCrestText = custom.gateCrestText || 'ROYAL PALACE BALLROOM';
  const gatesButtonText = custom.gatesButtonText || 'اضغط لفتح بوابات القصر ⚜️';
  const ballroomQuote = custom.ballroomQuote || '«بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ»';
  const invitationNote = custom.invitationNote || 'يسعدنا ويشرفنا دعوتكم لحضور حفل الزفاف الملكي ومشاركتنا بهجة هذا اليوم التاريخي في حياتنا.';
  const dressCode = custom.dressCode || 'أزياء سهرة فاخرة / Formal Evening Wear';
  const closingMessage = custom.closingMessage || 'بوجودكم تدوم الأفراح وتكتمل سعادتنا ✨';

  const t1Title = custom.timeline1Title || 'توافد الضيوف الملكي';
  const t1Time = custom.timeline1Time || '07:00 PM';
  const t1Desc = custom.timeline1Desc || 'استقبال وترحيب بالمشروبات الخاصة وموسيقى كلاسيكية';

  const t2Title = custom.timeline2Title || 'الدخول الملكي والزفة';
  const t2Time = custom.timeline2Time || '08:30 PM';
  const t2Desc = custom.timeline2Desc || 'إطلالة العروسين وبداية مراسم الاحتفال الكبرى';

  const t3Title = custom.timeline3Title || 'العشاء الفاخر';
  const t3Time = custom.timeline3Time || '10:00 PM';
  const t3Desc = custom.timeline3Desc || 'مأدبة عشاء ملكية احتفاءً بجمعنا المبارك';

  const weddingDate = new Date(data.weddingDate || '2026-11-20T19:00:00Z');
  const validDate = isNaN(weddingDate.getTime()) ? new Date('2026-11-20T19:00:00Z') : weddingDate;
  const dateArabic = validDate.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeArabic = data.weddingTime || validDate.toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit', hour12: true });

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
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#FFD700', '#FFFFFF', '#ECC56E']
      });
    }, 800);

    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
    }, 1800);
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
    <div className="relative min-h-screen bg-[#110D09] text-[#FAF4E6] font-serif overflow-x-hidden select-none" dir="rtl">
      {/* Background Ambience */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url('/assets/templates/palace-gates.jpg')` }}
      />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-t from-[#110D09] via-transparent to-[#110D09]" />

      {/* Audio Button */}
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
          className="fixed bottom-6 left-6 z-50 px-4 py-2 bg-[#231A12]/90 backdrop-blur-md border border-[#D4AF37]/70 text-[#F5E6BE] text-xs font-bold rounded-full shadow-2xl hover:bg-[#D4AF37] hover:text-[#110D09] transition-all flex items-center gap-2"
        >
          <span>↺</span>
          <span>إغلاق البوابات والمشاهدة مجدداً</span>
        </button>
      )}

      {/* UNOPENED STATE: 3D Grand Palace Golden Gates */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-gradient-to-b from-[#0A0704] via-[#161009] to-[#0A0704] overflow-hidden"
            style={{ perspective: 1200 }}
          >
            {/* Palace Archway Container */}
            <div className="relative w-full max-w-md sm:max-w-lg aspect-[3/4.2] rounded-3xl border-4 border-[#C5A059]/70 shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col items-center justify-between p-6">
              
              {/* Palace Ballroom Background Behind Gates */}
              <div 
                className="absolute inset-0 bg-cover bg-center brightness-75 scale-105 transition-transform duration-1000"
                style={{ backgroundImage: `url('/assets/templates/palace-gates.jpg')` }}
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

              {/* Arch Top Banner */}
              <div className="relative z-20 text-center pt-2">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-sans font-bold bg-black/60 px-4 py-1 rounded-full border border-[#D4AF37]/40">
                  {gateCrestText}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg mt-3">
                  {data.groomName} <span className="text-[#D4AF37] font-light">&</span> {data.brideName}
                </h2>
              </div>

              {/* 3D DOUBLE GATES (Left and Right swinging doors) */}
              <div className="absolute inset-x-4 top-24 bottom-24 flex z-10 pointer-events-none" style={{ perspective: 1000 }}>
                {/* Left Gate Door */}
                <motion.div 
                  animate={isOpening ? { rotateY: -105, x: -30, opacity: 0.1 } : { rotateY: 0, x: 0, opacity: 1 }}
                  transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
                  className="w-1/2 h-full border-r-2 border-[#FFE29A] rounded-l-2xl shadow-2xl flex flex-col justify-between p-4 bg-gradient-to-r from-[#20170F]/90 to-[#3C2E1D]/90 backdrop-blur-md"
                  style={{ transformOrigin: 'left center' }}
                >
                  <div className="text-2xl text-[#FFD700]">⚜</div>
                  <div className="border border-[#D4AF37]/40 h-3/4 rounded-xl flex items-center justify-center">
                    <span className="text-4xl text-[#FFD700]/70">🏛️</span>
                  </div>
                  <div className="text-2xl text-[#FFD700]">⚜</div>
                </motion.div>

                {/* Right Gate Door */}
                <motion.div 
                  animate={isOpening ? { rotateY: 105, x: 30, opacity: 0.1 } : { rotateY: 0, x: 0, opacity: 1 }}
                  transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
                  className="w-1/2 h-full border-l-2 border-[#FFE29A] rounded-r-2xl shadow-2xl flex flex-col justify-between p-4 bg-gradient-to-l from-[#20170F]/90 to-[#3C2E1D]/90 backdrop-blur-md"
                  style={{ transformOrigin: 'right center' }}
                >
                  <div className="text-2xl text-[#FFD700] text-left">⚜</div>
                  <div className="border border-[#D4AF37]/40 h-3/4 rounded-xl flex items-center justify-center">
                    <span className="text-4xl text-[#FFD700]/70">👑</span>
                  </div>
                  <div className="text-2xl text-[#FFD700] text-left">⚜</div>
                </motion.div>
              </div>

              {/* Click to Open Palace Door Button */}
              <div className="relative z-20 pb-4 w-full flex flex-col items-center">
                <motion.button 
                  onClick={handleOpen}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-[#C5A059] via-[#F4D085] to-[#B38728] text-[#110D09] rounded-full font-bold text-sm shadow-[0_0_30px_rgba(212,175,55,0.6)] border-2 border-white/50 flex items-center gap-2 cursor-pointer hover:brightness-110 transition-all"
                >
                  <span>{gatesButtonText}</span>
                </motion.button>
                <p className="text-xs text-[#E5D7B7] mt-3 font-sans opacity-80">
                  {dateArabic}
                </p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OPENED STATE: Full Royal Palace Experience */}
      {isOpen && (
        <main className="relative z-20 max-w-2xl mx-auto px-4 py-16 sm:py-24 space-y-16">
          {/* Ballroom Entrance Header */}
          <section className="text-center space-y-6">
            <RevealWrapper>
              <div className="inline-block p-4 rounded-full bg-[#20170F]/80 border-2 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/40 mb-2">
                <span className="text-3xl">👑</span>
              </div>
              <span className="text-xs tracking-[0.3em] uppercase text-[#D4AF37] block font-sans">
                GRAND ROYAL WEDDING
              </span>
              <h1 className="text-4xl sm:text-6xl font-black text-white drop-shadow-2xl my-3">
                {data.groomName} <span className="text-[#D4AF37] font-light">&</span> {data.brideName}
              </h1>
            </RevealWrapper>

            <RevealWrapper delay={0.15}>
              <div className="p-6 rounded-3xl bg-[#1C140C]/80 border border-[#D4AF37]/40 backdrop-blur-md max-w-lg mx-auto shadow-2xl">
                <p className="text-base sm:text-lg text-[#F4E1BA] leading-relaxed">
                  {ballroomQuote}
                </p>
              </div>
            </RevealWrapper>
          </section>

          {/* Invitation Speech */}
          <RevealWrapper delay={0.25}>
            <section className="p-8 rounded-3xl bg-gradient-to-b from-[#231A10] to-[#161009] border border-[#D4AF37]/30 shadow-2xl text-center space-y-4">
              <span className="text-2xl text-[#D4AF37]">⚜️</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">بطاقة الدعوة الملكية</h2>
              <p className="text-sm sm:text-base text-gray-300 max-w-lg mx-auto leading-relaxed">
                {invitationNote}
              </p>
            </section>
          </RevealWrapper>

          {/* Countdown Section */}
          {data.countdownEnabled && (
            <RevealWrapper delay={0.35}>
              <section className="p-6 sm:p-8 rounded-3xl bg-[#1D150D]/90 border-2 border-[#D4AF37]/40 shadow-2xl text-center space-y-6">
                <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
                  موعد الحفل الملكي
                </span>
                <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto font-sans">
                  {[
                    { label: 'أيام', val: timeLeft.days },
                    { label: 'ساعات', val: timeLeft.hours },
                    { label: 'دقائق', val: timeLeft.minutes },
                    { label: 'ثوانٍ', val: timeLeft.seconds }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-black/60 p-3 sm:p-4 rounded-2xl border border-[#D4AF37]/40 shadow-inner">
                      <span className="text-2xl sm:text-3xl font-black text-[#FFD700] block">{item.val}</span>
                      <span className="text-[10px] sm:text-xs text-gray-300 block mt-1">{item.label}</span>
                    </div>
                  ))}
                </div>
              </section>
            </RevealWrapper>
          )}

          {/* Palace Program / Schedule */}
          <RevealWrapper delay={0.45}>
            <section className="space-y-6">
              <div className="text-center">
                <span className="text-xs text-[#D4AF37] tracking-widest uppercase block mb-1">PROGRAM</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">مراسم وبرنامج الليلة الملكية</h2>
              </div>

              <div className="space-y-4">
                {[
                  { title: t1Title, time: t1Time, desc: t1Desc, icon: '🏛️' },
                  { title: t2Title, time: t2Time, desc: t2Desc, icon: '✨' },
                  { title: t3Title, time: t3Time, desc: t3Desc, icon: '🥂' }
                ].map((ev, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-[#1C140C]/90 border border-[#D4AF37]/30 backdrop-blur-sm shadow-xl hover:border-[#D4AF37] transition-all">
                    <span className="text-3xl p-3 bg-[#2D2012] rounded-2xl border border-[#D4AF37]/40">{ev.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-base sm:text-lg text-[#F4D085]">{ev.title}</h3>
                        <span className="text-xs font-bold text-[#110D09] bg-[#D4AF37] px-2.5 py-1 rounded-full">{ev.time}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-300">{ev.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </RevealWrapper>

          {/* Palace Venue & Location */}
          <RevealWrapper delay={0.55}>
            <section className="p-8 rounded-3xl bg-[#181109] border-2 border-[#D4AF37]/50 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-3xl border border-[#D4AF37]">
                📍
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{data.venueName}</h3>
                <p className="text-sm text-gray-300 max-w-sm mx-auto">{data.venueAddress}</p>
                <div className="mt-3 inline-block px-4 py-1.5 bg-black/50 rounded-full border border-[#D4AF37]/40 text-xs text-[#FFD700]">
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
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#F4D085] to-[#B38728] text-[#110D09] rounded-full font-bold text-sm shadow-2xl hover:scale-105 transition-transform"
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

          {/* RSVP Section */}
          <RevealWrapper delay={0.65}>
            <section className="text-center space-y-6 p-8 rounded-3xl bg-[#1C140C]/90 border border-[#D4AF37]/30 shadow-xl">
              <h3 className="text-2xl font-bold text-white">تأكيد الحضور (RSVP)</h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
                لتنسيق الترتيبات والاستقبال الملكي، يرجى تأكيد حضوركم عبر الواتساب:
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                {data.groomPhone && (
                  <TrackedLink
                    href={`https://wa.me/${data.groomPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً، ألف مبروك لـ ${data.groomName} و${data.brideName}! يسرني تأكيد حضور حفل الزفاف الملكي.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    eventType="GROOM_CONTACT"
                    className="px-6 py-2.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] rounded-full text-xs font-bold border border-[#25D366]/50 shadow-md transition-all flex items-center gap-2"
                  >
                    <span>واتساب العريس ({data.groomName})</span>
                    <span>💬</span>
                  </TrackedLink>
                )}
                {data.bridePhone && (
                  <TrackedLink
                    href={`https://wa.me/${data.bridePhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً، ألف مبروك لـ ${data.groomName} و${data.brideName}! يسرني تأكيد حضور حفل الزفاف الملكي.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    eventType="BRIDE_CONTACT"
                    className="px-6 py-2.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] rounded-full text-xs font-bold border border-[#25D366]/50 shadow-md transition-all flex items-center gap-2"
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
