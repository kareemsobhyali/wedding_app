import { notFound } from 'next/navigation';
import { TemplateRenderContext } from '../../templates/types';
import { getTemplateImplementation } from '../../templates/registry';

export const dynamic = 'force-dynamic';

export default function PreviewPage({ searchParams }: { searchParams: { template?: string } }) {
  const templateSlug = searchParams.template || 'butterfly-elegance';
  const registered = getTemplateImplementation(templateSlug);

  if (!registered) {
    return notFound();
  }

  const { component: TemplateComponent, metadata } = registered;

  const dynamicCustomData: Record<string, any> = {};
  metadata.customFields?.forEach((f: any) => {
    if (f.defaultValue !== undefined) {
      dynamicCustomData[f.key] = f.defaultValue;
    }
  });

  const sampleData: any = {
    id: 'demo-sample-id',
    groomName: 'عمر',
    brideName: 'فاطمة',
    customerPhone: '+201000000000',
    weddingDate: new Date('2026-11-20T19:00:00Z'),
    weddingTime: '07:30 PM',
    venueName: 'فندق الفورسيزونز - قاعة اللؤلؤة',
    venueAddress: 'كورنيش النيل، القاهرة، مصر',
    googleMapsUrl: 'https://maps.google.com',
    caption: 'دعوة زفاف خاصة',
    weddingMessage: '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»',
    groomPhone: '+201000000000',
    bridePhone: '+201000000000',
    countdownEnabled: true,
    customData: dynamicCustomData
  };

  const renderContext: TemplateRenderContext = {
    mode: 'PREVIEW',
    direction: 'RTL',
    data: sampleData,
    metadata
  };

  return <TemplateComponent {...renderContext} />;
}
