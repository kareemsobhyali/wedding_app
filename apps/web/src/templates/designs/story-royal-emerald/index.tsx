'use client';

import React from 'react';
import { TemplateRenderContext } from '../../types';
import { StoryPlayer, StorySlideItem, StoryThemeConfig } from '../story-engine/StoryPlayer';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Sparkles, Heart } from 'lucide-react';

export const StoryRoyalEmeraldTemplate: React.FC<TemplateRenderContext> = ({ data }) => {
  const weddingDate = new Date(data.weddingDate);
  const custom = data.customData || {};

  const theme: StoryThemeConfig = {
    themeName: 'Royal Emerald ⚜️',
    accentColor: '#F3C969',
    progressBarColor: '#FFD700',
    progressBarBg: 'rgba(255, 215, 0, 0.2)',
    bgGradient: 'radial-gradient(ellipse at 50% 30%, #0c3327 0%, #051610 100%)',
    textColor: '#FFF7E6',
    badgeBg: '#0e3a2c'
  };

  const slides: StorySlideItem[] = [
    // Slide 1: Emerald & Gold Seal
    {
      id: 'emerald-seal',
      duration: 6,
      renderContent: () => (
        <div className="w-full h-full flex flex-col justify-between items-center p-6 text-center pt-24 pb-20 relative">
          {/* Islamic Ornate Frame */}
          <div className="absolute inset-4 border border-amber-500/30 rounded-3xl pointer-events-none p-2 flex flex-col justify-between">
            <div className="flex justify-between items-center text-amber-400/60 text-xs px-2">
              <span>⚜️</span>
              <span className="text-[10px] tracking-widest font-serif">دعوة زفاف ملكية</span>
              <span>⚜️</span>
            </div>
            <div className="flex justify-center text-amber-400/60 text-xs">
              <span>❖ ❖ ❖</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 mt-4"
          >
            <p className="text-xs text-amber-300 font-serif tracking-widest">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="text-xl sm:text-2xl font-serif text-amber-100/90 leading-relaxed max-w-xs mx-auto">
              {custom.introVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا»'}
            </p>
          </motion.div>

          {/* Golden Wax / Medallion Center */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="my-auto py-4"
          >
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 p-1 shadow-2xl relative flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#082219] flex flex-col items-center justify-center border border-amber-400/50">
                <span className="text-2xl">👑</span>
                <span className="text-lg font-serif text-amber-200 mt-1">
                  {data.groomName.charAt(0)} & {data.brideName.charAt(0)}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-1">
              <h2 className="text-3xl font-serif text-amber-100 font-bold">
                {data.groomName}
              </h2>
              <p className="text-amber-400 font-serif text-lg">و</p>
              <h2 className="text-3xl font-serif text-amber-100 font-bold">
                {data.brideName}
              </h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-amber-200/80 font-serif"
          >
            يتشرفون بدعوتكم لمشاركتهم ليلة العمر ✨
          </motion.div>
        </div>
      )
    },

    // Slide 2: Romantic Invitation Verse
    {
      id: 'emerald-message',
      duration: 6,
      renderContent: () => (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center pt-24 pb-20 relative">
          <div className="absolute inset-4 border border-amber-500/30 rounded-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xs space-y-6"
          >
            <span className="text-3xl">🕊️</span>

            <h3 className="text-xl font-serif text-amber-300 font-bold">
              فرحتنا تكتمل بوجودكم
            </h3>

            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />

            <p className="text-sm font-serif text-neutral-200 leading-loose">
              {data.weddingMessage || custom.invitationNote || 'عندما تدق الساعات معلنةً بداية رحلتنا معاً، يسعدنا أن تشاركونا أجمل لحظات العمر بفرحة لا تكتمل إلا بلقياكم وحضوركم الكريم.'}
            </p>

            <p className="text-xs text-amber-400/90 font-serif italic pt-2">
              «بكم تحلو الليالي وتزداد الأفراح بهجة»
            </p>
          </motion.div>
        </div>
      )
    },

    // Slide 3: The Royal Date
    {
      id: 'emerald-date',
      duration: 6,
      renderContent: () => (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center pt-24 pb-20 relative">
          <div className="absolute inset-4 border border-amber-500/30 rounded-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xs space-y-6"
          >
            <span className="text-xs font-serif text-amber-300 tracking-widest uppercase">
              موعد الليلة المباركة
            </span>

            {/* Arch-shaped Date Container */}
            <div className="bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-400/40 rounded-t-[70px] rounded-b-3xl p-6 backdrop-blur-md shadow-2xl space-y-3">
              <Calendar className="w-8 h-8 text-amber-400 mx-auto" />
              <div className="text-5xl font-serif text-amber-200 font-bold">
                {weddingDate.getDate()}
              </div>
              <div className="text-xl font-serif text-white font-medium">
                {weddingDate.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
              </div>
              <div className="text-sm text-amber-300/80 font-serif pt-2 border-t border-amber-500/20">
                {weddingDate.toLocaleDateString('ar-EG', { weekday: 'long' })}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-amber-100 bg-[#0c3327]/80 py-2.5 px-4 rounded-full border border-amber-500/30">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{data.weddingTime || 'تبدأ المراسم في تمام الساعة 08:00 مساءً'}</span>
            </div>
          </motion.div>
        </div>
      )
    },

    // Slide 4: Royal Program / Timeline
    {
      id: 'emerald-program',
      duration: 6,
      renderContent: () => (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center pt-24 pb-20 relative">
          <div className="absolute inset-4 border border-amber-500/30 rounded-3xl pointer-events-none" />

          <div className="w-full max-w-xs space-y-5 text-right" dir="rtl">
            <div className="text-center mb-5">
              <span className="text-xs font-serif text-amber-300 tracking-widest uppercase">
                مراسم الحفل الملكي
              </span>
              <h3 className="text-2xl font-serif text-amber-100 mt-1">برنامج الليلة</h3>
            </div>

            <div className="space-y-3.5">
              <div className="bg-[#09261c]/90 border border-amber-500/30 p-3.5 rounded-2xl flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-serif text-sm font-bold shrink-0">
                  ١
                </span>
                <div>
                  <h4 className="text-sm font-bold text-amber-100 font-serif">توافد الضيوف الكرام</h4>
                  <p className="text-xs text-amber-300/70">07:30 PM • استقبال بالعود والبخور</p>
                </div>
              </div>

              <div className="bg-[#09261c]/90 border border-amber-500/30 p-3.5 rounded-2xl flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-serif text-sm font-bold shrink-0">
                  ٢
                </span>
                <div>
                  <h4 className="text-sm font-bold text-amber-100 font-serif">الزفة المباركة</h4>
                  <p className="text-xs text-amber-300/70">08:45 PM • زفة العروسين وعقد القران</p>
                </div>
              </div>

              <div className="bg-[#09261c]/90 border border-amber-500/30 p-3.5 rounded-2xl flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-serif text-sm font-bold shrink-0">
                  ٣
                </span>
                <div>
                  <h4 className="text-sm font-bold text-amber-100 font-serif">مأدبة العشاء الملكي</h4>
                  <p className="text-xs text-amber-300/70">10:00 PM • بوفيه عشاء فاخر احتفاءً بكم</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 5: The Grand Hall & Venue
    {
      id: 'emerald-venue',
      duration: 6,
      renderContent: () => (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center pt-24 pb-20 relative">
          <div className="absolute inset-4 border border-amber-500/30 rounded-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xs space-y-6"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-xl">
              <MapPin className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[11px] font-serif text-amber-300 tracking-widest uppercase">
                مكان الحفل والقاعة
              </span>
              <h3 className="text-2xl font-serif text-amber-100 font-bold mt-1">
                {data.venueName}
              </h3>
              {data.venueAddress && (
                <p className="text-xs text-neutral-300 mt-1 font-serif">{data.venueAddress}</p>
              )}
            </div>

            <div className="bg-[#082219]/90 border border-amber-500/30 rounded-2xl p-4 text-xs space-y-1 font-serif">
              <p className="text-amber-400 font-bold">قواعد اللباس (Dress Code)</p>
              <p className="text-neutral-200">{custom.dressCode || 'أزياء سهرة ملكية راقية / Formal Wear'}</p>
            </div>

            {data.googleMapsUrl && (
              <a
                href={data.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 font-bold text-xs shadow-xl active:scale-95 transition"
              >
                <MapPin className="w-4 h-4" />
                <span>عرض خريطة القاعة (Google Maps)</span>
              </a>
            )}
          </motion.div>
        </div>
      )
    }
  ];

  return (
    <StoryPlayer
      slides={slides}
      theme={theme}
      audioUrl={data.music?.url}
      invitationData={{
        groomName: data.groomName,
        brideName: data.brideName,
        weddingDate,
        venueName: data.venueName,
        venueAddress: data.venueAddress,
        googleMapsUrl: data.googleMapsUrl,
        groomWhatsapp: data.groomWhatsapp,
        brideWhatsapp: data.brideWhatsapp
      }}
    />
  );
};
