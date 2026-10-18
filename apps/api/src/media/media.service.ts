import { Injectable, BadRequestException, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { AuthorizeUploadDto } from './dto/authorize-upload.dto';
import { FinalizeUploadDto } from './dto/finalize-upload.dto';
import * as crypto from 'crypto';
import { MediaType, MediaRole } from '@prisma/client';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  // Configuration limits
  private readonly MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly MAX_AUDIO_SIZE = 25 * 1024 * 1024; // 25MB

  private readonly ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly ALLOWED_AUDIO_MIMES = ['audio/mpeg', 'audio/wav', 'audio/aac', 'audio/mp4'];
  
  private readonly ALLOWED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];
  private readonly ALLOWED_AUDIO_EXTS = ['.mp3', '.wav', '.m4a', '.aac'];

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  private validateConstraints(dto: AuthorizeUploadDto) {
    const ext = dto.filename.substring(dto.filename.lastIndexOf('.')).toLowerCase();

    if (dto.type === MediaType.IMAGE) {
      if (dto.sizeBytes > this.MAX_IMAGE_SIZE) throw new BadRequestException('Image exceeds 10MB limit');
      if (!this.ALLOWED_IMAGE_MIMES.includes(dto.mimeType)) throw new BadRequestException('Invalid image MIME type');
      if (!this.ALLOWED_IMAGE_EXTS.includes(ext)) throw new BadRequestException('Invalid image extension');
    } else if (dto.type === MediaType.AUDIO) {
      if (dto.sizeBytes > this.MAX_AUDIO_SIZE) throw new BadRequestException('Audio exceeds 25MB limit');
      if (!this.ALLOWED_AUDIO_MIMES.includes(dto.mimeType)) throw new BadRequestException('Invalid audio MIME type');
      if (!this.ALLOWED_AUDIO_EXTS.includes(ext)) throw new BadRequestException('Invalid audio extension');
    } else {
      throw new BadRequestException('Unsupported media type');
    }
  }

  async authorizeUpload(dto: AuthorizeUploadDto) {
    this.validateConstraints(dto);

    // Verify invitation exists
    const invitation = await this.prisma.invitation.findUnique({ where: { id: dto.invitationId } });
    if (!invitation) throw new NotFoundException('Invitation not found');

    // Generate safe storage key
    const ext = dto.filename.substring(dto.filename.lastIndexOf('.')).toLowerCase();
    const uniqueId = crypto.randomUUID();
    const typeFolder = dto.type === MediaType.IMAGE ? 'images' : 'audio';
    
    // Explicitly construct key to prevent path traversal
    const storageKey = `invitations/${invitation.id}/${typeFolder}/${uniqueId}${ext}`;

    // Get presigned URL (valid for 10 minutes)
    const uploadUrl = await this.storage.getPresignedUploadUrl(storageKey, dto.mimeType, dto.sizeBytes, 600);

    // We do NOT create the database record here. We wait for finalization.
    // However, we cache the intent securely in a pending state if we wanted to enforce it strictly.
    // For V1, the explicit path + finalization check is secure enough.

    return {
      uploadUrl,
      storageKey,
      mimeType: dto.mimeType,
      sizeBytes: dto.sizeBytes,
    };
  }

  async finalizeUpload(dto: FinalizeUploadDto) {
    // 1. Verify object exists in R2 and matches expectations
    const head = await this.storage.headObject(dto.storageKey);
    if (!head.exists) {
      throw new BadRequestException('File not found in storage. Upload may have failed.');
    }

    const mimeType = head.contentType || 'application/octet-stream';
    const sizeBytes = head.contentLength || 0;

    // Validate the actual uploaded file against constraints
    this.validateConstraints({
      invitationId: dto.invitationId,
      type: dto.type,
      role: dto.role,
      filename: dto.filename,
      mimeType,
      sizeBytes,
    });

    // 2. Audio versioning check: If this is an audio replacement, we must handle it cleanly.
    return this.prisma.$transaction(async (tx) => {
      let isOriginal = true;
      let sortOrder = 0;

      // If audio, find existing current audio
      if (dto.type === MediaType.AUDIO) {
        const existingAudio = await tx.media.findFirst({
          where: { invitationId: dto.invitationId, type: MediaType.AUDIO, isCurrent: true, deletedAt: null }
        });

        if (existingAudio) {
          isOriginal = false; // This is a replacement
          // Mark existing as not current
          await tx.media.update({
            where: { id: existingAudio.id },
            data: { isCurrent: false }
          });
        }
      }

      // 3. Create Media Record
      const media = await tx.media.create({
        data: {
          invitationId: dto.invitationId,
          type: dto.type,
          role: dto.role,
          storageKey: dto.storageKey,
          originalFilename: dto.filename,
          mimeType,
          sizeBytes,
          isOriginal: isOriginal,
          isCurrent: true,
          publicUrl: null, // Private by default unless explicitly public
          sortOrder,
        }
      });

      return media;
    });
  }

  async getMediaUrl(mediaId: string): Promise<string> {
    const media = await this.prisma.media.findUnique({ where: { id: mediaId, deletedAt: null } });
    if (!media) throw new NotFoundException('Media not found');

    // Admin download URL (1 hour)
    return this.storage.getPresignedDownloadUrl(media.storageKey, 3600);
  }

  async softDeleteMedia(mediaId: string): Promise<void> {
    const media = await this.prisma.media.findUnique({ where: { id: mediaId, deletedAt: null } });
    if (!media) throw new NotFoundException('Media not found');

    // 1. Soft delete in DB first (safer than deleting from R2 first, which breaks DB consistency if DB fails)
    await this.prisma.media.update({
      where: { id: mediaId },
      data: { deletedAt: new Date() }
    });

    // 2. Delete from R2
    // If this fails, the DB is already soft-deleted so the user doesn't see it.
    // An orphan cleanup job can eventually sweep soft-deleted records and purge R2.
    try {
      await this.storage.deleteObject(media.storageKey);
    } catch (err: any) {
      this.logger.error(`Failed to delete object from R2: ${media.storageKey}`, err.stack);
      // We don't throw, we allow the DB soft-delete to persist. 
      // Orphan cleanup will catch it.
    }
  }
}
