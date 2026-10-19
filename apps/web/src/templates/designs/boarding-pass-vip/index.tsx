'use client';

import React, { useState, useRef } from 'react';
import { TemplateRenderContext } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Plane, 
  Calendar, 
  Clock, 
  MapPin, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles,
  RotateCcw,
  Utensils,
  Ticket
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BoardingPassVipTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isTorn, setIsTorn] = useState(false);
  const [mealPreference, setMealPreference] = useState<'meat' | 'chicken' | 'diet'>('meat');
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

  const handleTearStub = () => {
    if (isTorn) return;
    setIsTorn(true);

    if (data.music && audioRef.current && !isPlayingAudio) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#1E3A8A', '#F8FAFC', '#F59E0B']
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
      className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 font-cairo bg-[#0B1320] text-slate-800 selection:bg-amber-400/30 overflow-x-hidden relative"
      dir="rtl"
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

        {isTorn && (
          <button
            onClick={() => setIsTorn(false)}
            className="px-3.5 py-2 rounded-full bg-white/10 backdrop-blur-md shadow-lg border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 hover:bg-white/20 active:scale-95 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة دمج التذكرة</span>
          </button>
        )}
      </div>

      {/* Atmospheric Starry Airport Lights Background */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Label */}
      <div className="text-center mb-6 space-y-1.5 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
          <Plane className="w-3.5 h-3.5" />
          <span>{custom.boardingHeader || 'ROYAL AIRLINES • FIRST CLASS WEDDING PASS'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-wide">
          تذكرة سفر إلى ليلة العمر
        </h2>
        <p className="text-xs text-slate-400">
          {!isTorn ? 'انقر على كعب التذكرة (RSVP STUB) لقص التذكرة وتأكيد صعود الطائرة' : 'تم تأكيد حجز مقعدك بنجاح في رحلة العمر!'}
        </p>
      </div>

      {/* THE VIP BOARDING PASS TICKET CONTAINER */}
      <div className="w-full max-w-3xl flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden bg-white border border-slate-200 relative z-10">
        
        {/* =================== SECTION 1: MAIN TICKET BODY =================== */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-white via-slate-50 to-[#F8F9FA] relative">
          
          {/* Ticket Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold font-mono shadow-md">
                VIP
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
                  BOARDING PASS
                </span>
                <span className="font-bold text-slate-900 text-sm font-serif">
                  {custom.ticketSubtitle || 'رحلة القفص الذهبي والسعادة الأبدية'}
                </span>
              </div>
            </div>

            <div className="text-left font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">FLIGHT NO.</span>
              <span className="font-bold text-amber-600 text-sm tracking-wider">
                {custom.flightNumber || 'LOVE-2026'}
              </span>
            </div>
          </div>

          {/* Passenger & Flight Journey Route */}
          <div className="my-6 space-y-6">
            {/* Passenger Names */}
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                PASSENGERS (العروسان)
              </span>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
                  {data.groomName}
                </h1>
                <span className="text-amber-500 font-serif italic text-xl">&</span>
                <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
                  {data.brideName}
                </h1>
              </div>
            </div>

            {/* Departure to Destination Flight Path */}
            <div className="bg-slate-100/90 rounded-2xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">ORIGIN (محطة الإقلاع)</span>
                  <div className="text-base font-bold text-slate-800 font-serif">
                    {custom.originCity || 'حياة العزوبية'}
                  </div>
                  <span className="text-xs text-amber-600 font-mono">SGL ➔</span>
                </div>

                <div className="flex flex-col items-center px-4">
                  <Plane className="w-6 h-6 text-amber-500 -rotate-90 animate-pulse" />
                  <div className="w-20 border-b border-dashed border-amber-400 my-1" />
                  <span className="text-[10px] font-mono text-slate-400">NON-STOP FLIGHT</span>
                </div>

                <div className="text-left">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">DESTINATION (الوجهة)</span>
                  <div className="text-base font-bold text-slate-800 font-serif">
                    {custom.destinationCity || 'عش الزوجية الأبدي'}
                  </div>
                  <span className="text-xs text-emerald-600 font-mono">FOREVER ♥</span>
                </div>
              </div>
            </div>

            {/* Flight Details Grid (Date, Time, Gate, Seat) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-right">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-mono text-slate-400 block">DATE (تاريخ الرحلة)</span>
                <span className="text-xs font-bold text-slate-900">{formattedDate}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-mono text-slate-400 block">TIME (موعد الصعود)</span>
                <span className="text-xs font-bold text-amber-600 font-mono">{data.weddingTime || '07:30 PM'}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-mono text-slate-400 block">GATE (بوابة القاعة)</span>
                <span className="text-xs font-bold text-slate-900 truncate block">{data.venueName}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-mono text-slate-400 block">SEAT (المقعد)</span>
                <span className="text-xs font-bold text-emerald-600 font-mono">1A (FIRST CLASS)</span>
              </div>
            </div>

            {/* Venue & Maps Button */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600 font-serif">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{data.venueAddress || data.venueName}</span>
              </div>
              {data.googleMapsUrl && (
                <a
                  href={data.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>فتح بوابة المطار (موقع القاعة) على Google Maps</span>
                </a>
              )}
            </div>
          </div>

          {/* Ticket Barcode Strip */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-7 flex items-center gap-0.5 opacity-75">
                {[4, 2, 6, 2, 8, 3, 2, 5, 2, 7, 3, 5, 2, 4, 6, 3, 2, 5, 7, 3, 2].map((w, idx) => (
                  <div key={idx} className="bg-slate-900 h-full" style={{ width: `${w}px` }} />
                ))}
              </div>
              <span className="text-[9px] font-mono text-slate-400 tracking-widest block">
                {custom.flightBarcode || '8839201948201928371940'}
              </span>
            </div>

            <div className="text-left">
              <span className="text-[10px] font-mono text-amber-600 font-bold uppercase tracking-wider block">
                PRIORITY BOARDING
              </span>
              <span className="text-[10px] text-slate-400 font-serif">
                دعوة خاصة لشخصكم الكريم
              </span>
            </div>
          </div>
        </div>

        {/* Perforation Cut Divider (Visual dashes with top & bottom notches) */}
        <div className="hidden md:flex flex-col items-center justify-between w-6 bg-slate-100 relative">
          <div className="w-6 h-6 bg-[#0B1320] rounded-full -mt-3" />
          <div className="h-full border-r-2 border-dashed border-slate-300" />
          <div className="w-6 h-6 bg-[#0B1320] rounded-full -mb-3" />
        </div>

        {/* =================== SECTION 2: TEAR-OFF RSVP STUB =================== */}
        <motion.div 
          animate={isTorn ? { rotate: [0, 4, -4, 0], scale: [1, 1.02, 1] } : {}}
          className={`w-full md:w-72 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-r border-dashed border-slate-300 transition-colors ${
            isTorn ? 'bg-amber-50/80' : 'bg-[#FAFAFA]'
          }`}
        >
          {/* Stub Header */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
              <span className="text-[11px] font-mono font-bold text-slate-900 uppercase">
                RSVP STUB
              </span>
              <span className="text-[10px] font-mono text-amber-600 bg-amber-100 px-2 py-0.5 rounded">
                PASSENGER TEAR-OFF
              </span>
            </div>

            <div className="space-y-2 text-right">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">GUEST CONFIRMATION</span>
                <span className="text-xs font-bold text-slate-800 font-serif">
                  تأكيد صعود الطائرة والحضور
                </span>
              </div>

              {/* Meal Preference Selector */}
              <div className="pt-2">
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1 mb-1.5">
                  <Utensils className="w-3 h-3 text-amber-500" />
                  <span>تفضيل وجبة العشاء:</span>
                </span>
                <div className="grid grid-cols-3 gap-1 text-[11px] font-serif">
                  <button
                    onClick={() => setMealPreference('meat')}
                    className={`py-1 rounded border transition ${mealPreference === 'meat' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'}`}
                  >
                    لحم فاخر
                  </button>
                  <button
                    onClick={() => setMealPreference('chicken')}
                    className={`py-1 rounded border transition ${mealPreference === 'chicken' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'}`}
                  >
                    دجاج
                  </button>
                  <button
                    onClick={() => setMealPreference('diet')}
                    className={`py-1 rounded border transition ${mealPreference === 'diet' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'}`}
                  >
                    نباتي
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Tear Action / RSVP Buttons */}
          <div className="my-4">
            {!isTorn ? (
              <button
                onClick={handleTearStub}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 group active:scale-95 transition"
              >
                <Ticket className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>قص التذكرة وتأكيد الحضور ✂</span>
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-3"
              >
                <div className="p-2.5 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>تم تأكيد حجز مقعدك بنجاح!</span>
                </div>

                {data.contactButtonsEnabled && (data.groomWhatsapp || data.brideWhatsapp) && (
                  <div className="space-y-1.5">
                    {data.groomWhatsapp && (
                      <a
                        href={`https://wa.me/${data.groomWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً يا ${data.groomName}، لقد قمت بقص تذكرة الصعود وتأكيد حضوري لرحلة العمر معكم! ✈️ وجبتي المفضلة: ${mealPreference === 'meat' ? 'لحم' : mealPreference === 'chicken' ? 'دجاج' : 'نباتي'}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition shadow"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>إرسال تأكيد الحجز للعريس</span>
                      </a>
                    )}
                    {data.brideWhatsapp && (
                      <a
                        href={`https://wa.me/${data.brideWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً يا ${data.brideName}، لقد قمت بقص تذكرة الصعود وتأكيد حضوري لرحلة العمر معكم! 🌸`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition shadow"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>إرسال تأكيد الحجز للعروس</span>
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Mini Barcode for Stub */}
          <div className="border-t border-slate-200 pt-2 text-center">
            <div className="h-5 flex items-center justify-center gap-0.5 opacity-60">
              {[3, 2, 4, 1, 3, 5, 2, 4, 2, 6, 2, 3, 2].map((w, idx) => (
                <div key={idx} className="bg-slate-900 h-full" style={{ width: `${w}px` }} />
              ))}
            </div>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mt-0.5">
              SEAT 01A • CONFIRMED
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
