'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TemplateRenderContext } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  RotateCcw, 
  MessageCircle,
  Heart,
  Flower
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VintageCallaBloomsTemplate: React.FC<TemplateRenderContext> = ({ data, mode }) => {
  const [isOpen, setIsOpen] = useState(mode === 'PREVIEW' ? false : false);
  const [isBlooming, setIsBlooming] = useState(false);
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

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  useEffect(() => {
    const calculateTime = () => {
      const diff = weddingDate.getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    };
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  const handleBloomAndOpen = () => {
    if (isOpen || isBlooming) return;
    setIsBlooming(true);

    if (data.music && audioRef.current) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }

    setTimeout(() => {
      confetti({
        particleCount: 75,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#FFF8DC', '#F5DEB3', '#D4AF37', '#E6D7C3']
      });
    }, 600);

    setTimeout(() => {
      setIsOpen(true);
      setIsBlooming(false);
    }, 1400);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsBlooming(false);
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
      className="min-h-screen relative font-cairo bg-[#FAF7F2] text-[#332E2B] overflow-x-hidden selection:bg-amber-200"
      dir="rtl"
    >
      {/* Background Music */}
      {data.music && (
        <audio ref={audioRef} src={data.music.url} loop preload="auto" />
      )}

      {/* Floating Audio & Controls Button */}
      <div className="fixed top-5 left-5 z-50 flex items-center gap-2">
        {data.music && (
          <button
            onClick={toggleAudio}
            className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-[#D5C7B5] flex items-center justify-center text-[#5C4D3C] hover:scale-105 active:scale-95 transition"
            title={isPlayingAudio ? 'كتم الصوت' : 'تشغيل الموسيقى'}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-5 h-5 text-[#8C6D4F] animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-neutral-400" />
            )}
          </button>
        )}

        {isOpen && (
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-[#D5C7B5] text-xs font-bold text-[#5C4D3C] flex items-center gap-1.5 hover:bg-white active:scale-95 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>عرض الغلاف الرومانسي</span>
          </button>
        )}
      </div>

      {/* STAGE 1: Vintage Lace & Blooming Floral Clasp */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#2B231E] via-[#3A3029] to-[#201915] text-center"
          >
            {/* Ambient Background Warm Light */}
            <div className="absolute w-[450px] h-[450px] bg-amber-400/10 rounded-full blur-[130px] pointer-events-none" />

            <div className="text-center mb-6 space-y-2 z-10">
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#E5D7C5] font-mono">
                VINTAGE ROMANCE & CALLA LILIES
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-wide">
                دعوة زفاف كلاسيكية دافئة
              </h2>
              <p className="text-xs text-[#C7B59F]">
                {custom.coverHint || 'انقر على باقة زهور الكالا لتفتح الدعوة وتتفتح البتلات'}
              </p>
            </div>

            {/* Vintage Lace Envelope Card with Blooming Center */}
            <div 
              onClick={handleBloomAndOpen}
              className="relative w-full max-w-[360px] sm:max-w-[400px] h-[440px] sm:h-[480px] rounded-3xl cursor-pointer group shadow-2xl overflow-hidden flex flex-col justify-between p-6 bg-[#FAF7F2] text-[#332E2B] border-4 border-[#E8DEC8]"
              style={{
                boxShadow: '0 25px 70px -15px rgba(0,0,0,0.7), inset 0 0 20px rgba(180,150,110,0.1)'
              }}
            >
              {/* French Lace Corner Accents */}
              <div className="absolute inset-2 border border-[#D5C7B5] rounded-2xl pointer-events-none p-3 flex flex-col justify-between">
                <div className="flex justify-between text-xs text-[#8C6D4F]">
                  <span>🌸</span>
                  <span className="text-[10px] tracking-widest font-serif uppercase">Save The Date</span>
                  <span>🌸</span>
                </div>
                <div className="flex justify-between text-xs text-[#8C6D4F]">
                  <span>🌿</span>
                  <span>🌿</span>
                </div>
              </div>

              {/* Header Title */}
              <div className="pt-4 z-10">
                <span className="text-[10px] tracking-widest uppercase text-[#8C6D4F] font-mono">
                  OUR WEDDING DAY
                </span>
                <p className="text-xl font-serif text-[#332E2B] italic mt-1">
                  «تلاقت الأرواح وتوّج الحب بالعهد»
                </p>
              </div>

              {/* Center Blooming Floral Emblem */}
              <motion.div
                animate={isBlooming ? { scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.8 }}
                className="my-auto z-10 flex flex-col items-center group-hover:scale-105 transition-transform"
              >
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#EFE8DC] to-[#FFFDF9] border-2 border-[#D5C7B5] shadow-xl flex flex-col items-center justify-center p-2 relative">
                  <span className="text-3xl">🕊️</span>
                  <span className="text-sm font-serif text-[#5C4D3C] font-bold mt-1">
                    {data.groomName.charAt(0)} & {data.brideName.charAt(0)}
                  </span>
                  {/* Subtle Blooming Petal Ring */}
                  <div className="absolute -inset-1.5 rounded-full border border-[#8C6D4F]/30 animate-pulse pointer-events-none" />
                </div>

                <div className="mt-4 space-y-0.5">
                  <h3 className="text-2xl font-serif text-[#2B231E] font-bold">
                    {data.groomName} & {data.brideName}
                  </h3>
                  <p className="text-xs text-[#8C6D4F] font-serif">
                    {formattedDate}
                  </p>
                </div>
              </motion.div>

              {/* Bottom Instruction Pill */}
              <div className="pb-2 z-10 text-[11px] font-mono text-[#8C6D4F] tracking-wider uppercase">
                CLICK TO UNVEIL INVITATION ❯
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 2: Unveiled Vintage Romance Invitation Experience */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl mx-auto px-4 py-16 sm:py-24"
        >
          {/* Main Vintage Card */}
          <div 
            className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-12 border-2 border-[#E8DEC8] shadow-2xl relative overflow-hidden text-center text-[#332E2B]"
            style={{
              boxShadow: '0 20px 60px -15px rgba(140, 109, 79, 0.15)'
            }}
          >
            {/* French Lace Inset Border */}
            <div className="absolute inset-3 border border-[#D5C7B5]/60 rounded-2xl pointer-events-none p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[#8C6D4F] text-xs px-2">
                <span>🌸</span>
                <span className="text-[10px] tracking-widest uppercase font-serif">Vintage Romance Invitation</span>
                <span>🌸</span>
              </div>
              <div className="flex justify-between items-center text-[#8C6D4F] text-xs px-2">
                <span>🌿</span>
                <span>🌿</span>
              </div>
            </div>

            {/* Quranic Ayah / Opening */}
            <div className="my-6 space-y-3">
              <span className="text-sm tracking-widest text-[#8C6D4F] font-serif font-bold block">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
              <p className="text-lg sm:text-2xl font-serif text-[#332E2B] leading-relaxed px-4">
                {custom.introVerse || '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'}
              </p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#8C6D4F] to-transparent mx-auto" />
            </div>

            {/* Couple Announcement */}
            <div className="my-8 space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-[#8C6D4F] font-mono">
                {custom.invitationIntro || 'معاً نكتب فصلاً جديداً من الحكاية، ويسرنا حضوركم'}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 my-4">
                <h1 className="text-4xl sm:text-5xl font-serif text-[#2B231E] font-bold">
                  {data.groomName}
                </h1>
                <span className="text-2xl font-serif text-[#8C6D4F] italic">&</span>
                <h1 className="text-4xl sm:text-5xl font-serif text-[#2B231E] font-bold">
                  {data.brideName}
                </h1>
              </div>

              <p className="text-sm text-[#5C4D3C] max-w-lg mx-auto leading-relaxed pt-2 font-serif">
                {data.weddingMessage || custom.invitationNote || 'يسعدنا ويشرفنا حضوركم ومشاركتنا فرحة العمر وتتويج مسيرة الحب في ليلتنا المنتظرة، لتكتمل سعادتنا برؤيتكم بيننا.'}
              </p>
            </div>

            {/* Date, Time & Countdown */}
            <div className="my-8 bg-[#FAF7F2] border border-[#D5C7B5] rounded-2xl p-6 max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-center gap-2 text-[#5C4D3C] font-bold text-sm font-serif">
                <Calendar className="w-5 h-5 text-[#8C6D4F]" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[#5C4D3C] text-xs font-serif">
                <Clock className="w-4 h-4 text-[#8C6D4F]" />
                <span>{data.weddingTime || 'السابعة والنصف مساءً (07:30 PM)'}</span>
              </div>

              {/* Live Countdown */}
              {data.countdownEnabled && (
                <div className="pt-3 border-t border-[#D5C7B5]/60">
                  <div className="text-[11px] font-mono text-[#8C6D4F] tracking-wider mb-2">
                    COUNTDOWN TO THE SPECIAL DAY
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center max-w-xs mx-auto">
                    <div className="bg-white p-2.5 rounded-xl border border-[#E8DEC8] shadow-sm">
                      <div className="text-xl font-bold font-mono text-[#2B231E]">{timeLeft.days}</div>
                      <div className="text-[10px] text-[#8C6D4F]">يوم</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#E8DEC8] shadow-sm">
                      <div className="text-xl font-bold font-mono text-[#2B231E]">{timeLeft.hours}</div>
                      <div className="text-[10px] text-[#8C6D4F]">ساعة</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#E8DEC8] shadow-sm">
                      <div className="text-xl font-bold font-mono text-[#2B231E]">{timeLeft.minutes}</div>
                      <div className="text-[10px] text-[#8C6D4F]">دقيقة</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#E8DEC8] shadow-sm">
                      <div className="text-xl font-bold font-mono text-[#8C6D4F]">{timeLeft.seconds}</div>
                      <div className="text-[10px] text-[#8C6D4F]">ثانية</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Romantic Love Story Milestones (Unique to this Vintage theme) */}
            <div className="my-8 text-right max-w-md mx-auto">
              <h3 className="text-center font-bold text-lg text-[#2B231E] mb-4 font-serif">
                رحلتنا معاً 🕊️
              </h3>
              <div className="space-y-3">
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D5C7B5]">
                  <span className="text-xs font-mono font-bold text-[#8C6D4F]">
                    {custom.story1Date || 'المحطة الأولى'}
                  </span>
                  <h4 className="text-sm font-bold text-[#2B231E] mt-0.5">
                    {custom.story1Title || 'اللقاء الأول'}
                  </h4>
                  <p className="text-xs text-[#5C4D3C] mt-1">
                    {custom.story1Desc || 'حيث تلاقت الأرواح وبدأت أجمل حكايات العمر.'}
                  </p>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D5C7B5]">
                  <span className="text-xs font-mono font-bold text-[#8C6D4F]">
                    {custom.story2Date || 'المحطة الثانية'}
                  </span>
                  <h4 className="text-sm font-bold text-[#2B231E] mt-0.5">
                    {custom.story2Title || 'الخطوبة والعهد'}
                  </h4>
                  <p className="text-xs text-[#5C4D3C] mt-1">
                    {custom.story2Desc || 'وعدنا بعضنا على الحب والوفاء ومواصلة الدرب معاً.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Event Itinerary / Timeline */}
            <div className="my-8 text-right max-w-md mx-auto">
              <h3 className="text-center font-bold text-lg text-[#2B231E] mb-4 font-serif">
                برنامج ومراسم الحفل
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#D5C7B5]">
                  <span className="text-xs font-mono font-bold text-[#8C6D4F] bg-[#EFE8DC] px-2.5 py-1 rounded-lg">
                    {custom.timeline1Time || '07:30 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#2B231E] font-serif">
                      {custom.timeline1Title || 'استقبال الضيوف الكرام'}
                    </h4>
                    <p className="text-xs text-[#5C4D3C]">
                      {custom.timeline1Desc || 'مراسم الترحيب وبداية توافد الأهل والأحباب'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#D5C7B5]">
                  <span className="text-xs font-mono font-bold text-[#8C6D4F] bg-[#EFE8DC] px-2.5 py-1 rounded-lg">
                    {custom.timeline2Time || '08:45 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#2B231E] font-serif">
                      {custom.timeline2Title || 'الزفة وعقد القران'}
                    </h4>
                    <p className="text-xs text-[#5C4D3C]">
                      {custom.timeline2Desc || 'لحظات مباركة البداية وتبادل التهاني'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#D5C7B5]">
                  <span className="text-xs font-mono font-bold text-[#8C6D4F] bg-[#EFE8DC] px-2.5 py-1 rounded-lg">
                    {custom.timeline3Time || '10:15 PM'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#2B231E] font-serif">
                      {custom.timeline3Title || 'العشاء واحتفال الزفاف'}
                    </h4>
                    <p className="text-xs text-[#5C4D3C]">
                      {custom.timeline3Desc || 'بوفيه عشاء فاخر احتفاءً بضيوفنا الكرام'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Venue & Location */}
            <div className="my-8 max-w-md mx-auto space-y-4">
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#D5C7B5] space-y-2">
                <MapPin className="w-6 h-6 text-[#8C6D4F] mx-auto" />
                <h4 className="text-lg font-bold text-[#2B231E] font-serif">
                  {data.venueName}
                </h4>
                {data.venueAddress && (
                  <p className="text-xs text-[#5C4D3C] font-serif">{data.venueAddress}</p>
                )}
                {custom.dressCode && (
                  <p className="text-xs text-[#8C6D4F] pt-2 border-t border-[#D5C7B5] font-serif font-medium">
                    👔 قواعد اللباس: {custom.dressCode}
                  </p>
                )}
              </div>

              {data.googleMapsUrl && (
                <a
                  href={data.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#8C6D4F] to-[#73553A] hover:from-[#73553A] hover:to-[#5C4D3C] text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition"
                >
                  <MapPin className="w-4 h-4" />
                  <span>فتح موقع القاعة على خرائط Google Maps</span>
                </a>
              )}
            </div>

            {/* WhatsApp RSVP / Congratulations Buttons */}
            {data.contactButtonsEnabled && (data.groomWhatsapp || data.brideWhatsapp) && (
              <div className="my-8 max-w-md mx-auto pt-6 border-t border-[#D5C7B5]">
                <p className="text-xs text-[#5C4D3C] mb-3 font-serif">تأكيد الحضور أو إرسال تهنئة عبر واتساب:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.groomWhatsapp && (
                    <a
                      href={`https://wa.me/${data.groomWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.groomName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة! 🎉`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition shadow"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>تهنئة العريس ({data.groomName})</span>
                    </a>
                  )}
                  {data.brideWhatsapp && (
                    <a
                      href={`https://wa.me/${data.brideWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`ألف مبروك يا ${data.brideName}، يسعدني تأكيد الحضور لمشاركتكم الفرحة! 🌸`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition shadow"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>تهنئة العروس ({data.brideName})</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Closing Note */}
            <div className="mt-8 text-[#8C6D4F] text-xs italic font-serif">
              {custom.closingMessage || 'فرحتنا لا تكتمل إلا بوجودكم ورؤيتكم بيننا في ليلتنا المنتظرة 🤍'}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
