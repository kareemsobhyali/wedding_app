'use client';

import React, { useState, useRef, useEffect } from "react";
import { TemplateRenderContext } from "../../types";
import { TrackedLink } from "../../utils/TrackedLink";
import { RevealWrapper } from "../../utils/useScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export const PearlBoxTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const custom = data.customData || {};

  const boxTitle = custom.boxTitle || 'THE ROYAL WEDDING BOX 🦪';
  const openBoxButtonText = custom.openBoxButtonText || 'افتح صندوق الدعوة الفاخر ✨';
  const welcomeMessage = custom.welcomeMessage || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا»';
  const invitationNote = custom.invitationNote || 'بكل مشاعر الحب والامتنان، ندعوكم لمشاركتنا فرحة العمر وتتويج مسيرة الحب في ليلتنا المنتظرة.';
  const dressCode = custom.dressCode || 'أناقة بيضاء أو ألوان ناعمة / Elegant & Pastel Formal';
  const closingMessage = custom.closingMessage || 'فرحتنا لا تكتمل إلا بوجودكم ورؤيتكم بيننا 🤍';

  const t1Title = custom.timeline1Title || 'استقبال الزهور والياسمين';
  const t1Time = custom.timeline1Time || '07:30 PM';
  const t1Desc = custom.timeline1Desc || 'مراسم الترحيب بعبق الياسمين ومشروبات الضيافة الفاخرة';

  const t2Title = custom.timeline2Title || 'الزفة وعقد القران';
  const t2Time = custom.timeline2Time || '08:45 PM';
  const t2Desc = custom.timeline2Desc || 'لحظات مباركة الجمع وبداية مسيرة الحب';

  const t3Title = custom.timeline3Title || 'العشاء الملكي';
  const t3Time = custom.timeline3Time || '10:15 PM';
  const t3Desc = custom.timeline3Desc || 'بوفيه عشاء مفتوح على أنغام الموسيقى الهادئة';

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
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#FFFFFF', '#FDF8F0', '#EADBC8', '#D4AF37', '#F3E5AB']
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
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#4A4036] font-serif overflow-x-hidden select-none" dir="rtl">
      {/* Background Ambience: Ivory Silk Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url('/assets/templates/pearl-box.jpg')` }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)]" />

      {/* Audio Button */}
      {data.music && (
        <>
          <audio ref={audioRef} src={data.music.url} loop />
          <button 
            onClick={toggleAudio}
            className="fixed top-5 left-5 z-50 p-3 bg-white/80 backdrop-blur-md rounded-full border border-[#D4AF37]/50 text-[#8E6E53] shadow-lg hover:scale-110 transition-transform"
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
          className="fixed bottom-6 left-6 z-50 px-4 py-2 bg-white/95 backdrop-blur-md border border-[#D4AF37]/60 text-[#8E6E53] text-xs font-bold rounded-full shadow-2xl hover:bg-[#8E6E53] hover:text-white transition-all flex items-center gap-2"
        >
          <span>↺</span>
          <span>إعادة فتح الصندوق اللؤلؤي</span>
        </button>
      )}

      {/* UNOPENED STATE: Pearlescent Box with Pearl Ribbon */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-gradient-to-b from-[#F2ECE4] via-[#FAF7F2] to-[#EAE2D8]"
          >
            <motion.div 
              onClick={handleOpen}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full max-w-sm sm:max-w-md aspect-[3/4.2] rounded-[2.5rem] p-6 shadow-[0_25px_60px_-15px_rgba(142,110,83,0.3)] cursor-pointer border-4 border-white/80 overflow-hidden flex flex-col items-center justify-between text-center transition-all bg-white"
            >
              {/* Pearl Pattern Inset */}
              <div className="absolute inset-3 rounded-[2rem] border-2 border-[#D4AF37]/30 pointer-events-none flex flex-col justify-between p-3 bg-gradient-to-b from-white/90 via-[#FDFBF7]/90 to-white/90">
                <div className="flex justify-between text-[#D4AF37] text-base opacity-70">
                  <span>🦪</span><span>🦪</span>
                </div>
                <div className="flex justify-between text-[#D4AF37] text-base opacity-70">
                  <span>🦪</span><span>🦪</span>
                </div>
              </div>

              {/* Box Top Header */}
              <div className="relative z-10 pt-4 flex flex-col items-center">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#8E6E53] font-sans font-bold bg-[#F4EBE1] px-4 py-1 rounded-full border border-[#D4AF37]/30">
                  {boxTitle}
                </span>
              </div>

              {/* Box Lid Center Elements */}
              <div className="relative z-10 my-auto flex flex-col items-center">
                <motion.div 
                  animate={isOpening ? { y: -80, opacity: 0 } : { y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-white via-[#FDFBF7] to-[#F3E5AB] border-2 border-[#D4AF37] flex items-center justify-center text-3xl shadow-xl shadow-[#D4AF37]/20 mb-4"
                >
                  🌸
                </motion.div>

                <h1 className="text-3xl sm:text-4xl font-bold text-[#4A4036] drop-shadow-sm mb-2">
                  {data.groomName} <span className="text-[#D4AF37] font-normal">&</span> {data.brideName}
                </h1>

                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  يسرنا أن نشارككم أسعد لحظات العمر في حفل زفافنا
                </p>
              </div>

              {/* Bottom Silk Bow & Button */}
              <div className="relative z-10 pb-4 w-full">
                <motion.div 
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ repeat: Infinity, duration: 2.2 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#BC8A5F] text-white font-bold text-xs shadow-xl shadow-[#D4A373]/30 mb-3"
                >
                  <span>{openBoxButtonText}</span>
                </motion.div>
                <p className="text-xs text-[#8E6E53] font-bold tracking-wider">
                  {dateArabic}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OPENED STATE: Full Pearl Box & Silk Experience */}
      {isOpen && (
        <main className="relative z-20 max-w-2xl mx-auto px-4 py-16 sm:py-24 space-y-16">
          {/* Header Pearl Monogram */}
          <section className="text-center space-y-6">
            <RevealWrapper>
              <div className="w-24 h-24 mx-auto rounded-full bg-white border-2 border-[#D4AF37] flex items-center justify-center text-4xl shadow-xl shadow-[#D4AF37]/20">
                🤍
              </div>
            </RevealWrapper>

            <RevealWrapper delay={0.15}>
              <div className="p-6 rounded-3xl bg-white border border-[#D4AF37]/30 shadow-sm max-w-lg mx-auto">
                <p className="text-base sm:text-lg text-[#5A4D41] leading-relaxed">
                  {welcomeMessage}
                </p>
              </div>
            </RevealWrapper>
          </section>

          {/* Names & Invitation Card */}
          <section className="text-center py-4 space-y-4">
            <RevealWrapper delay={0.25}>
              <span className="text-xs text-[#8E6E53] tracking-[0.3em] uppercase block font-sans font-bold">
                WEDDING INVITATION
              </span>
              <h1 className="text-4xl sm:text-6xl font-bold text-[#4A4036] tracking-wide drop-shadow-sm my-3">
                {data.groomName} <span className="text-[#D4AF37] font-light">&</span> {data.brideName}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto leading-relaxed">
                {invitationNote}
              </p>
            </RevealWrapper>
          </section>

          {/* Countdown Section */}
          {data.countdownEnabled && (
            <RevealWrapper delay={0.35}>
              <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D4AF37]/30 shadow-xl text-center space-y-6">
                <span className="text-xs uppercase tracking-widest text-[#8E6E53] font-bold">
                  العد التنازلي لليوم المنتظر
                </span>
                <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto font-sans">
                  {[
                    { label: 'أيام', val: timeLeft.days },
                    { label: 'ساعات', val: timeLeft.hours },
                    { label: 'دقائق', val: timeLeft.minutes },
                    { label: 'ثوانٍ', val: timeLeft.seconds }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-[#FAF7F2] p-3 sm:p-4 rounded-2xl border border-[#D4AF37]/20 shadow-sm">
                      <span className="text-2xl sm:text-3xl font-black text-[#8E6E53] block">{item.val}</span>
                      <span className="text-[10px] sm:text-xs text-gray-500 block mt-1">{item.label}</span>
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
                <span className="text-xs text-[#8E6E53] tracking-widest uppercase block mb-1 font-bold">PROGRAM</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#4A4036]">جدول فعاليات الحفل</h2>
              </div>

              <div className="space-y-4">
                {[
                  { title: t1Title, time: t1Time, desc: t1Desc, icon: '🌸' },
                  { title: t2Title, time: t2Time, desc: t2Desc, icon: '💍' },
                  { title: t3Title, time: t3Time, desc: t3Desc, icon: '🥂' }
                ].map((ev, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#D4AF37]/25 shadow-sm hover:border-[#D4AF37] transition-all">
                    <span className="text-3xl p-3 bg-[#FAF7F2] rounded-2xl border border-[#D4AF37]/30">{ev.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-base sm:text-lg text-[#4A4036]">{ev.title}</h3>
                        <span className="text-xs font-bold text-[#8E6E53] bg-[#F4EBE1] px-2.5 py-1 rounded-full">{ev.time}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">{ev.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </RevealWrapper>

          {/* Location & Map Section */}
          <RevealWrapper delay={0.55}>
            <section className="p-8 rounded-3xl bg-white border-2 border-[#D4AF37]/30 shadow-xl text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF7F2] flex items-center justify-center text-3xl border border-[#D4AF37]/40">
                📍
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#4A4036] mb-2">{data.venueName}</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">{data.venueAddress}</p>
                <div className="mt-3 inline-block px-4 py-1.5 bg-[#FAF7F2] rounded-full border border-[#D4AF37]/20 text-xs text-[#8E6E53] font-bold">
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
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#BC8A5F] text-white rounded-full font-bold text-sm shadow-xl hover:scale-105 transition-transform"
                  >
                    <span>فتح موقع القاعة على الخريطة</span>
                    <span>🗺️</span>
                  </TrackedLink>
                </div>
              )}

              {dressCode && (
                <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <span className="text-[#8E6E53] font-bold">قواعد اللباس (Dress Code):</span> {dressCode}
                </div>
              )}
            </section>
          </RevealWrapper>

          {/* RSVP / WhatsApp */}
          <RevealWrapper delay={0.65}>
            <section className="text-center space-y-6 p-8 rounded-3xl bg-white border border-[#D4AF37]/30 shadow-xl">
              <h3 className="text-2xl font-bold text-[#4A4036]">تأكيد الحضور (RSVP)</h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                لتجهيز أماكنكم ومشاركتنا ليلتنا اللؤلؤية، يرجى تأكيد حضوركم عبر الواتساب:
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                {data.groomPhone && (
                  <TrackedLink
                    href={`https://wa.me/${data.groomPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك زفاف ${data.groomName} و${data.brideName}! يسعدني تأكيد الحضور.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    eventType="GROOM_CONTACT"
                    className="px-6 py-2.5 bg-[#F4EBE1] hover:bg-[#EADBC8] text-[#8E6E53] rounded-full text-xs font-bold border border-[#D4AF37]/40 shadow-sm transition-all flex items-center gap-2"
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
                    className="px-6 py-2.5 bg-[#F4EBE1] hover:bg-[#EADBC8] text-[#8E6E53] rounded-full text-xs font-bold border border-[#D4AF37]/40 shadow-sm transition-all flex items-center gap-2"
                  >
                    <span>واتساب العروس ({data.brideName})</span>
                    <span>💬</span>
                  </TrackedLink>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100">
                <p className="text-base font-bold text-[#8E6E53]">
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
