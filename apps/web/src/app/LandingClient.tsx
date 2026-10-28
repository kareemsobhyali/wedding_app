'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  Smartphone, 
  MessageCircle, 
  Eye, 
  Search, 
  Clock, 
  ShieldCheck, 
  ChevronLeft,
  ChevronRight,
  Mail,
  Camera,
  Layers,
  LayoutGrid,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from '../components/SocialIcons';

interface TemplateItem {
  id: string;
  name: string;
  description?: string;
  previewImage?: string;
  category?: string;
  [key: string]: any;
}

interface LandingSettings {
  siteName?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  aboutTitle?: string;
  aboutText?: string;
  contactWhatsApp?: string;
  contactEmail?: string;
  contactInstagram?: string;
  contactTikTok?: string;
  demoLinks?: Record<string, string>;
  previewImages?: Record<string, string>;
  [key: string]: any;
}

// Category Mapping helper for rich filtration
const getThemeCategory = (id: string): string => {
  if (['palace-doors-reveal', 'mughal-palace-portal', 'cathedral-grand-arch', 'sculpted-porcelain-arch'].includes(id)) {
    return 'palace';
  }
  if (['golden-arabic'].includes(id)) {
    return 'arabic';
  }
  if (['butterfly-elegance'].includes(id)) {
    return '3d';
  }
  return 'palace';
};

// Top Priority display order
const PRIORITY_ORDER = [
  'palace-doors-reveal',
  'mughal-palace-portal',
  'cathedral-grand-arch',
  'sculpted-porcelain-arch',
  'butterfly-elegance',
  'golden-arabic'
];

export default function LandingClient({ 
  settings, 
  templatesList 
}: { 
  settings: LandingSettings; 
  templatesList: TemplateItem[]; 
}) {
  const [scrolled, setScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const siteName = settings.siteName || "دعوتي Daawati";
  const rawWhatsApp = settings.contactWhatsApp || "+201000000000";
  const cleanPhone = rawWhatsApp.replace(/[^0-9]/g, '');
  const instagramUrl = settings.contactInstagram || "https://instagram.com";
  const tikTokUrl = settings.contactTikTok || "https://tiktok.com";

  // Helper to build WhatsApp Direct Order URL with Theme Name pre-filled
  const getThemeWhatsAppUrl = (themeName: string) => {
    const message = encodeURIComponent(`مرحباً، أود طلب وتجهيز تصميم دعوة زفاف بثيم: (${themeName}) 💍✨`);
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  // Helper for general inquiries
  const generalWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('مرحباً، أود الاستفسار عن تفاصيل وأسعار دعوات الزفاف الإلكترونية 💍✨')}`;

  // Sort & Filter Templates
  const sortedAndFilteredTemplates = useMemo(() => {
    const sorted = [...templatesList].sort((a, b) => {
      const indexA = PRIORITY_ORDER.indexOf(a.id);
      const indexB = PRIORITY_ORDER.indexOf(b.id);
      const rankA = indexA === -1 ? 999 : indexA;
      const rankB = indexB === -1 ? 999 : indexB;
      return rankA - rankB;
    });

    return sorted.filter((tpl) => {
      const cat = getThemeCategory(tpl.id);
      const matchesCategory = selectedCategory === 'all' || cat === selectedCategory;
      const matchesSearch = !searchQuery.trim() || 
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tpl.description && tpl.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [templatesList, selectedCategory, searchQuery]);

  // When filters change, reset active index and scroll to beginning
  useEffect(() => {
    setActiveIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [selectedCategory, searchQuery]);

  // Handle Horizontal Scroll to detect the Center / Active Theme
  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const containerCenter = container.getBoundingClientRect().left + container.offsetWidth / 2;

    let closestIdx = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(containerCenter - cardCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = idx;
      }
    });

    if (closestIdx !== activeIndex) {
      setActiveIndex(closestIdx);
    }
  };

  // Scroll to a specific card index
  const scrollToTheme = (index: number) => {
    if (index < 0 || index >= sortedAndFilteredTemplates.length) return;
    const targetCard = cardRefs.current[index];
    if (targetCard && carouselRef.current) {
      targetCard.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
      setActiveIndex(index);
    }
  };

  const handleNextTheme = () => {
    scrollToTheme(Math.min(activeIndex + 1, sortedAndFilteredTemplates.length - 1));
  };

  const handlePrevTheme = () => {
    scrollToTheme(Math.max(activeIndex - 1, 0));
  };

  // Categories config
  const categories = [
    { id: 'all', label: 'جميع الثيمات', count: templatesList.length },
    { id: 'palace', label: 'أقواس وقصور ملكية 🏛️' },
    { id: 'arabic', label: 'طابع عربي وذهبي ⚜️' },
    { id: '3d', label: 'تفاعلي ومجسم 3D 🦋' }
  ];

  // FAQ items data
  const faqItems = [
    {
      q: 'كيف يستلم ضيوفي رابط الدعوة؟',
      a: 'نرسل لك رابطاً إلكترونياً فريداً ومخصصاً (باسم العروسين)، يمكنك نسخه ومشاركته مباشرة عبر الواتساب أو رسائل SMS، أو طباعة كارت الـ QR المرفق ليفتحه الضيف بكاميرا هاتفه فوراً.'
    },
    {
      q: 'هل يمكن عمل دعوة مخصصة باسم كل ضيف (Personalized Invite)؟',
      a: 'نعم بكل تأكيد! نوفر ميزة حصرية تجعل الرابط يفتح ببطاقة ترحيب عائمة تحمل اسم الضيف الكريم (مثال: أهلاً بك أستاذ أحمد)، مع إمكانية إدارة قائمة الأسماء بسهولة.'
    },
    {
      q: 'هل تدعم الدعوة معرفة وتأكيد حضور الضيوف (RSVP)؟',
      a: 'نعم، يمكن للضيف تأكيد حضوره أو الاعتذار بلطف وتحديد عدد المرافقين، وتصلك جميع الردود لحظياً في شاشة تحكم واضحة مع إمكانية تصدير القائمة للواتساب أو الطباعة.'
    },
    {
      q: 'هل تعمل الدعوات بسلاسة وسرعة على جميع الهواتف؟',
      a: 'نعم 100%، جميع الثيمات مصممة بأحدث تقنيات الويب السريع ومتوافقة بالكامل مع جميع أجهزة الآيفون والأندرويد بمقاسات الشاشة المختلفة بدون أي تأخير.'
    },
    {
      q: 'هل يمكن إضافة موقع القاعة عبر خرائط قوقل وموسيقى خاصة؟',
      a: 'نعم، تحتوي كل دعوة على زر مباشر لفتح موقع القاعة على Google Maps، مع تشغيل المقطع الموسيقي أو الشيلة التي تختارها لترافق ظهور البطاقة بنعومة.'
    }
  ];

  return (
    <main className="min-h-screen bg-[#FAF7F2] font-cairo text-[#38260F] overflow-x-hidden selection:bg-[#EBDCC0] selection:text-[#38260F]" dir="rtl">

      {/* ========================================================= */}
      {/* 1. Header / Navbar - Royal Boutique Glassmorphism */}
      {/* ========================================================= */}
      <motion.header 
        initial={{ y: -70 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 sm:py-3 border-b border-[#EADCC5]/70' 
            : 'bg-white/70 backdrop-blur-sm sm:bg-transparent py-3 sm:py-5 border-b sm:border-b-0 border-[#EADCC5]/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <Link href="/" className="cursor-pointer">
              <BrandLogo 
                siteName={siteName} 
                size="md" 
                showSubtitle={true}
              />
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-6 space-x-reverse text-sm font-bold text-[#634827]">
            <a href="#templates" className="hover:text-[#8C6D38] transition-colors py-1">تشكيلة الثيمات</a>
            <a href="#how-it-works" className="hover:text-[#8C6D38] transition-colors py-1">طريقة الطلب</a>
            <a href="#features" className="hover:text-[#8C6D38] transition-colors py-1">المميزات</a>
            <a href="#faq" className="hover:text-[#8C6D38] transition-colors py-1">الأسئلة الشائعة</a>
          </nav>

          {/* Action Area: Social Icons & WhatsApp CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Social Icons (Instagram & TikTok) */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-[#FDF2F4] text-[#8C6D38] hover:text-[#E1306C] border border-[#EADBCA] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xs"
                >
                  <InstagramIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </a>
              )}

              {tikTokUrl && (
                <a
                  href={tikTokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-black hover:text-white text-[#8C6D38] border border-[#EADBCA] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xs"
                >
                  <TikTokIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </a>
              )}
            </div>

            {/* Quick WhatsApp Action Button */}
            <a 
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg hover:shadow-[#25D366]/30 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span className="hidden xs:inline sm:inline">طلب عبر واتساب</span>
              <span className="xs:hidden sm:hidden">واتساب</span>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 rounded-xl bg-white border border-[#EADBCA] text-[#634827] flex items-center justify-center"
              aria-label="قائمة الموقع"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-md border-b border-[#EADCC5] px-4 py-4 space-y-3 shadow-lg"
            >
              <a 
                href="#templates" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-xl hover:bg-[#FAF7F2] font-bold text-sm text-[#38260F]"
              >
                تشكيلة الثيمات ⚜️
              </a>
              <a 
                href="#how-it-works" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-xl hover:bg-[#FAF7F2] font-bold text-sm text-[#38260F]"
              >
                طريقة الطلب والتجهيز 📝
              </a>
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-xl hover:bg-[#FAF7F2] font-bold text-sm text-[#38260F]"
              >
                مميزات الدعوة الإلكترونية ✨
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-xl hover:bg-[#FAF7F2] font-bold text-sm text-[#38260F]"
              >
                الأسئلة الشائعة ❓
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>


      {/* ========================================================= */}
      {/* 2. Hero Section - Royal Luxury Boutique & Floating Lights */}
      {/* ========================================================= */}
      <section className="relative pt-24 pb-3 sm:pt-36 sm:pb-8 overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FAF7F2]">
        
        {/* Animated Golden Ambient Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              x: [0, 20, 0],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#F5E6CD]/60 rounded-full blur-3xl" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, -25, 0],
              opacity: [0.4, 0.65, 0.4]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-28 left-1/4 w-60 sm:w-80 h-60 sm:h-80 bg-[#E8D5B5]/50 rounded-full blur-3xl" 
          />
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full max-w-4xl h-40 bg-[#DFBA73]/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center">
          
          {/* Top Royal Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="mt-2 sm:mt-0 mb-2.5 sm:mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#D5C7B2] text-[#8C6D38] text-[11px] sm:text-xs font-extrabold shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin" style={{ animationDuration: '6s' }} />
            <span>دعوات زفاف إلكترونية تفاعلية فاخرة</span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#38260F] mb-2 sm:mb-4 leading-[1.25] tracking-tight max-w-4xl px-2"
            style={{ fontFamily: "'Aref Ruqaa', 'Cairo', serif" }}
          >
            {settings.heroTitle || 'دعوات زفاف ملكية تليق بليلة العمر'}
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xs sm:text-base md:text-lg text-[#6B5338] mb-4 sm:mb-8 max-w-2xl mx-auto leading-relaxed font-medium px-4"
          >
            {settings.heroSubtitle || 'اختر ثيمك المفضل من تشكيلتنا الملكية الحصرية، عاينه حياً على هاتفك، واطلبه مباشرة عبر الواتساب مع رابط مخصص باسم كل ضيف وكارت QR جاهز للطباعة.'}
          </motion.p>

          {/* Main CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full sm:w-auto mb-4 sm:mb-8 px-4"
          >
            <a 
              href="#templates" 
              className="relative overflow-hidden w-full sm:w-auto px-6 sm:px-10 py-2.5 sm:py-3.5 rounded-full bg-gradient-to-r from-[#8C6D38] via-[#A88448] to-[#6E4E26] text-white font-extrabold text-xs sm:text-base shadow-xl shadow-[#8C6D38]/30 hover:shadow-[#8C6D38]/50 hover:brightness-110 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span className="relative z-10">استعرض تشكيلة الثيمات ⚜️</span>
              {/* Shimmer sweep effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </a>

            <a 
              href={generalWhatsAppUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-white text-[#4A3210] font-extrabold text-xs sm:text-base border border-[#D5C7B2] hover:bg-[#FAF5ED] shadow-sm transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
              <span>تحدث معنا عبر واتساب</span>
            </a>
          </motion.div>

          {/* Social Proof Pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-4 text-[11px] sm:text-xs text-[#7A6142] font-semibold"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              جاهزية سريعة خلال 24 ساعة
            </span>
            <span>•</span>
            <span>تصاميم ملكية 3D تفاعلية</span>
            <span>•</span>
            <span>تأكيد حضور ذكي</span>
          </motion.div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 3. Core Section: THEMES SHOWCASE (Slider & Grid Modes) */}
      {/* ========================================================= */}
      <section id="templates" className="pt-2 pb-10 sm:pt-6 sm:pb-16 bg-white relative overflow-hidden scroll-mt-16 sm:scroll-mt-20">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-3 sm:mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0D7] text-[#8C6D38] text-[11px] sm:text-xs font-bold mb-1.5 border border-[#E5C987]/60">
              <Sparkles className="w-3 h-3 text-[#C5A059]" />
              <span>معرض الثيمات الملكية الفاخرة</span>
            </div>
            <h2 
              className="text-xl sm:text-3xl md:text-5xl font-extrabold text-[#38260F] mb-1 sm:mb-2"
              style={{ fontFamily: "'Aref Ruqaa', 'Cairo', serif" }}
            >
              تشكيلة الثيمات الحصرية (6 ثيمات ملكية)
            </h2>
            <p className="text-[11px] sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
              تصفح تصاميمنا الملكية المجهزة بمؤثرات فتح الأبواب ثلاثية الأبعاد والموسيقى. يمكنك معاينة أي ثيم حياً على هاتفك أو طلبه مباشرة.
            </p>
          </div>

          {/* Quick Counter & Nav Controls */}
          {sortedAndFilteredTemplates.length > 0 && (
            <div className="flex items-center justify-between mb-2 px-1 sm:px-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8C6D38]">
                <span>الثيم رقم ({activeIndex + 1}) من ({sortedAndFilteredTemplates.length})</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 font-medium hidden sm:inline">اسحب باللمس أو اضغط على الأسهم</span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={handlePrevTheme}
                  disabled={activeIndex === 0}
                  aria-label="الثيم السابق"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-[#D5C7B2] text-[#6E4E26] hover:bg-[#FAF5ED] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-xs transition-all active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={handleNextTheme}
                  disabled={activeIndex === sortedAndFilteredTemplates.length - 1}
                  aria-label="الثيم التالي"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#8C6D38] text-white hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-md transition-all active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ========================================================= */}
        {/* THEMES DISPLAY (MODE 1: HORIZONTAL COVERFLOW SLIDER) */}
        {/* ========================================================= */}
        {sortedAndFilteredTemplates.length > 0 ? (
          viewMode === 'slider' ? (
            <div className="relative w-full py-1.5 sm:py-6 overflow-hidden">
              <div 
                ref={carouselRef}
                onScroll={handleCarouselScroll}
                className="flex items-center gap-4 sm:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth px-[8vw] sm:px-[20vw] md:px-[28vw] lg:px-[32vw] pb-6 pt-2 scrollbar-none"
                style={{
                  scrollPadding: '0 20%',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {sortedAndFilteredTemplates.map((tpl, i) => {
                  const isActive = i === activeIndex;
                  const demoUrl = settings.demoLinks?.[tpl.id] || `/preview?template=${tpl.id}`;
                  const previewImg = settings.previewImages?.[tpl.id] || tpl.previewImage || '/assets/templates/placeholder-couple.jpg';
                  const whatsappUrl = getThemeWhatsAppUrl(tpl.name);

                  return (
                    <motion.div
                      key={tpl.id}
                      ref={(el) => { cardRefs.current[i] = el; }}
                      onClick={() => {
                        if (!isActive) scrollToTheme(i);
                      }}
                      whileHover={{ y: -4 }}
                      className={`shrink-0 snap-center transition-all duration-400 ease-out flex flex-col justify-between cursor-pointer select-none rounded-[28px] sm:rounded-[32px] p-3.5 sm:p-4 ${
                        isActive 
                          ? 'w-[84vw] max-w-[340px] sm:w-[350px] md:w-[380px] bg-white ring-2 ring-[#C5A059] border-2 border-[#DFBA73] shadow-2xl shadow-[#8C6D38]/30 -translate-y-2 scale-100 z-30'
                          : 'w-[75vw] max-w-[300px] sm:w-[310px] md:w-[340px] bg-white/85 border border-[#EADBCA] shadow-md opacity-75 hover:opacity-100 scale-95 z-10'
                      }`}
                    >

                      {/* Active Floating Pill */}
                      {isActive && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-[#8C6D38] via-[#C5A059] to-[#8C6D38] text-white text-[10px] sm:text-[11px] font-extrabold px-3 py-0.5 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
                          <Sparkles className="w-3 h-3 text-[#FFF8E7]" />
                          <span>الثيم المعروض بالمنتصف</span>
                        </div>
                      )}
                      
                      {/* Mockup Display Box */}
                      <div className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden aspect-[9/13] bg-neutral-100 mb-3 border border-[#EAE0D1]">
                        <img 
                          src={previewImg}
                          alt={tpl.name}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          loading="lazy"
                        />

                        {/* Top Indicator */}
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="px-2 py-0.5 rounded-md bg-[#38260F]/80 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold">
                            معاينة تفاعلية
                          </span>
                        </div>

                        {/* Bottom Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                        {/* Bottom Info inside phone preview */}
                        <div className="absolute inset-x-0 bottom-0 p-2.5 text-white text-center z-10">
                          <span className="text-[10px] sm:text-[11px] font-semibold text-white/95 block">
                            تأثيرات 3D • موسيقى • عداد • خريطة
                          </span>
                        </div>
                      </div>

                      {/* Card Content & Action Buttons */}
                      <div className="px-1 flex-1 flex flex-col justify-between">
                        
                        <div className="mb-2.5">
                          <h3 className={`font-extrabold text-base sm:text-lg mb-1 line-clamp-1 transition-colors ${
                            isActive ? 'text-[#38260F]' : 'text-gray-700'
                          }`}>
                            {tpl.name}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                            {tpl.description || 'تصميم راقٍ ومميز لحفل زفافك يجمع بين الجمال وسهولة مشاركة الرابط.'}
                          </p>
                        </div>

                        {/* THE 2 DIRECT BUTTONS */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EADBCA]/70">
                          
                          {/* 1. Live Demo Preview */}
                          <a
                            href={demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="py-2.5 px-2 rounded-xl bg-white hover:bg-[#F2ECE1] border border-[#D5C7B2] text-[#543914] font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center shadow-xs active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#8C6D38] shrink-0" />
                            <span>معاينة حية</span>
                          </a>

                          {/* 2. Direct WhatsApp Order with Pre-filled Name */}
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-105 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#25D366]/20 transition-all text-center"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 text-white shrink-0" />
                            <span>اطلب بالواتساب</span>
                          </a>

                        </div>

                      </div>

                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination Dots Indicator */}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {sortedAndFilteredTemplates.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => scrollToTheme(dotIdx)}
                    aria-label={`انتقل للثيم ${dotIdx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeIndex === dotIdx 
                        ? 'w-7 bg-[#8C6D38]' 
                        : 'w-2 bg-[#E0D3BE] hover:bg-[#C5A059]'
                    }`}
                  />
                ))}
              </div>

            </div>
          ) : (
            /* ========================================================= */
            /* THEMES DISPLAY (MODE 2: RESPONSIVE GRID VIEW) */
            /* Perfect for mobile users who want to see all 6 themes at once */
            /* ========================================================= */
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedAndFilteredTemplates.map((tpl) => {
                  const demoUrl = settings.demoLinks?.[tpl.id] || `/preview?template=${tpl.id}`;
                  const previewImg = settings.previewImages?.[tpl.id] || tpl.previewImage || '/assets/templates/placeholder-couple.jpg';
                  const whatsappUrl = getThemeWhatsAppUrl(tpl.name);

                  return (
                    <motion.div
                      key={tpl.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -6 }}
                      className="bg-white rounded-3xl p-4 border border-[#EADBCA] shadow-sm hover:shadow-xl hover:border-[#DFBA73] transition-all flex flex-col justify-between"
                    >
                      <div className="relative rounded-2xl overflow-hidden aspect-[9/13] bg-neutral-100 mb-3.5 border border-[#EAE0D1]">
                        <img 
                          src={previewImg}
                          alt={tpl.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="px-2 py-0.5 rounded-md bg-[#38260F]/80 backdrop-blur-md text-white text-[10px] font-bold">
                            ثيم ملكي
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-lg text-[#38260F] mb-1">
                          {tpl.name}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                          {tpl.description || 'تصميم راقٍ ومميز لحفل زفافك يجمع بين الجمال وسهولة مشاركة الرابط.'}
                        </p>

                        <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-[#EADBCA]/70">
                          <a
                            href={demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-2 rounded-xl bg-white hover:bg-[#F2ECE1] border border-[#D5C7B2] text-[#543914] font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center shadow-xs active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#8C6D38]" />
                            <span>معاينة حية</span>
                          </a>

                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-105 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#25D366]/20 transition-all text-center"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                            <span>اطلب بالواتساب</span>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          /* Empty Search State */
          <div className="text-center py-12 sm:py-16 bg-[#FAF7F2] rounded-3xl border border-dashed border-gray-300 max-w-xl mx-auto px-4">
            <span className="text-4xl mb-3 block">🔍</span>
            <h3 className="font-bold text-lg text-gray-800 mb-1">لم يتم العثور على ثيمات مطابقة للبحث</h3>
            <p className="text-xs text-gray-500 mb-4">جرب البحث بكلمات أخرى أو تصفح جميع الثيمات</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-5 py-2 rounded-full bg-[#8C6D38] text-white text-xs font-bold shadow-sm"
            >
              عرض جميع الثيمات
            </button>
          </div>
        )}

      </section>


      {/* ========================================================= */}
      {/* 4. How It Works Section: 3 Clear Steps with Stagger Animation */}
      {/* ========================================================= */}
      <section id="how-it-works" className="py-14 sm:py-24 bg-[#FAF7F2] border-t border-[#EADBCA]/70 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D5C7B2] text-[#8C6D38] text-xs font-bold mb-3 shadow-xs">
            <span>سهل • سريع • بدون تعقيد</span>
          </div>
          
          <h2 
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#38260F] mb-3 sm:mb-4"
            style={{ fontFamily: "'Aref Ruqaa', 'Cairo', serif" }}
          >
            كيف تطلب دعوتك معنا؟
          </h2>
          <p className="text-xs sm:text-base text-gray-600 max-w-xl mx-auto mb-10 sm:mb-16">
            3 خطوات بسيطة لتجهيز بطاقتك الإلكترونية الفاخرة وإبهار ضيوفك في أسرع وقت.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
            
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBCA] shadow-sm flex flex-col items-center relative z-10 transition-all"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#8C6D38] to-[#C5A059] text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center mb-5 shadow-md shadow-[#8C6D38]/20">
                1
              </div>
              <h3 className="font-extrabold text-lg sm:text-xl text-[#38260F] mb-2 sm:mb-3">اختر الثيم المفضل</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                تصفح تشكيلة الثيمات واضغط على "معاينة حية" لتشاهد مؤثرات فتح الأبواب والموسيقى كما ستظهر للضيوف.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBCA] shadow-sm flex flex-col items-center relative z-10 transition-all"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#25D366] to-[#128C7E] text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center mb-5 shadow-md shadow-[#25D366]/20">
                2
              </div>
              <h3 className="font-extrabold text-lg sm:text-xl text-[#38260F] mb-2 sm:mb-3">تواصل عبر واتساب</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                اضغط على "اطلب بالواتساب"، وأرسل لنا تفاصيل زفافك (أسماء العروسين، التاريخ، موقع القاعة، وقائمة الضيوف).
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBCA] shadow-sm flex flex-col items-center relative z-10 transition-all"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#8C6D38] to-[#DFBA73] text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center mb-5 shadow-md shadow-[#8C6D38]/20">
                3
              </div>
              <h3 className="font-extrabold text-lg sm:text-xl text-[#38260F] mb-2 sm:mb-3">استلم الروابط وكارت الطباعة</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                نجهز لك الدعوة خلال 24 ساعة ونرسل لك روابط مخصصة لكل ضيف مع كارت QR عالي الدقة جاهز للطباعة الفاخرة.
              </p>
            </motion.div>

          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 5. Features & Benefits Section */}
      {/* ========================================================= */}
      <section id="features" className="py-14 sm:py-24 bg-white border-t border-[#EADBCA]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 
              className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#38260F] mb-3"
              style={{ fontFamily: "'Aref Ruqaa', 'Cairo', serif" }}
            >
              لماذا تختار دعوتك معنا؟
            </h2>
            <p className="text-xs sm:text-base text-gray-600">
              نجمع بين الفخامة الملكية والتقنيات الذكية لنمنح ضيوفك تجربة استثنائية لا تُنسى.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 sm:p-8 rounded-3xl bg-[#FAF7F2] border border-[#EADBCA] flex flex-col items-start text-right transition-all"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white flex items-center justify-center mb-4 sm:mb-5 text-[#8C6D38] shadow-xs border border-[#EADBCA]">
                <Smartphone className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-[#38260F] mb-2">متوافق 100% مع الهواتف</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                صُممت الدعوات لتعمل بسلاسة فائقة وسرعة خاطفة على جميع أجهزة الآيفون والأندرويد بمظهر سينمائي مريح للعين.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 sm:p-8 rounded-3xl bg-[#FAF7F2] border border-[#EADBCA] flex flex-col items-start text-right transition-all"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white flex items-center justify-center mb-4 sm:mb-5 text-[#8C6D38] shadow-xs border border-[#EADBCA]">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-[#38260F] mb-2">سرعة فائقة في التجهيز</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                ندرك أهمية الوقت؛ فريقنا يجهز لك رابط الدعوة المخصص خلال 24 ساعة فقط وبدقة عالية مع إمكانية التعديل الفوري.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 sm:p-8 rounded-3xl bg-[#FAF7F2] border border-[#EADBCA] flex flex-col items-start text-right transition-all"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white flex items-center justify-center mb-4 sm:mb-5 text-[#8C6D38] shadow-xs border border-[#EADBCA]">
                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-[#38260F] mb-2">خصوصية ودعوات مخصصة</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                روابط حصرية بأسماء المدعوين لمنع العبث بالرابط، بالإضافة إلى كارت QR عالي الجودة جاهز للطباعة الفورية.
              </p>
            </motion.div>

          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 6. FAQ Section (Accordion for Perfect Mobile UX) */}
      {/* ========================================================= */}
      <section id="faq" className="py-14 sm:py-24 bg-[#FAF7F2] border-t border-[#EADBCA]/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 
              className="text-2xl sm:text-4xl font-extrabold text-[#38260F] mb-2 sm:mb-3"
              style={{ fontFamily: "'Aref Ruqaa', 'Cairo', serif" }}
            >
              الأسئلة الشائعة
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">إجابات سريعة وواضحة على أكثر الأسئلة تكراراً</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className="rounded-2xl bg-white border border-[#EADBCA] shadow-xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-right font-bold text-sm sm:text-base text-[#38260F] flex items-center justify-between gap-3 focus:outline-none select-none"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#8C6D38] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-[#F2ECE1]">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* 7. Bottom CTA Banner */}
      {/* ========================================================= */}
      <section className="py-14 sm:py-20 relative overflow-hidden bg-gradient-to-r from-[#4A3210] via-[#543914] to-[#38260F] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-5 text-[#FAF0D7] leading-tight"
            style={{ fontFamily: "'Aref Ruqaa', 'Cairo', serif" }}
          >
            جاهز لإبهار ضيوفك بدعوة زفاف استثنائية؟
          </h2>
          <p className="text-xs sm:text-base text-gray-300 mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed">
            تواصل معنا عبر الواتساب وسنساعدك في اختيار الثيم الأنسب وتجهيز دعوتك بأعلى درجات الفخامة.
          </p>
          <a 
            href={generalWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-110 active:scale-95 text-white font-extrabold text-sm sm:text-base shadow-xl transition-all"
          >
            <WhatsAppIcon className="w-5 h-5 text-white" />
            <span>ابدأ الآن عبر الواتساب</span>
          </a>
        </div>
      </section>


      {/* ========================================================= */}
      {/* 8. Footer with TikTok, Instagram, WhatsApp, Email */}
      {/* ========================================================= */}
      <footer id="contact" className="bg-[#FAF7F2] pt-12 sm:pt-16 pb-10 sm:pb-12 border-t border-[#EADBCA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 sm:pb-10 border-b border-[#EADBCA]">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <BrandLogo 
                siteName={siteName} 
                size="md" 
                showSubtitle={true}
              />
            </div>

            {/* Socials & Contacts */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-gray-600">
              
              {/* WhatsApp */}
              {settings.contactWhatsApp && (
                <a 
                  href={`https://wa.me/${cleanPhone}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[#25D366] transition-colors bg-white px-3 py-1.5 rounded-full border border-[#EADBCA] shadow-xs"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  <span dir="ltr">{settings.contactWhatsApp}</span>
                </a>
              )}

              {/* Instagram */}
              {instagramUrl && (
                <a 
                  href={instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[#E1306C] transition-colors bg-white px-3 py-1.5 rounded-full border border-[#EADBCA] shadow-xs"
                >
                  <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
                  <span>انستغرام</span>
                </a>
              )}

              {/* TikTok */}
              {tikTokUrl && (
                <a 
                  href={tikTokUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-black transition-colors bg-white px-3 py-1.5 rounded-full border border-[#EADBCA] shadow-xs"
                >
                  <TikTokIcon className="w-4 h-4 text-black" />
                  <span>تيك توك</span>
                </a>
              )}

              {/* Email */}
              {settings.contactEmail && (
                <a 
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center gap-1.5 hover:text-[#8C6D38] transition-colors bg-white px-3 py-1.5 rounded-full border border-[#EADBCA] shadow-xs"
                >
                  <Mail className="w-4 h-4 text-[#8C6D38]" />
                  <span>{settings.contactEmail}</span>
                </a>
              )}

            </div>

          </div>

          <div className="pt-6 text-center text-xs text-gray-400">
            <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} {siteName}</p>
          </div>
        </div>
      </footer>


      {/* ========================================================= */}
      {/* 9. Floating WhatsApp Direct Button */}
      {/* ========================================================= */}
      <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-50">
        
        {/* Floating WhatsApp Button */}
        <a 
          href={generalWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصل معنا عبر واتساب"
          className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
        >
          {/* Subtle Radar Wave */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none" />
          
          <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />

          {/* Tooltip on Hover */}
          <span className="hidden sm:inline-block absolute left-16 whitespace-nowrap bg-white text-gray-800 text-xs font-bold py-1.5 px-3 rounded-xl shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            اطلب أو استفسر عبر واتساب 💬
          </span>
        </a>

      </div>

    </main>
  );
}
