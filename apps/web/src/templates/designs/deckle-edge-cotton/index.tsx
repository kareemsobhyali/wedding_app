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
  MessageCircle,
  Flower2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DeckleEdgeCottonTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const custom = data.customData || {};
  const weddingDate = new Date(data.weddingDate);

  const formattedDate = weddingDate.toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePos({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!e.touches[0]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    const y = ((e.touches[0].clientY - rect.top) / rect.height) * 100;
    setGlarePos({ x, y });
  };

  const handleCardClick = () => {
    if (data.music && audioRef.current && !isPlayingAudio) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    confetti({
      particleCount: 50,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#FAF6F0', '#C5A059', '#E6D7C3']
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
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 font-cairo bg-[#EBE7DF] text-[#2C241E] selection:bg-amber-200 overflow-x-hidden relative"
      dir="rtl"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.8), rgba(225,219,209,0.95))'
      }}
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
            className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-[#D5C7B5] flex items-center justify-center text-[#5C4D3C] hover:bg-white active:scale-95 transition"
            title={isPlayingAudio ? 'كتم الصوت' : 'تشغيل الموسيقى'}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-5 h-5 text-[#8C6D4F] animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-neutral-400" />
            )}
          </button>
        </div>
      )}

      {/* Top Helper */}
      <div className="text-center mb-6 space-y-1 z-10">
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#8C765C] block">
          HANDMADE COTTON PAPER • LETTERPRESS & FOIL
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#2C241E] font-normal tracking-wide">
          ورق القطن اليدوي والذهب النافر
        </h2>
        <p className="text-xs text-[#7A6B5D]">
          حرك إصبعك أو الماوس فوق الكرت لمشاهدة لمعان الذهب وانعكاس الضوء الحي
        </p>
      </div>

      {/* THE DECKLE-EDGE COTTON CARD */}
      <div
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={handleCardClick}
        className="w-full max-w-[420px] sm:max-w-[460px] bg-[#FAF8F5] p-7 sm:p-10 rounded-2xl relative shadow-2xl cursor-pointer overflow-hidden text-center flex flex-col justify-between"
        style={{
          boxShadow: '0 30px 80px -15px rgba(0,0,0,0.25), inset 0 0 40px rgba(225,215,200,0.5)',
          border: '1px solid rgba(213,199,181,0.6)'
        }}
      >
        {/* INTERACTIVE METALLIC FOIL SPECULAR GLARE OVERLAY */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-70 z-30"
          style={{
            background: `radial-gradient(circle 300px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 230, 160, 0.45), transparent 70%)`,
            mixBlendMode: 'color-dodge'
          }}
        />

        {/* Dried Botanical Sprig Accent at Top Center */}
        <div className="mx-auto w-10 h-10 rounded-full bg-[#FAF3E8] border border-[#D5C7B5] flex items-center justify-center text-[#8C6D4F] shadow-sm mb-3 z-10">
          <Flower2 className="w-5 h-5" />
        </div>

        {/* Holy Verse / Monogram */}
        <div className="space-y-3 z-10">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#8C6D4F] block uppercase font-bold">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
          <p className="text-xs sm:text-sm font-serif text-[#5C4D3C] italic max-w-xs mx-auto leading-relaxed">
            {data.weddingMessage || custom.holyVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
          </p>
          <div className="w-12 h-0.5 bg-[#D4AF37]/50 mx-auto" />
        </div>

        {/* Couple Names Section with Letterpress Deboss Look */}
        <div className="my-6 space-y-3 z-10">
          <p className="text-[11px] font-mono tracking-widest uppercase text-[#8C7B6B]">
            {custom.invitationIntro || 'يسرنا ويشرفنا دعوتكم لحضور حفل زفاف'}
          </p>

          <div className="space-y-1">
            <h1 
              className="text-4xl sm:text-5xl font-serif font-black text-[#2A231C] tracking-wide"
              style={{
                textShadow: '0 1px 1px rgba(255,255,255,0.9), inset 0 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              {data.groomName}
            </h1>
            <span className="text-2xl font-serif italic text-[#8C6D37] block my-1">&</span>
            <h1 
              className="text-4xl sm:text-5xl font-serif font-black text-[#2A231C] tracking-wide"
              style={{
                textShadow: '0 1px 1px rgba(255,255,255,0.9), inset 0 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              {data.brideName}
            </h1>
          </div>

          <p className="text-xs font-serif text-[#5C4D3C] leading-relaxed max-w-sm mx-auto pt-2">
            {custom.invitationNote || 'بحضوركم تكتمل بهجتنا، وتزداد ليلتنا نوراً وسعادة بحضور الأهل والأحباب.'}
          </p>
        </div>

        {/* Date, Time & Venue Block */}
        <div className="bg-[#FAF4EB] border border-[#E3D9CC] rounded-2xl p-5 space-y-3 z-10 shadow-sm">
          <div className="flex items-center justify-center gap-2 font-serif font-bold text-sm text-[#2A231C]">
            <Calendar className="w-4 h-4 text-[#8C6D37]" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#6B5A4B] font-serif">
            <Clock className="w-3.5 h-3.5 text-[#8C6D37]" />
            <span>{data.weddingTime || 'السابعة والنصف مساءً'}</span>
          </div>
          <div className="pt-2 border-t border-[#E3D9CC] space-y-1">
            <div className="flex items-center justify-center gap-1.5 font-serif font-bold text-xs text-[#2A231C]">
              <MapPin className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span>{data.venueName}</span>
            </div>
            {data.venueAddress && (
              <p className="text-[11px] text-neutral-500 font-serif">{data.venueAddress}</p>
            )}
          </div>

          {data.googleMapsUrl && (
            <a
              href={data.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full py-2.5 px-3 rounded-xl bg-[#2A231C] hover:bg-[#3E3329] text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>فتح الموقع على Google Maps</span>
            </a>
          )}
        </div>

        {/* WhatsApp RSVP */}
        {data.contactButtonsEnabled && (data.groomWhatsapp || data.brideWhatsapp) && (
          <div className="pt-4 border-t border-[#E3D9CC] space-y-2 z-10 mt-4">
            <span className="text-[11px] font-serif text-[#6B5A4B] block">
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
                  className="py-2.5 px-2 rounded-xl bg-[#8C6D37] hover:bg-[#9E7C41] text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition shadow"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>تهنئة العروس</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Bottom Gilded Seal Accent */}
        <div className="mt-4 text-[11px] font-serif italic text-[#8C6D4F] z-10">
          {custom.closingNote || '«فرحتنا تكتمل بوجودكم بيننا في ليلتنا المنتظرة 🤍»'}
        </div>
      </div>
    </div>
  );
};
