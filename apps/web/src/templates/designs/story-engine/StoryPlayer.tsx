'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Pause, Play, Share2, MapPin, MessageCircle, Calendar, ChevronUp, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface StorySlideItem {
  id: string;
  renderContent: (helpers: { isPaused: boolean; next: () => void; prev: () => void }) => React.ReactNode;
  duration?: number; // duration in seconds (default 6s)
}

export interface StoryThemeConfig {
  accentColor: string;
  progressBarColor: string;
  progressBarBg: string;
  bgGradient: string;
  textColor: string;
  badgeBg: string;
  fontFamily?: string;
  themeName: string;
}

interface StoryPlayerProps {
  slides: StorySlideItem[];
  theme: StoryThemeConfig;
  audioUrl?: string;
  invitationData: {
    groomName: string;
    brideName: string;
    weddingDate: Date;
    venueName: string;
    venueAddress?: string;
    googleMapsUrl?: string;
    groomWhatsapp?: string;
    brideWhatsapp?: string;
  };
}

export const StoryPlayer: React.FC<StoryPlayerProps> = ({
  slides,
  theme,
  audioUrl,
  invitationData
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef(false);

  const currentSlide = slides[currentIndex];
  const slideDuration = (currentSlide?.duration || 6) * 1000;

  // Auto-play audio on user interaction
  const toggleAudio = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }
  };

  const nextSlide = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      // Loop or stay on last
      setProgress(100);
    }
  }, [currentIndex, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    } else {
      setProgress(0);
    }
  }, [currentIndex]);

  // Story progression timer
  useEffect(() => {
    if (isPaused || showDetailsSheet || !hasStarted) return;

    const intervalTime = 50; // update every 50ms
    const step = (intervalTime / slideDuration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPaused, showDetailsSheet, hasStarted, slideDuration, nextSlide]);

  // Handle tap / press logic
  const handlePointerDown = () => {
    holdTimeoutRef.current = setTimeout(() => {
      isHoldingRef.current = true;
      setIsPaused(true);
    }, 200);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }

    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      setIsPaused(false);
      return;
    }

    // It was a tap!
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (!hasStarted) {
      setHasStarted(true);
      if (audioUrl && audioRef.current) {
        audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
      }
      return;
    }

    // Tap on left 35% -> previous, tap on right 65% -> next
    if (x < width * 0.35) {
      prevSlide();
    } else {
      nextSlide();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const triggerCelebration = (e: React.MouseEvent) => {
    e.stopPropagation();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center sm:p-4 select-none overflow-hidden">
      {/* Background Audio */}
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} loop preload="auto" />
      )}

      {/* Main Story Container - Phone Mockup on Desktop, 100dvh on Mobile */}
      <div 
        className="relative w-full max-w-[430px] h-[100dvh] sm:h-[880px] sm:max-h-[92vh] sm:rounded-[40px] overflow-hidden shadow-2xl flex flex-col justify-between"
        style={{ background: theme.bgGradient }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {/* Top Story Header & Progress Bars */}
        <div className="absolute top-0 left-0 right-0 z-30 pt-3 px-3 pb-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          {/* Progress Indicators */}
          <div className="flex items-center gap-1.5 mb-3">
            {slides.map((slide, idx) => {
              let fillWidth = '0%';
              if (idx < currentIndex) fillWidth = '100%';
              else if (idx === currentIndex) fillWidth = `${progress}%`;

              return (
                <div 
                  key={slide.id} 
                  className="flex-1 h-1 rounded-full overflow-hidden"
                  style={{ background: theme.progressBarBg }}
                >
                  <div 
                    className="h-full transition-all duration-75 ease-linear rounded-full"
                    style={{ 
                      width: fillWidth, 
                      background: theme.progressBarColor 
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Story Profile & Controls Bar */}
          <div className="flex items-center justify-between text-white text-xs">
            {/* Couple Profile Pill */}
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-white/30"
                style={{ background: theme.badgeBg }}
              >
                💍
              </div>
              <div className="flex flex-col">
                <span className="font-semibold tracking-wide drop-shadow text-white/95">
                  {invitationData.groomName} & {invitationData.brideName}
                </span>
                <span className="text-[10px] text-white/70">
                  {currentIndex + 1} من {slides.length} • {theme.themeName}
                </span>
              </div>
            </div>

            {/* Actions: Audio, Pause status */}
            <div className="flex items-center gap-2">
              {audioUrl && (
                <button
                  onClick={toggleAudio}
                  className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-black/60 transition"
                  title={isPlayingAudio ? 'كتم الصوت' : 'تشغيل الموسيقى'}
                >
                  {isPlayingAudio ? (
                    <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5" />
                  )}
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-black/60 transition"
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Story Slide Animated Content */}
        <div className="relative w-full h-full flex-1 overflow-hidden z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide?.id}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="w-full h-full flex flex-col"
            >
              {currentSlide?.renderContent({
                isPaused,
                next: nextSlide,
                prev: prevSlide
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Interactive Bar: Quick RSVP / Maps / Share */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pb-5 pt-8 px-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <div className="flex items-center gap-2">
            {/* Swipe up / Details button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetailsSheet(true);
                setIsPaused(true);
              }}
              className="flex-1 py-2.5 px-4 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition"
            >
              <ChevronUp className="w-4 h-4 animate-bounce text-amber-300" />
              <span>تفاصيل الحفل والموقع (اسحب للأعلى)</span>
            </button>

            {/* Confetti button */}
            <button
              onClick={triggerCelebration}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center active:scale-90 transition shadow-lg"
              title="بارك للعروسين"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>

        {/* Swipe-Up Details Drawer / Modal */}
        <AnimatePresence>
          {showDetailsSheet && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute inset-x-0 bottom-0 top-16 z-40 bg-neutral-900/95 backdrop-blur-xl rounded-t-[32px] p-6 text-white flex flex-col justify-between border-t border-white/10 shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Calendar className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-base">تفاصيل دعوة الزفاف</h3>
                      <p className="text-xs text-neutral-400">يسعدنا ويشرفنا حضوركم</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailsSheet(false);
                      setIsPaused(false);
                    }}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Venue & Location */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-neutral-100">{invitationData.venueName}</h4>
                      {invitationData.venueAddress && (
                        <p className="text-xs text-neutral-400 mt-0.5">{invitationData.venueAddress}</p>
                      )}
                    </div>
                  </div>

                  {invitationData.googleMapsUrl && (
                    <a
                      href={invitationData.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <MapPin className="w-4 h-4" />
                      فتح الموقع على خرائط Google Maps
                    </a>
                  )}
                </div>

                {/* WhatsApp RSVP / Congratulations */}
                {(invitationData.groomWhatsapp || invitationData.brideWhatsapp) && (
                  <div className="space-y-2">
                    <p className="text-xs text-neutral-400 mb-1">تأكيد الحضور أو إرسال تهنئة عبر واتساب:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {invitationData.groomWhatsapp && (
                        <a
                          href={`https://wa.me/${invitationData.groomWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${invitationData.groomName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة! 🎉`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>تهنئة العريس</span>
                        </a>
                      )}
                      {invitationData.brideWhatsapp && (
                        <a
                          href={`https://wa.me/${invitationData.brideWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${invitationData.brideName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة! 🌸`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>تهنئة العروس</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Close Drawer Button */}
              <button
                onClick={() => {
                  setShowDetailsSheet(false);
                  setIsPaused(false);
                }}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium mt-4 transition"
              >
                العودة للقصة (Story)
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
