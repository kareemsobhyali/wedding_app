import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MediaType, MediaRole } from '@prisma/client';

describe('MediaService', () => {
  let service: MediaService;
  let mockPrisma: any;
  let mockStorage: any;

  beforeEach(async () => {
    mockPrisma = {
      invitation: {
        findUnique: jest.fn(),
      },
      media: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
      },
      $transaction: jest.fn((cb) => cb(mockPrisma)),
    };

    mockStorage = {
      getPresignedUploadUrl: jest.fn().mockResolvedValue('http://mock-upload.url'),
      headObject: jest.fn(),
      getPresignedDownloadUrl: jest.fn().mockResolvedValue('http://mock-download.url'),
      deleteObject: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: StorageService, useValue: mockStorage },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
  });

  describe('authorizeUpload', () => {
    it('should reject image larger than 10MB', async () => {
      await expect(
        service.authorizeUpload({
          invitationId: 'inv-1',
          type: MediaType.IMAGE,
          role: MediaRole.GALLERY,
          filename: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 15 * 1024 * 1024,
        })
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject audio larger than 25MB', async () => {
      await expect(
        service.authorizeUpload({
          invitationId: 'inv-1',
          type: MediaType.AUDIO,
          role: MediaRole.ORIGINAL,
          filename: 'test.mp3',
          mimeType: 'audio/mpeg',
          sizeBytes: 30 * 1024 * 1024,
        })
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject unsafe extension', async () => {
      await expect(
        service.authorizeUpload({
          invitationId: 'inv-1',
          type: MediaType.IMAGE,
          role: MediaRole.GALLERY,
          filename: 'test.exe',
          mimeType: 'image/jpeg',
          sizeBytes: 1024,
        })
      ).rejects.toThrow(BadRequestException);
    });

    it('should generate secure storage key and return upload url', async () => {
      mockPrisma.invitation.findUnique.mockResolvedValue({ id: 'inv-1' });
      
      const result = await service.authorizeUpload({
        invitationId: 'inv-1',
        type: MediaType.IMAGE,
        role: MediaRole.GALLERY,
        filename: 'my_photo.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 5 * 1024 * 1024,
      });

      expect(result.uploadUrl).toBe('http://mock-upload.url');
      expect(result.storageKey).toMatch(/^invitations\/inv-1\/images\/[a-f0-9\-]+\.jpg$/);
      // Ensures path traversal like ../ is sanitized out because we generate the UUID ourselves and just append ext
      expect(result.storageKey).not.toContain('my_photo'); 
    });
  });

  describe('finalizeUpload', () => {
    it('should verify headObject and create DB record', async () => {
      mockStorage.headObject.mockResolvedValue({
        exists: true,
        contentLength: 2048,
        contentType: 'image/png'
      });

      mockPrisma.media.create.mockResolvedValue({ id: 'media-1', storageKey: 'some-key' });

      const result = await service.finalizeUpload({
        invitationId: 'inv-1',
        storageKey: 'invitations/inv-1/images/uuid.png',
        type: MediaType.IMAGE,
        role: MediaRole.GALLERY,
        filename: 'test.png'
      });

      expect(result.id).toBe('media-1');
      expect(mockPrisma.media.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            isOriginal: true,
            isCurrent: true,
          })
        })
      );
    });

    it('should flag previous audio as not current on replacement', async () => {
      mockStorage.headObject.mockResolvedValue({
        exists: true,
        contentLength: 1024 * 1024,
        contentType: 'audio/mpeg'
      });

      // Existing audio mock
      mockPrisma.media.findFirst.mockResolvedValue({ id: 'existing-audio', isCurrent: true });
      mockPrisma.media.create.mockResolvedValue({ id: 'new-audio' });

      await service.finalizeUpload({
        invitationId: 'inv-1',
        storageKey: 'invitations/inv-1/audio/uuid.mp3',
        type: MediaType.AUDIO,
        role: MediaRole.REPLACEMENT,
        filename: 'replace.mp3'
      });

      expect(mockPrisma.media.update).toHaveBeenCalledWith({
        where: { id: 'existing-audio' },
        data: { isCurrent: false }
      });
      
      expect(mockPrisma.media.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            isOriginal: false,
            isCurrent: true,
          })
        })
      );
    });
  });
});
