import { Controller, Post, Body, UseGuards, Param, Delete, ForbiddenException, Patch } from '@nestjs/common';
import { ApiTags, ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { DraftAuthGuard } from '../auth/guards/draft-auth.guard';
import { CurrentInvitationId } from '../auth/decorators/draft.decorator';
import { MediaService } from './media.service';
import { AuthorizeUploadDto } from './dto/authorize-upload.dto';
import { FinalizeUploadDto } from './dto/finalize-upload.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { InvitationStatus, MediaType, MediaRole } from '@prisma/client';

@ApiTags('Public Media')
@Controller('public/media')
@UseGuards(DraftAuthGuard)
@ApiCookieAuth('draft_session')
export class PublicMediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly prisma: PrismaService,
  ) {}

  private async ensureDraftStatus(invitationId: string) {
    const inv = await this.prisma.invitation.findUnique({ where: { id: invitationId } });
    if (!inv || inv.status !== InvitationStatus.DRAFT) {
      throw new ForbiddenException('Cannot modify media unless invitation is in DRAFT status');
    }
  }

  @Post('upload-url')
  @ApiOperation({ summary: 'Request a presigned URL to upload media to Cloudflare R2' })
  async getUploadUrl(@CurrentInvitationId() invitationId: string, @Body() dto: AuthorizeUploadDto) {
    await this.ensureDraftStatus(invitationId);
    
    // Override the DTO's invitationId to guarantee it matches the authenticated draft session
    dto.invitationId = invitationId;
    return this.mediaService.authorizeUpload(dto);
  }

  @Post('finalize')
  @ApiOperation({ summary: 'Finalize an upload after pushing to R2' })
  async finalizeUpload(@CurrentInvitationId() invitationId: string, @Body() dto: FinalizeUploadDto) {
    await this.ensureDraftStatus(invitationId);
    dto.invitationId = invitationId;
    return this.mediaService.finalizeUpload(dto);
  }

  @Post('link')
  @ApiOperation({ summary: 'Add external media URL directly' })
  async addExternalLink(
    @CurrentInvitationId() invitationId: string, 
    @Body('url') url: string, 
    @Body('type') type: MediaType, 
    @Body('role') role: MediaRole
  ) {
    await this.ensureDraftStatus(invitationId);
    
    // Clear existing for COVER or ORIGINAL audio to replace them
    if (role === MediaRole.COVER || role === MediaRole.ORIGINAL) {
      await this.prisma.media.updateMany({
        where: { invitationId, role },
        data: { isCurrent: false, deletedAt: new Date() }
      });
    }

    return this.prisma.media.create({
      data: {
        invitationId,
        type,
        role,
        storageKey: url,
        publicUrl: url,
        isCurrent: true,
      }
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete media from the draft' })
  async deleteMedia(@CurrentInvitationId() invitationId: string, @Param('id') mediaId: string) {
    await this.ensureDraftStatus(invitationId);
    
    // Ensure media belongs to this invitation
    const media = await this.prisma.media.findUnique({ where: { id: mediaId } });
    if (!media || media.invitationId !== invitationId) {
      throw new ForbiddenException('Access denied');
    }

    await this.mediaService.softDeleteMedia(mediaId);
    return { success: true };
  }

  @Patch(':id/order')
  @ApiOperation({ summary: 'Reorder gallery images' })
  async reorderMedia(
    @CurrentInvitationId() invitationId: string,
    @Param('id') mediaId: string,
    @Body('sortOrder') sortOrder: number
  ) {
    await this.ensureDraftStatus(invitationId);
    const media = await this.prisma.media.findUnique({ where: { id: mediaId } });
    if (!media || media.invitationId !== invitationId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.media.update({
      where: { id: mediaId },
      data: { sortOrder }
    });
    return { success: true };
  }
}
