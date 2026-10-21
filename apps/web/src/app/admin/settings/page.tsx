'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Globe, MessageCircle, Mail, Camera, Save, Check, Sparkles } from 'lucide-react';
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from '@/components/SocialIcons';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('فشل حفظ الإعدادات');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleDemoLinkChange = (templateId: string, url: string) => {
    setSettings((prev: any) => ({
      ...prev,
      demoLinks: {
        ...(prev.demoLinks || {}),
        [templateId]: url
      }
    }));
  };

  const handlePreviewImageChange = (templateId: string, url: string) => {
    setSettings((prev: any) => ({
      ...prev,
      previewImages: {
        ...(prev.previewImages || {}),
        [templateId]: url
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-stone-500 font-bold">
        <span>جاري تحميل إعدادات الموقع...</span>
      </div>
    );
  }

  const templateNames: Record<string, string> = {
    'palace-doors-reveal': '🚪 بوابة القصر الملكية (دق 3 مرات)',
    'mughal-palace-portal': '🕌 بوابة القصر وشلال الزهور',
    'cathedral-grand-arch': '⛪ قوس الكاتدرائية الملكي',
    'sculpted-porcelain-arch': '🏛️ قوس البورسلين المنحوت 3D',
    'butterfly-elegance': '🦋 فراشة الأناقة التفاعلية',
    'golden-arabic': '⚜️ الطابع العربي الذهبي'
  };

  const templateIds = Object.keys(templateNames);

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#EADBCA]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF0D7] text-[#8C6D38] flex items-center justify-center border border-[#DFBA73]/40 shadow-xs">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#38260F]" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
              إعدادات المنصة والموقع
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              تعديل نصوص الصفحة الرئيسية، أرقام وحسابات التواصل، وروابط الثيمات
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2 border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>تم حفظ التعديلات بنجاح!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. Global & Hero Info */}
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#EADBCA] shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-[#38260F] pb-2 border-b border-[#F2ECE1] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#8C6D38]" />
            <span>نصوص الواجهة والصفحة الرئيسية</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#5C4520] mb-1.5">اسم الموقع / البراند</label>
              <input 
                className="w-full bg-[#FAF7F2] border border-[#EADBCA] focus:bg-white focus:border-[#8C6D38] rounded-xl p-2.5 text-sm outline-none transition-all" 
                value={settings.siteName || ''} 
                onChange={e => setSettings({...settings, siteName: e.target.value})} 
                placeholder="دعوتي Daawati"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#5C4520] mb-1.5">عنوان الهيدر الرئيسي (Hero Title)</label>
              <input 
                className="w-full bg-[#FAF7F2] border border-[#EADBCA] focus:bg-white focus:border-[#8C6D38] rounded-xl p-2.5 text-sm outline-none transition-all" 
                value={settings.heroTitle || ''} 
                onChange={e => setSettings({...settings, heroTitle: e.target.value})} 
                placeholder="دعوات زفاف ملكية تليق بليلة العمر"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#5C4520] mb-1.5">الوصف الترويجي (Hero Subtitle)</label>
              <textarea 
                className="w-full bg-[#FAF7F2] border border-[#EADBCA] focus:bg-white focus:border-[#8C6D38] rounded-xl p-2.5 text-sm outline-none transition-all h-20" 
                value={settings.heroSubtitle || ''} 
                onChange={e => setSettings({...settings, heroSubtitle: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* 2. Contact & Social Channels */}
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#EADBCA] shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-[#38260F] pb-2 border-b border-[#F2ECE1] flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#8C6D38]" />
            <span>قنوات التواصل وحسابات السوشيال ميديا</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-[#5C4520] mb-1.5 flex items-center gap-1.5">
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                <span>رقم الواتساب الرسمي (مع كود الدولة)</span>
              </label>
              <input 
                dir="ltr"
                className="w-full bg-[#FAF7F2] border border-[#EADBCA] focus:bg-white focus:border-[#8C6D38] rounded-xl p-2.5 text-sm font-mono outline-none transition-all text-left" 
                value={settings.contactWhatsApp || ''} 
                onChange={e => setSettings({...settings, contactWhatsApp: e.target.value})}
                placeholder="+201000000000"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[#5C4520] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#8C6D38]" />
                <span>البريد الإلكتروني الرسمي</span>
              </label>
              <input 
                dir="ltr"
                className="w-full bg-[#FAF7F2] border border-[#EADBCA] focus:bg-white focus:border-[#8C6D38] rounded-xl p-2.5 text-sm font-mono outline-none transition-all text-left" 
                value={settings.contactEmail || ''} 
                onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                placeholder="contact@daawati.com"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-xs font-bold text-[#5C4520] mb-1.5 flex items-center gap-1.5">
                <InstagramIcon className="w-3.5 h-3.5 text-[#E1306C]" />
                <span>رابط حساب إنستجرام (Instagram URL)</span>
              </label>
              <input 
                dir="ltr"
                className="w-full bg-[#FAF7F2] border border-[#EADBCA] focus:bg-white focus:border-[#8C6D38] rounded-xl p-2.5 text-sm font-mono outline-none transition-all text-left" 
                value={settings.contactInstagram || ''} 
                onChange={e => setSettings({...settings, contactInstagram: e.target.value})}
                placeholder="https://instagram.com/daawati"
              />
            </div>

            {/* TikTok */}
            <div>
              <label className="block text-xs font-bold text-[#5C4520] mb-1.5 flex items-center gap-1.5">
                <TikTokIcon className="w-3.5 h-3.5 text-black" />
                <span>رابط حساب تيك توك (TikTok URL)</span>
              </label>
              <input 
                dir="ltr"
                className="w-full bg-[#FAF7F2] border border-[#EADBCA] focus:bg-white focus:border-[#8C6D38] rounded-xl p-2.5 text-sm font-mono outline-none transition-all text-left" 
                value={settings.contactTikTok || ''} 
                onChange={e => setSettings({...settings, contactTikTok: e.target.value})}
                placeholder="https://tiktok.com/@daawati"
              />
            </div>

          </div>
        </div>

        {/* 3. Official 6 Themes Overrides */}
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#EADBCA] shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-[#38260F] pb-2 border-b border-[#F2ECE1] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8C6D38]" />
            <span>روابط المعاينة وصور الثيمات الملكية الـ 6</span>
          </h2>
          <p className="text-xs text-gray-500">
            يمكنك تخصيص روابط المعاينة التجريبية وصور الغلاف التي تظهر في الصفحة الرئيسية لكل ثيم.
          </p>

          <div className="space-y-4 pt-2">
            {templateIds.map(tplId => (
              <div key={tplId} className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EADBCA] space-y-3">
                <div className="font-extrabold text-sm text-[#38260F]">
                  {templateNames[tplId]}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">رابط المعاينة المخصص (Demo Link)</label>
                    <input 
                      dir="ltr"
                      className="w-full bg-white border border-[#EADBCA] focus:border-[#8C6D38] rounded-xl p-2 text-xs font-mono outline-none" 
                      value={settings.demoLinks?.[tplId] || ''} 
                      onChange={e => handleDemoLinkChange(tplId, e.target.value)}
                      placeholder={`/preview?template=${tplId}`}
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">رابط صورة الغلاف (Preview Image)</label>
                    <input 
                      dir="ltr"
                      className="w-full bg-white border border-[#EADBCA] focus:border-[#8C6D38] rounded-xl p-2 text-xs font-mono outline-none" 
                      value={settings.previewImages?.[tplId] || ''} 
                      onChange={e => handlePreviewImageChange(tplId, e.target.value)}
                      placeholder="https://... أو /assets/..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={saving}
            className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-gradient-to-r from-[#8C6D38] to-[#5C4520] hover:brightness-110 active:scale-95 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات ✨'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
