import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import * as crypto from 'crypto';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

function getRawToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  const cookieStore = cookies();
  return cookieStore.get('draft_session')?.value || null;
}

async function getDraftFromToken(rawToken: string | null) {
  if (!rawToken) return null;
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const session = await prisma.draftSession.findUnique({
    where: { tokenHash },
    include: {
      invitation: {
        include: {
          template: { select: { id: true, name: true, slug: true } },
          media: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } }
        }
      }
    }
  });

  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    return null;
  }

  return session.invitation;
}

export async function GET(req: Request) {
  try {
    const rawToken = getRawToken(req);
    const draft = await getDraftFromToken(rawToken);

    if (!draft) {
      return NextResponse.json({ message: 'Draft not found or expired' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: draft
    });
  } catch (error: any) {
    console.error('Error fetching draft:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch draft' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const rawToken = getRawToken(req);
    const draft = await getDraftFromToken(rawToken);

    if (!draft) {
      return NextResponse.json({ message: 'Draft not found or session expired' }, { status: 404 });
    }

    const body = await req.json();

    const updateData: any = {};
    if (body.groomName !== undefined) updateData.groomName = body.groomName;
    if (body.brideName !== undefined) updateData.brideName = body.brideName;
    if (body.weddingDate !== undefined) updateData.weddingDate = body.weddingDate ? new Date(body.weddingDate) : null;
    if (body.venueName !== undefined) updateData.venueName = body.venueName;
    if (body.venueAddress !== undefined) updateData.venueAddress = body.venueAddress;
    if (body.mapsUrl !== undefined) updateData.googleMapsUrl = body.mapsUrl;
    if (body.customerPhone !== undefined) updateData.customerPhone = body.customerPhone;
    if (body.countdownEnabled !== undefined) updateData.countdownEnabled = Boolean(body.countdownEnabled);
    if (body.groomContact !== undefined) updateData.groomPhone = body.groomContact;
    if (body.brideContact !== undefined) updateData.bridePhone = body.brideContact;
    if (body.caption !== undefined) updateData.caption = body.caption;
    if (body.weddingMessage !== undefined) updateData.weddingMessage = body.weddingMessage;
    if (body.customData !== undefined) updateData.customData = body.customData;

    // Handle template switch if provided
    if (body.templateId) {
      let template = await prisma.template.findFirst({
        where: { OR: [{ id: body.templateId }, { slug: body.templateId }] }
      });
      if (!template) {
        template = await prisma.template.create({
          data: {
            name: body.templateId,
            slug: body.templateId,
            description: 'Wedding Invitation Template',
            sortOrder: 0
          }
        });
      }
      if (template) {
        updateData.template = { connect: { id: template.id } };
      }
    }

    const updated = await prisma.invitation.update({
      where: { id: draft.id },
      data: {
        ...updateData,
        version: { increment: 1 }
      },
      include: {
        template: { select: { id: true, name: true, slug: true } },
        media: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } }
      }
    });

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error: any) {
    console.error('Error updating draft:', error);
    return NextResponse.json({ message: error.message || 'Failed to update draft' }, { status: 500 });
  }
}
