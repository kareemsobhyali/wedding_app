'use client';

import React, { useState, useRef } from 'react';
import { TemplateRenderContext } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Camera, 
  MapPin, 
  Calendar, 
  Clock, 
  Heart, 
  MessageCircle, 
  Sparkles,
  RotateCcw,
  Pin
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PolaroidPhotoReelTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
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

  const handleSelectCard = (index: number) => {
    setSelectedCard(index);

    if (data.music && audioRef.current && !isPlayingAudio) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#EF4444', '#EC4899', '#FBBF24']
    });
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
      className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 font-cairo bg-gradient-to-b from-[#1C1613] via-[#2A1E17] to-[#120D0A] text-[#2C211A] selection:bg-amber-400/30 overflow-x-hidden relative"
      dir="rtl"
    >
      {/* Background Music */}
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

      {/* Twinkling Fairy Lights String in Background */}
      <div className="absolute top-8 inset-x-0 flex justify-around pointer-events-none z-0">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-0.5 h-6 bg-amber-400/30" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-300 shadow-[0_0_15px_rgba(252,211,77,0.9)] animate-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
          </div>
        ))}
      </div>

      {/* Header Helper */}
      <div className="text-center mb-6 space-y-1 z-10 pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
          <Camera className="w-3.5 h-3.5 text-amber-400" />
          <span>{custom.polaroidHeader || 'HANGING POLAROID LOVE REEL'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-wide">
          معرض لقطات العمر
        </h2>
        <p className="text-xs text-amber-200/60">
          المس أي كرت بولارويد معلق لتكبيره ومعاينة تفاصيل الدعوة
        </p>
      </div>

      {/* HANGING CLOTHESLINE STRING */}
      <div className="w-full max-w-4xl relative z-10 mb-2">
        <div className="w-full h-1 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 shadow-md" />
      </div>

      {/* GRID OF 4 HANGING POLAROIDS */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 relative z-10">
        
        {/* ================= CARD 1: THE NAMES & SAVE THE DATE ================= */}
        <motion.div
          animate={{ rotate: [-1.5, 1.5, -1.5] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          onClick={() => handleSelectCard(1)}
          className="bg-white rounded-xl p-4 pt-2 shadow-2xl border border-neutral-200 flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform relative group"
        >
          {/* Clothespin (مشبك خشبي) */}
          <div className="w-4 h-7 bg-amber-700 rounded-sm mx-auto -mt-4 shadow-md border border-amber-900 z-20 flex items-center justify-center">
            <div className="w-2 h-1 bg-amber-900 rounded-full" />
          </div>

          {/* Photo Frame */}
          <div className="w-full h-44 rounded-lg bg-gradient-to-tr from-[#3D2C1E] to-[#1C1510] flex flex-col items-center justify-center p-3 text-center my-2 text-amber-200 shadow-inner">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse mb-2" />
            <h3 className="font-serif font-black text-xl text-white">
              {data.groomName}
            </h3>
            <span className="font-serif italic text-amber-400">&</span>
            <h3 className="font-serif font-black text-xl text-white">
              {data.brideName}
            </h3>
          </div>

          {/* Handwritten Margin */}
          <div className="pt-2 text-center">
            <span className="font-serif font-bold text-sm text-neutral-800 block">
              Save The Date ♥
            </span>
            <span className="font-mono text-[11px] text-neutral-500">
              {formattedDate}
            </span>
          </div>
        </motion.div>

        {/* ================= CARD 2: THE INVITATION MESSAGE ================= */}
        <motion.div
          animate={{ rotate: [1.8, -1.8, 1.8] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
          onClick={() => handleSelectCard(2)}
          className="bg-white rounded-xl p-4 pt-2 shadow-2xl border border-neutral-200 flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform relative group"
        >
          {/* Clothespin */}
          <div className="w-4 h-7 bg-amber-700 rounded-sm mx-auto -mt-4 shadow-md border border-amber-900 z-20 flex items-center justify-center">
            <div className="w-2 h-1 bg-amber-900 rounded-full" />
          </div>

          {/* Photo Frame */}
          <div className="w-full h-44 rounded-lg bg-[#FAF7F2] border border-amber-200 flex flex-col items-center justify-center p-3 text-center my-2 text-neutral-800 shadow-inner">
            <span className="text-[10px] font-bold font-serif text-amber-800 mb-1">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
            <p className="text-xs font-serif text-neutral-700 line-clamp-4 leading-relaxed">
              {data.weddingMessage || custom.holyVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
            </p>
          </div>

          {/* Handwritten Margin */}
          <div className="pt-2 text-center">
            <span className="font-serif font-bold text-sm text-neutral-800 block">
              دعوة خاصة من القلب
            </span>
            <span className="font-mono text-[11px] text-neutral-500">
              انقر للقراءة الكاملة ❯
            </span>
          </div>
        </motion.div>

        {/* ================= CARD 3: THE VENUE & TIME ================= */}
        <motion.div
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 1 }}
          onClick={() => handleSelectCard(3)}
          className="bg-white rounded-xl p-4 pt-2 shadow-2xl border border-neutral-200 flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform relative group"
        >
          {/* Clothespin */}
          <div className="w-4 h-7 bg-amber-700 rounded-sm mx-auto -mt-4 shadow-md border border-amber-900 z-20 flex items-center justify-center">
            <div className="w-2 h-1 bg-amber-900 rounded-full" />
          </div>

          {/* Photo Frame */}
          <div className="w-full h-44 rounded-lg bg-gradient-to-tr from-[#1E293B] to-[#0F172A] flex flex-col items-center justify-center p-3 text-center my-2 text-white shadow-inner">
            <MapPin className="w-7 h-7 text-amber-400 mb-1 animate-bounce" />
            <h4 className="font-serif font-bold text-sm truncate max-w-[150px]">
              {data.venueName}
            </h4>
            <span className="text-[10px] font-mono text-amber-300 mt-1">
              {data.weddingTime || '07:30 PM'}
            </span>
          </div>

          {/* Handwritten Margin */}
          <div className="pt-2 text-center">
            <span className="font-serif font-bold text-sm text-neutral-800 block">
              مكان وموعد اللقاء
            </span>
            <span className="font-mono text-[11px] text-neutral-500">
              Google Maps ❯
            </span>
          </div>
        </motion.div>

        {/* ================= CARD 4: THE RSVP DESK ================= */}
        <motion.div
          animate={{ rotate: [1.6, -1.6, 1.6] }}
          transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut', delay: 1.5 }}
          onClick={() => handleSelectCard(4)}
          className="bg-white rounded-xl p-4 pt-2 shadow-2xl border border-neutral-200 flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform relative group"
        >
          {/* Clothespin */}
          <div className="w-4 h-7 bg-amber-700 rounded-sm mx-auto -mt-4 shadow-md border border-amber-900 z-20 flex items-center justify-center">
            <div className="w-2 h-1 bg-amber-900 rounded-full" />
          </div>

          {/* Photo Frame */}
          <div className="w-full h-44 rounded-lg bg-emerald-900/90 flex flex-col items-center justify-center p-3 text-center my-2 text-white shadow-inner">
            <MessageCircle className="w-8 h-8 text-emerald-400 mb-2" />
            <span className="font-serif font-bold text-sm">
              تأكيد الحضور والتهنئة
            </span>
            <span className="text-[10px] font-mono text-emerald-300 mt-1">
              WHATSAPP RSVP
            </span>
          </div>

          {/* Handwritten Margin */}
          <div className="pt-2 text-center">
            <span className="font-serif font-bold text-sm text-neutral-800 block">
              ننتظر حضوركم الغالي
            </span>
            <span className="font-mono text-[11px] text-neutral-500">
              انقر لتأكيد حضورك ❯
            </span>
          </div>
        </motion.div>
      </div>

      {/* MODAL POPUP FOR SELECTED POLAROID */}
      <AnimatePresence>
        {selectedCard !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 text-center text-neutral-900 shadow-2xl border-4 border-amber-200 space-y-5"
            >
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
                  POLAROID SNAPSHOT #{selectedCard}
                </span>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 font-bold hover:bg-neutral-200 transition"
                >
                  ✕
                </button>
              </div>

              {selectedCard === 1 && (
                <div className="space-y-4">
                  <Heart className="w-10 h-10 text-rose-500 fill-rose-500 mx-auto animate-bounce" />
                  <h2 className="text-3xl font-serif font-black text-neutral-900">
                    {data.groomName} & {data.brideName}
                  </h2>
                  <div className="p-3 bg-amber-50 rounded-xl font-serif text-sm text-amber-900 font-bold">
                    {formattedDate} • {data.weddingTime || '07:30 PM'}
                  </div>
                  <p className="text-xs text-neutral-600 font-serif leading-relaxed">
                    يسعدنا ويشرفنا مشاركتكم فرحة العمر وتتويج مسيرة الحب في ليلتنا المنتظرة 🤍
                  </p>
                </div>
              )}

              {selectedCard === 2 && (
                <div className="space-y-4">
                  <span className="text-sm font-bold font-serif text-amber-800 block">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </span>
                  <p className="text-sm font-serif text-neutral-800 leading-relaxed px-2">
                    {data.weddingMessage || custom.holyVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
                  </p>
                  <p className="text-xs text-neutral-500 font-serif pt-2 border-t">
                    {custom.polaroidNote || 'بين عبق الذكريات وبداية الفرح الجديد، نتشرف بحضوركم الكريم معنا.'}
                  </p>
                </div>
              )}

              {selectedCard === 3 && (
                <div className="space-y-4">
                  <MapPin className="w-10 h-10 text-amber-600 mx-auto" />
                  <h3 className="text-xl font-serif font-bold text-neutral-900">
                    {data.venueName}
                  </h3>
                  {data.venueAddress && (
                    <p className="text-xs text-neutral-600 font-serif">{data.venueAddress}</p>
                  )}
                  {data.googleMapsUrl && (
                    <a
                      href={data.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow"
                    >
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span>فتح الموقع على خرائط Google Maps</span>
                    </a>
                  )}
                </div>
              )}

              {selectedCard === 4 && (
                <div className="space-y-4">
                  <MessageCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-serif font-bold text-neutral-900">
                    تأكيد الحضور وتقديم التهاني
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {data.groomWhatsapp && (
                      <a
                        href={`https://wa.me/${data.groomWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.groomName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة! 🎉`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition shadow"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>تهنئة العريس</span>
                      </a>
                    )}
                    {data.brideWhatsapp && (
                      <a
                        href={`https://wa.me/${data.brideWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.brideName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة! 🌸`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition shadow"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>تهنئة العروس</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
