'use client';

import React from 'react';
import { TemplateRenderContext } from '../../types';
import { StoryPlayer, StorySlideItem, StoryThemeConfig } from '../story-engine/StoryPlayer';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Heart, Flower2 } from 'lucide-react';

export const StoryBohoTerracottaTemplate: React.FC<TemplateRenderContext> = ({ data }) => {
  const weddingDate = new Date(data.weddingDate);
  const custom = data.customData || {};

  const theme: StoryThemeConfig = {
    themeName: 'Boho Terracotta 🌾',
    accentColor: '#B85D43',
    progressBarColor: '#D97757',
    progressBarBg: 'rgba(255, 255, 255, 0.4)',
    bgGradient: 'linear-gradient(180deg, #3A231C 0%, #1F130E 100%)',
    textColor: '#FFF4EE',
    badgeBg: '#4A2A20'
  };

  const slides: StorySlideItem[] = [
    // Slide 1: Warm Boho Cover
    {
      id: 'boho-cover',
      duration: 6,
      renderContent: () => (
        <div className="w-full h-full flex flex-col justify-between items-center p-6 text-center pt-24 pb-20 relative">
          {/* Organic Rounded Border */}
          <div className="absolute inset-4 border border-[#D97757]/30 rounded-[36px] pointer-events-none p-3 flex flex-col justify-between">
            <div className="flex justify-between items-center text-[#E29578] text-xs">
              <Flower2 className="w-4 h-4 opacity-70" />
              <span className="text-[10px] tracking-widest font-mono uppercase">WE ARE GETTING MARRIED</span>
              <Flower2 className="w-4 h-4 opacity-70" />
            </div>
            <div className="flex justify-center text-[#E29578] text-xs">
              <span>🌾 🌾 🌾</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1 mt-4"
          >
            <span className="text-[11px] font-mono tracking-widest text-[#E29578] uppercase">
              TOGETHER WITH THEIR FAMILIES
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#FFF0E6] italic font-normal">
              Wedding Invitation
            </h1>
          </motion.div>

          {/* Couple Names in Organic Arch Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="my-auto py-4"
          >
            <div className="w-52 mx-auto rounded-t-full rounded-b-3xl bg-[#523024]/60 border border-[#D97757]/40 p-6 backdrop-blur-md shadow-2xl space-y-4">
              <span className="text-3xl block">🍂</span>
              <div>
                <h2 className="text-2xl font-serif text-[#FFF0E6] font-bold">
                  {data.groomName}
                </h2>
                <p className="text-[#E29578] font-serif italic text-base my-1">&</p>
                <h2 className="text-2xl font-serif text-[#FFF0E6] font-bold">
                  {data.brideName}
                </h2>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-[#E8C5B8] font-light tracking-wide"
          >
            {custom.coverSubtitle || 'يسعدنا أن تشاركونا أجمل بدايات العمر والحب 🕊️'}
          </motion.div>
        </div>
      )
    },

    // Slide 2: Warm Sentimental Story / Ayah
    {
      id: 'boho-message',
      duration: 6,
      renderContent: () => (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center pt-24 pb-20 relative">
          <div className="absolute inset-4 border border-[#D97757]/30 rounded-[36px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xs space-y-5"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-[#D97757]/20 border border-[#D97757]/40 flex items-center justify-center text-[#E29578]">
              <Heart className="w-5 h-5 fill-current" />
            </div>

            <p className="text-base font-serif text-[#FFF0E6] leading-relaxed">
              {custom.introVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
            </p>

            <div className="w-12 h-px bg-[#D97757]/40 mx-auto" />

            <p className="text-xs text-[#E8C5B8] leading-relaxed font-light">
              {data.weddingMessage || custom.invitationNote || 'بين دفء اللحظات وصدق المشاعر، يسعدنا دعوتكم لمشاركتنا ليلة العمر لنحتفل معاً بحب جمع قلبينا.'}
            </p>
          </motion.div>
        </div>
      )
    },

    // Slide 3: Earthy Date Card
    {
      id: 'boho-date',
      duration: 6,
      renderContent: () => (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center pt-24 pb-20 relative">
          <div className="absolute inset-4 border border-[#D97757]/30 rounded-[36px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xs space-y-5"
          >
            <span className="text-[10px] font-mono tracking-widest text-[#E29578] uppercase">
              SAVE OUR DATE
            </span>

            {/* Earthy Polaroid Frame */}
            <div className="bg-[#4E2B20]/80 border border-[#D97757]/40 rounded-3xl p-6 backdrop-blur-md shadow-2xl space-y-3">
              <Calendar className="w-7 h-7 text-[#E29578] mx-auto" />
              <div className="text-5xl font-serif text-[#FFF0E6] font-bold">
                {weddingDate.getDate()}
              </div>
              <div className="text-lg font-serif text-[#E8C5B8]">
                {weddingDate.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
              </div>
              <div className="text-xs text-[#E29578] pt-2 border-t border-[#D97757]/30">
                {weddingDate.toLocaleDateString('ar-EG', { weekday: 'long' })}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[#E8C5B8] bg-[#3A1E16] py-2.5 px-4 rounded-full border border-[#D97757]/30">
              <Clock className="w-4 h-4 text-[#E29578]" />
              <span>{data.weddingTime || 'الساعة 07:30 مساءً'}</span>
            </div>
          </motion.div>
        </div>
      )
    },

    // Slide 4: Earthy Timeline
    {
      id: 'boho-program',
      duration: 6,
      renderContent: () => (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center pt-24 pb-20 relative">
          <div className="absolute inset-4 border border-[#D97757]/30 rounded-[36px] pointer-events-none" />

          <div className="w-full max-w-xs space-y-5 text-right" dir="rtl">
            <div className="text-center mb-5">
              <span className="text-[10px] font-mono tracking-widest text-[#E29578] uppercase">
                THE SCHEDULE
              </span>
              <h3 className="text-2xl font-serif text-[#FFF0E6] mt-1">برنامج الاحتفال</h3>
            </div>

            <div className="space-y-3">
              <div className="bg-[#48281E]/70 border border-[#D97757]/30 p-3.5 rounded-2xl flex items-center gap-3">
                <span className="text-xs font-mono text-[#E29578] bg-[#D97757]/20 px-2 py-1 rounded-lg">
                  07:30
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#FFF0E6]">استقبال الضيوف والأحباب</h4>
                  <p className="text-xs text-[#E8C5B8]/70">الترحيب والمشروبات المنعشة</p>
                </div>
              </div>

              <div className="bg-[#48281E]/70 border border-[#D97757]/30 p-3.5 rounded-2xl flex items-center gap-3">
                <span className="text-xs font-mono text-[#E29578] bg-[#D97757]/20 px-2 py-1 rounded-lg">
                  08:45
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#FFF0E6]">الزفة وعقد القران</h4>
                  <p className="text-xs text-[#E8C5B8]/70">لحظات العهد وتبادل التهاني</p>
                </div>
              </div>

              <div className="bg-[#48281E]/70 border border-[#D97757]/30 p-3.5 rounded-2xl flex items-center gap-3">
                <span className="text-xs font-mono text-[#E29578] bg-[#D97757]/20 px-2 py-1 rounded-lg">
                  10:15
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#FFF0E6]">عشاء الزفاف</h4>
                  <p className="text-xs text-[#E8C5B8]/70">بوفيه عشاء واحتفال حتى النهاية</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 5: Warm Venue & Map
    {
      id: 'boho-venue',
      duration: 6,
      renderContent: () => (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center pt-24 pb-20 relative">
          <div className="absolute inset-4 border border-[#D97757]/30 rounded-[36px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xs space-y-5"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-[#D97757]/20 border border-[#D97757]/40 flex items-center justify-center text-[#E29578] shadow-xl">
              <MapPin className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#E29578] uppercase">
                LOCATION & DRESS
              </span>
              <h3 className="text-2xl font-serif text-[#FFF0E6] font-bold mt-1">
                {data.venueName}
              </h3>
              {data.venueAddress && (
                <p className="text-xs text-[#E8C5B8] mt-1">{data.venueAddress}</p>
              )}
            </div>

            <div className="bg-[#48281E]/80 border border-[#D97757]/30 rounded-2xl p-4 text-xs space-y-1">
              <p className="text-[#E29578] font-bold">قواعد اللباس (Dress Code)</p>
              <p className="text-[#FFF0E6]">{custom.dressCode || 'أناقة عصرية بألوان الباستيل / Semi-formal & Pastel'}</p>
            </div>

            {data.googleMapsUrl && (
              <a
                href={data.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D97757] hover:bg-[#B85D43] text-white font-bold text-xs shadow-xl active:scale-95 transition"
              >
                <MapPin className="w-4 h-4" />
                <span>الاتجاهات على خرائط Google</span>
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
