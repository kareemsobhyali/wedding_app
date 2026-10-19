'use client';

import React from 'react';
import { TemplateRenderContext } from '../../types';
import { StoryPlayer, StorySlideItem, StoryThemeConfig } from '../story-engine/StoryPlayer';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Sparkles, Heart } from 'lucide-react';

export const StoryVogueEditorialTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const weddingDate = new Date(data.weddingDate);
  const formattedDate = weddingDate.toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const custom = data.customData || {};

  const theme: StoryThemeConfig = {
    themeName: 'Vogue Editorial',
    accentColor: '#D4AF37',
    progressBarColor: '#E5C158',
    progressBarBg: 'rgba(255, 255, 255, 0.25)',
    bgGradient: 'radial-gradient(circle at 50% 20%, #1c1b1a 0%, #0c0b0a 100%)',
    textColor: '#F5F5F0',
    badgeBg: '#1f1e1d'
  };

  const slides: StorySlideItem[] = [
    // Slide 1: Editorial Cover
    {
      id: 'vogue-cover',
      duration: 6,
      renderContent: () => (
        <div className="w-full h-full flex flex-col justify-between p-6 text-center pt-24 pb-20 relative">
          {/* Subtle Film Grain / Grid lines */}
          <div className="absolute inset-4 border border-white/10 pointer-events-none rounded-2xl flex flex-col justify-between p-3">
            <div className="flex justify-between text-[9px] text-white/40 uppercase tracking-widest font-mono">
              <span>VOL. XXIV • NO. 1</span>
              <span>SPECIAL ISSUE</span>
            </div>
            <div className="flex justify-between text-[9px] text-white/40 uppercase tracking-widest font-mono">
              <span>SAVE THE DATE</span>
              <span>PARIS / CAIRO</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2 mt-4"
          >
            <p className="text-[11px] tracking-[0.35em] uppercase text-amber-300/80 font-mono">
              {custom.editorialKicker || 'THE WEDDING CELEBRATION'}
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif tracking-tight text-white font-normal uppercase">
              INVITATION
            </h1>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="my-auto py-8"
          >
            <div className="w-24 h-24 mx-auto rounded-full border border-amber-300/40 p-1 flex items-center justify-center backdrop-blur-sm bg-white/5 mb-6 shadow-2xl">
              <span className="text-3xl font-serif text-amber-200">
                {data.groomName.charAt(0)} & {data.brideName.charAt(0)}
              </span>
            </div>

            <h2 className="text-3xl font-serif text-white tracking-wide mb-2">
              {data.groomName}
            </h2>
            <p className="text-amber-400 font-serif italic text-lg my-1">&</p>
            <h2 className="text-3xl font-serif text-white tracking-wide">
              {data.brideName}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-1 mb-2"
          >
            <p className="text-xs text-neutral-300 font-light tracking-wide">
              {custom.coverSubtitle || 'يسرنا دعوتكم لمشاركتنا فرحة العمر وتتويج رحلة الحب'}
            </p>
            <p className="text-[10px] text-white/40 tracking-widest uppercase font-mono">
              TAP TO ADVANCE ❯
            </p>
          </motion.div>
        </div>
      )
    },

    // Slide 2: The Quranic Ayah & Message
    {
      id: 'vogue-message',
      duration: 6,
      renderContent: () => (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center pt-24 pb-20 relative">
          <div className="absolute inset-4 border border-white/10 pointer-events-none rounded-2xl" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-xs space-y-6"
          >
            <span className="inline-block p-2.5 rounded-full bg-white/5 border border-white/10 text-amber-300 mb-2">
              <Sparkles className="w-5 h-5" />
            </span>

            <p className="text-base text-amber-200/90 font-serif leading-loose px-2">
              {custom.introVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
            </p>

            <div className="w-12 h-px bg-amber-400/40 mx-auto" />

            <p className="text-sm text-neutral-300 font-light leading-relaxed">
              {data.weddingMessage || custom.invitationNote || 'بكل مشاعر الود والسرور، نتشرف بدعوتكم لحضور حفل زفافنا لنصنع معاً أجمل الذكريات في ليلة تكتمل بوجودكم.'}
            </p>
          </motion.div>
        </div>
      )
    },

    // Slide 3: The Date & Calendar Card
    {
      id: 'vogue-date',
      duration: 6,
      renderContent: () => (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center pt-24 pb-20 relative">
          <div className="absolute inset-4 border border-white/10 pointer-events-none rounded-2xl" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xs space-y-6"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-amber-300 font-mono">
              THE APPOINTMENT
            </p>

            {/* Luxury Minimalist Date Box */}
            <div className="bg-white/5 border border-white/15 rounded-3xl p-6 backdrop-blur-md shadow-2xl space-y-4">
              <div className="text-amber-400 font-mono text-sm tracking-wider">
                {weddingDate.getFullYear()}
              </div>
              <div className="text-6xl font-serif text-white font-light tracking-tight">
                {weddingDate.getDate()}
              </div>
              <div className="text-lg font-serif text-amber-200/90 uppercase tracking-widest">
                {weddingDate.toLocaleDateString('ar-EG', { month: 'long' })}
              </div>
              <div className="text-xs text-neutral-400 font-mono pt-2 border-t border-white/10">
                {weddingDate.toLocaleDateString('ar-EG', { weekday: 'long' })}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-neutral-300">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{data.weddingTime || 'السابعة والنصف مساءً (07:30 PM)'}</span>
            </div>
          </motion.div>
        </div>
      )
    },

    // Slide 4: Timeline / Program
    {
      id: 'vogue-timeline',
      duration: 6,
      renderContent: () => (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center pt-24 pb-20 relative">
          <div className="absolute inset-4 border border-white/10 pointer-events-none rounded-2xl" />

          <div className="w-full max-w-xs space-y-5 text-right" dir="rtl">
            <div className="text-center mb-6">
              <p className="text-[10px] tracking-[0.3em] uppercase text-amber-300 font-mono">
                ITINERARY
              </p>
              <h3 className="text-2xl font-serif text-white mt-1">جدول مراسم الحفل</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <span className="text-xs font-mono text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg">
                  07:30 PM
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">استقبال الضيوف الكرام</h4>
                  <p className="text-xs text-neutral-400">مراسم الترحيب والمشروبات</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <span className="text-xs font-mono text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg">
                  08:45 PM
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">الزفة وعقد القران</h4>
                  <p className="text-xs text-neutral-400">إطلالة العروسين والاحتفال</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <span className="text-xs font-mono text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg">
                  10:15 PM
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">مأدبة العشاء الملكي</h4>
                  <p className="text-xs text-neutral-400">بوفيه عشاء مفتوح واحتفاء</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 5: The Venue & Location
    {
      id: 'vogue-venue',
      duration: 6,
      renderContent: () => (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center pt-24 pb-20 relative">
          <div className="absolute inset-4 border border-white/10 pointer-events-none rounded-2xl" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xs space-y-6"
          >
            <span className="inline-block p-3 rounded-full bg-amber-400/10 text-amber-400 mb-1">
              <MapPin className="w-6 h-6" />
            </span>

            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-amber-300 font-mono mb-2">
                LOCATION & VENUE
              </p>
              <h3 className="text-2xl font-serif text-white">{data.venueName}</h3>
              {data.venueAddress && (
                <p className="text-xs text-neutral-400 mt-1">{data.venueAddress}</p>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-neutral-300 space-y-1">
              <p className="text-amber-300 font-medium font-mono uppercase text-[10px]">
                DRESS CODE
              </p>
              <p>{custom.dressCode || 'ملابس رسمية أنيقة / Formal Black Tie'}</p>
            </div>

            {data.googleMapsUrl && (
              <a
                href={data.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-neutral-900 font-bold text-xs hover:bg-neutral-200 transition shadow-xl"
              >
                <MapPin className="w-4 h-4 text-amber-600" />
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
