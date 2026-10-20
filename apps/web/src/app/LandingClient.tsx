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
  Camera
} from 'lucide-react';

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
  demoLinks?: Record<string, string>;
  previewImages?: Record<string, string>;
  [key: string]: any;
}

// Category Mapping helper for rich filtration
const getThemeCategory = (id: string): string => {
  if (['palace-doors-reveal', 'mughal-palace-portal', 'cathedral-grand-arch', 'sculpted-porcelain-arch', 'palace-gates', 'royal-velvet', 'royal-scroll', 'trifold-pocket-folio'].includes(id)) {
    return 'palace';
  }
  if (['golden-arabic', 'arabian-crescent-lantern', 'laser-gold-gatefold', 'celestial-stardust', 'celestial-constellations'].includes(id)) {
    return 'arabic';
  }
  if (['floral-romance', 'botanical-rustic', 'blooming-garden-3d', 'vintage-calla-blooms', 'deckle-edge-cotton', 'heavenly-roses'].includes(id)) {
    return 'floral';
  }
  if (['butterfly-elegance', 'wax-silk-reveal', 'luxury-flip-card', 'pearl-box', 'velvet-jewelry-box', 'vintage-vinyl-player', 'polaroid-photo-reel', 'boarding-pass-vip'].includes(id)) {
    return '3d';
  }
  return 'modern';
};

// Top Priority display order
const PRIORITY_ORDER = [
  'palace-doors-reveal',
  'mughal-palace-portal',
  'cathedral-grand-arch',
  'sculpted-porcelain-arch',
  'butterfly-elegance',
  'golden-arabic',
  'classic-elegance',
  'floral-romance',
  'modern-minimalist',
  'royal-velvet',
  'blooming-garden-3d',
  'wax-silk-reveal',
  'laser-gold-gatefold',
  'palace-gates',
  'pearl-silk-minimalist',
  'luxury-flip-card',
  'arabian-crescent-lantern',
  'vintage-calla-blooms',
  'botanical-rustic',
  'celestial-stardust'
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
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const siteName = settings.siteName || "دعوتي Daawati";
  const rawWhatsApp = settings.contactWhatsApp || "+201000000000";
  const cleanPhone = rawWhatsApp.replace(/[^0-9]/g, '');

  // Helper to build WhatsApp Direct Order URL with Theme Name pre-filled
  const getThemeWhatsAppUrl = (themeName: string) => {
    const message = encodeURIComponent(`مرحباً، أود طلب وتجهيز تصميم دعوة زفاف بثيم: (${themeName}) 💍✨`);
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  // Helper for general inquiries
  const generalWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('مرحباً، أود الاستفسار عن تفاصيل دعوات الزفاف الإلكترونية 💍✨')}`;

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
    { id: 'floral', label: 'ورود وطبيعة 🌸' },
    { id: '3d', label: 'تفاعلي ومجسم 3D 🦋' },
    { id: 'modern', label: 'عصري وناعم ✨' },
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
            ? 'bg-white/90 backdrop-blur-md shadow-md py-3 border-b border-[#EADCC5]/70' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8C6D38] via-[#C5A059] to-[#DFBA73] p-0.5 shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#FAF7F2] rounded-[14px] flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#8C6D38] fill-[#C5A059]/30" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl text-[#3D2810] tracking-tight" style={{ fontFamily: "'Aref Ruqaa', 'Cairo', serif" }}>
                {siteName}
              </span>
              <span className="text-[10px] text-[#8C6D38] font-bold tracking-widest -mt-1 uppercase">
                Luxury Digital Invitations
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 space-x-reverse text-sm font-bold text-[#634827]">
            <a href="#templates" className="hover:text-[#8C6D38] transition-colors py-1">الثيمات المتاحة</a>
            <a href="#how-it-works" className="hover:text-[#8C6D38] transition-colors py-1">طريقة الطلب</a>
            <a href="#features" className="hover:text-[#8C6D38] transition-colors py-1">مميزات الدعوة</a>
            <a href="#faq" className="hover:text-[#8C6D38] transition-colors py-1">الأسئلة الشائعة</a>
          </nav>

          {/* Quick WhatsApp Action Button */}
          <div className="flex items-center gap-3">
            <a 
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg hover:shadow-[#25D366]/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white/20 shrink-0" />
              <span>تواصل عبر واتساب</span>
            </a>
          </div>
        </div>
      </motion.header>


      {/* ========================================================= */}
      {/* 2. Hero Section - Royal Luxury Boutique */}
      {/* ========================================================= */}
      <section className="relative pt-32 pb-14 md:pt-40 md:pb-20 overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FAF7F2]">
        
        {/* Decorative Golden Ambient Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#F5E6CD]/50 rounded-full blur-3xl opacity-70" />
          <div className="absolute top-28 left-1/4 w-80 h-80 bg-[#E8D5B5]/40 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-40 bg-[#DFBA73]/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center">
          
          {/* Top Royal Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#D5C7B2]/70 text-[#8C6D38] text-xs font-bold shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>دعوات زفاف إلكترونية تفاعلية فاخرة</span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#38260F] mb-6 leading-[1.25] tracking-tight max-w-4xl"
            style={{ fontFamily: "'Aref Ruqaa', 'Cairo', serif" }}
          >
            {settings.heroTitle || 'دعوات زفاف فاخرة تليق بليلة العمر'}
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-xl text-[#6B5338] mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            {settings.heroSubtitle || 'اختر ثيمك المفضل من مجموعتنا الحصرية، شاهده حياً على هاتفك، واطلبه مباشرة عبر الواتساب لتجهيزه بأعلى درجات الأناقة والسرعة.'}
          </motion.p>

          {/* Main CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-12"
          >
            <a 
              href="#templates" 
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-[#8C6D38] via-[#A88448] to-[#6E4E26] text-white font-bold text-base shadow-xl shadow-[#8C6D38]/25 hover:shadow-[#8C6D38]/40 hover:brightness-110 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>استعرض تشكيلة الثيمات ⚜️</span>
            </a>

            <a 
              href={generalWhatsAppUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#4A3210] font-bold text-base border border-[#D5C7B2] hover:bg-[#FAF5ED] shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              <span>تحدث معنا عبر واتساب</span>
            </a>
          </motion.div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 3. Core Section: THEMES SHOWCASE (Horizontal Coverflow Carousel) */}
      {/* ========================================================= */}
      <section id="templates" className="py-16 md:py-24 bg-white relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF0D7] text-[#8C6D38] text-xs font-bold mb-3 border border-[#E5C987]/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>معرض الثيمات التفاعلي</span>
            </div>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#38260F] mb-3"
              style={{ fontFamily: "'Aref Ruqaa', 'Cairo', serif" }}
            >
              تشكيلة الثيمات الحصرية
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              اسحب أفقياً أو استخدم الأسهم للتنقل بين التصاميم. الثيم الأوسط يظهر بحجم بارز وعائم مع إمكانية المعاينة الحية والطلب الفوري.
            </p>
          </div>

          {/* Filter Bar & Live Search */}
          <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-3xl border border-[#EADBCA] shadow-sm mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        isActive 
                          ? 'bg-[#8C6D38] text-white shadow-md' 
                          : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {cat.count !== undefined && (
                        <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                          {cat.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Real-time Theme Search Input */}
              <div className="relative w-full md:w-72 shrink-0">
                <input
                  type="text"
                  placeholder="ابحث باسم الثيم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white rounded-2xl py-2 px-4 pr-10 text-xs sm:text-sm border border-gray-200 focus:outline-none focus:border-[#8C6D38] transition-all text-right shadow-xs"
                />
                <Search className="w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute top-1/2 -translate-y-1/2 left-3 text-xs text-gray-400 hover:text-gray-600 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Quick Counter & Nav Controls */}
          {sortedAndFilteredTemplates.length > 0 && (
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8C6D38]">
                <span>الثيم رقم ({activeIndex + 1}) من ({sortedAndFilteredTemplates.length})</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 font-medium hidden sm:inline">اسحب باللمس أو اضغط على الأسهم</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevTheme}
                  disabled={activeIndex === 0}
                  aria-label="الثيم السابق"
                  className="w-10 h-10 rounded-full bg-white border border-[#D5C7B2] text-[#6E4E26] hover:bg-[#FAF5ED] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-xs transition-all active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextTheme}
                  disabled={activeIndex === sortedAndFilteredTemplates.length - 1}
                  aria-label="الثيم التالي"
                  className="w-10 h-10 rounded-full bg-[#8C6D38] text-white hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-md transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ========================================================= */}
        {/* HORIZONTAL COVERFLOW TRACK */}
        {/* Cards are horizontally scrollable with snap-center */}
        {/* Active card is centered, enlarged (scale-105/108), elevated shadow, floating */}
        {/* Previous and next cards are partially visible (peeking) on both sides */}
        {/* ========================================================= */}
        {sortedAndFilteredTemplates.length > 0 ? (
          <div className="relative w-full py-8 overflow-hidden">
            
            {/* Scrollable Container with Side Padding to ensure center alignment & peeking */}
            <div 
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="flex items-center gap-5 sm:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth px-[10vw] sm:px-[22vw] md:px-[28vw] lg:px-[32vw] pb-6 pt-4 scrollbar-none"
              style={{
                scrollPadding: '0 25%',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {sortedAndFilteredTemplates.map((tpl, i) => {
                const isActive = i === activeIndex;
                const demoUrl = settings.demoLinks?.[tpl.id] || `/preview?template=${tpl.id}`;
                const previewImg = settings.previewImages?.[tpl.id] || tpl.previewImage || '/assets/templates/placeholder-couple.jpg';
                const whatsappUrl = getThemeWhatsAppUrl(tpl.name);
                const isFeatured = ['mughal-palace-portal', 'cathedral-grand-arch', 'butterfly-elegance'].includes(tpl.id);

                return (
                  <div
                    key={tpl.id}
                    ref={(el) => { cardRefs.current[i] = el; }}
                    onClick={() => {
                      if (!isActive) scrollToTheme(i);
                    }}
                    className={`shrink-0 snap-center transition-all duration-500 ease-out flex flex-col justify-between cursor-pointer select-none rounded-[32px] p-4 ${
                      isActive 
                        ? 'w-[80vw] sm:w-[350px] md:w-[380px] bg-white ring-2 ring-[#C5A059] border-2 border-[#DFBA73] shadow-2xl shadow-[#8C6D38]/30 -translate-y-3 scale-100 sm:scale-105 z-30'
                        : 'w-[72vw] sm:w-[310px] md:w-[340px] bg-white/80 border border-[#EADBCA] shadow-md opacity-70 hover:opacity-95 hover:scale-[0.98] scale-95 z-10'
                    }`}
                  >

                    {/* Active Floating Pill */}
                    {isActive && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-[#8C6D38] via-[#C5A059] to-[#8C6D38] text-white text-[11px] font-extrabold px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap animate-pulse">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>الثيم المعروض بالمنتصف</span>
                      </div>
                    )}
                    
                    {/* Mockup Display Box */}
                    <div className="relative rounded-[24px] overflow-hidden aspect-[9/13] bg-neutral-200 mb-3.5 border border-[#EAE0D1]">
                      <img 
                        src={previewImg} 
                        alt={tpl.name}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                          isActive ? 'group-hover:scale-105' : ''
                        }`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800';
                        }}
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                        {isFeatured && (
                          <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#8C6D38] text-[11px] font-bold shadow-xs border border-[#E5C987]">
                            ⭐ الأكثر طلباً
                          </span>
                        )}
                      </div>

                      {/* Top Left Indicator */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2 py-0.5 rounded-md bg-[#38260F]/80 backdrop-blur-md text-white text-[10px] font-bold">
                          معاينة مباشرة
                        </span>
                      </div>

                      {/* Gradient Bottom Shadow */}
                      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                      {/* Bottom Info inside phone preview */}
                      <div className="absolute inset-x-0 bottom-0 p-3 text-white text-center z-10">
                        <span className="text-[11px] font-semibold text-white/90 block">
                          تأثيرات حركية • موسيقى • عد تنازلي • خريطة
                        </span>
                      </div>
                    </div>

                    {/* Card Content & Action Buttons */}
                    <div className="px-1 flex-1 flex flex-col justify-between">
                      
                      <div className="mb-3">
                        <h3 className={`font-extrabold text-lg mb-1 line-clamp-1 transition-colors ${
                          isActive ? 'text-[#38260F]' : 'text-gray-700'
                        }`}>
                          {tpl.name}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {tpl.description || 'تصميم راقٍ ومميز لحفل زفافك يجمع بين الجمال وسهولة مشاركة الرابط.'}
                        </p>
                      </div>

                      {/* THE 2 DIRECT BUTTONS */}
                      <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-[#EADBCA]/70">
                        
                        {/* 1. Live Demo Preview */}
                        <a
                          href={demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="py-2.5 px-2 rounded-xl bg-white hover:bg-[#F2ECE1] border border-[#D5C7B2]/80 text-[#543914] font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center shadow-xs active:scale-95"
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
                          <MessageCircle className="w-3.5 h-3.5 fill-white/20 shrink-0" />
                          <span>اطلب بالواتساب</span>
                        </a>

                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

            {/* Pagination Dots Indicator */}
            <div className="flex items-center justify-center gap-1.5 pt-4">
              {sortedAndFilteredTemplates.slice(0, 15).map((_, dotIdx) => (
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
              {sortedAndFilteredTemplates.length > 15 && (
                <span className="text-[10px] text-gray-400 font-bold mr-1">
                  +{sortedAndFilteredTemplates.length - 15}
                </span>
              )}
            </div>

          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 bg-[#FAF7F2] rounded-3xl border border-dashed border-gray-300 max-w-xl mx-auto">
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
      {/* 4. How It Works Section: 3 Clear Steps */}
      {/* ========================================================= */}
      <section id="how-it-works" className="py-24 bg-[#FAF7F2] border-t border-[#EADBCA]/70 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D5C7B2] text-[#8C6D38] text-xs font-bold mb-3 shadow-xs">
            <span>سهل • سريع • بدون تعقيد</span>
          </div>
          
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#38260F] mb-4"
            style={{ fontFamily: "'Aref Ruqaa', 'Cairo', serif" }}
          >
            كيف تطلب دعوتك معنا؟
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mb-16">
            خطوات بسيطة وسريعة لتجهيز بطاقتك الإلكترونية الفاخرة وإبهار ضيوفك.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl border border-[#EADBCA] shadow-sm flex flex-col items-center relative z-10 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8C6D38] to-[#C5A059] text-white font-extrabold text-2xl flex items-center justify-center mb-6 shadow-md shadow-[#8C6D38]/20">
                1
              </div>
              <h3 className="font-extrabold text-xl text-[#38260F] mb-3">اختر الثيم المفضل</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                تصفح تشكيلة الثيمات واضغط على "معاينة حية" لتشاهد تفاصيل الدعوة والمؤثرات كما ستظهر للضيوف.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl border border-[#EADBCA] shadow-sm flex flex-col items-center relative z-10 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#25D366] to-[#128C7E] text-white font-extrabold text-2xl flex items-center justify-center mb-6 shadow-md shadow-[#25D366]/20">
                2
              </div>
              <h3 className="font-extrabold text-xl text-[#38260F] mb-3">تواصل عبر واتساب</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                اضغط على "اطلب بالواتساب"، وستُفتح لك محادثة فورية مع اسم الثيم جاهزاً، ثم أرسل لنا تفاصيل زفافك (الأسماء، الموعد، المكان).
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl border border-[#EADBCA] shadow-sm flex flex-col items-center relative z-10 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8C6D38] to-[#DFBA73] text-white font-extrabold text-2xl flex items-center justify-center mb-6 shadow-md shadow-[#8C6D38]/20">
                3
              </div>
              <h3 className="font-extrabold text-xl text-[#38260F] mb-3">استلم رابط دعوتك</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                نجهز لك الدعوة باحترافية ونرسل لك رابطاً خاصاً جاهزاً للإرسال عبر واتساب ووسائل التواصل بكل سهولة.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 5. Features & Benefits Section */}
      {/* ========================================================= */}
      <section id="features" className="py-24 bg-white border-t border-[#EADBCA]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#38260F] mb-4"
              style={{ fontFamily: "'Aref Ruqaa', 'Cairo', serif" }}
            >
              لماذا تختار دعوتك معنا؟
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              نجمع بين أحدث التقنيات وأرقى اللمسات الجمالية لنمنح ضيوفك تجربة لا تُنسى.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EADBCA] flex flex-col items-start text-right">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-5 text-[#8C6D38] shadow-xs border border-[#EADBCA]">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl text-[#38260F] mb-3">متوافق 100% مع الهواتف</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                صُممت الدعوات لتعمل بسلاسة فائقة ودون أي تأخير على كافة أجهزة الآيفون والأندرويد بمظهر سينمائي مبهر.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EADBCA] flex flex-col items-start text-right">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-5 text-[#8C6D38] shadow-xs border border-[#EADBCA]">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl text-[#38260F] mb-3">سرعة فائقة في التجهيز</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                ندرك أهمية الوقت؛ فريقنا يجهز لك رابط الدعوة المخصص خلال 24 ساعة فقط وبدقة عالية.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EADBCA] flex flex-col items-start text-right">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-5 text-[#8C6D38] shadow-xs border border-[#EADBCA]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl text-[#38260F] mb-3">تعديلات غير محدودة</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                راحة بالك هي أولويتنا؛ نعدل النصوص والبيانات حتى تصل إلى النتيجة المثالية التي ترضيك تماماً.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 6. FAQ Section */}
      {/* ========================================================= */}
      <section id="faq" className="py-24 bg-[#FAF7F2] border-t border-[#EADBCA]/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 
              className="text-3xl sm:text-4xl font-extrabold text-[#38260F] mb-3"
              style={{ fontFamily: "'Aref Ruqaa', 'Cairo', serif" }}
            >
              الأسئلة الشائعة
            </h2>
            <p className="text-sm text-gray-600">إجابات سريعة على أهم الاستفسارات التي قد تخطر ببالك</p>
          </div>

          <div className="space-y-4">
            
            <div className="p-6 rounded-2xl bg-white border border-[#EADBCA] shadow-xs">
              <h4 className="font-bold text-base text-[#38260F] mb-2">كيف يستلم ضيوفي رابط الدعوة؟</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                نرسل لك رابطاً إلكترونياً فريداً وخفيفاً يمكنك نسخه ومشاركته مباشرة عبر الواتساب، الرسائل النصية، أو أي وسيلة تفضلها.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EADBCA] shadow-xs">
              <h4 className="font-bold text-base text-[#38260F] mb-2">هل يمكن إضافة موقع القاعة عبر خرائط قوقل؟</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                نعم بالتأكيد! جميع الثيمات تحتوي على زر مخصص للموقع ينقل ضيوفك مباشرة إلى تطبيق خرائط قوقل للوصول بسهولة.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EADBCA] shadow-xs">
              <h4 className="font-bold text-base text-[#38260F] mb-2">هل يمكن إضافة موسيقى خاصة أو صوت شيلة؟</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                نعم، يمكننا تضمين أي مقطع صوتي أو موسيقى هادئة مفضلة لديك تبدأ مع فتح الدعوة بنعومة.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EADBCA] shadow-xs">
              <h4 className="font-bold text-base text-[#38260F] mb-2">ماذا لو أردت تغيير موعد أو مكان الحفل بعد استلام الرابط؟</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                يمكن تحديث البيانات فوراً من طرفنا في أي وقت دون الحاجة لتغيير الرابط المرسل للضيوف.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* 7. Bottom CTA Banner */}
      {/* ========================================================= */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-r from-[#4A3210] via-[#543914] to-[#38260F] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 
            className="text-3xl sm:text-5xl font-extrabold mb-5 text-[#FAF0D7] leading-tight"
            style={{ fontFamily: "'Aref Ruqaa', 'Cairo', serif" }}
          >
            جاهز لإبهار ضيوفك بدعوة زفاف استثنائية؟
          </h2>
          <p className="text-sm sm:text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            تواصل معنا عبر الواتساب وسنساعدك في اختيار الثيم الأنسب وتجهيز دعوتك بأسرع وقت.
          </p>
          <a 
            href={generalWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-110 active:scale-95 text-white font-extrabold text-base shadow-xl transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            <span>ابدأ الآن عبر الواتساب</span>
          </a>
        </div>
      </section>


      {/* ========================================================= */}
      {/* 8. Footer (Admin button completely removed as requested) */}
      {/* ========================================================= */}
      <footer id="contact" className="bg-[#FAF7F2] pt-16 pb-12 border-t border-[#EADBCA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-[#EADBCA]">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#8C6D38] fill-[#C5A059]/40" />
              <span className="font-extrabold text-2xl text-[#3D2810]" style={{ fontFamily: "'Aref Ruqaa', 'Cairo', serif" }}>
                {siteName}
              </span>
            </div>

            {/* Socials & Contacts */}
            <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
              {settings.contactWhatsApp && (
                <a 
                  href={`https://wa.me/${cleanPhone}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[#25D366] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span dir="ltr">{settings.contactWhatsApp}</span>
                </a>
              )}
              {settings.contactEmail && (
                <a 
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center gap-1.5 hover:text-[#8C6D38] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>{settings.contactEmail}</span>
                </a>
              )}
              {settings.contactInstagram && (
                <a 
                  href={settings.contactInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[#E1306C] transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>انستغرام</span>
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
      {/* 9. Floating WhatsApp Button (Instant Accessibility) */}
      {/* ========================================================= */}
      <div className="fixed bottom-6 left-6 z-50">
        <a 
          href={generalWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصل معنا عبر واتساب"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
        >
          {/* Subtle Radar Wave */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
          
          <MessageCircle className="w-7 h-7 fill-white/20" />

          {/* Tooltip on Hover */}
          <span className="absolute left-16 whitespace-nowrap bg-white text-gray-800 text-xs font-bold py-1.5 px-3 rounded-xl shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            اطلب أو استفسر عبر واتساب 💬
          </span>
        </a>
      </div>

    </main>
  );
}
