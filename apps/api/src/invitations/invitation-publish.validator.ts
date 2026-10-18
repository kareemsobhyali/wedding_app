import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { InvitationStatus } from '@prisma/client';

export interface PublishValidationError {
  code: string;
  field: string;
  message: string;
}

@Injectable()
export class InvitationPublishValidator {
  constructor(private readonly prisma: PrismaService) {}

  async validateForActivation(invitationId: string): Promise<PublishValidationError[]> {
    const inv = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
      include: { template: true, media: { where: { deletedAt: null } }, slugs: { where: { isCurrent: true } } }
    });

    const errors: PublishValidationError[] = [];

    if (!inv) {
      return [{ code: 'NOT_FOUND', field: 'id', message: 'Invitation does not exist.' }];
    }

    if (inv.deletedAt) {
      errors.push({ code: 'DELETED', field: 'id', message: 'Cannot activate a deleted invitation.' });
    }

    // Required fields
    if (!inv.groomName) errors.push({ code: 'MISSING_REQUIRED_FIELD', field: 'groomName', message: 'Groom name is required' });
    if (!inv.brideName) errors.push({ code: 'MISSING_REQUIRED_FIELD', field: 'brideName', message: 'Bride name is required' });
    if (!inv.customerPhone) errors.push({ code: 'MISSING_REQUIRED_FIELD', field: 'customerPhone', message: 'Customer phone is required' });
    if (!inv.weddingDate) errors.push({ code: 'MISSING_REQUIRED_FIELD', field: 'weddingDate', message: 'Wedding date is required' });
    if (!inv.venueName) errors.push({ code: 'MISSING_REQUIRED_FIELD', field: 'venueName', message: 'Venue name is required' });

    // Expiration
    if (inv.expiresAt && inv.expiresAt < new Date()) {
      errors.push({ code: 'INVALID_EXPIRATION', field: 'expiresAt', message: 'Cannot activate an invitation that is already expired.' });
    }

    // Slug
    if (inv.slugs.length === 0) {
      errors.push({ code: 'MISSING_SLUG', field: 'slug', message: 'Invitation has no current canonical slug.' });
    }

    // Template
    if (!inv.template) {
      errors.push({ code: 'MISSING_TEMPLATE', field: 'templateId', message: 'No template selected.' });
    } else if (!inv.template.isActive) {
      errors.push({ code: 'INACTIVE_TEMPLATE', field: 'templateId', message: 'The selected template is not administratively active.' });
    }

    return errors;
  }
}
