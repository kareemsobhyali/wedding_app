'use client';

import React, { useState, useRef } from 'react';
import { TemplateRenderContext } from '../../types';
import { motion } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  RotateCw, 
  MessageCircle,
  QrCode,
  ShieldAlert,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LuxuryFlipCardTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isFlipped, setIsFlipped] = useState(false);
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

  const handleFlip = () => {
    const nextState = !isFlipped;
    setIsFlipped(nextState);

    if (data.music && audioRef.current && !isPlayingAudio) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    if (nextState) {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F3E5AB', '#FFFFFF', '#AA771C']
      });
    }
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

  // Color swatches for Dress code
  const dressSwatches = (custom.dressColors || '#D4AF37,#1E3A2F,#FFFFFF,#2C2C2C').split(',');

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 font-cairo bg-gradient-to-br from-[#0D131A] via-[#151D26] to-[#0A0E14] text-white selection:bg-amber-400/30 overflow-hidden relative"
      dir="rtl"
    >
      {/* Background Audio */}
      {data.music && (
        <audio ref={audioRef} src={data.music.url} loop preload="auto" />
      )}

      {/* Floating Audio Toggle */}
      {data.music && (
        <div className="fixed top-5 left-5 z-50">
          <button
            onClick={toggleAudio}
            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md shadow-lg border border-amber-400/30 flex items-center justify-center text-amber-300 hover:bg-white/20 active:scale-95 transition"
            title={isPlayingAudio ? 'كتم الصوت' : 'تشغيل الموسيقى'}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-5 h-5 text-amber-400 animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-neutral-400" />
            )}
          </button>
        </div>
      )}

      {/* Ambient Foil Light in Background */}
      <div className="absolute w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Helper Indicator */}
      <div className="mb-4 sm:mb-6 text-center z-10 space-y-1">
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-amber-300/80 block">
          3D DOUBLE-SIDED LUXURY FOIL CARD
        </span>
        <p className="text-xs text-neutral-400 flex items-center justify-center gap-1.5">
          <RotateCw className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{isFlipped ? 'انقر على الكرت للعودة إلى الوجه الرئيسي' : 'انقر على الكرت لقلبه ومعاينة تفاصيل الحفل'}</span>
        </p>
      </div>

      {/* 3D Flipping Card Container */}
      <div 
        className="w-full max-w-[380px] sm:max-w-[420px] h-[580px] sm:h-[620px] cursor-pointer"
        style={{ perspective: '1400px' }}
        onClick={handleFlip}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1] }}
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* ===================== SIDE A: FRONT OF THE CARD ===================== */}
          <div 
            className="absolute inset-0 w-full h-full rounded-[2.5rem] p-7 sm:p-9 flex flex-col justify-between text-center border-2 border-amber-300/40 shadow-2xl overflow-hidden bg-gradient-to-b from-[#182330] via-[#101924] to-[#0A1017]"
            style={{
              backfaceVisibility: 'hidden',
              boxShadow: '0 25px 70px -15px rgba(0,0,0,0.85), inset 0 0 40px rgba(212,175,55,0.1)'
            }}
          >
            {/* Outer Gilded Inset Border */}
            <div className="absolute inset-3 border border-amber-400/30 rounded-[2rem] pointer-events-none p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[10px] text-amber-400/60 font-mono tracking-widest">
                <span>ROYAL CARD</span>
                <span>✦</span>
                <span>N° {weddingDate.getFullYear()}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-amber-400/60">
                <span>⚜</span>
                <span>⚜</span>
              </div>
            </div>

            {/* Top Monogram Seal */}
            <div className="pt-2 z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-2 border-amber-400/50 bg-gradient-to-tr from-amber-500/20 to-transparent flex items-center justify-center shadow-lg mb-2">
                <span className="text-xl font-serif font-bold text-amber-300 tracking-wider">
                  {custom.monogram || `${data.groomName.charAt(0)}&${data.brideName.charAt(0)}`}
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-300/80 uppercase">
                {custom.frontSubtitle || 'THE WEDDING CELEBRATION OF'}
              </span>
            </div>

            {/* Main Couple Names */}
            <div className="my-auto z-10 space-y-4">
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 drop-shadow-md">
                  {data.groomName}
                </h1>
                <div className="flex items-center justify-center gap-3 text-amber-400/60 my-1">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-400/40" />
                  <span className="font-serif italic text-xl text-amber-300">&</span>
                  <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-400/40" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 drop-shadow-md">
                  {data.brideName}
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300/90 font-serif max-w-xs mx-auto leading-relaxed pt-2">
                {data.weddingMessage || custom.invitationQuote || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
              </p>
            </div>

            {/* Bottom Date & Flip CTA */}
            <div className="pb-2 z-10 space-y-3">
              <div className="py-2.5 px-4 rounded-xl bg-amber-400/10 border border-amber-400/20 backdrop-blur-sm">
                <div className="text-xs font-serif text-amber-200 font-bold">{formattedDate}</div>
                <div className="text-[11px] text-neutral-400">{data.weddingTime || 'السابعة والنصف مساءً'}</div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-amber-400 tracking-wider uppercase pt-1">
                <RotateCw className="w-3.5 h-3.5" />
                <span>TAP TO FLIP CARD ❯</span>
              </div>
            </div>
          </div>

          {/* ===================== SIDE B: BACK OF THE CARD ===================== */}
          <div 
            className="absolute inset-0 w-full h-full rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between text-right border-2 border-amber-300/50 shadow-2xl overflow-y-auto bg-gradient-to-b from-[#151E28] via-[#0F1620] to-[#0A0F16]"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              boxShadow: '0 25px 70px -15px rgba(0,0,0,0.85), inset 0 0 40px rgba(212,175,55,0.1)'
            }}
            onClick={e => e.stopPropagation()} // let user click maps/buttons without flipping back instantly
          >
            {/* Top Header with Flip Back Button */}
            <div className="flex items-center justify-between border-b border-amber-400/20 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 tracking-widest uppercase block">
                  EVENT DETAILS & LOCATION
                </span>
                <h3 className="text-base font-bold text-amber-200 font-serif">
                  تفاصيل ومراسم الحفل
                </h3>
              </div>

              <button
                onClick={handleFlip}
                className="px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1 hover:bg-amber-400/20 transition"
              >
                <RotateCw className="w-3 h-3" />
                <span>الواجهة</span>
              </button>
            </div>

            {/* Venue & Location Box */}
            <div className="my-2 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 text-sm font-bold font-serif">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{data.venueName}</span>
              </div>
              {data.venueAddress && (
                <p className="text-xs text-neutral-400 leading-relaxed pr-6 font-serif">
                  {data.venueAddress}
                </p>
              )}
              {data.googleMapsUrl && (
                <a
                  href={data.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>فتح الموقع على خرائط Google Maps</span>
                </a>
              )}
            </div>

            {/* Dress Code Swatches */}
            <div className="my-2 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-2">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>ألوان اللباس المقترحة (Dress Code Palette)</span>
              </div>
              <div className="flex items-center gap-2.5">
                {dressSwatches.map((color: string, i: number) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span 
                      className="w-7 h-7 rounded-full border border-white/30 shadow-md transition hover:scale-110" 
                      style={{ backgroundColor: color.trim() }}
                    />
                  </div>
                ))}
                <span className="text-[11px] text-neutral-400 mr-2 font-serif">
                  {custom.dressCodeDesc || 'أزياء سهرة رسمية راقية'}
                </span>
              </div>
            </div>

            {/* Etiquette & Notes */}
            {custom.etiquetteNote && (
              <div className="my-1 flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{custom.etiquetteNote}</span>
              </div>
            )}

            {/* WhatsApp RSVP */}
            {data.contactButtonsEnabled && (data.groomWhatsapp || data.brideWhatsapp) && (
              <div className="my-2 pt-2 border-t border-white/10">
                <span className="text-[11px] text-neutral-400 block mb-2 font-serif">
                  تأكيد الحضور وتقديم التهاني:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {data.groomWhatsapp && (
                    <a
                      href={`https://wa.me/${data.groomWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.groomName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة! 🎉`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition shadow"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>تهنئة العريس</span>
                    </a>
                  )}
                  {data.brideWhatsapp && (
                    <a
                      href={`https://wa.me/${data.brideWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.brideName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة! 🌸`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition shadow"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>تهنئة العروس</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Flip Back Action */}
            <div className="pt-2 text-center">
              <button
                onClick={handleFlip}
                className="text-xs text-amber-400/80 hover:text-amber-300 font-mono tracking-wider uppercase transition"
              >
                ↺ FLIP TO FRONT
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
