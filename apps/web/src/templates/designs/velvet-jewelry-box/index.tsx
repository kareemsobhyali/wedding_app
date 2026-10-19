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
  Gem,
  Lock,
  Unlock,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VelvetJewelryBoxTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const handleOpenBox = () => {
    if (isBoxOpen) return;
    setIsBoxOpen(true);

    if (data.music && audioRef.current && !isPlayingAudio) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    confetti({
      particleCount: 65,
      spread: 85,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#E5E7EB', '#FFFFFF', '#C5A059']
    });

    // Auto open secret drawer 1.2s after the box lid opens
    setTimeout(() => {
      setIsDrawerOpen(true);
    }, 1200);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDrawerOpen(false);
    setTimeout(() => {
      setIsBoxOpen(false);
    }, 300);
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
      className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 font-cairo bg-gradient-to-b from-[#0F0D15] via-[#1A1424] to-[#0A080E] text-white selection:bg-amber-400/30 overflow-x-hidden relative"
      dir="rtl"
    >
      {/* Background Music */}
      {data.music && (
        <audio ref={audioRef} src={data.music.url} loop preload="auto" />
      )}

      {/* Floating Audio & Controls */}
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

        {isBoxOpen && (
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-full bg-white/10 backdrop-blur-md shadow-lg border border-amber-400/30 text-xs font-bold text-amber-300 flex items-center gap-1.5 hover:bg-white/20 active:scale-95 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إغلاق الصندوق</span>
          </button>
        )}
      </div>

      {/* Ambient Velvet Purple Glow */}
      <div className="absolute top-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Helper */}
      <div className="text-center mb-6 space-y-1.5 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
          <Gem className="w-3.5 h-3.5 text-amber-400" />
          <span>{custom.boxSubtitle || 'VELVET JEWELRY BOX & SECRET DRAWER'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-wide">
          صندوق المجوهرات المخملي
        </h2>
        <p className="text-xs text-neutral-400">
          {!isBoxOpen 
            ? 'المس قفل الصندوق المذهب لفتح الصندوق وسحب درج الدعوة' 
            : 'خواتم الزفاف تضيء والدرج السحري يحمل تفاصيل الدعوة'}
        </p>
      </div>

      {/* THE 3D VELVET BOX CONTAINER */}
      <div className="w-full max-w-[400px] sm:max-w-[440px] flex flex-col items-center relative z-10" style={{ perspective: '1200px' }}>
        
        {/* UPPER VELVET BOX LID (OPENS UPWARDS) */}
        <motion.div
          animate={{ 
            rotateX: isBoxOpen ? -100 : 0,
            y: isBoxOpen ? -40 : 0,
            opacity: isBoxOpen ? 0.35 : 1
          }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          onClick={!isBoxOpen ? handleOpenBox : undefined}
          className={`w-full h-44 rounded-t-3xl bg-gradient-to-b from-[#2B1736] via-[#200F29] to-[#17091F] border-2 border-amber-400/40 p-5 flex flex-col justify-between items-center text-center shadow-2xl relative z-20 origin-top cursor-pointer ${
            !isBoxOpen ? 'hover:scale-[1.01]' : ''
          }`}
          style={{
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 35px rgba(212,175,55,0.15)'
          }}
        >
          {/* Box Gold Monogram Crest on Lid */}
          <div className="pt-2">
            <span className="text-[10px] font-mono tracking-[0.25em] text-amber-300/80 uppercase">
              HAUTE JOAILLERIE
            </span>
          </div>

          <div className="my-auto space-y-1">
            <div className="w-12 h-12 rounded-full border border-amber-400/40 bg-white/5 mx-auto flex items-center justify-center shadow-lg">
              <span className="font-serif font-bold text-base text-amber-300">
                {custom.monogram || `${data.groomName.charAt(0)}&${data.brideName.charAt(0)}`}
              </span>
            </div>
            <h3 className="text-xl font-serif font-bold text-amber-100">
              {data.groomName} & {data.brideName}
            </h3>
          </div>

          {/* Golden Clasp Lock Button */}
          <div className="pb-1">
            <div className="py-1.5 px-4 rounded-full bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg animate-pulse">
              {!isBoxOpen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{custom.claspText || 'انقر لفتح قفل الصندوق'}</span>
            </div>
          </div>
        </motion.div>

        {/* CUSHION INTERIOR WITH INTERLOCKED RINGS */}
        <div 
          className="w-full h-40 bg-gradient-to-b from-[#1C0D24] via-[#14081B] to-[#0D0412] border-x-2 border-amber-400/30 flex flex-col items-center justify-center p-4 relative overflow-hidden"
          style={{
            boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.9)'
          }}
        >
          {/* Velvet Cushion Indent */}
          <div className="w-48 h-24 rounded-2xl bg-[#0D0512] border border-amber-400/30 flex items-center justify-center gap-3 relative shadow-inner">
            {/* Groom Ring */}
            <div className="w-12 h-12 rounded-full border-4 border-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.6)] flex items-center justify-center relative">
              <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            {/* Bride Diamond Ring */}
            <div className="w-11 h-11 rounded-full border-4 border-amber-300 shadow-[0_0_25px_rgba(255,255,255,0.7)] flex items-center justify-center relative -mr-3">
              <Gem className="w-5 h-5 text-amber-200" />
            </div>
          </div>
          <span className="text-[11px] text-amber-300/80 font-serif mt-2 font-bold tracking-widest">
            {formattedDate}
          </span>
        </div>

        {/* SECRET SLIDING DRAWER AT THE BASE */}
        <div className="w-full relative z-30">
          {/* Drawer Face and Pull Handle */}
          <div className="w-full h-14 bg-gradient-to-r from-[#2B1736] via-[#381F47] to-[#2B1736] border-2 border-amber-400/50 rounded-b-3xl flex items-center justify-between px-6 shadow-xl">
            <span className="text-[11px] font-mono text-amber-300/80 uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>THE INVITATION DRAWER</span>
            </span>

            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold hover:bg-amber-400 hover:text-black transition flex items-center gap-1"
            >
              <span>{isDrawerOpen ? 'إغلاق الدرج' : 'سحب الدرج ⇲'}</span>
            </button>
          </div>

          {/* THE DRAWER CONTENT CARD (SLIDES FORWARD) */}
          <AnimatePresence>
            {isDrawerOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 15, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full bg-[#FCFBF8] text-[#1E1724] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-400/40 text-center space-y-5 mt-2 relative"
                style={{
                  boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
                }}
              >
                {/* Drawer Inset Border */}
                <div className="border-b border-amber-900/20 pb-3 space-y-1">
                  <span className="text-xs font-serif font-bold text-amber-800 block">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </span>
                  <p className="text-xs font-serif text-neutral-600 italic">
                    {data.weddingMessage || custom.holyVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
                  </p>
                </div>

                {/* Couple Names */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
                    WEDDING CELEBRATION
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-serif font-black text-neutral-900">
                    {data.groomName} & {data.brideName}
                  </h1>
                  <p className="text-xs font-serif text-neutral-600 max-w-xs mx-auto leading-relaxed pt-1">
                    {custom.drawerNote || 'يسعدنا ويشرفنا حضوركم ومشاركتنا أبهى ليالي العمر لتكتمل سعادتنا برؤيتكم بيننا.'}
                  </p>
                </div>

                {/* Venue Details */}
                <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 font-serif font-bold text-sm text-neutral-900">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    <span>{data.venueName}</span>
                  </div>
                  {data.venueAddress && (
                    <p className="text-xs text-neutral-600 font-serif">{data.venueAddress}</p>
                  )}
                  <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-neutral-600 pt-1 border-t border-amber-200/60">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>{data.weddingTime || 'السابعة والنصف مساءً (07:30 PM)'}</span>
                  </div>

                  {data.googleMapsUrl && (
                    <a
                      href={data.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>فتح الموقع على Google Maps</span>
                    </a>
                  )}
                </div>

                {/* WhatsApp RSVP */}
                {data.contactButtonsEnabled && (data.groomWhatsapp || data.brideWhatsapp) && (
                  <div className="space-y-2 pt-2 border-t border-neutral-200">
                    <span className="text-xs font-serif text-neutral-600 block">
                      تأكيد الحضور والتهاني:
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
                          className="py-2.5 px-2 rounded-xl bg-[#2B1736] hover:bg-[#3E224F] text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition shadow"
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
      </div>
    </div>
  );
};
