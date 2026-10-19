'use client';

import React, { useState, useRef } from 'react';
import { TemplateRenderContext } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Moon, 
  Compass, 
  MapPin, 
  Calendar, 
  Clock, 
  MessageCircle, 
  RotateCcw,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CelestialConstellationsTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [connectedStars, setConnectedStars] = useState<number[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
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

  const totalStars = 4;

  const handleStarClick = (starId: number) => {
    if (connectedStars.includes(starId)) return;
    const nextConnected = [...connectedStars, starId];
    setConnectedStars(nextConnected);

    if (data.music && audioRef.current && !isPlayingAudio) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    if (nextConnected.length >= totalStars) {
      confetti({
        particleCount: 85,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#FDE047', '#E0E7FF', '#93C5FD', '#FFFFFF', '#D4AF37']
      });
      setTimeout(() => {
        setIsUnlocked(true);
      }, 700);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConnectedStars([]);
    setIsUnlocked(false);
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
      className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 font-cairo bg-gradient-to-b from-[#050711] via-[#0B0F24] to-[#04060E] text-white selection:bg-amber-400/30 overflow-x-hidden relative"
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
            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md shadow-lg border border-indigo-400/30 flex items-center justify-center text-amber-300 hover:bg-white/20 active:scale-95 transition"
            title={isPlayingAudio ? 'كتم الصوت' : 'تشغيل الموسيقى'}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-5 h-5 text-amber-400 animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-neutral-400" />
            )}
          </button>
        )}

        {isUnlocked && (
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-full bg-white/10 backdrop-blur-md shadow-lg border border-amber-400/30 text-xs font-bold text-amber-300 flex items-center gap-1.5 hover:bg-white/20 active:scale-95 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة رسم النجوم</span>
          </button>
        )}
      </div>

      {/* Cosmic Nebula Glow */}
      <div className="absolute top-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header Helper */}
      <div className="text-center mb-6 space-y-1.5 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-400/10 border border-indigo-400/30 text-indigo-300 text-xs font-mono tracking-widest uppercase">
          <Moon className="w-3.5 h-3.5 text-amber-300" />
          <span>{custom.celestialSubtitle || 'CELESTIAL CONSTELLATION MAP'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-wide">
          سماء النجوم والأبراج
        </h2>
        <p className="text-xs text-indigo-200/60">
          {!isUnlocked 
            ? `المس النجوم المضيئة لتوصيل كوكبة الحب وكشف الدعوة (${connectedStars.length}/${totalStars})`
            : 'اكتملت كوكبة النجوم وأضاءت ليلة الفرح السماوية'}
        </p>
      </div>

      {/* STAGE 1: THE INTERACTIVE CONSTELLATION SKY */}
      {!isUnlocked && (
        <div className="w-full max-w-[380px] sm:max-w-[420px] h-[460px] rounded-[2.5rem] bg-gradient-to-b from-[#0F142E] via-[#090D1E] to-[#04060D] border-2 border-indigo-400/40 p-6 flex flex-col justify-between items-center text-center relative shadow-2xl overflow-hidden cursor-pointer">
          
          {/* Subtle Astrological Ring */}
          <div className="absolute inset-6 rounded-full border border-dashed border-indigo-400/20 animate-spin pointer-events-none" style={{ animationDuration: '60s' }} />
          
          <div className="pt-2 z-10">
            <span className="text-[10px] font-mono tracking-[0.25em] text-indigo-300/80 uppercase">
              TOUCH STARS TO CONNECT
            </span>
          </div>

          {/* Interactive Stars Positioning */}
          <div className="w-full h-64 relative my-auto">
            {/* Star 1 (Top Left) */}
            <motion.div
              whileHover={{ scale: 1.2 }}
              onClick={() => handleStarClick(1)}
              className={`absolute top-4 left-10 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition ${
                connectedStars.includes(1) ? 'bg-amber-400 text-black shadow-[0_0_25px_rgba(250,204,21,1)]' : 'bg-white/10 text-amber-300 border border-amber-300/40 animate-pulse'
              }`}
            >
              <Star className="w-6 h-6 fill-current" />
            </motion.div>

            {/* Star 2 (Top Right) */}
            <motion.div
              whileHover={{ scale: 1.2 }}
              onClick={() => handleStarClick(2)}
              className={`absolute top-12 right-12 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition ${
                connectedStars.includes(2) ? 'bg-amber-400 text-black shadow-[0_0_25px_rgba(250,204,21,1)]' : 'bg-white/10 text-amber-300 border border-amber-300/40 animate-pulse'
              }`}
            >
              <Star className="w-6 h-6 fill-current" />
            </motion.div>

            {/* Star 3 (Bottom Left) */}
            <motion.div
              whileHover={{ scale: 1.2 }}
              onClick={() => handleStarClick(3)}
              className={`absolute bottom-6 left-16 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition ${
                connectedStars.includes(3) ? 'bg-amber-400 text-black shadow-[0_0_25px_rgba(250,204,21,1)]' : 'bg-white/10 text-amber-300 border border-amber-300/40 animate-pulse'
              }`}
            >
              <Star className="w-6 h-6 fill-current" />
            </motion.div>

            {/* Star 4 (Center Right) */}
            <motion.div
              whileHover={{ scale: 1.2 }}
              onClick={() => handleStarClick(4)}
              className={`absolute bottom-16 right-10 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition ${
                connectedStars.includes(4) ? 'bg-amber-400 text-black shadow-[0_0_25px_rgba(250,204,21,1)]' : 'bg-white/10 text-amber-300 border border-amber-300/40 animate-pulse'
              }`}
            >
              <Star className="w-6 h-6 fill-current" />
            </motion.div>

            {/* Center Monogram Preview */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-serif font-black text-amber-200/40 tracking-wider">
                {data.groomName.charAt(0)} & {data.brideName.charAt(0)}
              </span>
            </div>
          </div>

          <div className="pb-2 z-10">
            <span className="text-xs font-mono text-amber-300 tracking-wider">
              {connectedStars.length === totalStars ? 'جاري فتح الكوكبة...' : 'انقر على النجوم الأربعة المتبقية'}
            </span>
          </div>
        </div>
      )}

      {/* STAGE 2: UNLOCKED CELESTIAL MOON CARD */}
      <AnimatePresence>
        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="w-full max-w-[420px] sm:max-w-[460px] bg-gradient-to-b from-[#111736] via-[#0B0F24] to-[#060815] rounded-[2.5rem] p-6 sm:p-9 border-2 border-amber-400/40 shadow-2xl relative z-10 text-center space-y-6"
            style={{
              boxShadow: '0 25px 70px -15px rgba(0,0,0,0.9), inset 0 0 40px rgba(212,175,55,0.1)'
            }}
          >
            {/* Celestial Header */}
            <div className="border-b border-indigo-400/20 pb-4 space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-black flex items-center justify-center shadow-[0_0_25px_rgba(250,204,21,0.5)]">
                <Moon className="w-7 h-7 fill-current" />
              </div>
              <span className="text-xs font-mono tracking-[0.25em] text-amber-300 uppercase block font-bold">
                «تلاقت النجوم في سماء العشق»
              </span>
              <p className="text-xs font-serif text-neutral-300 leading-relaxed px-2">
                {data.weddingMessage || custom.celestialVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
              </p>
            </div>

            {/* Couple Announcement */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-indigo-300">
                THE CELESTIAL WEDDING OF
              </span>
              <div className="flex items-center justify-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300">
                  {data.groomName}
                </h1>
                <span className="text-xl font-serif italic text-amber-400">&</span>
                <h1 className="text-3xl sm:text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300">
                  {data.brideName}
                </h1>
              </div>
              <p className="text-xs font-serif text-neutral-300 pt-1 leading-relaxed">
                {custom.celestialNote || 'تحت ضياء النجوم وبريق السماء، يسعدنا أن تشاركونا فرحة العمر في ليلتنا السماوية.'}
              </p>
            </div>

            {/* Date & Astronomical Venue Box */}
            <div className="bg-white/5 border border-indigo-400/30 rounded-2xl p-4 text-center space-y-2.5 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 font-bold text-sm font-serif text-amber-200">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{data.weddingTime || 'السابعة والنصف مساءً'}</span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-center gap-1.5 font-bold text-xs font-serif text-white">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{data.venueName}</span>
                </div>
                {data.venueAddress && (
                  <p className="text-[11px] text-neutral-400 mt-0.5">{data.venueAddress}</p>
                )}
              </div>

              {data.googleMapsUrl && (
                <a
                  href={data.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>فتح إحداثيات القاعة على Google Maps</span>
                </a>
              )}
            </div>

            {/* WhatsApp RSVP */}
            {data.contactButtonsEnabled && (data.groomWhatsapp || data.brideWhatsapp) && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-xs font-serif text-neutral-400 block">
                  تأكيد الحضور وتقديم التهاني:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {data.groomWhatsapp && (
                    <a
                      href={`https://wa.me/${data.groomWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.groomName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة! 🌟`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition shadow"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>تهنئة العريس</span>
                    </a>
                  )}
                  {data.brideWhatsapp && (
                    <a
                      href={`https://wa.me/${data.brideWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.brideName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة! ✨`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition shadow"
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
