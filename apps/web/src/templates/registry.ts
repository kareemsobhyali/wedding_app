import React from 'react';
import { TemplateRenderContext, TemplateMetadata } from './types';
import { ButterflyEleganceTemplate } from './designs/butterfly-elegance';
import { GoldenArabicTemplate } from './designs/golden-arabic';
import { SculptedPorcelainArchTemplate } from './designs/sculpted-porcelain-arch';
import { CathedralGrandArchTemplate } from './designs/cathedral-grand-arch';
import { MughalPalacePortalTemplate } from './designs/mughal-palace-portal';
import { PalaceDoorsRevealTemplate } from './designs/palace-doors-reveal';

export interface RegisteredTemplate {
  component: React.FC<TemplateRenderContext>;
  metadata: TemplateMetadata;
}

export const templateRegistry: Record<string, RegisteredTemplate> = {
  'palace-doors-reveal': {
    component: PalaceDoorsRevealTemplate,
    metadata: {
      id: 'palace-doors-reveal',
      name: 'Palace Doors Reveal 🚪✨',
      description: 'بوابة القصر الملكي التفاعلية: دق على الباب 3 مرات لتفتح الأبواب بمؤثرات صوتية وضوئية وتكشف قاعة الحفل وبطاقة الزفاف الفاخرة.',
      previewImage: '/assets/templates/palace-doors-closed.jpg',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'SHARE'],
      customFields: [
        { key: 'bismillah', label: 'البسملة أعلى الباب', type: 'text', defaultValue: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
        { key: 'cardSubtitle', label: 'العنوان الترحيبي', type: 'text', defaultValue: 'دعوة زفاف خاصة' },
        { key: 'knockInstruction', label: 'نص التوجيه للنقر', type: 'text', defaultValue: 'دُقّوا على الباب ثلاث دقّاتٍ ليُفتح' },
        { key: 'sacredQuote', label: 'الآية الكريمة أو العبارة الترحيبية', type: 'textarea', defaultValue: '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»' },
        { key: 'welcomeMessage', label: 'نص الدعوة الرسمي', type: 'textarea', defaultValue: 'يسرنا دعوتكم لمشاركتنا فرحة العمر وحضور حفل زفافنا الميمون، لتكتمل سعادتنا بوجودكم معنا.' },
        { key: 'closingMessage', label: 'العبارة الختامية بالأسفل', type: 'text', defaultValue: 'بكم تكتمل فرحتنا وتزداد بهجتنا ✨' }
      ]
    }
  },
  'mughal-palace-portal': {
    component: MughalPalacePortalTemplate,
    metadata: {
      id: 'mughal-palace-portal',
      name: 'Mughal Palace Portal 🕌 (بوابة القصر الملكية)',
      description: 'تصميم مطابق 100% لبوابة القصر الملكية بأقواس الحجر المنحوتة وأعمدة الرخام المذهبة وشلال الزهور المتدلية مع تساقط البتلات.',
      previewImage: '/assets/templates/mughal-palace-bg.jpg',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'cursiveHeader', label: 'الكلمة التمهيدية بالخط المتصل (مثال: The أو تفاصيل)', type: 'text', defaultValue: 'The' },
        { key: 'detailsTitle', label: 'العنوان الرئيسي للبطاقة', type: 'text', defaultValue: 'WEDDING DETAILS' },
        { key: 'dateMonth', label: 'الشهر (أعلى التاريخ)', type: 'text', defaultValue: 'AUGUST' },
        { key: 'dateDayName', label: 'اسم اليوم (يسار الرقم)', type: 'text', defaultValue: 'SATURDAY' },
        { key: 'dateDayNumber', label: 'رقم اليوم (في المنتصف)', type: 'text', defaultValue: '22' },
        { key: 'dateTime', label: 'توقيت الحفل', type: 'text', defaultValue: '6:30 PM' },
        { key: 'atTimePrefix', label: 'بادئة الوقت (AT أو الساعة)', type: 'text', defaultValue: 'AT' },
        { key: 'dateYearNumber', label: 'السنة', type: 'text', defaultValue: '2026' },
        { key: 'venueHeading', label: 'عنوان قسم القاعة (VENUE)', type: 'text', defaultValue: 'VENUE' },
        { key: 'venueInsertedText', label: 'اسم قاعة الحفل', type: 'text', defaultValue: 'ROYAL PALACE BALLROOM' },
        { key: 'venueAddressText', label: 'عنوان القاعة', type: 'text', defaultValue: 'Grand Avenue, Royal Gardens' }
      ]
    }
  },
  'cathedral-grand-arch': {
    component: CathedralGrandArchTemplate,
    metadata: {
      id: 'cathedral-grand-arch',
      name: 'Cathedral Grand Arch ⛪ (قوس الكاتدرائية الملكي)',
      description: 'تصميم مطابق 100% للكاتدرائية الملكية، ثريات كريستال معلقة وفوانيس بلهب شموع متحرك واقعي وبطاقات مراسم الحفل والموقع.',
      previewImage: '/assets/templates/cathedral-grand-bg.jpg',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'sacredQuote', label: 'الآية أو الاقتباس المقدس', type: 'text', defaultValue: '"SO THEY ARE NO LONGER TWO, BUT ONE FLESH."' },
        { key: 'sacredReference', label: 'المرجع / الشاهد (مثال: MATTHEW 19:6)', type: 'text', defaultValue: 'MATTHEW 19:6' },
        { key: 'familiesHeader', label: 'عنوان العائلات', type: 'text', defaultValue: 'TOGETHER WITH THEIR FAMILIES' },
        { key: 'groomSurname', label: 'لقب العريس أسفل الاسم', type: 'text', defaultValue: 'D\'SOUZA' },
        { key: 'brideSurname', label: 'لقب العروس أسفل الاسم', type: 'text', defaultValue: 'FERNANDES' },
        { key: 'invitationNote1', label: 'عبارة الدعوة - السطر الأول', type: 'text', defaultValue: 'JOYFULLY INVITE YOU TO CELEBRATE' },
        { key: 'invitationNote2', label: 'عبارة الدعوة - السطر الثاني', type: 'text', defaultValue: 'THEIR WEDDING' },
        { key: 'ceremonyTitle', label: 'عنوان فقرة المراسم', type: 'text', defaultValue: 'WEDDING CEREMONY' },
        { key: 'ceremonyTime', label: 'توقيت المراسم', type: 'text', defaultValue: '04:00 PM' },
        { key: 'receptionTitle', label: 'عنوان فقرة حفل الاستقبال', type: 'text', defaultValue: 'RECEPTION' },
        { key: 'receptionTime', label: 'توقيت حفل الاستقبال', type: 'text', defaultValue: '07:30 PM' },
        { key: 'venueAddressSub', label: 'العنوان التفصيلي للقاعة', type: 'text', defaultValue: 'Park Street, City Center' },
        { key: 'receptionBallroomNote', label: 'ملاحظة القاعة الختامية بالخط المائل', type: 'text', defaultValue: 'Reception to follow at The Grand Ballroom' },
        { key: 'closingBannerText', label: 'العبارة الختامية أسفل البطاقة', type: 'text', defaultValue: 'YOUR PRESENCE WILL MAKE OUR DAY' }
      ]
    }
  },
  'sculpted-porcelain-arch': {
    component: SculptedPorcelainArchTemplate,
    metadata: {
      id: 'sculpted-porcelain-arch',
      name: 'Sculpted Porcelain Arch 🏛️ (قوس البورسلين الملكي)',
      description: 'تصميم مطابق 100% لإطار البورسلين المنحوت 3D والورود البيضاء واللؤلؤ مع تفاصيل العائلات وجدول المواعيد المذهب وتفاعل 3D واقعي.',
      previewImage: '/assets/templates/sculpted-porcelain-bg.jpg',
      version: '1.0.0',
      supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'welcomeSubtitle1', label: 'السطر الترحيبي الأول', type: 'text', defaultValue: 'BU MUTLU GÜNÜMÜZDE' },
        { key: 'welcomeSubtitle2', label: 'السطر الترحيبي الثاني', type: 'text', defaultValue: 'SİZ DEĞERLİ DOST VE AKRABALARIMIZI' },
        { key: 'welcomeSubtitle3', label: 'السطر الترحيبي الثالث', type: 'text', defaultValue: 'ARAMIZDA GÖRMEKTEN ONUR DUYARIZ.' },
        { key: 'connectorText', label: 'أداة الربط بين الاسمين (مثال: Ve أو & أو و)', type: 'text', defaultValue: 'Ve' },
        { key: 'hostFamiliesTitle', label: 'عنوان العائلات المستضيفة', type: 'text', defaultValue: 'ATALAY VE UYSAL AİLESİ' },
        { key: 'family1Father', label: 'العائلة الأولى - أسماء الوالدين', type: 'text', defaultValue: 'Mustafa & Havva' },
        { key: 'family1Surname', label: 'العائلة الأولى - اللقب', type: 'text', defaultValue: 'Atalay' },
        { key: 'family2Father', label: 'العائلة الثانية - أسماء الوالدين', type: 'text', defaultValue: 'Halis & Meral' },
        { key: 'family2Surname', label: 'العائلة الثانية - اللقب', type: 'text', defaultValue: 'Uysal' },
        { key: 'ceremonyLabel', label: 'عنوان المراسم الأولى (مثال: KIZ ALMA: 17.00)', type: 'text', defaultValue: 'KIZ ALMA: 17.00' },
        { key: 'ceremonyAddress', label: 'عنوان المراسم الأولى', type: 'text', defaultValue: 'AŞKAN MAH. KALEDİBİ SOK NO:10/1' },
        { key: 'dateMonth', label: 'الشهر (كبير)', type: 'text', defaultValue: 'EKİM' },
        { key: 'dateDay', label: 'اليوم (رقم كبير)', type: 'text', defaultValue: '10' },
        { key: 'dateTime', label: 'توقيت الحفل (SAAT 18.00)', type: 'text', defaultValue: 'SAAT 18.00' },
        { key: 'venueHeader', label: 'ترويسة المكان (YER :)', type: 'text', defaultValue: 'YER :' },
        { key: 'venueStreet', label: 'الشارع / العنوان', type: 'text', defaultValue: '48. OSMAN GAZİ HATİP ÇAD' },
        { key: 'venueCity', label: 'المدينة / الرمز البريدي', type: 'text', defaultValue: '42090 MERAM / KONYA' },
        { key: 'venueHallName', label: 'اسم القاعة الكبرى', type: 'text', defaultValue: 'HALİS USTA PİLAV KONAĞI' }
      ]
    }
  },
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
  }
};

/**
 * Safely fetches a registered template.
 * If the database declares an active template that is missing from the registry, this falls back safely.
 */
export function getTemplateImplementation(id: string): RegisteredTemplate | null {
  const normalizedId = id === 'heavenly-roses' ? 'golden-arabic' : id;
  const template = templateRegistry[normalizedId];
  if (!template) {
    // Graceful fallback to premier palace doors reveal
    return templateRegistry['palace-doors-reveal'] || templateRegistry['mughal-palace-portal'] || null;
  }
  return template;
}
