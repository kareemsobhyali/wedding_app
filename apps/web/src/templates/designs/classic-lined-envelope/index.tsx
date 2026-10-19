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

export const ClassicLinedEnvelopeTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cardSlidOut, setCardSlidOut] = useState(false);
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

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);

    if (data.music && audioRef.current && !isPlayingAudio) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    // Step 1: Flap opens, then card slides out smoothly after flap clears
    setTimeout(() => {
      setCardSlidOut(true);
      confetti({
        particleCount: 75,
        spread: 85,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#E5D9C5', '#FFFFFF', '#C5A059']
      });
    }, 700);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCardSlidOut(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 400);
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
      className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 font-cairo bg-[#EFECE6] text-[#2C241E] selection:bg-amber-300 overflow-x-hidden relative"
      dir="rtl"
      style={{
        backgroundImage: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.7), rgba(235,230,222,0.9))'
      }}
    >
      {/* Background Music */}
      {data.music && (
        <audio ref={audioRef} src={data.music.url} loop preload="auto" />
      )}

      {/* Floating Audio Toggle & Reset */}
      <div className="fixed top-5 left-5 z-50 flex items-center gap-2">
        {data.music && (
          <button
            onClick={toggleAudio}
            className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-[#D5C7B5] flex items-center justify-center text-[#5C4D3C] hover:bg-white active:scale-95 transition"
            title={isPlayingAudio ? 'كتم الصوت' : 'تشغيل الموسيقى'}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-5 h-5 text-[#8C6D4F] animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-neutral-400" />
            )}
          </button>
        )}

        {cardSlidOut && (
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-[#D5C7B5] text-xs font-bold text-[#5C4D3C] flex items-center gap-1.5 hover:bg-white active:scale-95 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة إغلاق المظروف</span>
          </button>
        )}
      </div>

      {/* Top Helper Indicator */}
      <div className="text-center mb-6 space-y-1 z-10">
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#8C765C] block">
          PHYSICAL STATIONERY EXPERIENCE • THE LINED ENVELOPE
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#2C241E] font-normal tracking-wide">
          دعوة الزفاف الملكية
        </h2>
        <p className="text-xs text-[#7A6B5D]">
          {!isOpen 
            ? 'المس الختم الشمعي لفتح المظروف وسحب البطاقة المذهبة' 
            : 'انزلق الكرت الفاخر من جيب المظروف'}
        </p>
      </div>

      {/* THE PHOTOREALISTIC ENVELOPE SUITE */}
      <div className="w-full max-w-[380px] sm:max-w-[440px] relative z-20 flex flex-col items-center">
        
        {/* ENVELOPE BASE WRAPPER */}
        <div 
          className="relative w-full h-[280px] sm:h-[310px] rounded-2xl shadow-2xl overflow-visible cursor-pointer"
          style={{ perspective: '1200px' }}
          onClick={!isOpen ? handleOpenEnvelope : undefined}
        >
          {/* 1. ENVELOPE BACK WALL WITH PATTERNED LUXURY LINER */}
          <div 
            className="absolute inset-0 rounded-2xl overflow-hidden border border-[#D0C4B4] shadow-md z-0"
            style={{
              backgroundColor: '#EDE8DF',
              backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px), radial-gradient(circle, #D4AF37 1px, #FAF7F2 1px)',
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px'
            }}
          >
            {/* Soft inner shadow of envelope interior */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10 pointer-events-none" />
          </div>

          {/* 2. THE INVITATION CARD (SLIDES OUT FROM INSIDE) */}
          <motion.div
            animate={{
              y: cardSlidOut ? -180 : 0,
              scale: cardSlidOut ? 1.03 : 0.94,
              opacity: 1
            }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute inset-x-3 bottom-3 rounded-2xl p-6 sm:p-7 bg-[#FFFDF9] text-[#2C241E] border border-[#E0D5C3] flex flex-col justify-between text-center transition-shadow ${
              cardSlidOut ? 'shadow-2xl z-40' : 'shadow-inner z-10'
            }`}
            style={{
              height: cardSlidOut ? 'auto' : '250px',
              minHeight: cardSlidOut ? '520px' : '250px',
              boxShadow: cardSlidOut ? '0 25px 70px -10px rgba(0,0,0,0.4), 0 0 35px rgba(212,175,55,0.2)' : 'none'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Gilded Edge Border (Beveled Gold Leaf) */}
            <div className="absolute inset-2 border-2 border-[#D4AF37]/50 rounded-xl pointer-events-none p-2 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[9px] text-[#A38953] font-mono tracking-widest uppercase">
                <span>ROYAL SUITE</span>
                <span>✦</span>
                <span>INVITATION</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-[#A38953]">
                <span>⚜</span>
                <span>⚜</span>
              </div>
            </div>

            {/* Top Monogram */}
            <div className="pt-2 z-10">
              <div className="w-12 h-12 rounded-full border border-[#D4AF37]/60 bg-[#FAF6EE] mx-auto flex items-center justify-center shadow-sm">
                <span className="font-serif font-bold text-sm text-[#8C6D37]">
                  {custom.monogram || `${data.groomName.charAt(0)}&${data.brideName.charAt(0)}`}
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#8C6D37] block mt-1.5 uppercase">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
            </div>

            {/* Couple Announcement & Verse */}
            <div className="my-auto z-10 space-y-3 py-2">
              <p className="text-xs font-serif text-[#665747] italic max-w-xs mx-auto leading-relaxed">
                {data.weddingMessage || custom.holyVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
              </p>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                  {custom.invitationIntro || 'نتشرف بدعوتكم لحضور حفل زفاف'}
                </span>
                <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#2C241E]">
                  {data.groomName}
                </h1>
                <span className="text-xl font-serif italic text-[#8C6D37]">&</span>
                <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#2C241E]">
                  {data.brideName}
                </h1>
              </div>

              <p className="text-xs font-serif text-[#5C4F42] leading-relaxed max-w-xs mx-auto pt-1">
                {custom.invitationNote || 'يسعدنا ويشرفنا حضوركم ومشاركتنا أبهى ليالي العمر، لتكتمل سعادتنا برؤيتكم بيننا.'}
              </p>
            </div>

            {/* Date & Venue Box */}
            <div className="z-10 bg-[#FAF7F0] border border-[#E3D7C5] rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-center gap-1.5 font-serif font-bold text-xs text-[#2C241E]">
                <Calendar className="w-3.5 h-3.5 text-[#8C6D37]" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-[11px] font-serif text-[#665747]">
                <Clock className="w-3 h-3 text-[#8C6D37]" />
                <span>{data.weddingTime || 'السابعة والنصف مساءً'}</span>
              </div>
              <div className="pt-1.5 border-t border-[#E3D7C5] text-xs font-serif font-bold text-[#2C241E]">
                <MapPin className="w-3.5 h-3.5 text-[#8C6D37] inline ml-1" />
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
                  className="mt-1 w-full py-2 px-3 rounded-lg bg-[#2C241E] hover:bg-[#3D332B] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition shadow"
                >
                  <MapPin className="w-3 h-3 text-amber-300" />
                  <span>فتح الموقع على Google Maps</span>
                </a>
              )}
            </div>

            {/* WhatsApp RSVP */}
            {data.contactButtonsEnabled && (data.groomWhatsapp || data.brideWhatsapp) && (
              <div className="z-10 pt-2 border-t border-neutral-200 space-y-1.5">
                <span className="text-[10px] font-serif text-neutral-500 block">
                  تأكيد الحضور وتقديم التهاني:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {data.groomWhatsapp && (
                    <a
                      href={`https://wa.me/${data.groomWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.groomName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة! 🎉`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-[11px] flex items-center justify-center gap-1 transition shadow"
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
                      className="py-2 px-2 rounded-lg bg-[#8C6D37] hover:bg-[#9E7C41] text-white font-medium text-[11px] flex items-center justify-center gap-1 transition shadow"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>تهنئة العروس</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* 3. ENVELOPE FRONT POCKET (LEFT, RIGHT, BOTTOM TRIANGLES) */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-2xl">
            {/* Left Pocket Flap */}
            <div 
              className="absolute inset-y-0 left-0 w-1/2 bg-[#E5DFD4] shadow-md"
              style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}
            />
            {/* Right Pocket Flap */}
            <div 
              className="absolute inset-y-0 right-0 w-1/2 bg-[#E2DBD0] shadow-md"
              style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
            />
            {/* Bottom Pocket Flap */}
            <div 
              className="absolute inset-x-0 bottom-0 h-1/2 bg-[#DAD2C5] shadow-lg border-t border-white/20"
              style={{ clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }}
            />
          </div>

          {/* 4. TOP TRIANGULAR FOLD FLAP (FOLDS UPWARDS 180 DEG) */}
          <motion.div
            animate={{ rotateX: isOpen ? 180 : 0 }}
            transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-x-0 top-0 h-1/2 origin-top z-30"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Flap Outer Side (when closed) */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-[#EFECE5] to-[#DCD4C7] shadow-xl border-b border-black/10 flex items-center justify-center"
              style={{ 
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                backfaceVisibility: 'hidden'
              }}
            >
              {/* 3D Embossed Wax Seal */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8C2323] via-[#6B1414] to-[#450A0A] border-2 border-amber-300/40 shadow-2xl flex flex-col items-center justify-center text-amber-200 mt-12 cursor-pointer hover:scale-105 transition">
                <Heart className="w-5 h-5 fill-current" />
                <span className="text-[8px] font-serif font-bold tracking-widest mt-0.5">OPEN</span>
              </div>
            </div>

            {/* Flap Inner Side (Patterned Liner revealed when flipped) */}
            <div 
              className="absolute inset-0 bg-[#EDE8DF] shadow-inner"
              style={{ 
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                transform: 'rotateX(180deg)',
                backfaceVisibility: 'hidden',
                backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px), radial-gradient(circle, #D4AF37 1px, #FAF7F2 1px)',
                backgroundSize: '24px 24px'
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
