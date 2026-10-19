import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';
import { InvitationStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; action: string } }
) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id, action } = params;
    const existing = await prisma.invitation.findUnique({
      where: { id },
      include: { media: { where: { deletedAt: null } } }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Invitation not found' }, { status: 404 });
    }

    switch (action.toLowerCase()) {
      case 'activate': {
        const updated = await prisma.$transaction(async (tx) => {
          const inv = await tx.invitation.update({
            where: { id },
            data: { status: InvitationStatus.ACTIVE, version: { increment: 1 } }
          });
          await tx.auditLog.create({
            data: { action: 'INVITATION_ACTIVATED', adminUserId: admin.id, entityType: 'INVITATION', entityId: id, metadata: {} }
          });
          return inv;
        });
        return NextResponse.json({ success: true, data: updated, ...updated });
      }

      case 'disable': {
        const updated = await prisma.$transaction(async (tx) => {
          const inv = await tx.invitation.update({
            where: { id },
            data: { status: InvitationStatus.DISABLED, version: { increment: 1 } }
          });
          await tx.auditLog.create({
            data: { action: 'INVITATION_DISABLED', adminUserId: admin.id, entityType: 'INVITATION', entityId: id, metadata: {} }
          });
          return inv;
        });
        return NextResponse.json({ success: true, data: updated, ...updated });
      }

      case 'archive': {
        const updated = await prisma.$transaction(async (tx) => {
          const inv = await tx.invitation.update({
            where: { id },
            data: { status: InvitationStatus.ARCHIVED, version: { increment: 1 } }
          });
          await tx.auditLog.create({
            data: { action: 'INVITATION_ARCHIVED', adminUserId: admin.id, entityType: 'INVITATION', entityId: id, metadata: {} }
          });
          return inv;
        });
        return NextResponse.json({ success: true, data: updated, ...updated });
      }

      case 'restore': {
        const updated = await prisma.$transaction(async (tx) => {
          const inv = await tx.invitation.update({
            where: { id },
            data: { deletedAt: null, status: InvitationStatus.DISABLED, version: { increment: 1 } }
          });
          await tx.auditLog.create({
            data: { action: 'INVITATION_RESTORED', adminUserId: admin.id, entityType: 'INVITATION', entityId: id, metadata: {} }
          });
          return inv;
        });
        return NextResponse.json({ success: true, data: updated, ...updated });
      }

      case 'delete': {
        const updated = await prisma.$transaction(async (tx) => {
          const inv = await tx.invitation.update({
            where: { id },
            data: { deletedAt: new Date(), version: { increment: 1 } }
          });
          await tx.auditLog.create({
            data: { action: 'INVITATION_DELETED', adminUserId: admin.id, entityType: 'INVITATION', entityId: id, metadata: {} }
          });
          return inv;
        });
        return NextResponse.json({ success: true, data: updated, ...updated });
      }

      case 'duplicate': {
        const newSlug = `copy-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
        const duplicated = await prisma.$transaction(async (tx) => {
          const created = await tx.invitation.create({
            data: {
              groomName: `${existing.groomName} (Copy)`,
              brideName: existing.brideName,
              customerPhone: existing.customerPhone,
              weddingDate: existing.weddingDate,
              weddingTime: existing.weddingTime,
              venueName: existing.venueName,
              venueAddress: existing.venueAddress,
              googleMapsUrl: existing.googleMapsUrl,
              caption: existing.caption,
              weddingMessage: existing.weddingMessage,
              groomPhone: existing.groomPhone,
              bridePhone: existing.bridePhone,
              countdownEnabled: existing.countdownEnabled,
              contactButtonsEnabled: existing.contactButtonsEnabled,
              customData: existing.customData as any,
              status: InvitationStatus.DRAFT,
              templateId: existing.templateId,
              slugs: {
                create: [{ slug: newSlug, isCurrent: true }]
              }
            }
          });

          await tx.auditLog.create({
            data: {
              action: 'INVITATION_DUPLICATED',
              adminUserId: admin.id,
              entityType: 'INVITATION',
              entityId: created.id,
              metadata: { originalId: id }
            }
          });

          return created;
        });
        return NextResponse.json({ success: true, data: duplicated, ...duplicated });
      }

      default:
        return NextResponse.json({ message: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    console.error(`Error processing action ${params.action}:`, error);
    return NextResponse.json({ message: 'Action failed', error: error.message }, { status: 500 });
  }
}
