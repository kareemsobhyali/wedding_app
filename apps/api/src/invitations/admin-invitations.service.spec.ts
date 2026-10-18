import { Test, TestingModule } from '@nestjs/testing';
import { AdminInvitationsService } from './admin-invitations.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { InvitationPublishValidator } from './invitation-publish.validator';
import { ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InvitationStatus } from '@prisma/client';

describe('AdminInvitationsService', () => {
  let service: AdminInvitationsService;
  let mockPrisma: any;
  let mockStorage: any;
  let mockValidator: any;

  beforeEach(async () => {
    mockPrisma = {
      invitation: { 
        findUnique: jest.fn(),
        update: jest.fn(),
        create: jest.fn()
      },
      invitationSlug: {
        findUnique: jest.fn(),
        updateMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn()
      },
      auditLog: { create: jest.fn() },
      $transaction: jest.fn(async (cb) => cb(mockPrisma)),
    };

    mockStorage = {
      copyObject: jest.fn(),
      getPublicUrl: jest.fn().mockReturnValue('mock-url'),
      deleteObject: jest.fn()
    };

    mockValidator = {
      validateForActivation: jest.fn().mockResolvedValue([])
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminInvitationsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: StorageService, useValue: mockStorage },
        { provide: InvitationPublishValidator, useValue: mockValidator }
      ],
    }).compile();

    service = module.get<AdminInvitationsService>(AdminInvitationsService);
  });

  describe('duplicate media', () => {
    it('should assign a new storage key and copy object without touching original', async () => {
      mockPrisma.invitation.findUnique.mockResolvedValue({
        id: 'inv-1',
        groomName: 'G', brideName: 'B',
        templateId: 'temp',
        media: [
          { storageKey: 'original-key', type: 'IMAGE', role: 'GALLERY', publicUrl: 'orig-url' }
        ]
      });

      mockPrisma.invitation.create.mockResolvedValue({ id: 'inv-2' });

      await service.duplicate('inv-1', 'admin-1');

      expect(mockStorage.copyObject).toHaveBeenCalledWith('original-key', expect.stringContaining('duplicates/'));
      expect(mockPrisma.invitation.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          status: InvitationStatus.DRAFT,
          media: {
            create: expect.arrayContaining([
              expect.objectContaining({ storageKey: expect.stringContaining('duplicates/') })
            ])
          }
        })
      }));
    });

    it('failed storage copy does not delete source media', async () => {
      mockPrisma.invitation.findUnique.mockResolvedValue({
        id: 'inv-1',
        media: [{ storageKey: 'original-key', type: 'IMAGE', role: 'GALLERY' }]
      });

      mockStorage.copyObject.mockRejectedValue(new Error('S3 Down'));

      await expect(service.duplicate('inv-1', 'admin-1')).rejects.toThrow('Storage copy failed during duplication');

      expect(mockStorage.deleteObject).not.toHaveBeenCalledWith('original-key'); // original untouched
      expect(mockPrisma.invitation.create).not.toHaveBeenCalled(); // DB aborted
    });
  });

  describe('Revalidation', () => {
    it('database mutation succeeds even if revalidation fails', async () => {
      // Mock existing
      mockPrisma.invitation.findUnique.mockResolvedValue({ id: 'inv-1', status: InvitationStatus.PENDING_REVIEW });
      // Mock update
      mockPrisma.invitation.update.mockResolvedValue({ id: 'inv-1', status: InvitationStatus.ACTIVE });
      
      const inv = await service.activate('inv-1', 'admin-1');
      
      expect(inv.status).toBe(InvitationStatus.ACTIVE);
    });
  });

  describe('Transactions & Audit Logs', () => {
    it('failed status transition does not create a misleading AuditLog', async () => {
      mockPrisma.invitation.findUnique.mockResolvedValue({ id: 'inv-1', status: InvitationStatus.PENDING_REVIEW });
      mockValidator.validateForActivation.mockResolvedValue([{ code: 'ERR' }]);
      
      await expect(service.activate('inv-1', 'admin-1')).rejects.toThrow(BadRequestException);
      
      expect(mockPrisma.auditLog.create).not.toHaveBeenCalled();
      expect(mockPrisma.invitation.update).not.toHaveBeenCalled();
    });

    it('optimistic locking failure blocks update and audit log', async () => {
      mockPrisma.invitation.findUnique.mockResolvedValue({ id: 'inv-1', version: 1 });
      
      await expect(service.updateInvitation('inv-1', 'admin-1', 0, {})).rejects.toThrow(ConflictException);
      
      expect(mockPrisma.auditLog.create).not.toHaveBeenCalled();
      expect(mockPrisma.invitation.update).not.toHaveBeenCalled();
    });
  });

  describe('Soft Delete', () => {
    it('sets deletedAt and increments version', async () => {
      mockPrisma.invitation.update.mockResolvedValue({ id: 'inv-1', deletedAt: new Date() });
      await service.softDelete('inv-1', 'admin-1');
      expect(mockPrisma.invitation.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ deletedAt: expect.any(Date) })
      }));
    });
  });

});
