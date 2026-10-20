import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function findInvitationBySlug(slug: string) {
  const slugRecord = await prisma.invitationSlug.findUnique({
    where: { slug },
    include: {
      invitation: {
        include: {
          slugs: { where: { isCurrent: true } },
          template: true,
        }
      }
    }
  });

  return slugRecord?.invitation || null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const inv = await findInvitationBySlug(params.slug);
    if (!inv) {
      return NextResponse.json({ message: 'Invitation not found' }, { status: 404 });
    }

    const rsvps = await prisma.invitationRsvp.findMany({
      where: { invitationId: inv.id },
      orderBy: { createdAt: 'desc' }
    });

    const attendingRsvps = rsvps.filter(r => r.attendance === 'yes');
    const declinedRsvps = rsvps.filter(r => r.attendance === 'no');
    const totalGuestsCount = attendingRsvps.reduce((acc, r) => acc + (r.guestsCount || 1), 0);

    return NextResponse.json({
      success: true,
      invitation: {
        id: inv.id,
        slug: params.slug,
        groomName: inv.groomName,
        brideName: inv.brideName,
        weddingDate: inv.weddingDate,
        weddingTime: (inv.customData as any)?.weddingTime || '',
        venueName: inv.venueName,
        venueAddress: inv.venueAddress || '',
        language: (inv.customData as any)?.language || (inv.groomName && /[\u0600-\u06FF]/.test(inv.groomName) ? 'ar' : 'en'),
        customData: inv.customData
      },
      summary: {
        totalResponses: rsvps.length,
        attendingCount: attendingRsvps.length,
        declinedCount: declinedRsvps.length,
        totalGuestsCount
      },
      rsvps
    });
  } catch (error: any) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch RSVPs' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const inv = await findInvitationBySlug(params.slug);
    if (!inv) {
      return NextResponse.json({ message: 'Invitation not found' }, { status: 404 });
    }

    const body = await req.json();
    const name = (body.name || '').trim();
    if (!name) {
      return NextResponse.json({ message: 'Guest name is required' }, { status: 400 });
    }

    const attendance = (body.attendance || 'yes').toLowerCase() === 'no' ? 'no' : 'yes';
    const rawGuests = body.guestsCount ?? body.guests ?? 1;
    const guestsCount = attendance === 'no' ? 0 : Math.max(1, parseInt(String(rawGuests), 10) || 1);
    const phone = body.phone ? String(body.phone).trim() : null;
    const notes = body.notes ?? body.note ? String(body.notes || body.note).trim() : null;

    const rsvp = await prisma.invitationRsvp.create({
      data: {
        invitationId: inv.id,
        name,
        attendance,
        guestsCount,
        phone,
        notes
      }
    });

    return NextResponse.json({
      success: true,
      message: 'RSVP recorded successfully',
      data: rsvp
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving RSVP:', error);
    return NextResponse.json({ message: error.message || 'Failed to save RSVP' }, { status: 500 });
  }
}
