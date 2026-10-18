import React from 'react';
import Link from 'next/link';
import { templateRegistry } from '../templates/registry';
import LandingClient from './LandingClient';

export const dynamic = 'force-dynamic';

async function getLandingSettings() {
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${apiUrl}/api/settings`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (err) {
    console.error(err);
    return {
      siteName: 'دعوتي Daawati',
      heroTitle: 'أجمل دعوات الزفاف الإلكترونية',
      heroSubtitle: 'صمم دعوتك بأسلوبك الخاص وشاركها مع من تحب بثوانٍ معدودة.',
      aboutTitle: 'لماذا تختار منصتنا؟',
      aboutText: 'نوفر لك قوالب عصرية وتجربة مستخدم لا مثيل لها لتصميم دعوة زفافك بكل سهولة، مع إمكانية إدارة الحضور ومعرفة الإحصائيات.',
      contactWhatsApp: '+201000000000',
      contactEmail: 'contact@domain.com',
      demoLinks: {},
      previewImages: {}
    };
  }
}

export default async function LandingPage() {
  const settings = await getLandingSettings();
  const templatesList = Object.values(templateRegistry).map(t => t.metadata);

  return <LandingClient settings={settings} templatesList={templatesList} />;
}
