'use client';

import React, { useState, useRef, useEffect } from "react";
import { TemplateRenderContext } from "../../types";
import { TrackedLink } from "../../utils/TrackedLink";
import { RevealWrapper } from "../../utils/useScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export const CelestialStardustTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const custom = data.customData || {};

  const celestialSubtitle = custom.celestialSubtitle || 'WRITTEN IN THE STARS ✨';
  const moonQuote = custom.moonQuote || '«تلاقت الأرواح تحت سماء كُتبت تفاصيل حبها بنور النجوم»';
  const invitationNote = custom.invitationNote || 'تحت بريق النجوم وضوء القمر، نتشرف بدعوتكم لمشاركتنا ليلة العمر وبداية رحلتنا الأبدية معاً.';
  const dressCode = custom.dressCode || 'مسائي أنيق / Midnight Blue or Black Formal';
  const closingMessage = custom.closingMessage || 'بوجودكم تسطع ليلتنا وتكتمل سعادتنا بنجوم حضوركم 🌙';

  const t1Title = custom.timeline1Title || 'استقبال ضوء النجوم';
  const t1Time = custom.timeline1Time || '07:00 PM';
  const t1Desc = custom.timeline1Desc || 'استقبال وترحيب وعزف كلاسيكي هادئ تحت الأضواء';

  const t2Title = custom.timeline2Title || 'مراسم عقد القران والزفة';
  const t2Time = custom.timeline2Time || '08:30 PM';
  const t2Desc = custom.timeline2Desc || 'لحظات العهد وتتويج الحب ببركة الجمع الكريم';

  const t3Title = custom.timeline3Title || 'العشاء والاحتفال';
  const t3Time = custom.timeline3Time || '10:00 PM';
  const t3Desc = custom.timeline3Desc || 'مأدبة عشاء واحتفال ساحر حتى منتصف الليل';

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
        particleCount: 110,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#FFD700', '#F0E68C', '#FFFFFF', '#64B5F6', '#1E3A8A']
      });
    }, 700);

    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
    }, 1500);
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
    <div className="relative min-h-screen bg-[#070B19] text-[#E0E7FF] font-serif overflow-x-hidden select-none" dir="rtl">
      {/* Background Ambience: Night Stars & Moon Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-25 bg-cover bg-center"
        style={{ backgroundImage: `url('/assets/templates/celestial-stardust.jpg')` }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(30,58,138,0.3)_0%,_transparent_70%)]" />

      {/* Audio Button */}
      {data.music && (
        <>
          <audio ref={audioRef} src={data.music.url} loop />
          <button 
            onClick={toggleAudio}
            className="fixed top-5 left-5 z-50 p-3 bg-[#0B132B]/80 backdrop-blur-md rounded-full border border-[#FFD700]/50 text-[#FFD700] shadow-xl hover:scale-110 transition-transform"
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
          className="fixed bottom-6 left-6 z-50 px-4 py-2 bg-[#0B132B]/90 backdrop-blur-md border border-[#FFD700]/70 text-[#FFD700] text-xs font-bold rounded-full shadow-2xl hover:bg-[#FFD700] hover:text-[#070B19] transition-all flex items-center gap-2"
        >
          <span>↺</span>
          <span>إعادة مشاهدة سماء النجوم</span>
        </button>
      )}

      {/* UNOPENED STATE: Celestial Card with Shimmering Moon & Constellations */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-gradient-to-b from-[#04060E] via-[#0A1026] to-[#04060E]"
          >
            <motion.div 
              onClick={handleOpen}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full max-w-sm sm:max-w-md aspect-[3/4.2] rounded-3xl p-6 shadow-2xl cursor-pointer border-2 border-[#FFD700]/50 overflow-hidden flex flex-col items-center justify-between text-center transition-all"
              style={{
                background: 'linear-gradient(135deg, #070F26 0%, #101E4A 50%, #060B1E 100%)',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.95), inset 0 0 50px rgba(16, 30, 74, 0.8)'
              }}
            >
              {/* Starry Dust Grid */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#FFD700_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Constellation Lines & Corner Stars */}
              <div className="absolute inset-3 rounded-2xl border border-[#FFD700]/30 pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between text-[#FFD700] text-lg">
                  <span>✦</span><span>✦</span>
                </div>
                <div className="flex justify-between text-[#FFD700] text-lg">
                  <span>✦</span><span>✦</span>
                </div>
              </div>

              {/* Top Subtitle */}
              <div className="relative z-10 pt-4 flex flex-col items-center">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#FFD700] font-sans font-bold bg-white/5 px-4 py-1 rounded-full border border-[#FFD700]/30">
                  {celestialSubtitle}
                </span>
              </div>

              {/* Glowing Golden Crescent Moon & Names */}
              <div className="relative z-10 my-auto flex flex-col items-center">
                <motion.div 
                  animate={isOpening ? { scale: 1.5, opacity: 0 } : { rotate: [0, 5, 0, -5, 0], scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 text-[#FFD700] drop-shadow-[0_0_25px_rgba(255,215,0,0.8)]"
                >
                  🌙
                </motion.div>

                <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-xl mb-2">
                  {data.groomName} <span className="text-[#FFD700] font-light">&</span> {data.brideName}
                </h1>

                <p className="text-xs text-[#C7D2FE] max-w-xs mx-auto leading-relaxed">
                  دعوة زفاف تحت أضواء النجوم المتلألئة
                </p>
              </div>

              {/* Bottom Date & Click Prompt */}
              <div className="relative z-10 pb-4 w-full">
                <motion.div 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#070B19] font-bold text-xs shadow-[0_0_20px_rgba(255,215,0,0.5)] mb-3"
                >
                  <span>افتح بطاقة الدعوة الفلكية</span>
                  <span>✨</span>
                </motion.div>
                <p className="text-xs text-[#FFD700] font-bold tracking-wider">
                  {dateArabic}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OPENED STATE: Full Celestial Stardust Experience */}
      {isOpen && (
        <main className="relative z-20 max-w-2xl mx-auto px-4 py-16 sm:py-24 space-y-16">
          {/* Header Celestial Icon & Blessing */}
          <section className="text-center space-y-6">
            <RevealWrapper>
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#0B132B] border-2 border-[#FFD700] flex items-center justify-center text-4xl shadow-[0_0_35px_rgba(255,215,0,0.4)]">
                🌙
              </div>
            </RevealWrapper>

            <RevealWrapper delay={0.15}>
              <div className="p-6 rounded-3xl bg-[#0B132B]/80 border border-[#FFD700]/30 backdrop-blur-md max-w-lg mx-auto shadow-2xl">
                <p className="text-base sm:text-lg text-[#FDE047] leading-relaxed">
                  {moonQuote}
                </p>
              </div>
            </RevealWrapper>
          </section>

          {/* Names & Celestial Invitation Note */}
          <section className="text-center py-4 space-y-4">
            <RevealWrapper delay={0.25}>
              <span className="text-xs text-[#FFD700] tracking-[0.3em] uppercase block font-sans">
                A CELESTIAL UNION
              </span>
              <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-wide drop-shadow-2xl my-3">
                {data.groomName} <span className="text-[#FFD700] font-light">&</span> {data.brideName}
              </h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-md mx-auto leading-relaxed">
                {invitationNote}
              </p>
            </RevealWrapper>
          </section>

          {/* Countdown Section */}
          {data.countdownEnabled && (
            <RevealWrapper delay={0.35}>
              <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0F1C42]/80 to-[#070B19]/90 border border-[#FFD700]/40 shadow-2xl text-center space-y-6">
                <span className="text-xs uppercase tracking-widest text-[#FFD700]">
                  العد التنازلي لليلة العمر
                </span>
                <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto font-sans">
                  {[
                    { label: 'أيام', val: timeLeft.days },
                    { label: 'ساعات', val: timeLeft.hours },
                    { label: 'دقائق', val: timeLeft.minutes },
                    { label: 'ثوانٍ', val: timeLeft.seconds }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-[#070B19]/80 p-3 sm:p-4 rounded-2xl border border-[#FFD700]/30 shadow-md">
                      <span className="text-2xl sm:text-3xl font-black text-[#FFD700] block">{item.val}</span>
                      <span className="text-[10px] sm:text-xs text-gray-300 block mt-1">{item.label}</span>
                    </div>
                  ))}
                </div>
              </section>
            </RevealWrapper>
          )}

          {/* Program Under The Stars */}
          <RevealWrapper delay={0.45}>
            <section className="space-y-6">
              <div className="text-center">
                <span className="text-xs text-[#FFD700] tracking-widest uppercase block mb-1">PROGRAM</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">برنامج الليلة الساهرة</h2>
              </div>

              <div className="space-y-4">
                {[
                  { title: t1Title, time: t1Time, desc: t1Desc, icon: '🌟' },
                  { title: t2Title, time: t2Time, desc: t2Desc, icon: '💍' },
                  { title: t3Title, time: t3Time, desc: t3Desc, icon: '✨' }
                ].map((ev, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-[#0B132B]/80 border border-[#FFD700]/30 backdrop-blur-sm shadow-xl hover:border-[#FFD700] transition-all">
                    <span className="text-3xl p-3 bg-[#101E4A] rounded-2xl border border-[#FFD700]/40">{ev.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-base sm:text-lg text-[#FDE047]">{ev.title}</h3>
                        <span className="text-xs font-bold text-[#070B19] bg-[#FFD700] px-2.5 py-1 rounded-full">{ev.time}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-300">{ev.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </RevealWrapper>

          {/* Location & Map Section */}
          <RevealWrapper delay={0.55}>
            <section className="p-8 rounded-3xl bg-[#0B132B] border-2 border-[#FFD700]/40 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FFD700]/20 flex items-center justify-center text-3xl border border-[#FFD700]">
                📍
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{data.venueName}</h3>
                <p className="text-sm text-gray-300 max-w-sm mx-auto">{data.venueAddress}</p>
                <div className="mt-3 inline-block px-4 py-1.5 bg-black/50 rounded-full border border-[#FFD700]/30 text-xs text-[#FFD700]">
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
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#070B19] rounded-full font-bold text-sm shadow-2xl hover:scale-105 transition-transform"
                  >
                    <span>فتح موقع الحفل على الخريطة</span>
                    <span>🗺️</span>
                  </TrackedLink>
                </div>
              )}

              {dressCode && (
                <div className="pt-4 border-t border-[#FFD700]/20 text-xs text-gray-400">
                  <span className="text-[#FFD700] font-bold">قواعد اللباس (Dress Code):</span> {dressCode}
                </div>
              )}
            </section>
          </RevealWrapper>

          {/* RSVP / WhatsApp */}
          <RevealWrapper delay={0.65}>
            <section className="text-center space-y-6 p-8 rounded-3xl bg-[#0B132B]/90 border border-[#FFD700]/30 shadow-xl">
              <h3 className="text-2xl font-bold text-white">تأكيد الحضور (RSVP)</h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
                لتجهيز أماكنكم ومشاركتنا سهرتنا المميزة، يرجى تأكيد حضوركم عبر الواتساب:
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                {data.groomPhone && (
                  <TrackedLink
                    href={`https://wa.me/${data.groomPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك زفاف ${data.groomName} و${data.brideName}! يسعدني تأكيد الحضور.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    eventType="GROOM_CONTACT"
                    className="px-6 py-2.5 bg-indigo-900/80 hover:bg-indigo-800 text-white rounded-full text-xs font-bold border border-indigo-400 shadow-md transition-all flex items-center gap-2"
                  >
                    <span>واتساب العريس ({data.groomName})</span>
                    <span>💬</span>
                  </TrackedLink>
                )}
                {data.bridePhone && (
                  <TrackedLink
                    href={`https://wa.me/${data.bridePhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك زفاف ${data.groomName} و${data.brideName}! يسعدني تأكيد الحضور.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    eventType="BRIDE_CONTACT"
                    className="px-6 py-2.5 bg-indigo-900/80 hover:bg-indigo-800 text-white rounded-full text-xs font-bold border border-indigo-400 shadow-md transition-all flex items-center gap-2"
                  >
                    <span>واتساب العروس ({data.brideName})</span>
                    <span>💬</span>
                  </TrackedLink>
                )}
              </div>

              <div className="pt-6 border-t border-[#FFD700]/20">
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
