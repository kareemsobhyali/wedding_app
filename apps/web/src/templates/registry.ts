import React from 'react';
import { TemplateRenderContext, TemplateMetadata } from './types';
import { ClassicEleganceTemplate } from './designs/classic-elegance';
import { ModernMinimalistTemplate } from './designs/modern-minimalist';
import { FloralRomanceTemplate } from './designs/floral-romance';
import { BotanicalRusticTemplate } from './designs/botanical-rustic';
import { GoldenArabicTemplate } from './designs/golden-arabic';
import { ButterflyEleganceTemplate } from './designs/butterfly-elegance';
import { RoyalVelvetTemplate } from './designs/royal-velvet';
import { PalaceGatesTemplate } from './designs/palace-gates';
import { CelestialStardustTemplate } from './designs/celestial-stardust';
import { PearlBoxTemplate } from './designs/pearl-box';
import { StoryVogueEditorialTemplate } from './designs/story-vogue-editorial';
import { StoryRoyalEmeraldTemplate } from './designs/story-royal-emerald';
import { StoryBohoTerracottaTemplate } from './designs/story-boho-terracotta';
import { WaxSilkRevealTemplate } from './designs/wax-silk-reveal';
import { ArabianCrescentLanternTemplate } from './designs/arabian-crescent-lantern';
import { LaserGoldGatefoldTemplate } from './designs/laser-gold-gatefold';
import { VintageCallaBloomsTemplate } from './designs/vintage-calla-blooms';
import { BloomingGarden3DTemplate } from './designs/blooming-garden-3d';
import { PearlSilkMinimalistTemplate } from './designs/pearl-silk-minimalist';

export interface RegisteredTemplate {
  component: React.FC<TemplateRenderContext>;
  metadata: TemplateMetadata;
}

export const templateRegistry: Record<string, RegisteredTemplate> = {
  'butterfly-elegance': {
    component: ButterflyEleganceTemplate,
    metadata: {
      id: 'butterfly-elegance',
      name: 'Butterfly Elegance 🦋',
      description: 'تصميم ملكي فاخر بمظروف ينفتح وفراشة ثلاثية الأبعاد تطير بنعومة وأناقة.',
      previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'GALLERY', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'welcomeSubtitle', label: 'العنوان أعلى المظروف (مثال: WEDDING INVITATION)', type: 'text', defaultValue: 'WEDDING INVITATION' },
        { key: 'envelopeMessage', label: 'الرسالة الترحيبية داخل المظروف', type: 'text', defaultValue: 'يسعدنا حضوركم ومشاركتنا الفرحة' },
        { key: 'invitationNote', label: 'نص بطاقة الدعوة الترحيبي', type: 'textarea', defaultValue: 'يسرنا دعوتكم لحضور حفل زفافنا ومشاركتنا فرحة هذا اليوم المميز، لتكتمل سعادتنا بوجودكم معنا.' },
        { key: 'timeline1Title', label: 'الفقرة 1 - العنوان', type: 'text', defaultValue: 'استقبال الضيوف' },
        { key: 'timeline1Time', label: 'الفقرة 1 - التوقيت', type: 'text', defaultValue: '07:30 PM' },
        { key: 'timeline1Desc', label: 'الفقرة 1 - الوصف', type: 'text', defaultValue: 'يسعدنا حضوركم ومشاركتنا فرحتنا' },
        { key: 'timeline2Title', label: 'الفقرة 2 - العنوان', type: 'text', defaultValue: 'عقد القران والزفة' },
        { key: 'timeline2Time', label: 'الفقرة 2 - التوقيت', type: 'text', defaultValue: '08:30 PM' },
        { key: 'timeline2Desc', label: 'الفقرة 2 - الوصف', type: 'text', defaultValue: 'لحظات البداية ومباركة الجمع الكريم' },
        { key: 'timeline3Title', label: 'الفقرة 3 - العنوان', type: 'text', defaultValue: 'العشاء الملكي' },
        { key: 'timeline3Time', label: 'الفقرة 3 - التوقيت', type: 'text', defaultValue: '10:00 PM' },
        { key: 'timeline3Desc', label: 'الفقرة 3 - الوصف', type: 'text', defaultValue: 'بوفيه عشاء فاخر احتفاءً بكم' },
        { key: 'closingMessage', label: 'العبارة الختامية', type: 'text', defaultValue: 'بكم تكتمل فرحتنا وتزداد سعادتنا ✨' }
      ]
    }
  },
  'golden-arabic': {
    component: GoldenArabicTemplate,
    metadata: {
      id: 'golden-arabic',
      name: 'Golden Arabic ⚜️',
      description: 'طابع عربي أصيل ببريق الذهب وقصص اللقاء والخطوبة والزفاف.',
      previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'GALLERY', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'envelopeQuote1', label: 'عبارة المظروف (السطر الأول)', type: 'text', defaultValue: 'إلى توأم الروح.. رفيق الدرب' },
        { key: 'envelopeQuote2', label: 'عبارة المظروف (السطر الثاني)', type: 'text', defaultValue: 'اليوم يكتمل الحلم 🤍' },
        { key: 'introMessage', label: 'عبارة الترحيب بعد الآية الكريمة', type: 'text', defaultValue: 'إلى توأم الروح.. رفيق الدرب.. ونس الأيام الحلوة' },
        { key: 'storyTitle', label: 'عنوان قسم القصة', type: 'text', defaultValue: 'قصتنا' },
        { key: 'story1Title', label: 'المرحلة 1 - العنوان', type: 'text', defaultValue: 'اللقاء الأول' },
        { key: 'story1Desc', label: 'المرحلة 1 - الوصف', type: 'text', defaultValue: 'يوم التقينا وتلاقت الأرواح' },
        { key: 'story2Title', label: 'المرحلة 2 - العنوان', type: 'text', defaultValue: 'الخطوبة' },
        { key: 'story2Desc', label: 'المرحلة 2 - الوصف', type: 'text', defaultValue: 'وعدنا بعضنا على الحب والوفاء' },
        { key: 'story3Title', label: 'المرحلة 3 - العنوان', type: 'text', defaultValue: 'يوم الفرح' },
        { key: 'story3Desc', label: 'المرحلة 3 - الوصف', type: 'text', defaultValue: 'نتوج حبنا ببداية حياة جديدة' },
        { key: 'dressCode', label: 'قواعد اللباس (Dress Code)', type: 'text', defaultValue: 'رسمي / Formal' },
        { key: 'closingMessage', label: 'العبارة الختامية', type: 'text', defaultValue: 'بحضوركم تكتمل فرحتنا ♥' }
      ]
    }
  },
  'classic-elegance': {
    component: ClassicEleganceTemplate,
    metadata: {
      id: 'classic-elegance',
      name: 'Classic Elegance ✨',
      description: 'أناقة كلاسيكية فاخرة بالخط السيريفي واللونين الأسود والذهبي الملكي.',
      previewImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'GALLERY', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'welcomeTitle', label: 'عنوان المظروف الترحيبي', type: 'text', defaultValue: 'You Are Invited' },
        { key: 'openButtonText', label: 'نص زر فتح المظروف', type: 'text', defaultValue: 'Open Invitation' },
        { key: 'heroSubtitle', label: 'العنوان الفرعي للقسم الرئيسي', type: 'text', defaultValue: 'The Wedding Of' },
        { key: 'ceremonyTitle', label: 'عنوان تفاصيل الحفل والاستقبال', type: 'text', defaultValue: 'Ceremony & Reception' },
        { key: 'scheduleTitle', label: 'عنوان جدول الفعاليات', type: 'text', defaultValue: 'Schedule of Events' },
        { key: 'event1Title', label: 'الحدث 1 - العنوان', type: 'text', defaultValue: 'Arrival' },
        { key: 'event1Time', label: 'الحدث 1 - التوقيت', type: 'text', defaultValue: '15:00' },
        { key: 'event1Desc', label: 'الحدث 1 - الوصف', type: 'text', defaultValue: 'Welcome drinks' },
        { key: 'event2Title', label: 'الحدث 2 - العنوان', type: 'text', defaultValue: 'Ceremony' },
        { key: 'event2Time', label: 'الحدث 2 - التوقيت', type: 'text', defaultValue: '16:00' },
        { key: 'event2Desc', label: 'الحدث 2 - الوصف', type: 'text', defaultValue: 'Exchange of vows' },
        { key: 'event3Title', label: 'الحدث 3 - العنوان', type: 'text', defaultValue: 'Reception' },
        { key: 'event3Time', label: 'الحدث 3 - التوقيت', type: 'text', defaultValue: '18:00' },
        { key: 'event3Desc', label: 'الحدث 3 - الوصف', type: 'text', defaultValue: 'Dinner & Dancing' },
        { key: 'closingTitle', label: 'العبارة الختامية', type: 'text', defaultValue: 'We await your presence' }
      ]
    }
  },
  'modern-minimalist': {
    component: ModernMinimalistTemplate,
    metadata: {
      id: 'modern-minimalist',
      name: 'Modern Minimalist 🖤',
      description: 'تصميم عصري بسيط بخطوط جريئة ومساحات بيضاء وتناغم هادئ.',
      previewImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MUSIC'],
      customFields: [
        { key: 'welcomeHeader', label: 'عنوان الغلاف', type: 'text', defaultValue: 'The Invitation' },
        { key: 'enterButtonText', label: 'نص زر الدخول', type: 'text', defaultValue: 'Enter Experience' },
        { key: 'heroTagline', label: 'النص الترحيبي في البداية', type: 'text', defaultValue: 'The Wedding Day' },
        { key: 'programTitle', label: 'عنوان جدول البرنامج', type: 'text', defaultValue: 'The Program' },
        { key: 'event1Title', label: 'الفقرة 1 - العنوان', type: 'text', defaultValue: 'Ceremony' },
        { key: 'event1Time', label: 'الفقرة 1 - الوقت', type: 'text', defaultValue: '4:00 PM' },
        { key: 'event2Title', label: 'الفقرة 2 - العنوان', type: 'text', defaultValue: 'Cocktails' },
        { key: 'event2Time', label: 'الفقرة 2 - الوقت', type: 'text', defaultValue: '5:30 PM' },
        { key: 'event3Title', label: 'الفقرة 3 - العنوان', type: 'text', defaultValue: 'Reception' },
        { key: 'event3Time', label: 'الفقرة 3 - الوقت', type: 'text', defaultValue: '7:00 PM' },
        { key: 'closingTitle', label: 'عنوان قسم الختام', type: 'text', defaultValue: 'Join Us' },
        { key: 'closingSubtitle', label: 'الرسالة الختامية', type: 'text', defaultValue: 'Please let us know if you can make it.' }
      ]
    }
  },
  'floral-romance': {
    component: FloralRomanceTemplate,
    metadata: {
      id: 'floral-romance',
      name: 'Floral Romance 🌸',
      description: 'درجات الوردي الباستيل الرقيقة مع بتلات متساقطة وقصة التعارف.',
      previewImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1000&auto=format&fit=crop',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'GALLERY', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'welcomeSubtitle', label: 'النص الترحيبي بالغلاف', type: 'text', defaultValue: 'Together with their families' },
        { key: 'storyTitle', label: 'عنوان قسم قصة اللقاء', type: 'text', defaultValue: 'Our Journey' },
        { key: 'story1Title', label: 'المرحلة 1 - العنوان', type: 'text', defaultValue: 'First Met' },
        { key: 'story1Subtitle', label: 'المرحلة 1 - العنوان الفرعي', type: 'text', defaultValue: 'A beautiful beginning' },
        { key: 'story1Desc', label: 'المرحلة 1 - التفاصيل', type: 'textarea', defaultValue: 'It started with a simple hello, and little did we know it was the start of something forever.' },
        { key: 'story2Title', label: 'المرحلة 2 - العنوان', type: 'text', defaultValue: 'The Proposal' },
        { key: 'story2Subtitle', label: 'المرحلة 2 - العنوان الفرعي', type: 'text', defaultValue: 'A moment to remember' },
        { key: 'story2Desc', label: 'المرحلة 2 - التفاصيل', type: 'textarea', defaultValue: 'Under the stars, a promise was made to share a lifetime of love and happiness together.' },
        { key: 'venueTitle', label: 'عنوان تفاصيل المكان والزمان', type: 'text', defaultValue: 'When & Where' },
        { key: 'closingTitle', label: 'العبارة الختامية', type: 'text', defaultValue: "We Can't Wait to Celebrate!" }
      ]
    }
  },
  'botanical-rustic': {
    component: BotanicalRusticTemplate,
    metadata: {
      id: 'botanical-rustic',
      name: 'Botanical Rustic 🌿',
      description: 'طابع الورق الطبيعي المعتق وأغصان الزيتون وختم الشمع الأحمر.',
      previewImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1000&auto=format&fit=crop',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'GALLERY', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'welcomeHeader', label: 'عنوان الغلاف', type: 'text', defaultValue: 'You Are Invited' },
        { key: 'welcomeSubtitle', label: 'العنوان الفرعي', type: 'text', defaultValue: 'Together with their families' },
        { key: 'dressCodeTitle', label: 'عنوان قواعد اللباس', type: 'text', defaultValue: 'Dress Code' },
        { key: 'giftNote', label: 'ملاحظة الهدايا والحضور', type: 'textarea', defaultValue: 'Our most important gift is your presence. However, if you wish to honour us with a gift, a contribution towards our honeymoon would be appreciated.' },
        { key: 'quoteText', label: 'مقولة الزفاف', type: 'textarea', defaultValue: 'A successful marriage requires falling in love many times, always with the same person.' },
        { key: 'timeline1Title', label: 'الفقرة 1 - العنوان', type: 'text', defaultValue: 'Guest Arrival' },
        { key: 'timeline1Time', label: 'الفقرة 1 - الوقت', type: 'text', defaultValue: '15:00' },
        { key: 'timeline2Title', label: 'الفقرة 2 - العنوان', type: 'text', defaultValue: 'Ceremony' },
        { key: 'timeline2Time', label: 'الفقرة 2 - الوقت', type: 'text', defaultValue: '16:00' },
        { key: 'timeline3Title', label: 'الفقرة 3 - العنوان', type: 'text', defaultValue: 'Banquet' },
        { key: 'timeline3Time', label: 'الفقرة 3 - الوقت', type: 'text', defaultValue: '18:00' },
        { key: 'timeline4Title', label: 'الفقرة 4 - العنوان', type: 'text', defaultValue: 'Dinner & Speeches' },
        { key: 'timeline4Time', label: 'الفقرة 4 - الوقت', type: 'text', defaultValue: '20:30' },
        { key: 'closingTitle', label: 'عنوان الختام', type: 'text', defaultValue: 'Thank You!' },
        { key: 'closingSubtitle', label: 'الرسالة الختامية', type: 'text', defaultValue: "We can't wait to celebrate with you!" }
      ]
    }
  },
  'royal-velvet': {
    component: RoyalVelvetTemplate,
    metadata: {
      id: 'royal-velvet',
      name: 'Royal Velvet 🎀',
      description: 'مخمل ملكي زمردي فاخر مع شريط ساتان ذهبي ينفك بنعومة ومونوغرام مذهب.',
      previewImage: '/assets/templates/royal-velvet.jpg',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'GALLERY', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'ribbonText', label: 'نص شريط الساتان التفاعلي', type: 'text', defaultValue: 'انقر لفتح الدعوة الملكية ✨' },
        { key: 'monogramText', label: 'حروف المونوغرام الملكي (مثال: A & F)', type: 'text', defaultValue: '' },
        { key: 'introVerse', label: 'الآية الكريمة أو عبارة الترحيب', type: 'textarea', defaultValue: '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»' },
        { key: 'invitationNote', label: 'نص بطاقة الدعوة الترحيبي', type: 'textarea', defaultValue: 'يتشرف العروسان بدعوتكم لمشاركتهما أجمل لحظات العمر وتتويج قصة حبهما بفرحة تكتمل بوجودكم.' },
        { key: 'dressCode', label: 'قواعد اللباس (Dress Code)', type: 'text', defaultValue: 'ملابس رسمية / Formal Black Tie' },
        { key: 'timeline1Title', label: 'الفقرة 1 - العنوان', type: 'text', defaultValue: 'استقبال الضيوف الكرام' },
        { key: 'timeline1Time', label: 'الفقرة 1 - التوقيت', type: 'text', defaultValue: '07:30 PM' },
        { key: 'timeline1Desc', label: 'الفقرة 1 - الوصف', type: 'text', defaultValue: 'مراسم الترحيب وبداية توافد الأهل والأحباب' },
        { key: 'timeline2Title', label: 'الفقرة 2 - العنوان', type: 'text', defaultValue: 'الزفة الملكية وعقد القران' },
        { key: 'timeline2Time', label: 'الفقرة 2 - التوقيت', type: 'text', defaultValue: '08:45 PM' },
        { key: 'timeline2Desc', label: 'الفقرة 2 - الوصف', type: 'text', defaultValue: 'لحظات مباركة البداية وبدء مراسم الاحتفال' },
        { key: 'timeline3Title', label: 'الفقرة 3 - العنوان', type: 'text', defaultValue: 'العشاء الملكي' },
        { key: 'timeline3Time', label: 'الفقرة 3 - التوقيت', type: 'text', defaultValue: '10:15 PM' },
        { key: 'timeline3Desc', label: 'الفقرة 3 - الوصف', type: 'text', defaultValue: 'بوفيه عشاء فاخر احتفاءً بضيوفنا الأعزاء' },
        { key: 'closingMessage', label: 'العبارة الختامية', type: 'text', defaultValue: 'حضوركم شرف لنا ويزيد ليلتنا بهجة وسروراً 🤍' }
      ]
    }
  },
  'palace-gates': {
    component: PalaceGatesTemplate,
    metadata: {
      id: 'palace-gates',
      name: 'Grand Palace Gates 🏰',
      description: 'بوابات قصر ذهبية ثلاثية الأبعاد تنفتح لتكشف عن قاعة ملكية ساحرة وثريات متلألئة.',
      previewImage: '/assets/templates/palace-gates.jpg',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'GALLERY', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'gateCrestText', label: 'الشعار أعلى البوابة الملكية', type: 'text', defaultValue: 'ROYAL PALACE BALLROOM' },
        { key: 'gatesButtonText', label: 'نص زر فتح بوابات القصر', type: 'text', defaultValue: 'اضغط لفتح بوابات القصر ⚜️' },
        { key: 'ballroomQuote', label: 'العبارة الترحيبية داخل قاعة القصر', type: 'textarea', defaultValue: '«بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ»' },
        { key: 'invitationNote', label: 'نص بطاقة الدعوة الملكية', type: 'textarea', defaultValue: 'يسعدنا ويشرفنا دعوتكم لحضور حفل الزفاف الملكي ومشاركتنا بهجة هذا اليوم التاريخي في حياتنا.' },
        { key: 'dressCode', label: 'قواعد اللباس (Dress Code)', type: 'text', defaultValue: 'أزياء سهرة فاخرة / Formal Evening Wear' },
        { key: 'timeline1Title', label: 'الفقرة 1 - العنوان', type: 'text', defaultValue: 'توافد الضيوف الملكي' },
        { key: 'timeline1Time', label: 'الفقرة 1 - التوقيت', type: 'text', defaultValue: '07:00 PM' },
        { key: 'timeline1Desc', label: 'الفقرة 1 - الوصف', type: 'text', defaultValue: 'استقبال وترحيب بالمشروبات الخاصة وموسيقى كلاسيكية' },
        { key: 'timeline2Title', label: 'الفقرة 2 - العنوان', type: 'text', defaultValue: 'الدخول الملكي والزفة' },
        { key: 'timeline2Time', label: 'الفقرة 2 - التوقيت', type: 'text', defaultValue: '08:30 PM' },
        { key: 'timeline2Desc', label: 'الفقرة 2 - الوصف', type: 'text', defaultValue: 'إطلالة العروسين وبداية مراسم الاحتفال الكبرى' },
        { key: 'timeline3Title', label: 'الفقرة 3 - العنوان', type: 'text', defaultValue: 'العشاء الفاخر' },
        { key: 'timeline3Time', label: 'الفقرة 3 - التوقيت', type: 'text', defaultValue: '10:00 PM' },
        { key: 'timeline3Desc', label: 'الفقرة 3 - الوصف', type: 'text', defaultValue: 'مأدبة عشاء ملكية احتفاءً بجمعنا المبارك' },
        { key: 'closingMessage', label: 'العبارة الختامية', type: 'text', defaultValue: 'بوجودكم تدوم الأفراح وتكتمل سعادتنا ✨' }
      ]
    }
  },
  'celestial-stardust': {
    component: CelestialStardustTemplate,
    metadata: {
      id: 'celestial-stardust',
      name: 'Celestial Stardust 🌌',
      description: 'سماء النجوم والفلك الليلي مع هلال ذهبي متوهج وأبراج فلكية مرسومة بالنور.',
      previewImage: '/assets/templates/celestial-stardust.jpg',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'GALLERY', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'celestialSubtitle', label: 'العنوان التمهيدي في السماء', type: 'text', defaultValue: 'WRITTEN IN THE STARS ✨' },
        { key: 'moonQuote', label: 'عبارة الهلال والنجوم الترحيبية', type: 'textarea', defaultValue: '«تلاقت الأرواح تحت سماء كُتبت تفاصيل حبها بنور النجوم»' },
        { key: 'invitationNote', label: 'نص بطاقة الدعوة الترحيبي', type: 'textarea', defaultValue: 'تحت بريق النجوم وضوء القمر، نتشرف بدعوتكم لمشاركتنا ليلة العمر وبداية رحلتنا الأبدية معاً.' },
        { key: 'dressCode', label: 'قواعد اللباس (Dress Code)', type: 'text', defaultValue: 'مسائي أنيق / Midnight Blue or Black Formal' },
        { key: 'timeline1Title', label: 'الفقرة 1 - العنوان', type: 'text', defaultValue: 'استقبال ضوء النجوم' },
        { key: 'timeline1Time', label: 'الفقرة 1 - التوقيت', type: 'text', defaultValue: '07:00 PM' },
        { key: 'timeline1Desc', label: 'الفقرة 1 - الوصف', type: 'text', defaultValue: 'استقبال وترحيب وعزف كلاسيكي هادئ تحت الأضواء' },
        { key: 'timeline2Title', label: 'الفقرة 2 - العنوان', type: 'text', defaultValue: 'مراسم عقد القران والزفة' },
        { key: 'timeline2Time', label: 'الفقرة 2 - التوقيت', type: 'text', defaultValue: '08:30 PM' },
        { key: 'timeline2Desc', label: 'الفقرة 2 - الوصف', type: 'text', defaultValue: 'لحظات العهد وتتويج الحب ببركة الجمع الكريم' },
        { key: 'timeline3Title', label: 'الفقرة 3 - العنوان', type: 'text', defaultValue: 'العشاء والاحتفال' },
        { key: 'timeline3Time', label: 'الفقرة 3 - التوقيت', type: 'text', defaultValue: '10:00 PM' },
        { key: 'timeline3Desc', label: 'الفقرة 3 - الوصف', type: 'text', defaultValue: 'مأدبة عشاء واحتفال ساحر حتى منتصف الليل' },
        { key: 'closingMessage', label: 'العبارة الختامية', type: 'text', defaultValue: 'بوجودكم تسطع ليلتنا وتكتمل سعادتنا بنجوم حضوركم 🌙' }
      ]
    }
  },
  'pearl-box': {
    component: PearlBoxTemplate,
    metadata: {
      id: 'pearl-box',
      name: 'Pearl & Jasmine Box 🦪',
      description: 'صندوق دعوة أبيض لؤلؤي مبطن بالحرير العاجي وأزهار الياسمين وعقدة لؤلؤ رقيقة.',
      previewImage: '/assets/templates/pearl-box.jpg',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'GALLERY', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'boxTitle', label: 'العنوان أعلى غطاء الصندوق', type: 'text', defaultValue: 'THE ROYAL WEDDING BOX 🦪' },
        { key: 'openBoxButtonText', label: 'نص زر فتح الصندوق اللؤلؤي', type: 'text', defaultValue: 'افتح صندوق الدعوة الفاخر ✨' },
        { key: 'welcomeMessage', label: 'العبارة الترحيبية اللؤلؤية', type: 'textarea', defaultValue: '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا»' },
        { key: 'invitationNote', label: 'نص بطاقة الدعوة', type: 'textarea', defaultValue: 'بكل مشاعر الحب والامتنان، ندعوكم لمشاركتنا فرحة العمر وتتويج مسيرة الحب في ليلتنا المنتظرة.' },
        { key: 'dressCode', label: 'قواعد اللباس (Dress Code)', type: 'text', defaultValue: 'أناقة بيضاء أو ألوان ناعمة / Elegant & Pastel Formal' },
        { key: 'timeline1Title', label: 'الفقرة 1 - العنوان', type: 'text', defaultValue: 'استقبال الزهور والياسمين' },
        { key: 'timeline1Time', label: 'الفقرة 1 - التوقيت', type: 'text', defaultValue: '07:30 PM' },
        { key: 'timeline1Desc', label: 'الفقرة 1 - الوصف', type: 'text', defaultValue: 'مراسم الترحيب بعبق الياسمين ومشروبات الضيافة الفاخرة' },
        { key: 'timeline2Title', label: 'الفقرة 2 - العنوان', type: 'text', defaultValue: 'الزفة وعقد القران' },
        { key: 'timeline2Time', label: 'الفقرة 2 - التوقيت', type: 'text', defaultValue: '08:45 PM' },
        { key: 'timeline2Desc', label: 'الفقرة 2 - الوصف', type: 'text', defaultValue: 'لحظات مباركة الجمع وبداية مسيرة الحب' },
        { key: 'timeline3Title', label: 'الفقرة 3 - العنوان', type: 'text', defaultValue: 'العشاء الملكي' },
        { key: 'timeline3Time', label: 'الفقرة 3 - التوقيت', type: 'text', defaultValue: '10:15 PM' },
        { key: 'timeline3Desc', label: 'الفقرة 3 - الوصف', type: 'text', defaultValue: 'بوفيه عشاء مفتوح على أنغام الموسيقى الهادئة' },
        { key: 'closingMessage', label: 'العبارة الختامية', type: 'text', defaultValue: 'فرحتنا لا تكتمل إلا بوجودكم ورؤيتكم بيننا 🤍' }
      ]
    }
  },
  'story-vogue-editorial': {
    component: StoryVogueEditorialTemplate,
    metadata: {
      id: 'story-vogue-editorial',
      name: 'Vogue Story 🖤',
      description: 'دعوة بنمط ستوري إنستغرام كامل للموبايل بتصميم مجلة فوغ الأنيقة بالخطوط الراقية.',
      previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'editorialKicker', label: 'العنوان الفرعي للمجلة', type: 'text', defaultValue: 'THE WEDDING CELEBRATION' },
        { key: 'coverSubtitle', label: 'عبارة الغلاف الترحيبية', type: 'text', defaultValue: 'يسرنا دعوتكم لمشاركتنا فرحة العمر وتتويج رحلة الحب' },
        { key: 'introVerse', label: 'الآية الكريمة أو عبارة الترحيب', type: 'textarea', defaultValue: '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»' },
        { key: 'dressCode', label: 'قواعد اللباس (Dress Code)', type: 'text', defaultValue: 'ملابس رسمية أنيقة / Formal Black Tie' }
      ]
    }
  },
  'story-royal-emerald': {
    component: StoryRoyalEmeraldTemplate,
    metadata: {
      id: 'story-royal-emerald',
      name: 'Royal Emerald Story ⚜️',
      description: 'دعوة ستوري ملكية فاخرة بالزمرد الأخضر والأقواس والزخارف الذهبية الأصيلة.',
      previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'introVerse', label: 'الآية الكريمة أو عبارة الافتتاح', type: 'textarea', defaultValue: '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا»' },
        { key: 'invitationNote', label: 'نص بطاقة الدعوة الملكية', type: 'textarea', defaultValue: 'عندما تدق الساعات معلنةً بداية رحلتنا معاً، يسعدنا أن تشاركونا أجمل لحظات العمر بفرحة لا تكتمل إلا بلقياكم وحضوركم الكريم.' },
        { key: 'dressCode', label: 'قواعد اللباس (Dress Code)', type: 'text', defaultValue: 'أزياء سهرة ملكية راقية / Formal Wear' }
      ]
    }
  },
  'story-boho-terracotta': {
    component: StoryBohoTerracottaTemplate,
    metadata: {
      id: 'story-boho-terracotta',
      name: 'Boho Terracotta Story 🌾',
      description: 'دعوة ستوري دافئة بطابع بوهو وألوان التيراكوتا والوردي الناعم وجمال الطبيعة.',
      previewImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1000&auto=format&fit=crop',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'coverSubtitle', label: 'العبارة الترحيبية للغلاف', type: 'text', defaultValue: 'يسعدنا أن تشاركونا أجمل بدايات العمر والحب 🕊️' },
        { key: 'introVerse', label: 'الآية الكريمة أو العبارة الرومانسية', type: 'textarea', defaultValue: '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»' },
        { key: 'invitationNote', label: 'رسالة الدعوة', type: 'textarea', defaultValue: 'بين دفء اللحظات وصدق المشاعر، يسعدنا دعوتكم لمشاركتنا ليلة العمر لنحتفل معاً بحب جمع قلبينا.' },
        { key: 'dressCode', label: 'قواعد اللباس (Dress Code)', type: 'text', defaultValue: 'أناقة عصرية بألوان الباستيل / Semi-formal & Pastel' }
      ]
    }
  },
  'wax-silk-reveal': {
    component: WaxSilkRevealTemplate,
    metadata: {
      id: 'wax-silk-reveal',
      name: 'Wax Seal & Silk 💌',
      description: 'مظروف حريري فاخر بختم شمعي ثلاثي الأبعاد ينكسر واقعياً لتنزلق بطاقة الدعوة المذهبة.',
      previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'waxMonogram', label: 'أحرف الختم الشمعي (مثال: A & F)', type: 'text', defaultValue: '' },
        { key: 'waxColor', label: 'لون الختم الشمعي (burgundy / gold / emerald)', type: 'text', defaultValue: 'burgundy' },
        { key: 'envelopeTagline', label: 'العنوان أعلى المظروف', type: 'text', defaultValue: 'ROYAL WEDDING INVITATION' },
        { key: 'envelopeHint', label: 'تلميح زر كسر الختم', type: 'text', defaultValue: 'CLICK WAX TO BREAK SEAL & OPEN' },
        { key: 'introVerse', label: 'الآية الكريمة أو عبارة الترحيب', type: 'textarea', defaultValue: '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»' },
        { key: 'invitationIntro', label: 'مقدمة بطاقة الدعوة', type: 'text', defaultValue: 'يتشرف العروسان بدعوتكم لحضور حفل زفافهما' },
        { key: 'invitationNote', label: 'نص بطاقة الدعوة الترحيبي', type: 'textarea', defaultValue: 'يسعدنا ويشرفنا حضوركم ومشاركتنا فرحة العمر في هذا اليوم المبارك، لتكتمل سعادتنا برؤيتكم بيننا.' },
        { key: 'dressCode', label: 'قواعد اللباس (Dress Code)', type: 'text', defaultValue: 'رسمي وأنيق / Black Tie' },
        { key: 'timeline1Title', label: 'الفقرة 1 - العنوان', type: 'text', defaultValue: 'استقبال الضيوف الكرام' },
        { key: 'timeline1Time', label: 'الفقرة 1 - التوقيت', type: 'text', defaultValue: '07:30 PM' },
        { key: 'timeline1Desc', label: 'الفقرة 1 - الوصف', type: 'text', defaultValue: 'الترحيب والمشروبات المنعشة ومراسم البداية' },
        { key: 'timeline2Title', label: 'الفقرة 2 - العنوان', type: 'text', defaultValue: 'عقد القران والزفة' },
        { key: 'timeline2Time', label: 'الفقرة 2 - التوقيت', type: 'text', defaultValue: '08:45 PM' },
        { key: 'timeline2Desc', label: 'الفقرة 2 - الوصف', type: 'text', defaultValue: 'لحظات مباركة البداية وإطلالة العروسين' },
        { key: 'timeline3Title', label: 'الفقرة 3 - العنوان', type: 'text', defaultValue: 'العشاء الملكي' },
        { key: 'timeline3Time', label: 'الفقرة 3 - التوقيت', type: 'text', defaultValue: '10:15 PM' },
        { key: 'timeline3Desc', label: 'الفقرة 3 - الوصف', type: 'text', defaultValue: 'بوفيه عشاء مفتوح واحتفال حتى النهاية' },
        { key: 'closingMessage', label: 'العبارة الختامية', type: 'text', defaultValue: 'حضوركم شرف لنا ويزيد ليلتنا بهجة وسروراً 🤍' }
      ]
    }
  },
  'arabian-crescent-lantern': {
    component: ArabianCrescentLanternTemplate,
    metadata: {
      id: 'arabian-crescent-lantern',
      name: 'Arabian Crescent & Lanterns 🌙',
      description: 'سماء ليلية كحلية بهلال ذهبي ثلاثي الأبعاد وفوانيس عربية متأرجحة بنور الشموع وبسملة مذهبة.',
      previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'bismillahText', label: 'نص البسملة أو الافتتاحية', type: 'text', defaultValue: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
        { key: 'crescentBadge', label: 'الشعار داخل الهلال الذهبي', type: 'text', defaultValue: 'ROYAL CELEBRATION' },
        { key: 'crescentQuote', label: 'عبارة الهلال والنجوم', type: 'textarea', defaultValue: '«تلاقت الأرواح تحت سماء كُتبت تفاصيل حبها بنور النجوم»' },
        { key: 'introVerse', label: 'الآية الكريمة أو عبارة الترحيب', type: 'textarea', defaultValue: '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»' },
        { key: 'invitationIntro', label: 'مقدمة بطاقة الدعوة', type: 'text', defaultValue: 'يتشرف العروسان بدعوتكم لحضور حفل زفافهما المبارك' },
        { key: 'invitationNote', label: 'نص بطاقة الدعوة الترحيبي', type: 'textarea', defaultValue: 'عندما تشرق أنوار هذه الليلة المباركة، نتشرف بدعوتكم لمشاركتنا فرحة العمر وتتويج مسيرة الحب في ليلتنا المنتظرة.' },
        { key: 'dressCode', label: 'قواعد اللباس (Dress Code)', type: 'text', defaultValue: 'أزياء سهرة ملكية راقية / Formal Wear' },
        { key: 'timeline1Title', label: 'الفقرة 1 - العنوان', type: 'text', defaultValue: 'توافد الضيوف الكرام' },
        { key: 'timeline1Time', label: 'الفقرة 1 - التوقيت', type: 'text', defaultValue: '07:30 PM' },
        { key: 'timeline1Desc', label: 'الفقرة 1 - الوصف', type: 'text', defaultValue: 'مراسم الاستقبال الفاخرة بالبخور والعود والمشروبات' },
        { key: 'timeline2Title', label: 'الفقرة 2 - العنوان', type: 'text', defaultValue: 'الزفة وعقد القران المبارك' },
        { key: 'timeline2Time', label: 'الفقرة 2 - التوقيت', type: 'text', defaultValue: '08:45 PM' },
        { key: 'timeline2Desc', label: 'الفقرة 2 - الوصف', type: 'text', defaultValue: 'لحظات مباركة البداية وإطلالة العروسين الكريمة' },
        { key: 'timeline3Title', label: 'الفقرة 3 - العنوان', type: 'text', defaultValue: 'العشاء الملكي' },
        { key: 'timeline3Time', label: 'الفقرة 3 - التوقيت', type: 'text', defaultValue: '10:15 PM' },
        { key: 'timeline3Desc', label: 'الفقرة 3 - الوصف', type: 'text', defaultValue: 'بوفيه عشاء فاخر احتفاءً بكم واحتفال حتى النهاية' },
        { key: 'closingDuaa', label: 'دعاء الختام المبارك', type: 'text', defaultValue: '«بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ» ✨' }
      ]
    }
  },
  'laser-gold-gatefold': {
    component: LaserGoldGatefoldTemplate,
    metadata: {
      id: 'laser-gold-gatefold',
      name: 'Laser-Cut Gold Gatefold 🎀',
      description: 'أبواب ذهبية مقصوصة بالليزر ومزخرفة بأناقة، تنفتح بنعومة مع فك شريط الساتان الملكي.',
      previewImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'monogramCrest', label: 'أحرف المونوغرام على الشريط (مثال: A & F)', type: 'text', defaultValue: '' },
        { key: 'ribbonColor', label: 'لون شريط الساتان (burgundy / emerald / gold)', type: 'text', defaultValue: 'burgundy' },
        { key: 'ribbonHint', label: 'نص تلميح فك الشريط', type: 'text', defaultValue: 'انقر على شريط الساتان لفك عقدة البوابة الذهبية' },
        { key: 'introVerse', label: 'الآية الكريمة أو عبارة الترحيب', type: 'textarea', defaultValue: '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»' },
        { key: 'invitationIntro', label: 'مقدمة بطاقة الدعوة', type: 'text', defaultValue: 'يتشرف العروسان بدعوتكم لحضور حفل زفافهما الملكي' },
        { key: 'invitationNote', label: 'نص بطاقة الدعوة الملكية', type: 'textarea', defaultValue: 'يسعدنا ويشرفنا حضوركم ومشاركتنا فرحة العمر في هذا اليوم المبارك، لتكتمل سعادتنا برؤيتكم بيننا.' },
        { key: 'dressCode', label: 'قواعد اللباس (Dress Code)', type: 'text', defaultValue: 'ملابس سهرة ملكية راقية / Formal Wear' },
        { key: 'timeline1Title', label: 'الفقرة 1 - العنوان', type: 'text', defaultValue: 'استقبال الضيوف الكرام' },
        { key: 'timeline1Time', label: 'الفقرة 1 - التوقيت', type: 'text', defaultValue: '07:30 PM' },
        { key: 'timeline1Desc', label: 'الفقرة 1 - الوصف', type: 'text', defaultValue: 'مراسم الترحيب وبداية توافد الأهل والأحباب' },
        { key: 'timeline2Title', label: 'الفقرة 2 - العنوان', type: 'text', defaultValue: 'الزفة وعقد القران' },
        { key: 'timeline2Time', label: 'الفقرة 2 - التوقيت', type: 'text', defaultValue: '08:45 PM' },
        { key: 'timeline2Desc', label: 'الفقرة 2 - الوصف', type: 'text', defaultValue: 'لحظات مباركة البداية وبدء مراسم الاحتفال الملكي' },
        { key: 'timeline3Title', label: 'الفقرة 3 - العنوان', type: 'text', defaultValue: 'العشاء الملكي' },
        { key: 'timeline3Time', label: 'الفقرة 3 - التوقيت', type: 'text', defaultValue: '10:15 PM' },
        { key: 'timeline3Desc', label: 'الفقرة 3 - الوصف', type: 'text', defaultValue: 'بوفيه عشاء فاخر احتفاءً بضيوفنا الكرام' },
        { key: 'closingMessage', label: 'العبارة الختامية', type: 'text', defaultValue: 'بكم تدوم الأفراح وتكتمل سعادتنا في هذه الليلة الملكية 🤍' }
      ]
    }
  },
  'vintage-calla-blooms': {
    component: VintageCallaBloomsTemplate,
    metadata: {
      id: 'vintage-calla-blooms',
      name: 'Vintage Calla Blooms 🕊️',
      description: 'رومانسية كلاسيكية مع الدانتيل الفرنسي وزهور الكالا البيضاء المتفتحة وقصة حب العروسين.',
      previewImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1000&auto=format&fit=crop',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'coverHint', label: 'نص تلميح الغلاف والفتح', type: 'text', defaultValue: 'انقر على باقة زهور الكالا لتفتح الدعوة وتتفتح البتلات' },
        { key: 'introVerse', label: 'الآية الكريمة أو عبارة الترحيب', type: 'textarea', defaultValue: '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»' },
        { key: 'invitationIntro', label: 'مقدمة بطاقة الدعوة', type: 'text', defaultValue: 'معاً نكتب فصلاً جديداً من الحكاية، ويسرنا حضوركم' },
        { key: 'invitationNote', label: 'نص بطاقة الدعوة الترحيبي', type: 'textarea', defaultValue: 'يسعدنا ويشرفنا حضوركم ومشاركتنا فرحة العمر وتتويج مسيرة الحب في ليلتنا المنتظرة، لتكتمل سعادتنا برؤيتكم بيننا.' },
        { key: 'story1Title', label: 'قصتنا - المحطة الأولى (العنوان)', type: 'text', defaultValue: 'اللقاء الأول' },
        { key: 'story1Date', label: 'قصتنا - المحطة الأولى (التاريخ/التسمية)', type: 'text', defaultValue: 'المحطة الأولى' },
        { key: 'story1Desc', label: 'قصتنا - المحطة الأولى (الوصف)', type: 'textarea', defaultValue: 'حيث تلاقت الأرواح وبدأت أجمل حكايات العمر.' },
        { key: 'story2Title', label: 'قصتنا - المحطة الثانية (العنوان)', type: 'text', defaultValue: 'الخطوبة والعهد' },
        { key: 'story2Date', label: 'قصتنا - المحطة الثانية (التاريخ/التسمية)', type: 'text', defaultValue: 'المحطة الثانية' },
        { key: 'story2Desc', label: 'قصتنا - المحطة الثانية (الوصف)', type: 'textarea', defaultValue: 'وعدنا بعضنا على الحب والوفاء ومواصلة الدرب معاً.' },
        { key: 'dressCode', label: 'قواعد اللباس (Dress Code)', type: 'text', defaultValue: 'أناقة ناعمة وكلاسيكية / Pastel & Formal' },
        { key: 'timeline1Title', label: 'الفقرة 1 - العنوان', type: 'text', defaultValue: 'استقبال الضيوف الكرام' },
        { key: 'timeline1Time', label: 'الفقرة 1 - التوقيت', type: 'text', defaultValue: '07:30 PM' },
        { key: 'timeline1Desc', label: 'الفقرة 1 - الوصف', type: 'text', defaultValue: 'مراسم الترحيب وبداية توافد الأهل والأحباب' },
        { key: 'timeline2Title', label: 'الفقرة 2 - العنوان', type: 'text', defaultValue: 'الزفة وعقد القران' },
        { key: 'timeline2Time', label: 'الفقرة 2 - التوقيت', type: 'text', defaultValue: '08:45 PM' },
        { key: 'timeline2Desc', label: 'الفقرة 2 - الوصف', type: 'text', defaultValue: 'لحظات مباركة البداية وتبادل التهاني' },
        { key: 'timeline3Title', label: 'الفقرة 3 - العنوان', type: 'text', defaultValue: 'العشاء واحتفال الزفاف' },
        { key: 'timeline3Time', label: 'الفقرة 3 - التوقيت', type: 'text', defaultValue: '10:15 PM' },
        { key: 'timeline3Desc', label: 'الفقرة 3 - الوصف', type: 'text', defaultValue: 'بوفيه عشاء فاخر احتفاءً بضيوفنا الكرام' },
        { key: 'closingMessage', label: 'العبارة الختامية', type: 'text', defaultValue: 'فرحتنا لا تكتمل إلا بوجودكم ورؤيتكم بيننا في ليلتنا المنتظرة 🤍' }
      ]
    }
  },
  'blooming-garden-3d': {
    component: BloomingGarden3DTemplate,
    metadata: {
      id: 'blooming-garden-3d',
      name: '3D Blooming Garden 🌸',
      description: 'بستان زهور ربيعي ثلاثي الأبعاد تتفتح بتلاته بنعومة مع زجاج مصقول وبطاقة رومانسية ساحرة.',
      previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'flowerGreeting', label: 'العنوان أعلى البستان (مثال: بستان الحب والفرح)', type: 'text', defaultValue: 'بستان الحب والفرح' },
        { key: 'bloomingHint', label: 'نص تلميح تفتح البتلات', type: 'text', defaultValue: 'انقر على باقة الزهور لتتفتح البتلات وتبدأ الدعوة' },
        { key: 'introVerse', label: 'الآية الكريمة أو عبارة الترحيب', type: 'textarea', defaultValue: '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»' },
        { key: 'invitationIntro', label: 'مقدمة بطاقة الدعوة', type: 'text', defaultValue: 'يسعدنا ويشرفنا دعوتكم لحضور حفل زفافنا الميمون' },
        { key: 'invitationNote', label: 'نص بطاقة الدعوة الترحيبي', type: 'textarea', defaultValue: 'بين عبق الزهور ونسمات الفرح، يسعدنا أن تشاركونا أجمل لحظات العمر لتكتمل سعادتنا بوجودكم معنا في ليلتنا المنتظرة.' },
        { key: 'dressCode', label: 'قواعد اللباس (Dress Code)', type: 'text', defaultValue: 'أزياء ربيعية راقية / Floral & Formal' },
        { key: 'timeline1Title', label: 'الفقرة 1 - العنوان', type: 'text', defaultValue: 'استقبال الضيوف الكرام' },
        { key: 'timeline1Time', label: 'الفقرة 1 - التوقيت', type: 'text', defaultValue: '07:30 PM' },
        { key: 'timeline1Desc', label: 'الفقرة 1 - الوصف', type: 'text', defaultValue: 'مراسم الترحيب بعبق الزهور وبداية توافد الأهل والأحباب' },
        { key: 'timeline2Title', label: 'الفقرة 2 - العنوان', type: 'text', defaultValue: 'الزفة وعقد القران' },
        { key: 'timeline2Time', label: 'الفقرة 2 - التوقيت', type: 'text', defaultValue: '08:45 PM' },
        { key: 'timeline2Desc', label: 'الفقرة 2 - الوصف', type: 'text', defaultValue: 'لحظات مباركة البداية وإطلالة العروسين الكريمة' },
        { key: 'timeline3Title', label: 'الفقرة 3 - العنوان', type: 'text', defaultValue: 'العشاء الملكي' },
        { key: 'timeline3Time', label: 'الفقرة 3 - التوقيت', type: 'text', defaultValue: '10:15 PM' },
        { key: 'timeline3Desc', label: 'الفقرة 3 - الوصف', type: 'text', defaultValue: 'بوفيه عشاء فاخر احتفاءً بضيوفنا الكرام' },
        { key: 'closingMessage', label: 'العبارة الختامية', type: 'text', defaultValue: 'بوجودكم تكتمل فرحتنا وتزهر أوقاتنا بأجمل الذكريات 🤍' }
      ]
    }
  },
  'pearl-silk-minimalist': {
    component: PearlSilkMinimalistTemplate,
    metadata: {
      id: 'pearl-silk-minimalist',
      name: 'Pearl Silk Minimalist 🪞',
      description: 'أناقة الحرير الإيفواري المنسدل مع خاتم الزفاف اللؤلؤي البراق والتصميم المينيمالي الفاخر.',
      previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'silkHint', label: 'نص تلميح طيات الحرير والخاتم', type: 'text', defaultValue: 'المس خاتم اللؤلؤ لفتح طيات الحرير وبدء الدعوة' },
        { key: 'monogramText', label: 'أحرف المونوغرام (مثال: M & K)', type: 'text', defaultValue: '' },
        { key: 'introVerse', label: 'الآية الكريمة أو عبارة الترحيب', type: 'textarea', defaultValue: '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»' },
        { key: 'invitationIntro', label: 'مقدمة بطاقة الدعوة', type: 'text', defaultValue: 'في ليلة من ليالي العمر ينسجها الحرير ويزينها اللؤلؤ' },
        { key: 'invitationNote', label: 'نص بطاقة الدعوة الترحيبي', type: 'textarea', defaultValue: 'نتشرف بدعوتكم لمشاركتنا فرحة العمر والاحتفال بزفافنا الميمون، لتكتمل سعادتنا بحضوركم الكريم ومشاركتنا أبهى لحظات البداية.' },
        { key: 'dressCode', label: 'قواعد اللباس (Dress Code)', type: 'text', defaultValue: 'أزياء سهرة راقية بألوان الباستيل واللؤلؤ / Pearl & Formal Elegance' },
        { key: 'timeline1Title', label: 'الفقرة 1 - العنوان', type: 'text', defaultValue: 'استقبال الضيوف الكرام' },
        { key: 'timeline1Time', label: 'الفقرة 1 - التوقيت', type: 'text', defaultValue: '07:30 PM' },
        { key: 'timeline1Desc', label: 'الفقرة 1 - الوصف', type: 'text', defaultValue: 'الترحيب بنسمات الورد وقهوة الضيافة وتوافد الأهل والأحباب' },
        { key: 'timeline2Title', label: 'الفقرة 2 - العنوان', type: 'text', defaultValue: 'زفة العروسين وعقد القران' },
        { key: 'timeline2Time', label: 'الفقرة 2 - التوقيت', type: 'text', defaultValue: '08:45 PM' },
        { key: 'timeline2Desc', label: 'الفقرة 2 - الوصف', type: 'text', defaultValue: 'إطلالة العروسين الكريمة وتوثيق أجمل لحظات العمر ومباركة البداية' },
        { key: 'timeline3Title', label: 'الفقرة 3 - العنوان', type: 'text', defaultValue: 'مأدبة العشاء الملكي' },
        { key: 'timeline3Time', label: 'الفقرة 3 - التوقيت', type: 'text', defaultValue: '10:15 PM' },
        { key: 'timeline3Desc', label: 'الفقرة 3 - الوصف', type: 'text', defaultValue: 'بوفيه عشاء فاخر احتفاءً بضيوفنا الأعزاء' },
        { key: 'closingMessage', label: 'العبارة الختامية', type: 'text', defaultValue: 'حضوركم يضفي على ليلتنا رونقاً وسعادة لا تُنسى 🤍' }
      ]
    }
  }
};

/**
 * Safely fetches a registered template.
 * If the database declares an active template that is missing from the registry, this fails safely.
 */
export function getTemplateImplementation(id: string): RegisteredTemplate | null {
  const normalizedId = id === 'heavenly-roses' ? 'golden-arabic' : id;
  const template = templateRegistry[normalizedId];
  if (!template) {
    console.warn(`[TemplateEngine] Template implementation for ID "${id}" is missing in the registry.`);
    return null;
  }
  return template;
}
