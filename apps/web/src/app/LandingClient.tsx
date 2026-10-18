'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Smartphone, BarChart3, Mail, MessageCircle, Camera, CheckCircle2 } from 'lucide-react';

export default function LandingClient({ settings, templatesList }: { settings: any, templatesList: any[] }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const siteName = settings.siteName || "دعوتي Daawati";

  return (
    <main className="min-h-screen bg-[#FDFBF7] font-cairo text-gray-800 overflow-hidden" dir="rtl">

      
      
      {/* Navbar - Glassmorphism */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="font-bold text-3xl text-[#8E6E53] tracking-wider flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#D4A373]" fill="currentColor" />
            {siteName}
          </div>
          <nav className="hidden md:flex space-x-8 space-x-reverse">
            <a href="#about" className="text-gray-600 hover:text-[#D4A373] font-semibold transition-colors">عن المنصة</a>
            <a href="#features" className="text-gray-600 hover:text-[#D4A373] font-semibold transition-colors">المميزات</a>
            <a href="#templates" className="text-gray-600 hover:text-[#D4A373] font-semibold transition-colors">الثيمات</a>
            <a href="#contact" className="text-gray-600 hover:text-[#D4A373] font-semibold transition-colors">تواصل معنا</a>
          </nav>
          <a href="#contact" className="px-6 py-2.5 bg-gradient-to-r from-[#D4A373] to-[#BC8A5F] text-white rounded-full font-bold hover:shadow-lg hover:shadow-[#D4A373]/30 transition-all transform hover:-translate-y-0.5">
            اطلب دعوتك الآن
          </a>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-gradient-to-b from-[#FFF5F0] to-[#FDFBF7]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#FFE8D6] rounded-full mix-blend-multiply filter blur-3xl opacity-50"
          />
          <motion.div 
            animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }} 
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-[#FDE2E4] rounded-full mix-blend-multiply filter blur-3xl opacity-50"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-[#D4A373]/30 text-[#8E6E53] text-sm font-bold shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-[#D4A373]" />
            <span>البداية لزفافك المثالي</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-extrabold text-[#4A4036] mb-8 leading-[1.2]"
          >
            {settings.heroTitle}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {settings.heroSubtitle}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-auto"
          >
            <a href="#contact" className="px-10 py-4 bg-gradient-to-r from-[#D4A373] to-[#BC8A5F] text-white rounded-full font-bold text-lg hover:shadow-xl hover:shadow-[#D4A373]/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
              تواصل معنا للطلب
              <Sparkles className="w-5 h-5" />
            </a>
            <a href="#templates" className="px-10 py-4 bg-white text-[#8E6E53] rounded-full font-bold text-lg hover:bg-gray-50 transition-all border border-[#D4A373]/30 shadow-sm flex items-center justify-center">
              استعرض الثيمات
            </a>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-[#4A4036] mb-8"
          >
            {settings.aboutTitle}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 leading-relaxed"
          >
            {settings.aboutText}
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Smartphone, title: 'متجاوب وسريع', desc: 'دعوات تعمل بامتياز على جميع الشاشات والأجهزة المحمولة بلمسة عصرية.' },
              { icon: Sparkles, title: 'تصاميم فاخرة', desc: 'قوالب وثيمات تم تصميمها بعناية فائقة لتليق بفخامة مناسبتك.' },
              { icon: BarChart3, title: 'إدارة وإحصائيات', desc: 'تابع من سيحضر حفل زفافك واعرف عدد المشاهدات بضغطة زر.' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
              >
                <div className="w-16 h-16 mx-auto bg-[#FFE8D6] rounded-2xl flex items-center justify-center mb-6 text-[#D4A373]">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#4A4036] mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      {/* How it Works Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-[#4A4036] mb-16"
          >
            كيف تصمم دعوتك معنا؟
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-[#D4A373]/30 to-transparent"></div>
            
            {[
              { step: '1', title: 'اختر ثيمك المفضل', desc: 'تصفح تشكيلة الثيمات الفاخرة واختر التصميم الذي يناسب ذوقك' },
              { step: '2', title: 'تواصل معنا', desc: 'أرسل لنا بيانات زفافك (الأسماء، الموعد، المكان) عبر الواتساب' },
              { step: '3', title: 'استلم دعوتك', desc: 'سنقوم بتجهيز الدعوة وإرسال رابطها الخاص لك في أسرع وقت' }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-[#D4A373] to-[#BC8A5F] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-xl shadow-[#D4A373]/20 border-4 border-white">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold text-[#4A4036] mb-4">{s.title}</h3>
                <p className="text-gray-600 max-w-xs">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Templates Showcase */}
      <section id="templates" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-[#4A4036] mb-6"
            >
              تشكيلة الثيمات الفاخرة
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-lg max-w-2xl mx-auto"
            >
              اختر الثيم الذي يعكس ذوقك الرفيع ويناسب طابع حفل زفافك. جميع الثيمات قابلة للتخصيص بالكامل.
            </motion.p>
          </div>
          
          <div className="flex overflow-x-auto gap-4 md:gap-8 pb-12 snap-x snap-mandatory px-4 md:px-8 custom-scrollbar">
            {templatesList.map((tpl, i) => (
              <motion.div 
                key={tpl.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-[#FDFBF7] rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-[#D4A373]/20 transition-all duration-500 group flex flex-col w-[85vw] sm:w-[350px] md:w-[400px] shrink-0 snap-center"
              >
                <div className="h-64 sm:h-80 md:h-[450px] relative bg-gray-200 overflow-hidden w-full">
                  <img 
                    src={settings.previewImages?.[tpl.id] || tpl.previewImage || '/assets/templates/placeholder-couple.jpg'} 
                    alt={tpl.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4A4036]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 p-6 bg-black/50 backdrop-blur-sm">
                    <a 
                      href={settings.demoLinks?.[tpl.id] || `/preview?template=${tpl.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full max-w-xs text-center py-3 bg-white text-[#8E6E53] rounded-full font-bold hover:bg-gray-50 shadow-xl transition-transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <span>👁️ معاينة الثيم حياً</span>
                    </a>
                    <Link 
                      href={`/create?template=${tpl.id}`} 
                      className="w-full max-w-xs text-center py-3 bg-gradient-to-r from-[#D4A373] to-[#BC8A5F] text-white rounded-full font-bold shadow-xl transition-transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <span>✨ تصميم دعوتك بهذا الثيم</span>
                    </Link>
                  </div>
                </div>
                <div className="p-6 text-center flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-[#4A4036] mb-2">{tpl.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{tpl.description}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <a 
                      href={settings.demoLinks?.[tpl.id] || `/preview?template=${tpl.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 bg-[#F4EBE1] hover:bg-[#EADBC8] text-[#8E6E53] rounded-xl text-sm font-bold transition-all text-center"
                    >
                      معاينة الديمو
                    </a>
                    <Link 
                      href={`/create?template=${tpl.id}`} 
                      className="flex-1 py-2.5 px-3 bg-[#8E6E53] hover:bg-[#725740] text-white rounded-xl text-sm font-bold transition-all text-center"
                    >
                      اختيار الثيم
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-[#4A4036] text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8 text-[#FFE8D6]"
          >
            هل أنت مستعد لإنشاء دعوتك؟
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-10"
          >
            خطوات بسيطة تفصلك عن إبهار ضيوفك بدعوة لا تُنسى.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <a href="#contact" className="inline-block px-12 py-5 bg-[#D4A373] text-white rounded-full font-bold text-xl hover:bg-[#BC8A5F] hover:shadow-2xl hover:shadow-[#D4A373]/50 transition-all transform hover:-translate-y-1">
              اطلب الآن
            </a>
          </motion.div>
        </div>
      </section>

      {/* Contact Section & Footer */}
      <footer id="contact" className="bg-[#FDFBF7] pt-24 pb-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="font-bold text-3xl text-[#8E6E53] tracking-wider flex items-center gap-2 mb-6">
                <Heart className="w-6 h-6 text-[#D4A373]" fill="currentColor" />
                {siteName}
              </div>
              <p className="text-gray-500 leading-relaxed max-w-sm">
                نحن هنا لنجعل يوم زفافك أكثر تميزاً من خلال دعوات إلكترونية تجمع بين الأصالة والحداثة.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-[#4A4036] text-lg mb-6">تواصل معنا</h4>
              <ul className="space-y-4">
                {settings.contactWhatsApp && (
                  <li>
                    <a href={`https://wa.me/${settings.contactWhatsApp.replace(/[^0-9]/g, '')}`} target="_blank" className="flex items-center gap-3 text-gray-600 hover:text-[#D4A373] transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span dir="ltr">{settings.contactWhatsApp}</span>
                    </a>
                  </li>
                )}
                {settings.contactEmail && (
                  <li>
                    <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-3 text-gray-600 hover:text-[#D4A373] transition-colors">
                      <Mail className="w-5 h-5" />
                      <span>{settings.contactEmail}</span>
                    </a>
                  </li>
                )}
                {settings.contactInstagram && (
                  <li>
                    <a href={settings.contactInstagram} target="_blank" className="flex items-center gap-3 text-gray-600 hover:text-[#D4A373] transition-colors">
                      <Camera className="w-5 h-5" />
                      <span>انستقرام</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#4A4036] text-lg mb-6">روابط سريعة</h4>
              <ul className="space-y-4">
                <li><a href="#contact" className="text-gray-600 hover:text-[#D4A373] transition-colors">اطلب دعوتك</a></li>
                <li><Link href="/admin-login" className="text-gray-600 hover:text-[#D4A373] transition-colors">تسجيل دخول الإدارة</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 text-center text-gray-400">
            <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} {siteName}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
