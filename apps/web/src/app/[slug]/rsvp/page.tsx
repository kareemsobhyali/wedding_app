import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import RsvpListClient from './RsvpListClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { slug: string };
}

async function getInvitationWithRsvps(slug: string) {
  const slugRecord = await prisma.invitationSlug.findUnique({
    where: { slug },
    include: {
      invitation: {
        include: {
          slugs: { where: { isCurrent: true } },
          rsvps: { orderBy: { createdAt: 'desc' } }
        }
      }
    }
  });

  if (!slugRecord || !slugRecord.invitation) {
    return null;
  }

  return slugRecord.invitation;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const inv = await getInvitationWithRsvps(params.slug);
  if (!inv) {
    return { title: 'Not Found' };
  }

  const isArabic = (inv.customData as any)?.language !== 'en';
  return {
    title: isArabic 
      ? `قائمة تأكيد الحضور | حفل زفاف ${inv.groomName} & ${inv.brideName}`
      : `RSVP Attendance List | ${inv.groomName} & ${inv.brideName}`,
    description: isArabic
      ? `سجل تأكيدات واعتذارات الحضور لحفل زفاف ${inv.groomName} و ${inv.brideName}`
      : `RSVP registry and guest attendance list for ${inv.groomName} & ${inv.brideName}`,
    robots: { index: false, follow: false }
  };
}

export default async function InvitationRsvpPage({ params }: PageProps) {
  const inv = await getInvitationWithRsvps(params.slug);

  if (!inv) {
    notFound();
  }

  const custom = (inv.customData as Record<string, any>) || {};
  const language = custom.language || (inv.groomName && /[\u0600-\u06FF]/.test(inv.groomName) ? 'ar' : 'en');

  const invitationData = {
    id: inv.id,
    slug: params.slug,
    groomName: inv.groomName,
    brideName: inv.brideName,
    weddingDate: inv.weddingDate ? inv.weddingDate.toISOString() : new Date().toISOString(),
    venueName: inv.venueName || '',
    venueAddress: inv.venueAddress || '',
    language
  };

  const serializedRsvps = (inv.rsvps || []).map(r => ({
    id: r.id,
    name: r.name,
    attendance: r.attendance,
    guestsCount: r.guestsCount,
    phone: r.phone,
    notes: r.notes,
    createdAt: r.createdAt.toISOString()
  }));

  return (
    <RsvpListClient 
      invitation={invitationData} 
      initialRsvps={serializedRsvps} 
    />
  );
}
