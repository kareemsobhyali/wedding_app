import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const inv = await prisma.invitation.findUnique({
      where: { id: params.id },
      include: {
        slugs: { orderBy: { createdAt: 'desc' } },
        template: true,
        media: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } }
      }
    });

    if (!inv) {
      return NextResponse.json({ message: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json({ data: inv, ...inv });
  } catch (error: any) {
    console.error('Error fetching invitation details:', error);
    return NextResponse.json({ message: 'Failed to fetch invitation details', error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const existing = await prisma.invitation.findUnique({ where: { id: params.id } });

    if (!existing) {
      return NextResponse.json({ message: 'Invitation not found' }, { status: 404 });
    }

    if (body.version !== undefined && existing.version !== body.version) {
      return NextResponse.json({
        message: 'Data was modified by another user. Please refresh and try again.'
      }, { status: 409 });
    }

    const updateData: any = {};
    const safeFields = [
      'groomName', 'brideName', 'customerPhone', 'weddingDate', 'weddingTime',
      'venueName', 'venueAddress', 'googleMapsUrl', 'caption', 'weddingMessage',
      'groomPhone', 'bridePhone', 'countdownEnabled', 'expiresAt', 'customData'
    ];

    safeFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    if (body.weddingDate) updateData.weddingDate = new Date(body.weddingDate);
    if (body.expiresAt) updateData.expiresAt = new Date(body.expiresAt);

    if (body.templateId) {
      const tmpl = await prisma.template.findFirst({
        where: { OR: [{ id: body.templateId }, { slug: body.templateId }] }
      });
      if (tmpl) {
        updateData.templateId = tmpl.id;
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.invitation.update({
        where: { id: params.id },
        data: {
          ...updateData,
          version: { increment: 1 }
        },
        include: {
          slugs: { where: { isCurrent: true } },
          template: true
        }
      });

      await tx.auditLog.create({
        data: {
          action: 'INVITATION_UPDATED',
          adminUserId: admin.id,
          entityType: 'INVITATION',
          entityId: params.id,
          metadata: updateData
        }
      });

      return result;
    });

    return NextResponse.json({ data: updated, ...updated });
  } catch (error: any) {
    console.error('Error updating invitation:', error);
    return NextResponse.json({ message: 'Failed to update invitation', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const inv = await prisma.$transaction(async (tx) => {
      const result = await tx.invitation.update({
        where: { id: params.id },
        data: { deletedAt: new Date(), version: { increment: 1 } }
      });

      await tx.auditLog.create({
        data: {
          action: 'INVITATION_DELETED',
          adminUserId: admin.id,
          entityType: 'INVITATION',
          entityId: params.id,
          metadata: {}
        }
      });

      return result;
    });

    return NextResponse.json({ success: true, data: inv, ...inv });
  } catch (error: any) {
    console.error('Error deleting invitation:', error);
    return NextResponse.json({ message: 'Failed to delete invitation', error: error.message }, { status: 500 });
  }
}
