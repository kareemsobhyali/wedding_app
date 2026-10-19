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
  Crown,
  ScrollText,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RoyalScrollTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isUnrolled, setIsUnrolled] = useState(false);
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

  const handleUnroll = () => {
    if (isUnrolled) return;
    setIsUnrolled(true);

    if (data.music && audioRef.current && !isPlayingAudio) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#D4AF37', '#996515', '#FFF8DC', '#C5A059']
    });
  };

  const handleReroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUnrolled(false);
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
      className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 font-cairo bg-gradient-to-b from-[#140E0A] via-[#20150F] to-[#0E0906] text-[#3A2A1A] selection:bg-amber-300 overflow-x-hidden relative"
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

        {isUnrolled && (
          <button
            onClick={handleReroll}
            className="px-3.5 py-2 rounded-full bg-white/10 backdrop-blur-md shadow-lg border border-amber-400/30 text-xs font-bold text-amber-300 flex items-center gap-1.5 hover:bg-white/20 active:scale-95 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة لف المخطوطة</span>
          </button>
        )}
      </div>

      {/* Ambient Warm Golden Chamber Glow */}
      <div className="absolute top-1/4 w-[460px] h-[460px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Helper */}
      <div className="text-center mb-5 space-y-1 z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>{custom.scrollSubtitle || 'IMPERIAL ROYAL DECREE • مرسوم زفاف ملكي'}</span>
        </div>
        <p className="text-xs text-amber-200/60 pt-1">
          {!isUnrolled ? 'المس المخطوطة الملكية أو اسحبها للأسفل لفض المرسوم وقراءة الفرمان' : 'صدر الفرمان السامي بمباركة الجمع الكريم'}
        </p>
      </div>

      {/* THE ROYAL SCROLL CONTAINER */}
      <div className="w-full max-w-[420px] sm:max-w-[480px] flex flex-col items-center relative z-10">
        
        {/* UPPER WOODEN ROD WITH GILDED FINIALS */}
        <div className="w-full flex items-center justify-between relative z-30 drop-shadow-2xl">
          {/* Left Golden Finial */}
          <div className="w-7 h-10 rounded-l-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 shadow-md border-y border-l border-amber-200" />
          {/* Main Wooden Rod Body */}
          <div className="flex-1 h-7 bg-gradient-to-b from-[#53301B] via-[#85522F] to-[#3B1F0E] border-y-2 border-amber-400/60 rounded-sm shadow-inner flex items-center justify-center">
            <div className="w-full h-[1px] bg-amber-300/40" />
          </div>
          {/* Right Golden Finial */}
          <div className="w-7 h-10 rounded-r-full bg-gradient-to-l from-amber-300 via-amber-500 to-amber-700 shadow-md border-y border-r border-amber-200" />
          
          {/* Hanging Left Silk Tassel */}
          <div className="absolute -left-1 top-7 flex flex-col items-center pointer-events-none">
            <div className="w-1.5 h-8 bg-amber-400/80" />
            <div className="w-3.5 h-6 rounded-b-full bg-amber-500 shadow-md" />
          </div>
          {/* Hanging Right Silk Tassel */}
          <div className="absolute -right-1 top-7 flex flex-col items-center pointer-events-none">
            <div className="w-1.5 h-8 bg-amber-400/80" />
            <div className="w-3.5 h-6 rounded-b-full bg-amber-500 shadow-md" />
          </div>
        </div>

        {/* PARCHMENT BODY (EXPANDS OR REMAINS ROLLED) */}
        <motion.div
          animate={{ height: isUnrolled ? 'auto' : '150px' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          onClick={!isUnrolled ? handleUnroll : undefined}
          className={`w-[93%] bg-[#F7EEDD] border-x-4 border-amber-800/30 overflow-hidden shadow-2xl relative transition-all ${
            !isUnrolled ? 'cursor-pointer hover:brightness-105' : ''
          }`}
          style={{
            backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.7), rgba(247,238,221,0.95))',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), inset 0 0 45px rgba(160,110,60,0.25)'
          }}
        >
          {/* Antique Inset Filigree Border */}
          <div className="p-5 sm:p-7 flex flex-col justify-between text-center relative z-10 min-h-[500px]">
            
            {/* Top Ornamental Seal & Bismillah */}
            <div className="space-y-2 border-b-2 border-amber-900/20 pb-4">
              <div className="w-12 h-12 mx-auto rounded-full border-2 border-amber-700/60 bg-amber-100 flex items-center justify-center shadow-inner">
                <Crown className="w-6 h-6 text-amber-800" />
              </div>
              <span className="text-[11px] font-mono tracking-[0.25em] text-amber-900 uppercase block font-bold">
                {custom.decreeHeader || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
              </span>
              <p className="text-xs font-serif text-amber-950/80 italic max-w-xs mx-auto">
                {data.weddingMessage || custom.decreeVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
              </p>
            </div>

            {/* Decree Main Proclamation */}
            <div className="my-6 space-y-4">
              <span className="text-xs font-serif font-bold text-amber-900/90 tracking-widest block uppercase">
                {custom.decreeTitle || 'فرمان ملكي صادر بالبشرى والمسرة'}
              </span>

              <div className="space-y-1">
                <p className="text-xs text-amber-950 font-serif">
                  {custom.introLine || 'يتشرف قصر العروسين بإعلان عقد القران الميمون وزفاف:'}
                </p>
                <div className="py-2">
                  <h1 className="text-3xl sm:text-4xl font-serif font-black text-amber-950">
                    {data.groomName}
                  </h1>
                  <span className="text-2xl font-serif italic text-amber-800">&</span>
                  <h1 className="text-3xl sm:text-4xl font-serif font-black text-amber-950">
                    {data.brideName}
                  </h1>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-serif text-amber-950 leading-relaxed max-w-sm mx-auto pt-1 border-t border-amber-900/15">
                {custom.decreeBody || 'يسعدنا ويشرفنا دعوة معاليكم وأحبابكم لحضور ليلتنا الكبرى، لنشهد معاً تتويج هذا الرباط المقدس بمكارم جمعكم وطيب أنسكم.'}
              </p>
            </div>

            {/* Date & Imperial Palace Venue Box */}
            <div className="my-4 bg-amber-50/70 border border-amber-900/20 rounded-2xl p-4 text-amber-950 space-y-3">
              <div className="flex items-center justify-center gap-2 font-bold text-sm font-serif text-amber-900">
                <Calendar className="w-4 h-4 text-amber-800" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-serif text-amber-900/80">
                <Clock className="w-3.5 h-3.5 text-amber-800" />
                <span>{data.weddingTime || 'السابعة والنصف مساءً'}</span>
              </div>
              <div className="pt-2 border-t border-amber-900/10">
                <div className="flex items-center justify-center gap-1.5 font-bold text-xs font-serif text-amber-950">
                  <MapPin className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                  <span>{data.venueName}</span>
                </div>
                {data.venueAddress && (
                  <p className="text-[11px] text-amber-900/70 font-serif mt-0.5">{data.venueAddress}</p>
                )}
              </div>

              {data.googleMapsUrl && (
                <a
                  href={data.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-900 hover:to-amber-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>موقع القصر الملكي على Google Maps</span>
                </a>
              )}
            </div>

            {/* Royal Wax Seal of Decree Stamp */}
            <div className="my-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-700 via-red-800 to-red-950 border-2 border-red-500/50 shadow-xl flex flex-col items-center justify-center text-amber-200">
                <Crown className="w-5 h-5" />
                <span className="text-[9px] font-mono tracking-widest mt-0.5">ROYAL</span>
              </div>
              <span className="text-[10px] font-serif text-amber-950/70 mt-1 font-bold">
                خُتم بالمرسوم السامي
              </span>
            </div>

            {/* WhatsApp RSVP */}
            {data.contactButtonsEnabled && (data.groomWhatsapp || data.brideWhatsapp) && (
              <div className="pt-3 border-t border-amber-900/20 space-y-2">
                <span className="text-[11px] font-serif text-amber-950 block">
                  تأكيد الحضور وتقديم التهاني للديوان:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {data.groomWhatsapp && (
                    <a
                      href={`https://wa.me/${data.groomWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.groomName}، يشرفني تلبية المرسوم الملكي وتأكيد حضوري لمشاركتكم الفرحة! 🎉`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition shadow"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>تهنئة العريس</span>
                    </a>
                  )}
                  {data.brideWhatsapp && (
                    <a
                      href={`https://wa.me/${data.brideWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.brideName}، يشرفني تلبية المرسوم الملكي وتأكيد حضوري لمشاركتكم الفرحة! 🌸`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition shadow"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>تهنئة العروس</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Decree Closing */}
            <div className="mt-4 text-[11px] font-serif italic text-amber-900">
              {custom.decreeClosing || '«دامت الأفراح بدياركم عامرة بالمسرات والمحبة»'}
            </div>
          </div>

          {/* Unrolled Click Mask Overlay when closed */}
          {!isUnrolled && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#F7EEDD] via-[#F7EEDD]/80 to-transparent flex flex-col items-center justify-end pb-3 z-20">
              <div className="flex items-center gap-1 text-xs font-serif font-bold text-amber-900 bg-amber-200/90 px-3 py-1.5 rounded-full border border-amber-600/40 shadow animate-bounce">
                <span>انقر لفض وفرد المخطوطة</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          )}
        </motion.div>

        {/* LOWER WOODEN ROD WITH GILDED FINIALS */}
        <div className="w-full flex items-center justify-between relative z-30 drop-shadow-2xl">
          {/* Left Golden Finial */}
          <div className="w-7 h-10 rounded-l-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 shadow-md border-y border-l border-amber-200" />
          {/* Main Wooden Rod Body */}
          <div className="flex-1 h-7 bg-gradient-to-b from-[#53301B] via-[#85522F] to-[#3B1F0E] border-y-2 border-amber-400/60 rounded-sm shadow-inner flex items-center justify-center">
            <div className="w-full h-[1px] bg-amber-300/40" />
          </div>
          {/* Right Golden Finial */}
          <div className="w-7 h-10 rounded-r-full bg-gradient-to-l from-amber-300 via-amber-500 to-amber-700 shadow-md border-y border-r border-amber-200" />
        </div>
      </div>
    </div>
  );
};
