import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { InvitationStatus, Prisma } from '@prisma/client';
import { InvitationPublishValidator } from './invitation-publish.validator';

@Injectable()
export class AdminInvitationsService {
  private readonly logger = new Logger(AdminInvitationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly publishValidator: InvitationPublishValidator,
  ) {}

  async getDashboardSummary() {
    const counts = await this.prisma.invitation.groupBy({
      by: ['status'],
      _count: true,
      where: { deletedAt: null }
    });

    const summary: Record<string, number> = {
      TOTAL: 0,
      DRAFT: 0,
      PENDING_REVIEW: 0,
      ACTIVE: 0,
      DISABLED: 0,
      EXPIRED: 0,
      ARCHIVED: 0,
    };

    counts.forEach(c => {
      summary[c.status] = c._count;
      summary.TOTAL += c._count;
    });

    const recentSubmissions = await this.prisma.invitation.findMany({
      where: { status: 'PENDING_REVIEW', deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { id: true, groomName: true, brideName: true, customerPhone: true, updatedAt: true }
    });

    return { summary, recentSubmissions };
  }

  async getInvitations(query: any) {
    const { page = 1, limit = 20, search, status, sort = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (Math.max(1, page) - 1) * Math.max(1, Math.min(100, limit));

    const where: Prisma.InvitationWhereInput = { deletedAt: null };

    if (status) {
      where.status = status as InvitationStatus;
    }

    if (search) {
      where.OR = [
        { groomName: { contains: search, mode: 'insensitive' } },
        { brideName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search } },
        { slugs: { some: { slug: { contains: search, mode: 'insensitive' }, isCurrent: true } } }
      ];
    }

    // Whitelist sort fields
    const validSortFields = ['createdAt', 'updatedAt', 'weddingDate', 'groomName', 'brideName', 'status'];
    const orderByField = validSortFields.includes(sort) ? sort : 'createdAt';
    const orderByDirection = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const [items, total] = await Promise.all([
      this.prisma.invitation.findMany({
        where,
        skip,
        take: Math.min(100, limit),
        orderBy: { [orderByField]: orderByDirection },
        include: {
          slugs: { where: { isCurrent: true }, select: { slug: true } },
          template: { select: { name: true } }
        }
      }),
      this.prisma.invitation.count({ where })
    ]);

    return {
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Math.min(100, limit))
      }
    };
  }

  async getInvitationDetails(id: string) {
    const inv = await this.prisma.invitation.findUnique({
      where: { id },
      include: {
        slugs: { orderBy: { createdAt: 'desc' } },
        template: true,
        media: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } }
      }
    });

    if (!inv) throw new NotFoundException('Invitation not found');

    return inv;
  }

  
  async createQuick(adminId: string, data: any) {
    return this.prisma.$transaction(async (tx) => {
      // Find a default template
      const defaultTemplate = await tx.template.findFirst();
      if (!defaultTemplate) throw new Error('No active templates found');

      const created = await tx.invitation.create({
        data: {
          groomName: data.groomName || 'Groom',
          brideName: data.brideName || 'Bride',
          customerPhone: data.customerPhone || '',
          venueName: '',
          weddingDate: data.weddingDate ? new Date(data.weddingDate) : null,
          status: 'DRAFT',
          template: { connect: { id: defaultTemplate.id } },
          version: 1
        }
      });
      
      const slugStr = `${(data.groomName || 'g').substring(0,10)}-${(data.brideName || 'b').substring(0,10)}-${Math.random().toString(36).substring(2,6)}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      await tx.invitationSlug.create({
        data: { invitationId: created.id, slug: slugStr, isCurrent: true }
      });

      await tx.auditLog.create({
        data: { action: 'INVITATION_CREATED_QUICK', adminUserId: adminId, entityType: 'INVITATION', entityId: created.id, metadata: {} }
      });

      return created;
    });
  }

  async updateInvitation(id: string, adminId: string, version: number, data: any) {
    const existing = await this.prisma.invitation.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException();

    if (existing.version !== version) {
      throw new ConflictException('Data was modified by another user. Please refresh and try again.');
    }

    // Extract safe update fields, explicitly mapping the schema keys
    const updateData: any = {};
    const safeFields = ['groomName', 'brideName', 'customerPhone', 'weddingDate', 'weddingTime', 'venueName', 'venueAddress', 'googleMapsUrl', 'caption', 'weddingMessage', 'groomPhone', 'bridePhone', 'countdownEnabled', 'expiresAt', 'customData', 'templateId'];
    
    safeFields.forEach(f => {
      if (data[f] !== undefined) updateData[f] = data[f];
    });
    
    if (data.weddingDate) updateData.weddingDate = new Date(data.weddingDate);
    if (data.expiresAt) updateData.expiresAt = new Date(data.expiresAt);

    if (data.templateId) {
      const tmpl = await this.prisma.template.findFirst({
        where: { OR: [{ id: data.templateId }, { slug: data.templateId }] }
      });
      if (tmpl) {
        updateData.templateId = tmpl.id;
      } else {
        delete updateData.templateId;
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.invitation.update({
        where: { id, version },
        data: {
          ...updateData,
          version: { increment: 1 }
        }
      });

      await tx.auditLog.create({
        data: {
          action: 'INVITATION_UPDATED',
          adminUserId: adminId,
          entityType: 'INVITATION',
          entityId: id,
          metadata: updateData
        }
      });

      return result;
    });

    this.triggerRevalidation(id);
    return updated;
  }

  // --- State Transitions ---

  private validateTransition(current: InvitationStatus, next: InvitationStatus) {
    const allowedTransitions: Record<InvitationStatus, InvitationStatus[]> = {
      [InvitationStatus.DRAFT]: [InvitationStatus.PENDING_REVIEW],
      [InvitationStatus.PENDING_REVIEW]: [InvitationStatus.ACTIVE],
      [InvitationStatus.ACTIVE]: [InvitationStatus.DISABLED, InvitationStatus.EXPIRED, InvitationStatus.ARCHIVED],
      [InvitationStatus.DISABLED]: [InvitationStatus.ACTIVE, InvitationStatus.ARCHIVED],
      [InvitationStatus.EXPIRED]: [InvitationStatus.ACTIVE],
      [InvitationStatus.ARCHIVED]: [InvitationStatus.ACTIVE],
    };

    if (!allowedTransitions[current]?.includes(next)) {
      throw new BadRequestException(`Cannot transition from ${current} to ${next}`);
    }
  }

  async activate(id: string, adminId: string) {
    const existing = await this.prisma.invitation.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException();
    this.validateTransition(existing.status, InvitationStatus.ACTIVE);

    const errors = await this.publishValidator.validateForActivation(id);
    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Validation failed', errors });
    }

    const inv = await this.prisma.$transaction(async (tx) => {
      const result = await tx.invitation.update({
        where: { id },
        data: { status: InvitationStatus.ACTIVE, version: { increment: 1 } }
      });
      await tx.auditLog.create({
        data: { action: 'INVITATION_ACTIVATED', adminUserId: adminId, entityType: 'INVITATION', entityId: id, metadata: {} }
      });
      return result;
    });

    this.triggerRevalidation(id);
    return inv;
  }

  async disable(id: string, adminId: string) {
    const existing = await this.prisma.invitation.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException();
    this.validateTransition(existing.status, InvitationStatus.DISABLED);

    const inv = await this.prisma.$transaction(async (tx) => {
      const result = await tx.invitation.update({
        where: { id },
        data: { status: InvitationStatus.DISABLED, version: { increment: 1 } }
      });
      await tx.auditLog.create({
        data: { action: 'INVITATION_DISABLED', adminUserId: adminId, entityType: 'INVITATION', entityId: id, metadata: {} }
      });
      return result;
    });

    this.triggerRevalidation(id);
    return inv;
  }

  async archive(id: string, adminId: string) {
    const existing = await this.prisma.invitation.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException();
    this.validateTransition(existing.status, InvitationStatus.ARCHIVED);

    const inv = await this.prisma.$transaction(async (tx) => {
      const result = await tx.invitation.update({
        where: { id },
        data: { status: InvitationStatus.ARCHIVED, version: { increment: 1 } }
      });
      await tx.auditLog.create({
        data: { action: 'INVITATION_ARCHIVED', adminUserId: adminId, entityType: 'INVITATION', entityId: id, metadata: {} }
      });
      return result;
    });

    this.triggerRevalidation(id);
    return inv;
  }

  async softDelete(id: string, adminId: string) {
    const inv = await this.prisma.$transaction(async (tx) => {
      const result = await tx.invitation.update({
        where: { id },
        data: { deletedAt: new Date(), version: { increment: 1 } }
      });
      await tx.auditLog.create({
        data: { action: 'INVITATION_DELETED', adminUserId: adminId, entityType: 'INVITATION', entityId: id, metadata: {} }
      });
      return result;
    });

    this.triggerRevalidation(id);
    return inv;
  }

  async restore(id: string, adminId: string) {
    const inv = await this.prisma.$transaction(async (tx) => {
      // Restore puts it back to DISABLED, explicitly requiring a human to ACTIVATE it
      const result = await tx.invitation.update({
        where: { id },
        data: { deletedAt: null, status: InvitationStatus.DISABLED, version: { increment: 1 } }
      });
      await tx.auditLog.create({
        data: { action: 'INVITATION_RESTORED', adminUserId: adminId, entityType: 'INVITATION', entityId: id, metadata: {} }
      });
      return result;
    });

    this.triggerRevalidation(id);
    return inv;
  }

  async duplicate(id: string, adminId: string) {
    const original = await this.prisma.invitation.findUnique({
      where: { id },
      include: { template: true, media: { where: { deletedAt: null } } }
    });

    if (!original) throw new NotFoundException();

    const newMediaData: any[] = [];
    
    for (const media of original.media) {
      const newStorageKey = `duplicates/${Date.now()}-${media.storageKey.split('/').pop()}`;
      try {
        await this.storage.copyObject(media.storageKey, newStorageKey);
        
        let newPublicUrl = null;
        if (media.publicUrl) {
          newPublicUrl = this.storage.getPublicUrl(newStorageKey);
        }

        newMediaData.push({
          type: media.type,
          role: media.role,
          storageKey: newStorageKey,
          publicUrl: newPublicUrl,
          originalFilename: media.originalFilename,
          mimeType: media.mimeType,
          sizeBytes: media.sizeBytes,
          width: media.width,
          height: media.height,
          durationSeconds: media.durationSeconds,
          sortOrder: media.sortOrder,
          isOriginal: media.isOriginal,
          isCurrent: media.isCurrent
        });
      } catch (err) {
        this.logger.error(`Failed to copy media ${media.storageKey} during duplication`, err);
        for (const done of newMediaData) {
          try { await this.storage.deleteObject(done.storageKey); } catch (e) {}
        }
        throw new Error('Storage copy failed during duplication');
      }
    }

    const newSlug = `copy-${Date.now()}-${original.id.slice(-6)}`;

    const duplicate = await this.prisma.$transaction(async (tx) => {
      const created = await tx.invitation.create({
        data: {
          groomName: original.groomName,
          brideName: original.brideName,
          customerPhone: original.customerPhone,
          weddingDate: original.weddingDate,
          weddingTime: original.weddingTime,
          venueName: original.venueName,
          venueAddress: original.venueAddress,
          googleMapsUrl: original.googleMapsUrl,
          caption: original.caption,
          weddingMessage: original.weddingMessage,
          groomPhone: original.groomPhone,
          bridePhone: original.bridePhone,
          countdownEnabled: original.countdownEnabled,
          contactButtonsEnabled: original.contactButtonsEnabled,
          template: { connect: { id: original.templateId! } },
          status: InvitationStatus.DRAFT,
          media: {
            create: newMediaData
          },
          slugs: {
            create: [{ slug: newSlug, isCurrent: true }]
          }
        }
      });

      await tx.auditLog.create({
        data: { action: 'INVITATION_DUPLICATED', adminUserId: adminId, entityType: 'INVITATION', entityId: created.id, metadata: { originalId: id } }
      });

      return created;
    });

    return duplicate;
  }

  async updateSlug(id: string, adminId: string, newSlug: string) {
    const normalized = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    
    const exists = await this.prisma.invitationSlug.findUnique({ where: { slug: normalized } });
    if (exists && exists.invitationId !== id) {
      throw new ConflictException('Slug is already in use by another invitation');
    }
    if (exists && exists.invitationId === id && exists.isCurrent) {
      return { success: true };
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.invitationSlug.updateMany({
        where: { invitationId: id, isCurrent: true },
        data: { isCurrent: false, replacedAt: new Date() }
      });

      if (exists) {
        await tx.invitationSlug.update({
          where: { slug: normalized },
          data: { isCurrent: true, replacedAt: null }
        });
      } else {
        await tx.invitationSlug.create({
          data: { invitationId: id, slug: normalized, isCurrent: true }
        });
      }

      await tx.auditLog.create({
        data: { action: 'SLUG_CHANGED', adminUserId: adminId, entityType: 'INVITATION', entityId: id, metadata: { newSlug: normalized } }
      });
    });

    this.triggerRevalidation(id);
    return { success: true, slug: normalized };
  }

  async getAuditLogs(id: string, page = 1) {
    const take = 20;
    const skip = (Math.max(1, page) - 1) * take;

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: { entityId: id, entityType: 'INVITATION' },
        orderBy: { timestamp: 'desc' },
        skip,
        take,
      }),
      this.prisma.auditLog.count({ where: { entityId: id, entityType: 'INVITATION' } })
    ]);

    return { items, total, page, totalPages: Math.ceil(total / take) };
  }

  private async triggerRevalidation(invitationId: string) {
    try {
      const slugRecord = await this.prisma.invitationSlug.findFirst({
        where: { invitationId, isCurrent: true }
      });
      if (!slugRecord) return;

      const secret = process.env.REVALIDATION_SECRET;
      if (!secret) {
        this.logger.warn('REVALIDATION_SECRET not configured, skipping cache revalidation.');
        return;
      }

      const url = process.env.NEXT_INTERNAL_URL || 'http://localhost:3000';
      
      fetch(`${url}/api/internal/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secret}`
        },
        body: JSON.stringify({ tags: [`public-invitation-${slugRecord.slug}`] })
      }).catch(err => {
        this.logger.error(`Failed to trigger cache revalidation for ${slugRecord.slug}: ${err.message}`);
      });
    } catch (e) {
      this.logger.error('Error computing revalidation payload', e);
    }
  }
}
