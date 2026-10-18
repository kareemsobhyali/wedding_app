import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

const settingsFile = path.join(process.cwd(), 'landing-settings.json');

const defaultSettings = {
  siteName: 'دعوتي Daawati',
  heroTitle: 'أجمل دعوات الزفاف الإلكترونية',
  heroSubtitle: 'صمم دعوتك بأسلوبك الخاص وشاركها مع من تحب بثوانٍ معدودة.',
  aboutTitle: 'لماذا تختار منصتنا؟',
  aboutText: 'نوفر لك قوالب عصرية وتجربة مستخدم لا مثيل لها لتصميم دعوة زفافك بكل سهولة، مع إمكانية إدارة الحضور ومعرفة الإحصائيات.',
  contactWhatsApp: '+201000000000',
  contactEmail: 'contact@domain.com',
  contactInstagram: '',
  demoLinks: {
    'heavenly-roses': '/preview?template=heavenly-roses',
    'classic-elegance': '/preview?template=classic-elegance',
    'modern-minimalist': '/preview?template=modern-minimalist',
    'floral-romance': '/preview?template=floral-romance',
    'botanical-rustic': '/preview?template=botanical-rustic'
  },
  previewImages: {}
};

export async function GET() {
  try {
    if (fs.existsSync(settingsFile)) {
      const data = fs.readFileSync(settingsFile, 'utf8');
      const parsed = JSON.parse(data);
      if (!parsed.siteName) parsed.siteName = 'دعوتي Daawati';
      if (!parsed.previewImages) parsed.previewImages = {};
      return NextResponse.json(parsed);
    }
  } catch (e) {
    console.error('Error reading settings', e);
  }
  return NextResponse.json(defaultSettings);
}

export async function POST(req: Request) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    fs.writeFileSync(settingsFile, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true, data: body });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
