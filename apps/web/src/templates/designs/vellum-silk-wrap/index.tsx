'use client';

import React, { useState, useRef } from 'react';
import { TemplateRenderContext } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  MapPin, 
  Calendar, 
  Clock, 
  RotateCcw, 
  MessageCircle, 
  Sparkles,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VellumSilkWrapTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleUntieAndOpen = () => {
    if (isOpen) return;
    setIsOpen(true);

    if (data.music && audioRef.current && !isPlayingAudio) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    confetti({
      particleCount: 70,
      spread: 85,
      origin: { y: 0.55 },
      colors: ['#D4AF37', '#FFF5EE', '#E6D7C3', '#FFFFFF']
    });
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
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
      className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 font-cairo bg-[#FAF7F2] text-[#2D2620] selection:bg-rose-200 overflow-x-hidden relative"
      dir="rtl"
    >
      {/* Background Music */}
      {data.music && (
        <audio ref={audioRef} src={data.music.url} loop preload="auto" />
      )}

      {/* Floating Audio & Reset */}
      <div className="fixed top-5 left-5 z-50 flex items-center gap-2">
        {data.music && (
          <button
            onClick={toggleAudio}
            className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-[#E3D7C5] flex items-center justify-center text-[#5C4D3C] hover:bg-white active:scale-95 transition"
            title={isPlayingAudio ? 'كتم الصوت' : 'تشغيل الموسيقى'}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-5 h-5 text-[#8C6D4F] animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-neutral-400" />
            )}
          </button>
        )}

        {isOpen && (
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-[#E3D7C5] text-xs font-bold text-[#5C4D3C] flex items-center gap-1.5 hover:bg-white active:scale-95 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ربط الغلاف الشفاف</span>
          </button>
        )}
      </div>

      {/* Top Helper */}
      <div className="text-center mb-6 space-y-1 z-10">
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#8C765C] block">
          TRANSLUCENT VELLUM & SILK RIBBON
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#2D2620] font-normal tracking-wide">
          غلاف الكلك الشفاف والشريط الحريري
        </h2>
        <p className="text-xs text-[#7A6B5D]">
          {!isOpen 
            ? 'المس الشريط الحريري لفك العقدة وفتح أجنحة الغلاف الشفاف' 
            : 'انفتحت أجنحة ورق الكلك الشفاف لتكشف بطاقة الزفاف'}
        </p>
      </div>

      {/* THE VELLUM WRAP CONTAINER */}
      <div 
        className="w-full max-w-[400px] sm:max-w-[450px] relative rounded-3xl shadow-2xl overflow-hidden cursor-pointer bg-white"
        style={{
          boxShadow: '0 25px 70px -15px rgba(0,0,0,0.18)',
          perspective: '1200px'
        }}
        onClick={!isOpen ? handleUntieAndOpen : undefined}
      >
        {/* UNDERNEATH: THE GOLD-STAMPED INVITATION CARD */}
        <div className="p-7 sm:p-9 text-center space-y-5 bg-[#FFFDF9] border border-[#E8DEC8]">
          {/* Gilded Top Emblem */}
          <div className="space-y-2 border-b border-[#E8DEC8] pb-4">
            <span className="text-xs font-mono tracking-widest text-[#8C6D4F] uppercase font-bold block">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
            <p className="text-xs font-serif text-[#6B5A4B] italic max-w-xs mx-auto leading-relaxed">
              {data.weddingMessage || custom.holyVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
            </p>
          </div>

          {/* Couple Names */}
          <div className="space-y-2 my-4">
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              {custom.invitationIntro || 'معاً نبدأ أجمل حكايات العمر'}
            </span>
            <div className="space-y-0.5">
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#2D2620]">
                {data.groomName}
              </h1>
              <span className="text-xl font-serif italic text-[#8C6D4F] block my-1">&</span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#2D2620]">
                {data.brideName}
              </h1>
            </div>
            <p className="text-xs font-serif text-[#6B5A4B] leading-relaxed max-w-sm mx-auto pt-1">
              {custom.invitationNote || 'يسعدنا ويشرفنا حضوركم ومشاركتنا فرحة العمر وتتويج مسيرة الحب في ليلتنا، لتكتمل سعادتنا برؤيتكم بيننا.'}
            </p>
          </div>

          {/* Date & Venue Box */}
          <div className="bg-[#FAF7F0] border border-[#E3D7C5] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-center gap-1.5 font-serif font-bold text-xs text-[#2D2620]">
              <Calendar className="w-3.5 h-3.5 text-[#8C6D4F]" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-[11px] font-serif text-[#6B5A4B]">
              <Clock className="w-3 h-3 text-[#8C6D4F]" />
              <span>{data.weddingTime || 'السابعة والنصف مساءً'}</span>
            </div>
            <div className="pt-1.5 border-t border-[#E3D7C5] text-xs font-serif font-bold text-[#2D2620]">
              <MapPin className="w-3.5 h-3.5 text-[#8C6D4F] inline ml-1" />
              <span>{data.venueName}</span>
              {data.venueAddress && (
                <p className="text-[10px] font-normal text-neutral-500 mt-0.5">{data.venueAddress}</p>
              )}
            </div>

            {data.googleMapsUrl && (
              <a
                href={data.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 w-full py-2 px-3 rounded-xl bg-[#2D2620] hover:bg-[#3E352D] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition shadow"
              >
                <MapPin className="w-3 h-3 text-amber-300" />
                <span>فتح الموقع على Google Maps</span>
              </a>
            )}
          </div>

          {/* WhatsApp RSVP */}
          {data.contactButtonsEnabled && (data.groomWhatsapp || data.brideWhatsapp) && (
            <div className="pt-3 border-t border-neutral-200 space-y-1.5">
              <span className="text-[10px] font-serif text-neutral-500 block">
                تأكيد الحضور وتقديم التهاني:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {data.groomWhatsapp && (
                  <a
                    href={`https://wa.me/${data.groomWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.groomName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة! 🎉`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-[11px] flex items-center justify-center gap-1 transition shadow"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>تهنئة العريس</span>
                  </a>
                )}
                {data.brideWhatsapp && (
                  <a
                    href={`https://wa.me/${data.brideWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.brideName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة! 🌸`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 rounded-xl bg-[#8C6D4F] hover:bg-[#9E7C41] text-white font-medium text-[11px] flex items-center justify-center gap-1 transition shadow"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>تهنئة العروس</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* OVERLAY: TRANSLUCENT VELLUM WINGS (LEFT & RIGHT) */}
        {/* Left Vellum Wing */}
        <motion.div
          animate={{
            rotateY: isOpen ? -110 : 0,
            opacity: isOpen ? 0 : 1
          }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-y-0 left-0 w-1/2 origin-left z-30 pointer-events-none border-r border-white/60"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(8px)',
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.8)'
          }}
        />

        {/* Right Vellum Wing */}
        <motion.div
          animate={{
            rotateY: isOpen ? 110 : 0,
            opacity: isOpen ? 0 : 1
          }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-y-0 right-0 w-1/2 origin-right z-30 pointer-events-none border-l border-white/60"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(8px)',
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.8)'
          }}
        />

        {/* SATIN RIBBON BOW & WAX MEDALLION AT THE HORIZONTAL CENTER */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center pointer-events-none"
            >
              {/* Horizontal Satin Ribbon Band */}
              <div className="absolute w-full h-8 bg-gradient-to-r from-[#D4AF37]/90 via-[#F3E5AB] to-[#D4AF37]/90 shadow-md border-y border-amber-300/40" />

              {/* Center Bow / Seal */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#8C2A2A] via-[#A83838] to-[#6E1C1C] border-2 border-amber-300 shadow-xl flex flex-col items-center justify-center text-amber-200 z-10 animate-pulse">
                <Heart className="w-5 h-5 fill-current" />
                <span className="text-[8px] font-mono tracking-wider font-bold mt-0.5">UNTIE</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
