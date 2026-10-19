'use client';

import React, { useState, useRef } from 'react';
import { TemplateRenderContext } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Palette, 
  CameraOff, 
  Baby, 
  MessageCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LuxuryBookletEditorialTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;
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

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      if (currentPage === totalPages - 1) {
        confetti({
          particleCount: 50,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#000000', '#D4AF37', '#F5F5F5']
        });
      }
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
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

  // Color palette swatches
  const colorSwatches = (custom.dressColors || '#1A1A1A,#D4AF37,#E5D9C5,#FFFFFF').split(',');

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 font-cairo bg-[#121214] text-[#1A1A1A] selection:bg-neutral-300 overflow-x-hidden relative"
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
            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md shadow-lg border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition"
            title={isPlayingAudio ? 'كتم الصوت' : 'تشغيل الموسيقى'}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-5 h-5 text-amber-300 animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-neutral-400" />
            )}
          </button>
        </div>
      )}

      {/* Top Booklet Tracker */}
      <div className="mb-4 text-center z-10 space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-neutral-300 text-[11px] font-mono tracking-widest uppercase">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>{custom.magazineHeader || 'THE WEDDING CHRONICLE • LUXURY EDITION'}</span>
        </div>
        <p className="text-xs text-neutral-400">
          تصفح صفحات الكتيب الفاخر لمعرفة كامل تفاصيل الحفل
        </p>
      </div>

      {/* THE BOOKLET CONTAINER */}
      <div className="w-full max-w-[420px] sm:max-w-[480px] min-h-[580px] sm:min-h-[640px] rounded-[2rem] bg-[#FAF8F5] shadow-2xl border-4 border-[#222] flex flex-col justify-between p-6 sm:p-8 relative overflow-hidden text-neutral-900">
        
        {/* Soft Book Texture Watermark */}
        <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 opacity-80" />

        <AnimatePresence mode="wait">
          {/* ===================== PAGE 1: THE EDITORIAL COVER ===================== */}
          {currentPage === 1 && (
            <motion.div
              key="page-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col justify-between text-center py-2"
            >
              {/* Masthead */}
              <div className="border-b-2 border-neutral-900 pb-3">
                <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase">
                  <span>VOL. 01</span>
                  <span>SPECIAL WEDDING ISSUE</span>
                  <span>{weddingDate.getFullYear()}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-neutral-950 mt-1 uppercase">
                  {custom.magazineTitle || 'THE WEDDING'}
                </h2>
              </div>

              {/* Main Headline & Couple Names */}
              <div className="my-auto space-y-4">
                <span className="text-xs font-mono tracking-[0.3em] uppercase text-neutral-600 block">
                  CELEBRATING THE UNION OF
                </span>

                <div className="space-y-1">
                  <h1 className="text-4xl sm:text-5xl font-serif font-black text-neutral-900 leading-tight">
                    {data.groomName}
                  </h1>
                  <span className="text-2xl font-serif italic text-amber-700">&</span>
                  <h1 className="text-4xl sm:text-5xl font-serif font-black text-neutral-900 leading-tight">
                    {data.brideName}
                  </h1>
                </div>

                <div className="w-16 h-0.5 bg-neutral-900 mx-auto my-3" />

                <p className="text-xs font-serif text-neutral-600 italic px-4">
                  {custom.coverTeaser || '«في مساء يُسطر بالحب والأناقة، نحتفل معاً بأجمل بدايات العمر»'}
                </p>
              </div>

              {/* Cover Bottom Date & Location */}
              <div className="border-t border-neutral-300 pt-3 flex justify-between items-center text-xs font-serif text-neutral-800">
                <div className="font-bold">{formattedDate}</div>
                <div className="text-neutral-500 font-mono text-[11px]">{data.weddingTime || '07:30 PM'}</div>
              </div>
            </motion.div>
          )}

          {/* ===================== PAGE 2: THE INVITATION LETTER ===================== */}
          {currentPage === 2 && (
            <motion.div
              key="page-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col justify-between py-2 text-right"
            >
              <div>
                <div className="flex justify-between items-center border-b border-neutral-300 pb-2 mb-4">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    PAGE 02 • THE INVITATION
                  </span>
                  <span className="text-xs font-serif italic text-neutral-600">افتتاحية العدد</span>
                </div>

                <div className="space-y-4">
                  <span className="text-sm font-bold font-serif text-amber-800 block text-center">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </span>

                  <p className="text-sm font-serif text-neutral-800 leading-relaxed text-center px-2">
                    {data.weddingMessage || custom.holyVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
                  </p>

                  <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm space-y-2 mt-4">
                    <h3 className="font-serif font-bold text-base text-neutral-900">
                      {custom.letterHeadline || 'أهلاً بكم في ليلتنا المنتظرة'}
                    </h3>
                    <p className="text-xs sm:text-sm font-serif text-neutral-600 leading-relaxed">
                      {custom.letterBody || 'يسعدنا ويشرفنا دعوتكم لمشاركتنا فرحة العمر وتتويج مسيرة الحب في ليلتنا، فحضوركم بيننا هو السر الأكبر لاكتمال بهجتنا وسعادتنا.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <span className="text-xs font-serif italic text-neutral-500">
                  {data.groomName} & {data.brideName}
                </span>
              </div>
            </motion.div>
          )}

          {/* ===================== PAGE 3: DRESS CODE & ETIQUETTE ===================== */}
          {currentPage === 3 && (
            <motion.div
              key="page-3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col justify-between py-2 text-right"
            >
              <div>
                <div className="flex justify-between items-center border-b border-neutral-300 pb-2 mb-4">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    PAGE 03 • STYLE & ETIQUETTE
                  </span>
                  <span className="text-xs font-serif italic text-neutral-600">إرشادات وأناقة الليلة</span>
                </div>

                {/* Color Palette Swatches */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-xs font-bold font-serif text-neutral-900">
                    <Palette className="w-4 h-4 text-amber-700" />
                    <span>باليت ألوان الحفل المقترحة:</span>
                  </div>

                  <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-neutral-200">
                    {colorSwatches.map((col: string, idx: number) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <span 
                          className="w-8 h-8 rounded-full border border-neutral-300 shadow-sm"
                          style={{ backgroundColor: col.trim() }}
                        />
                      </div>
                    ))}
                    <span className="text-xs font-serif text-neutral-600 pr-2">
                      {custom.dressCodeText || 'ملابس سهرة رسمية تناسب ألوان الليلة'}
                    </span>
                  </div>
                </div>

                {/* Etiquette Notes */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold font-serif text-neutral-900 block">
                    إتيكيت الحفل:
                  </span>

                  <div className="flex items-start gap-3 bg-white p-3 rounded-2xl border border-neutral-200 text-xs font-serif text-neutral-700">
                    <CameraOff className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                    <span>{custom.unpluggedText || 'رجاءً الاستمتاع باللحظة والتقليل من التصوير بالهواتف أثناء الزفة.'}</span>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-3 rounded-2xl border border-neutral-200 text-xs font-serif text-neutral-700">
                    <Baby className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                    <span>{custom.kidsText || 'جنة الأطفال منازلهم.. نعتذر عن قبول حضور الأطفال مع كامل المحبة.'}</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2 text-[11px] font-mono text-neutral-400">
                SWIPE OR TAP NEXT FOR VENUE & RSVP
              </div>
            </motion.div>
          )}

          {/* ===================== PAGE 4: VENUE, MAPS & RSVP ===================== */}
          {currentPage === 4 && (
            <motion.div
              key="page-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col justify-between py-2 text-right"
            >
              <div>
                <div className="flex justify-between items-center border-b border-neutral-300 pb-2 mb-4">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    PAGE 04 • VENUE & RSVP
                  </span>
                  <span className="text-xs font-serif italic text-neutral-600">الموقع وتأكيد الحضور</span>
                </div>

                {/* Venue Details */}
                <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold font-serif text-neutral-900">
                    <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{data.venueName}</span>
                  </div>
                  {data.venueAddress && (
                    <p className="text-xs text-neutral-500 font-serif leading-relaxed pr-6">
                      {data.venueAddress}
                    </p>
                  )}

                  {data.googleMapsUrl && (
                    <a
                      href={data.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>فتح الموقع على Google Maps</span>
                    </a>
                  )}
                </div>

                {/* WhatsApp RSVP */}
                {data.contactButtonsEnabled && (data.groomWhatsapp || data.brideWhatsapp) && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold font-serif text-neutral-800 block">
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
                          className="py-2.5 px-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition shadow"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>تهنئة العروس</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Final Note */}
              <div className="text-center pt-2 text-xs font-serif text-neutral-500 italic">
                {custom.closingNote || 'بكم تكتمل فرحتنا وتزداد ليلتنا نوراً وبهاءً 🤍'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================== BOOKLET BOTTOM NAVIGATION BAR ===================== */}
        <div className="pt-4 border-t border-neutral-300 flex items-center justify-between z-10">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-1 text-xs font-serif font-bold text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed hover:text-black transition"
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابقة</span>
          </button>

          {/* Page Indicators */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-6 h-6 rounded-full text-[10px] font-mono font-bold transition ${
                  currentPage === p 
                    ? 'bg-neutral-950 text-white' 
                    : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 text-xs font-serif font-bold text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed hover:text-black transition"
          >
            <span>التالية</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
