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
  Gem
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AcrylicGlassCardTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
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
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: -y * 14,
      rotateY: x * 14
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!e.touches[0]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.touches[0].clientX - rect.left) / rect.width - 0.5;
    const y = (e.touches[0].clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: -y * 14,
      rotateY: x * 14
    });
  };

  const handleCardClick = () => {
    if (data.music && audioRef.current && !isPlayingAudio) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#93C5FD', '#FFFFFF', '#FDE047']
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
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 font-cairo bg-gradient-to-b from-[#0A0D14] via-[#101726] to-[#07090F] text-white selection:bg-amber-400/30 overflow-x-hidden relative"
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
            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md shadow-lg border border-white/20 flex items-center justify-center text-amber-300 hover:bg-white/20 active:scale-95 transition"
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

      {/* Ambient Velvet Blue Glow */}
      <div className="absolute top-1/4 w-[480px] h-[480px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 w-[420px] h-[420px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Helper */}
      <div className="text-center mb-6 space-y-1 z-10">
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-amber-300/80 block">
          LUXURY BEVELED ACRYLIC GLASS SUITE
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-wide">
          البطاقة الزجاجية الأكريليك
        </h2>
        <p className="text-xs text-neutral-400">
          حرك إصبعك أو الماوس لمشاهدة الانعكاسات الضوئية على حواف الزجاج المشطوف
        </p>
      </div>

      {/* THE BEVELED ACRYLIC SLAB CONTAINER */}
      <div style={{ perspective: '1200px' }} className="w-full max-w-[420px] sm:max-w-[460px]">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseLeave}
          onClick={handleCardClick}
          animate={{
            rotateX: tilt.rotateX,
            rotateY: tilt.rotateY
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="w-full rounded-[2.5rem] p-7 sm:p-10 relative cursor-pointer text-center flex flex-col justify-between overflow-hidden shadow-2xl border-2 border-white/40"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(22px)',
            boxShadow: '0 30px 80px -15px rgba(0,0,0,0.8), inset 0 0 35px rgba(255,255,255,0.15), inset 0 2px 4px rgba(255,255,255,0.4)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Glass Specular Sheen Diagonal Line */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 40%, rgba(255,255,255,0.15) 60%, transparent 100%)'
            }}
          />

          {/* Gilded Inset Border */}
          <div className="absolute inset-3 border border-amber-300/40 rounded-[2rem] pointer-events-none p-3 flex flex-col justify-between">
            <div className="flex justify-between items-center text-[10px] text-amber-300/80 font-mono tracking-widest uppercase">
              <span>CRYSTAL ACRYLIC</span>
              <span>✦</span>
              <span>GOLD ETCHED</span>
            </div>
            <div className="flex justify-between items-center text-xs text-amber-300/70">
              <span>⚜</span>
              <span>⚜</span>
            </div>
          </div>

          {/* Top Monogram */}
          <div className="pt-2 z-10 space-y-2">
            <div className="w-14 h-14 rounded-full border border-amber-300/50 bg-white/5 mx-auto flex items-center justify-center shadow-lg">
              <span className="font-serif font-black text-base text-amber-300">
                {custom.monogram || `${data.groomName.charAt(0)}&${data.brideName.charAt(0)}`}
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-amber-300/90 uppercase block font-bold">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
            <p className="text-xs font-serif text-neutral-300 italic max-w-xs mx-auto leading-relaxed">
              {data.weddingMessage || custom.holyVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
            </p>
          </div>

          {/* Couple Announcement */}
          <div className="my-6 space-y-3 z-10">
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
              {custom.invitationIntro || 'نتشرف بدعوتكم لمشاركتنا فرحة العمر'}
            </span>
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 drop-shadow-md">
                {data.groomName}
              </h1>
              <span className="text-2xl font-serif italic text-amber-400 block my-1">&</span>
              <h1 className="text-4xl sm:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 drop-shadow-md">
                {data.brideName}
              </h1>
            </div>
            <p className="text-xs font-serif text-neutral-300 leading-relaxed max-w-sm mx-auto pt-1">
              {custom.invitationNote || 'يسعدنا ويشرفنا حضوركم ومشاركتنا أبهى ليالي العمر، لتكتمل سعادتنا برؤيتكم بيننا.'}
            </p>
          </div>

          {/* Date, Time & Venue Box */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 space-y-2.5 z-10 backdrop-blur-md shadow-inner">
            <div className="flex items-center justify-center gap-2 font-serif font-bold text-sm text-amber-200">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{data.weddingTime || 'السابعة والنصف مساءً'}</span>
            </div>
            <div className="pt-2 border-t border-white/10 space-y-1">
              <div className="flex items-center justify-center gap-1.5 font-serif font-bold text-xs text-white">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{data.venueName}</span>
              </div>
              {data.venueAddress && (
                <p className="text-[11px] text-neutral-400 font-serif">{data.venueAddress}</p>
              )}
            </div>

            {data.googleMapsUrl && (
              <a
                href={data.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>فتح الموقع على Google Maps</span>
              </a>
            )}
          </div>

          {/* WhatsApp RSVP */}
          {data.contactButtonsEnabled && (data.groomWhatsapp || data.brideWhatsapp) && (
            <div className="pt-4 border-t border-white/10 space-y-2 z-10 mt-4">
              <span className="text-[11px] font-serif text-neutral-300 block">
                تأكيد الحضور وتقديم التهاني:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {data.groomWhatsapp && (
                  <a
                    href={`https://wa.me/${data.groomWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.groomName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة! 🎉`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition shadow"
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
                    className="py-2 px-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>تهنئة العروس</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Bottom Note */}
          <div className="mt-4 text-[11px] font-serif italic text-amber-300/80 z-10">
            {custom.closingNote || '«فرحتنا لا تكتمل إلا برؤيتكم بيننا في ليلتنا المنتظرة 🤍»'}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
