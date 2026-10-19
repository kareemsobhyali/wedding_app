'use client';

import React, { useState, useRef } from 'react';
import { TemplateRenderContext } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  MapPin, 
  Calendar, 
  Clock, 
  Disc, 
  Music, 
  MessageCircle, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VintageVinylPlayerTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSleeveOpen, setIsSleeveOpen] = useState(false);
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

  const handleTogglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    if (nextState) {
      setIsSleeveOpen(true);
      if (data.music && audioRef.current) {
        audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
      }
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#85522F', '#FFFFFF', '#000000']
      });
    } else {
      if (audioRef.current && isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      }
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

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 font-cairo bg-gradient-to-b from-[#18110D] via-[#241A14] to-[#120C09] text-[#2C211A] selection:bg-amber-500/30 overflow-x-hidden relative"
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

      {/* Ambient Turntable Glow */}
      <div className="absolute top-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Helper */}
      <div className="text-center mb-6 space-y-1.5 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
          <Disc className="w-3.5 h-3.5 text-amber-400" />
          <span>{custom.vinylSubtitle || 'VINTAGE PHONOGRAPH • VINYL WEDDING EDITION'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-wide">
          أسطوانة الحب والزفاف
        </h2>
        <p className="text-xs text-amber-200/60">
          {!isPlaying ? 'اضغط على زر التشغيل لتحريك الإبرة ودوران الأسطوانة' : 'الأسطوانة تدور وأغنية العمر تبدأ بأعذب الألحان'}
        </p>
      </div>

      {/* THE VINTAGE TURNTABLE PLAYER DECK */}
      <div className="w-full max-w-[420px] sm:max-w-[460px] bg-gradient-to-b from-[#3D2619] via-[#2F1C12] to-[#20120B] p-5 sm:p-7 rounded-[2.5rem] border-4 border-amber-700/40 shadow-2xl relative z-10 flex flex-col items-center">
        
        {/* Brass Screws at Corners */}
        <div className="w-full flex justify-between px-2 pt-1 pb-4">
          <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 border border-amber-800 shadow" />
          <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 border border-amber-800 shadow" />
        </div>

        {/* VINYL RECORD & TURNTABLE PLATTER */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-2">
          
          {/* Turntable Platter Base */}
          <div className="absolute inset-0 rounded-full bg-[#120B07] border-4 border-amber-600/30 shadow-2xl" />

          {/* Spinning Vinyl Record */}
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={isPlaying ? { repeat: Infinity, duration: 4, ease: 'linear' } : { duration: 0.5 }}
            className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-[#0D0B0A] border-4 border-neutral-900 shadow-2xl relative flex items-center justify-center cursor-pointer"
            onClick={handleTogglePlay}
            style={{
              backgroundImage: 'repeating-radial-gradient(circle, #0A0A0A 0, #0A0A0A 2px, #1A1A1A 3px, #1A1A1A 4px)'
            }}
          >
            {/* Vinyl Center Gilded Label */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 border-2 border-amber-900 flex flex-col items-center justify-center text-center p-2 text-black shadow-md z-10">
              <span className="text-[8px] font-mono tracking-widest font-black uppercase">
                STEREO • 33 RPM
              </span>
              <span className="text-[11px] font-serif font-black truncate max-w-[80px]">
                {data.groomName} & {data.brideName}
              </span>
              <span className="text-[8px] font-mono tracking-widest">SIDE A</span>
              <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] border border-amber-900 mt-0.5" />
            </div>

            {/* Light reflection sheen across vinyl */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 via-transparent to-white/10 pointer-events-none" />
          </motion.div>

          {/* Tonearm (ذراع الفونوغراف) */}
          <motion.div
            animate={isPlaying ? { rotate: 28 } : { rotate: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute top-2 right-2 w-28 h-36 origin-top-right pointer-events-none z-20"
          >
            {/* Pivot Base */}
            <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 via-amber-400 to-amber-200 border-2 border-amber-950 shadow-lg" />
            {/* Tone Arm Rod */}
            <div className="absolute top-4 right-3.5 w-1.5 h-28 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 rounded-full shadow" />
            {/* Cartridge Head / Stylus */}
            <div className="absolute bottom-4 right-1 w-6 h-5 rounded bg-neutral-900 border border-amber-400 shadow-md" />
          </motion.div>
        </div>

        {/* TURNTABLE CONTROL KNOBS & PLAY BUTTON */}
        <div className="w-full flex items-center justify-between pt-5 px-3 border-t border-amber-700/30 mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-black font-bold shadow-lg transition active:scale-95 ${
                isPlaying ? 'bg-amber-400 text-black' : 'bg-gradient-to-r from-amber-400 to-amber-500'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <span className="text-xs font-serif font-bold text-amber-200">
              {isPlaying ? 'إيقاف الأسطوانة' : 'تشغيل وقراءة الدعوة'}
            </span>
          </div>

          <button
            onClick={() => setIsSleeveOpen(!isSleeveOpen)}
            className="px-3.5 py-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold hover:bg-amber-400/20 transition flex items-center gap-1.5"
          >
            <Music className="w-3.5 h-3.5" />
            <span>{isSleeveOpen ? 'إخفاء الغلاف' : 'غلاف الألبوم ⇲'}</span>
          </button>
        </div>
      </div>

      {/* SLIDING ALBUM SLEEVE CARD (تفاصيل الألبوم وحفل الزفاف) */}
      <AnimatePresence>
        {isSleeveOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[420px] sm:max-w-[460px] bg-[#FAF6F0] rounded-3xl p-6 sm:p-8 mt-5 border-2 border-amber-300/80 shadow-2xl relative z-10 text-center space-y-6"
            style={{
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
            }}
          >
            {/* Album Header */}
            <div className="border-b border-amber-900/20 pb-4">
              <div className="flex justify-between items-center text-[10px] font-mono text-amber-900/70 uppercase tracking-widest">
                <span>WEDDING ALBUM</span>
                <span>ORIGINAL TRACKS</span>
                <span>{weddingDate.getFullYear()}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-neutral-900 mt-2">
                «أجمل ألحان العمر»
              </h3>
            </div>

            {/* Couple Announcement */}
            <div className="space-y-2">
              <span className="text-xs font-mono tracking-widest uppercase text-amber-900 font-bold block">
                SPECIAL PERFORMANCE BY
              </span>
              <div className="flex items-center justify-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-serif font-black text-neutral-900">
                  {data.groomName}
                </h1>
                <span className="text-xl font-serif italic text-amber-700">&</span>
                <h1 className="text-3xl sm:text-4xl font-serif font-black text-neutral-900">
                  {data.brideName}
                </h1>
              </div>
              <p className="text-xs sm:text-sm font-serif text-neutral-600 max-w-sm mx-auto leading-relaxed pt-1">
                {data.weddingMessage || custom.albumNote || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
              </p>
            </div>

            {/* Album Tracklist (Timeline / Program) */}
            <div className="bg-white p-4 rounded-2xl border border-amber-200/80 text-right space-y-3 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-amber-900 tracking-wider block border-b border-amber-100 pb-1.5 uppercase">
                ALBUM TRACKLIST (برنامج الليلة)
              </span>

              <div className="flex items-center justify-between text-xs font-serif">
                <span className="font-bold text-neutral-900">01. {custom.track1Title || 'استقبال الأحباب وبداية اللحن'}</span>
                <span className="font-mono text-amber-800">{custom.track1Time || '07:30 PM'}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-serif">
                <span className="font-bold text-neutral-900">02. {custom.track2Title || 'الزفة وعقد القران الملكي'}</span>
                <span className="font-mono text-amber-800">{custom.track2Time || '08:45 PM'}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-serif">
                <span className="font-bold text-neutral-900">03. {custom.track3Title || 'مأدبة العشاء ومباركة الجمع'}</span>
                <span className="font-mono text-amber-800">{custom.track3Time || '10:15 PM'}</span>
              </div>
            </div>

            {/* Venue & Maps */}
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-center gap-1.5 font-serif font-bold text-sm text-neutral-900">
                <MapPin className="w-4 h-4 text-amber-800" />
                <span>{data.venueName}</span>
              </div>
              {data.venueAddress && (
                <p className="text-xs text-neutral-600 font-serif">{data.venueAddress}</p>
              )}
              <div className="flex items-center justify-center gap-1.5 text-xs font-serif text-amber-900 pt-1 border-t border-amber-200/60 font-bold">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate} - {data.weddingTime || '07:30 PM'}</span>
              </div>

              {data.googleMapsUrl && (
                <a
                  href={data.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>فتح موقع الحفل على Google Maps</span>
                </a>
              )}
            </div>

            {/* WhatsApp RSVP */}
            {data.contactButtonsEnabled && (data.groomWhatsapp || data.brideWhatsapp) && (
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <span className="text-xs font-serif text-neutral-600 block">
                  تأكيد الحضور وتقديم التهاني:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {data.groomWhatsapp && (
                    <a
                      href={`https://wa.me/${data.groomWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.groomName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة! 🎉`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition shadow"
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
                      className="py-2.5 px-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition shadow"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>تهنئة العروس</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
