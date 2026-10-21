import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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
      'groomPhone', 'bridePhone', 'countdownEnabled', 'expiresAt'
    ];

    safeFields.forEach((field: string) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // Merge and persist customData, language, musicUrl, and coverImageUrl
    const currentCustom = (existing.customData as Record<string, any>) || {};
    const mergedCustom = {
      ...currentCustom,
      ...(body.customData || {})
    };
    if (body.language !== undefined) {
      mergedCustom.language = body.language;
    }
    if (body.musicUrl !== undefined) {
      mergedCustom.musicUrl = body.musicUrl;
    }
    if (body.coverImageUrl !== undefined) {
      mergedCustom.coverImageUrl = body.coverImageUrl;
    }
    updateData.customData = mergedCustom;

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
      // 1. Sync Audio / Music in Media Table
      if (body.musicUrl !== undefined) {
        const trimmedMusic = (body.musicUrl || '').trim();
        if (trimmedMusic) {
          const existingAudio = await tx.media.findFirst({
            where: { invitationId: params.id, type: 'AUDIO', deletedAt: null }
          });
          if (existingAudio) {
            await tx.media.update({
              where: { id: existingAudio.id },
              data: {
                storageKey: trimmedMusic,
                publicUrl: trimmedMusic,
                isCurrent: true,
                deletedAt: null
              }
            });
          } else {
            await tx.media.create({
              data: {
                invitationId: params.id,
                type: 'AUDIO',
                role: 'ORIGINAL',
                storageKey: trimmedMusic,
                publicUrl: trimmedMusic,
                originalFilename: trimmedMusic.split('/').pop()?.split('?')[0] || 'music.mp3',
                isCurrent: true
              }
            });
          }
        } else {
          await tx.media.updateMany({
            where: { invitationId: params.id, type: 'AUDIO', deletedAt: null },
            data: { deletedAt: new Date(), isCurrent: false }
          });
        }
      }

      // 2. Sync Cover / Image in Media Table
      if (body.coverImageUrl !== undefined) {
        const trimmedCover = (body.coverImageUrl || '').trim();
        if (trimmedCover) {
          const existingCover = await tx.media.findFirst({
            where: { invitationId: params.id, role: 'COVER', deletedAt: null }
          });
          if (existingCover) {
            await tx.media.update({
              where: { id: existingCover.id },
              data: {
                storageKey: trimmedCover,
                publicUrl: trimmedCover,
                type: 'IMAGE',
                isCurrent: true,
                deletedAt: null
              }
            });
          } else {
            await tx.media.create({
              data: {
                invitationId: params.id,
                type: 'IMAGE',
                role: 'COVER',
                storageKey: trimmedCover,
                publicUrl: trimmedCover,
                originalFilename: trimmedCover.split('/').pop()?.split('?')[0] || 'cover.jpg',
                isCurrent: true
              }
            });
          }
        } else {
          await tx.media.updateMany({
            where: { invitationId: params.id, role: 'COVER', deletedAt: null },
            data: { deletedAt: new Date(), isCurrent: false }
          });
        }
      }

      // 3. Update Invitation Record
      const result = await tx.invitation.update({
        where: { id: params.id },
        data: {
          ...updateData,
          version: { increment: 1 }
        },
        include: {
          slugs: { where: { isCurrent: true } },
          template: true,
          media: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } }
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

    const currentSlug = updated.slugs?.find((s: any) => s.isCurrent)?.slug || updated.slugs?.[0]?.slug;
    if (currentSlug) {
      try {
        revalidatePath(`/${currentSlug}`);
        revalidatePath(`/${currentSlug}/card`);
        revalidatePath(`/${currentSlug}/rsvp`);
      } catch (e) {
        console.error('Revalidation error:', e);
      }
    }

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
