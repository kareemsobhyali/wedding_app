import { Injectable, BadRequestException, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { InvitationStatus } from '@prisma/client';
import * as crypto from 'crypto';
import { Response } from 'express';

export interface StartDraftDto {
  templateId: string;
}

@Injectable()
export class PublicInvitationsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSlugCandidate(groomName: string, brideName: string): string {
    const raw = `${groomName}-${brideName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return raw || 'our-wedding';
  }

  async startDraft(dto: StartDraftDto, res: Response, ipAddress?: string, userAgent?: string) {
    // 1. Verify template (can be ID or slug)
    const template = await this.prisma.template.findFirst({ 
      where: { 
        OR: [
          { id: dto.templateId },
          { slug: dto.templateId }
        ],
        isActive: true 
      } 
    });
    if (!template) throw new BadRequestException('Invalid or inactive template selected');

    // 2. Create raw draft session token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    // 3. Create Invitation
    const invitation = await this.prisma.invitation.create({
      data: {
        status: InvitationStatus.DRAFT,
        template: { connect: { id: template.id } },
        // Optional default empty fields since it's a draft
        groomName: '',
        brideName: '',
        venueName: '',
        customerPhone: '',
        weddingDate: new Date(),
      }
    });

    // 4. Create Session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14); // 14-day draft window

    await this.prisma.draftSession.create({
      data: {
        invitationId: invitation.id,
        tokenHash,
        expiresAt,
        ipAddress,
        userAgent,
      }
    });

    // 5. Set Cookie
    res.cookie('draft_session', rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });

    return { version: invitation.version, status: invitation.status, draftSessionToken: rawToken };
  }

  async getDraft(invitationId: string) {
    const inv = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
      include: {
        media: {
          where: { deletedAt: null },
          orderBy: { sortOrder: 'asc' }
        },
        template: {
          select: { id: true, name: true, slug: true }
        }
      }
    });
    if (!inv) throw new NotFoundException('Draft not found');
    
    // We only return public fields
    const { id, createdAt, updatedAt, deletedAt, sourceInvitationId, ...safeData } = inv;
    return safeData;
  }

  async patchDraft(invitationId: string, clientVersion: number, data: any) {
    // 1. Ensure status is DRAFT
    const inv = await this.prisma.invitation.findUnique({ where: { id: invitationId } });
    if (!inv) throw new NotFoundException();
    if (inv.status !== InvitationStatus.DRAFT) {
      throw new ForbiddenException('Cannot modify an invitation that is not in DRAFT status');
    }

    // 2. Perform optimistic atomic update
      const { mapsUrl, groomContact, brideContact, ...rest } = data;
      const updateData: any = { ...rest };
      if (mapsUrl !== undefined) updateData.googleMapsUrl = mapsUrl;
      if (groomContact !== undefined) updateData.groomPhone = groomContact;
      if (brideContact !== undefined) updateData.bridePhone = brideContact;
      if (data.templateId) {
        const tmpl = await this.prisma.template.findFirst({
          where: { OR: [{ id: data.templateId }, { slug: data.templateId }], isActive: true }
        });
        if (tmpl) {
          updateData.templateId = tmpl.id;
        } else {
          delete updateData.templateId;
        }
      }

      const result = await this.prisma.invitation.updateMany({
        where: {
          id: invitationId,
          version: clientVersion
        },
        data: {
          ...updateData,
          version: { increment: 1 }
        }
    });

    if (result.count === 0) {
      throw new ConflictException('Version mismatch. Refresh to sync latest changes.');
    }

    return { version: clientVersion + 1 };
  }

  async submitDraft(invitationId: string, res: Response) {
    const inv = await this.prisma.invitation.findUnique({ where: { id: invitationId } });
    if (!inv) throw new NotFoundException();
    
    if (inv.status !== InvitationStatus.DRAFT) {
      throw new ConflictException('Invitation is already submitted');
    }

    // Validate required fields
    if (!inv.groomName || !inv.brideName || !inv.weddingDate || !inv.venueName || !inv.customerPhone) {
      throw new BadRequestException('Missing required fields for submission');
    }

    // Generate unique slug
    let candidate = this.generateSlugCandidate(inv.groomName, inv.brideName);
    const RESERVED_SLUGS = ['api', 'admin', 'create', 'templates', 'assets', 'login', 'dashboard'];
    if (RESERVED_SLUGS.includes(candidate)) {
      candidate = `${candidate}-wed`;
    }

    // Deduplicate
    let finalSlug = candidate;
    let attempts = 1;
    while (true) {
      const existing = await this.prisma.invitationSlug.findUnique({ where: { slug: finalSlug } });
      if (!existing) break;
      finalSlug = `${candidate}-${attempts}`;
      attempts++;
    }

    // Perform atomic submission transaction
    await this.prisma.$transaction(async (tx) => {
      // 1. Update status
      await tx.invitation.update({
        where: { id: invitationId },
        data: {
          status: InvitationStatus.PENDING_REVIEW,
          version: { increment: 1 }
        }
      });

      // 2. Assign slug
      await tx.invitationSlug.create({
        data: {
          slug: finalSlug,
          invitationId: invitationId,
        }
      });

      // 3. Revoke all draft sessions for this invitation securely
      await tx.draftSession.updateMany({
        where: { invitationId },
        data: { revokedAt: new Date() }
      });
    });

    // Clear cookie for client
    res.clearCookie('draft_session');

    return { status: InvitationStatus.PENDING_REVIEW };
  }

  async getBySlug(slug: string) {
    const slugRecord = await this.prisma.invitationSlug.findUnique({
      where: { slug },
      include: {
        invitation: {
          include: {
            template: true,
            media: {
              where: { deletedAt: null },
              orderBy: { sortOrder: 'asc' }
            }
          }
        }
      }
    });

    if (!slugRecord) {
      return { type: 'NOT_FOUND' };
    }

    if (!slugRecord.isCurrent) {
      // Find the canonical slug for this invitation
      const canonicalSlug = await this.prisma.invitationSlug.findFirst({
        where: { invitationId: slugRecord.invitationId, isCurrent: true }
      });
      if (!canonicalSlug || canonicalSlug.slug === slug) {
        // Prevent loop
        return { type: 'NOT_FOUND' };
      }
      return { type: 'LEGACY_SLUG', canonicalSlug: canonicalSlug.slug };
    }

    const inv = slugRecord.invitation;

    // Strict Status enforcement
    if (inv.status !== InvitationStatus.ACTIVE || !!inv.deletedAt) {
      return { type: 'NOT_FOUND' };
    }

    // Expiration enforcement
    if (inv.expiresAt && inv.expiresAt < new Date()) {
      return { type: 'NOT_FOUND' };
    }

    // Build Public Render Data
    const publicData = {
      groomName: inv.groomName,
      brideName: inv.brideName,
      weddingDate: inv.weddingDate,
      weddingTime: inv.weddingTime,
      venueName: inv.venueName,
      venueAddress: inv.venueAddress,
      googleMapsUrl: inv.googleMapsUrl,
      caption: inv.caption,
      weddingMessage: inv.weddingMessage,
      groomPhone: inv.groomPhone,
      bridePhone: inv.bridePhone,
      countdownEnabled: inv.countdownEnabled,
      customData: inv.customData,
      template: {
        id: inv.template.id,
        name: inv.template.name,
        slug: inv.template.slug
      },
      galleryImages: inv.media.filter(m => m.role === 'GALLERY').map(m => ({ url: m.publicUrl || m.storageKey, alt: 'Gallery Image' })),
      music: inv.media.find(m => m.type === 'AUDIO') ? { url: inv.media.find(m => m.type === 'AUDIO')!.publicUrl || inv.media.find(m => m.type === 'AUDIO')!.storageKey } : undefined,
      coverImage: inv.media.find(m => m.role === 'COVER') ? { url: inv.media.find(m => m.role === 'COVER')!.publicUrl || inv.media.find(m => m.role === 'COVER')!.storageKey, alt: 'Cover' } : undefined,
    };

    return { type: 'FOUND', data: publicData };
  }
}

