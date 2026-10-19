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
  Layers,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TrifoldPocketFolioTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeInsert, setActiveInsert] = useState<'none' | 'map' | 'rsvp'>('none');
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

  const handleOpenFolio = () => {
    if (isOpen) return;
    setIsOpen(true);

    if (data.music && audioRef.current && !isPlayingAudio) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    confetti({
      particleCount: 75,
      spread: 85,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#6B1414', '#FFFFFF', '#C5A059']
    });
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveInsert('none');
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
      className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 font-cairo bg-gradient-to-b from-[#1C1215] via-[#2D1B22] to-[#140C0E] text-[#2C241E] selection:bg-rose-200 overflow-x-hidden relative"
      dir="rtl"
    >
      {/* Background Audio */}
      {data.music && (
        <audio ref={audioRef} src={data.music.url} loop preload="auto" />
      )}

      {/* Floating Audio & Reset */}
      <div className="fixed top-5 left-5 z-50 flex items-center gap-2">
        {data.music && (
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
        )}

        {isOpen && (
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-full bg-white/10 backdrop-blur-md shadow-lg border border-amber-400/30 text-xs font-bold text-amber-300 flex items-center gap-1.5 hover:bg-white/20 active:scale-95 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة إغلاق الحافظة</span>
          </button>
        )}
      </div>

      {/* Ambient Burgundy Glow */}
      <div className="absolute top-1/4 w-[480px] h-[480px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Helper */}
      <div className="text-center mb-6 space-y-1 z-10">
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-amber-300/80 block">
          TRI-FOLD POCKET FOLIO & INSERT CARDS
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-wide">
          حافظة الفوليو الملكية ثلاثية الطيات
        </h2>
        <p className="text-xs text-neutral-400">
          {!isOpen 
            ? 'المس الحافظة لفتح الأجنحة وسحب كروت الجيب المائل' 
            : 'انفتحت الحافظة: يمكنك لمس كرت الخريطة أو كرت الحجز لسحبهما من الجيب'}
        </p>
      </div>

      {/* THE TRI-FOLD FOLIO CONTAINER */}
      <div 
        className="w-full max-w-[420px] sm:max-w-[460px] relative rounded-[2rem] shadow-2xl cursor-pointer"
        style={{ perspective: '1400px' }}
        onClick={!isOpen ? handleOpenFolio : undefined}
      >
        {/* CENTER PANEL: THE MAIN WEDDING INVITATION CARD */}
        <div 
          className="w-full rounded-[2rem] p-7 sm:p-9 text-center space-y-5 bg-[#FAF7F2] border-2 border-amber-400/40 shadow-2xl relative z-10 overflow-hidden"
          style={{
            boxShadow: '0 25px 70px -15px rgba(0,0,0,0.85)'
          }}
        >
          {/* Gilded Inset Border */}
          <div className="absolute inset-2.5 border border-[#D4AF37]/40 rounded-2xl pointer-events-none p-2 flex flex-col justify-between">
            <div className="flex justify-between items-center text-[9px] text-[#8C6D37] font-mono tracking-widest uppercase">
              <span>FOLIO SUITE</span>
              <span>✦</span>
              <span>ROYAL WEDDING</span>
            </div>
            <div className="flex justify-between items-center text-xs text-[#8C6D37]">
              <span>⚜</span>
              <span>⚜</span>
            </div>
          </div>

          {/* Holy Verse */}
          <div className="space-y-2 border-b border-[#E3D7C5] pb-3 z-10">
            <span className="text-xs font-mono tracking-widest text-[#8C6D37] uppercase font-bold block">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
            <p className="text-xs font-serif text-[#6B5A4B] italic max-w-xs mx-auto leading-relaxed">
              {data.weddingMessage || custom.holyVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
            </p>
          </div>

          {/* Couple Names */}
          <div className="space-y-1 my-3 z-10">
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              {custom.invitationIntro || 'نتشرف بدعوتكم لحضور حفل زفاف'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#2C241E]">
              {data.groomName}
            </h1>
            <span className="text-xl font-serif italic text-[#8C6D37] block my-0.5">&</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#2C241E]">
              {data.brideName}
            </h1>
            <p className="text-xs font-serif text-[#6B5A4B] leading-relaxed max-w-sm mx-auto pt-1">
              {custom.invitationNote || 'يسعدنا ويشرفنا حضوركم ومشاركتنا أبهى ليالي العمر، لتكتمل سعادتنا برؤيتكم بيننا.'}
            </p>
          </div>

          {/* Date & Time Header */}
          <div className="bg-[#F3EDE3] p-3 rounded-xl border border-[#E3D7C5] flex items-center justify-around text-xs font-serif font-bold text-[#2C241E] z-10">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span>{data.weddingTime || '07:30 PM'}</span>
            </div>
          </div>

          {/* THE DIAGONAL POCKET FOR INSERT CARDS (AT THE BOTTOM OF FOLIO) */}
          <div className="mt-4 pt-3 border-t border-[#E3D7C5] z-10 text-right space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-[#8C6D37] tracking-wider uppercase flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>POCKET INSERTS (كروت الجيب)</span>
              </span>
              <span className="text-[10px] text-neutral-400">انقر على الكرت لسحبه</span>
            </div>

            {/* The 2 Slide-out Insert Cards in the Pocket */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Insert 1: Venue & Maps Card */}
              <div
                onClick={e => {
                  e.stopPropagation();
                  setActiveInsert(activeInsert === 'map' ? 'none' : 'map');
                }}
                className={`p-2.5 rounded-xl border transition cursor-pointer text-center ${
                  activeInsert === 'map' ? 'bg-[#2C241E] text-white border-black' : 'bg-white text-[#2C241E] border-[#D5C7B5] hover:border-black'
                }`}
              >
                <MapPin className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                <span className="text-xs font-serif font-bold block">كرت موقع القاعة</span>
                <span className="text-[9px] font-mono opacity-60">PULL OUT ⇲</span>
              </div>

              {/* Insert 2: RSVP WhatsApp Card */}
              <div
                onClick={e => {
                  e.stopPropagation();
                  setActiveInsert(activeInsert === 'rsvp' ? 'none' : 'rsvp');
                }}
                className={`p-2.5 rounded-xl border transition cursor-pointer text-center ${
                  activeInsert === 'rsvp' ? 'bg-[#2C241E] text-white border-black' : 'bg-white text-[#2C241E] border-[#D5C7B5] hover:border-black'
                }`}
              >
                <MessageCircle className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                <span className="text-xs font-serif font-bold block">كرت تأكيد الحضور</span>
                <span className="text-[9px] font-mono opacity-60">PULL OUT ⇲</span>
              </div>
            </div>
          </div>

          {/* EXPANDED MODAL / DRAWER FOR PULLED INSERT CARD */}
          <AnimatePresence>
            {activeInsert === 'map' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="mt-3 p-4 bg-white rounded-2xl border border-amber-300 shadow-lg text-center space-y-2"
                onClick={e => e.stopPropagation()}
              >
                <h4 className="font-serif font-bold text-sm text-[#2C241E]">{data.venueName}</h4>
                {data.venueAddress && (
                  <p className="text-xs text-neutral-500 font-serif">{data.venueAddress}</p>
                )}
                {data.googleMapsUrl && (
                  <a
                    href={data.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-[#2C241E] hover:bg-[#3E332B] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-300" />
                    <span>فتح الموقع على Google Maps</span>
                  </a>
                )}
              </motion.div>
            )}

            {activeInsert === 'rsvp' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="mt-3 p-4 bg-white rounded-2xl border border-amber-300 shadow-lg text-center space-y-2"
                onClick={e => e.stopPropagation()}
              >
                <span className="text-xs font-serif text-neutral-600 block">إرسال تهنئة أو تأكيد حضور عبر واتساب:</span>
                <div className="grid grid-cols-2 gap-2 pt-1">
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LEFT FOLIO FLAP (FOLDS OPEN TO LEFT) */}
        <motion.div
          animate={{
            rotateY: isOpen ? -115 : 0,
            opacity: isOpen ? 0.2 : 1
          }}
          transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-y-0 left-0 w-1/2 origin-left z-30 pointer-events-none rounded-l-[2rem] border-r border-amber-400/40 bg-gradient-to-r from-[#38161F] via-[#481E29] to-[#2E1219] shadow-2xl"
          style={{
            transformStyle: 'preserve-3d'
          }}
        />

        {/* RIGHT FOLIO FLAP (FOLDS OPEN TO RIGHT) */}
        <motion.div
          animate={{
            rotateY: isOpen ? 115 : 0,
            opacity: isOpen ? 0.2 : 1
          }}
          transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-y-0 right-0 w-1/2 origin-right z-30 pointer-events-none rounded-r-[2rem] border-l border-amber-400/40 bg-gradient-to-l from-[#38161F] via-[#481E29] to-[#2E1219] shadow-2xl"
          style={{
            transformStyle: 'preserve-3d'
          }}
        />

        {/* FOLIO BELLY BAND (BELT WITH WAX SEAL ACROSS THE CENTER WHEN CLOSED) */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center pointer-events-none"
            >
              {/* Gold Belly Band */}
              <div className="absolute w-full h-12 bg-gradient-to-r from-amber-500/90 via-amber-300 to-amber-500/90 shadow-xl border-y border-amber-200" />

              {/* Center Seal */}
              <div className="w-16 h-16 rounded-full bg-[#1F0A10] border-2 border-amber-300 shadow-2xl flex flex-col items-center justify-center text-amber-300 z-10 animate-pulse">
                <Heart className="w-5 h-5 fill-current" />
                <span className="text-[8px] font-mono tracking-widest font-bold mt-0.5">OPEN</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
