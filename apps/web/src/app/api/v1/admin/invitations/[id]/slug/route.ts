import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await req.json();
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ message: 'Valid slug is required' }, { status: 400 });
    }

    const normalized = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    const exists = await prisma.invitationSlug.findUnique({
      where: { slug: normalized }
    });

    if (exists && exists.invitationId !== params.id) {
      return NextResponse.json({ message: 'Slug is already in use by another invitation' }, { status: 409 });
    }

    if (exists && exists.invitationId === params.id && exists.isCurrent) {
      return NextResponse.json({ success: true, slug: normalized });
    }

    await prisma.$transaction(async (tx) => {
      await tx.invitationSlug.updateMany({
        where: { invitationId: params.id, isCurrent: true },
        data: { isCurrent: false, replacedAt: new Date() }
      });

      if (exists) {
        await tx.invitationSlug.update({
          where: { slug: normalized },
          data: { isCurrent: true, replacedAt: null }
        });
      } else {
        await tx.invitationSlug.create({
          data: { invitationId: params.id, slug: normalized, isCurrent: true }
        });
      }

      await tx.auditLog.create({
        data: {
          action: 'SLUG_CHANGED',
          adminUserId: admin.id,
          entityType: 'INVITATION',
          entityId: params.id,
          metadata: { newSlug: normalized }
        }
      });
    });

    return NextResponse.json({ success: true, slug: normalized });
  } catch (error: any) {
    console.error('Error updating slug:', error);
    return NextResponse.json({ message: 'Failed to update slug', error: error.message }, { status: 500 });
  }
}
