import fs from 'fs';
import path from 'path';

export const defaultSettings = {
  siteName: 'دعوتي Daawati',
  heroTitle: 'أجمل دعوات الزفاف الإلكترونية',
  heroSubtitle: 'صمم دعوتك بأسلوبك الخاص وشاركها مع من تحب بثوانٍ معدودة.',
  aboutTitle: 'لماذا تختار منصتنا؟',
  aboutText: 'نوفر لك قوالب عصرية وتجربة مستخدم لا مثيل لها لتصميم دعوة زفافك بكل سهولة، مع إمكانية إدارة الحضور ومعرفة الإحصائيات.',
  contactWhatsApp: '+201000000000',
  contactEmail: 'contact@domain.com',
  contactInstagram: '',
  demoLinks: {
    'butterfly-elegance': '/preview?template=butterfly-elegance',
    'golden-arabic': '/preview?template=golden-arabic',
    'classic-elegance': '/preview?template=classic-elegance',
    'modern-minimalist': '/preview?template=modern-minimalist',
    'floral-romance': '/preview?template=floral-romance',
    'botanical-rustic': '/preview?template=botanical-rustic',
    'royal-velvet': '/preview?template=royal-velvet',
    'palace-gates': '/preview?template=palace-gates',
    'celestial-stardust': '/preview?template=celestial-stardust',
    'pearl-box': '/preview?template=pearl-box',
    'story-vogue-editorial': '/preview?template=story-vogue-editorial',
    'story-royal-emerald': '/preview?template=story-royal-emerald',
    'story-boho-terracotta': '/preview?template=story-boho-terracotta',
    'wax-silk-reveal': '/preview?template=wax-silk-reveal',
    'arabian-crescent-lantern': '/preview?template=arabian-crescent-lantern'
  },
  previewImages: {}
};

export function getSettings() {
  const settingsFile = path.join(process.cwd(), 'landing-settings.json');
  try {
    if (fs.existsSync(settingsFile)) {
      const data = fs.readFileSync(settingsFile, 'utf8');
      const parsed = JSON.parse(data);
      if (!parsed.siteName) parsed.siteName = 'دعوتي Daawati';
      if (!parsed.previewImages) parsed.previewImages = {};
      return parsed;
    }
  } catch (e) {
    console.error('Error reading settings', e);
  }
  return defaultSettings;
}
