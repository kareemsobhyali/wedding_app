import { Test, TestingModule } from '@nestjs/testing';
import { PublicInvitationsService } from './public-invitations.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InvitationStatus } from '@prisma/client';
import { Response } from 'express';

describe('PublicInvitationsService', () => {
  let service: PublicInvitationsService;
  let mockPrisma: any;
  let mockRes: Partial<Response>;

  beforeEach(async () => {
    mockPrisma = {
      template: { findUnique: jest.fn() },
      invitation: { 
        create: jest.fn(),
        findUnique: jest.fn(),
        updateMany: jest.fn(),
        update: jest.fn(),
      },
      draftSession: { create: jest.fn(), updateMany: jest.fn() },
      invitationSlug: { findUnique: jest.fn(), findFirst: jest.fn(), create: jest.fn() },
      $transaction: jest.fn((cb) => cb(mockPrisma)),
    };

    mockRes = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicInvitationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PublicInvitationsService>(PublicInvitationsService);
  });

  describe('startDraft', () => {
    it('should reject inactive template', async () => {
      mockPrisma.template.findUnique.mockResolvedValue(null);
      await expect(service.startDraft({ templateId: 'invalid' }, mockRes as Response))
        .rejects.toThrow(BadRequestException);
    });

    it('should create draft and set HttpOnly cookie', async () => {
      mockPrisma.template.findUnique.mockResolvedValue({ id: 'valid' });
      mockPrisma.invitation.create.mockResolvedValue({ id: 'inv-1', version: 1, status: InvitationStatus.DRAFT });
      
      const result = await service.startDraft({ templateId: 'valid' }, mockRes as Response);
      
      expect(mockPrisma.draftSession.create).toHaveBeenCalled();
      expect(mockRes.cookie).toHaveBeenCalledWith('draft_session', expect.any(String), expect.objectContaining({
        httpOnly: true,
        sameSite: 'lax',
      }));
      expect(result.status).toBe(InvitationStatus.DRAFT);
    });
  });

  describe('patchDraft (Autosave)', () => {
    it('should throw ConflictException on version mismatch', async () => {
      mockPrisma.invitation.findUnique.mockResolvedValue({ id: 'inv-1', status: InvitationStatus.DRAFT });
      mockPrisma.invitation.updateMany.mockResolvedValue({ count: 0 }); // simulate optimistic lock failure
      
      await expect(service.patchDraft('inv-1', 1, { groomName: 'John' }))
        .rejects.toThrow(ConflictException);
    });

    it('should throw Forbidden if not DRAFT', async () => {
      mockPrisma.invitation.findUnique.mockResolvedValue({ id: 'inv-1', status: InvitationStatus.PENDING_REVIEW });
      
      await expect(service.patchDraft('inv-1', 1, { groomName: 'John' }))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('submitDraft', () => {
    it('should reject if missing required fields', async () => {
      mockPrisma.invitation.findUnique.mockResolvedValue({
        id: 'inv-1',
        status: InvitationStatus.DRAFT,
        groomName: 'John',
        // missing brideName, etc.
      });

      await expect(service.submitDraft('inv-1', mockRes as Response))
        .rejects.toThrow(BadRequestException);
    });

    it('should successfully submit and generate safe slug', async () => {
      mockPrisma.invitation.findUnique.mockResolvedValue({
        id: 'inv-1',
        status: InvitationStatus.DRAFT,
        groomName: 'John Admin', // Contains reserved word inside string
        brideName: 'Jane',
        weddingDate: new Date(),
        venueName: 'Place',
        customerPhone: '123456789'
      });
      mockPrisma.invitationSlug.findUnique.mockResolvedValue(null);

      await service.submitDraft('inv-1', mockRes as Response);
      
      expect(mockPrisma.invitation.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ status: InvitationStatus.PENDING_REVIEW })
      }));
      expect(mockPrisma.invitationSlug.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ slug: 'john-admin-jane' }) // Normalized string
      }));
      expect(mockRes.clearCookie).toHaveBeenCalledWith('draft_session');
    });

    it('should prevent reserved slugs completely', async () => {
      // "api" is reserved.
      mockPrisma.invitation.findUnique.mockResolvedValue({
        id: 'inv-1',
        status: InvitationStatus.DRAFT,
        groomName: 'ap', 
        brideName: 'i',
        weddingDate: new Date(),
        venueName: 'Place',
        customerPhone: '123456789'
      });
      mockPrisma.invitationSlug.findUnique.mockResolvedValueOnce(null); // api-wed check

      await service.submitDraft('inv-1', mockRes as Response);
      
      expect(mockPrisma.invitationSlug.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ slug: 'ap-i' })
      }));
    });
  });

  describe('getBySlug', () => {
    it('should return NOT_FOUND if slug does not exist', async () => {
      mockPrisma.invitationSlug.findUnique.mockResolvedValue(null);
      const res = await service.getBySlug('non-existent');
      expect(res.type).toBe('NOT_FOUND');
    });

    it('should return LEGACY_SLUG if isCurrent is false', async () => {
      mockPrisma.invitationSlug.findUnique.mockResolvedValue({
        slug: 'old-slug',
        isCurrent: false,
        invitationId: 'inv-1'
      });
      mockPrisma.invitationSlug.findFirst.mockResolvedValue({
        slug: 'new-slug',
        isCurrent: true
      });
      const res = await service.getBySlug('old-slug');
      expect(res.type).toBe('LEGACY_SLUG');
      expect((res as any).canonicalSlug).toBe('new-slug');
    });

    it('should return NOT_FOUND if invitation is not ACTIVE', async () => {
      mockPrisma.invitationSlug.findUnique.mockResolvedValue({
        slug: 'slug',
        isCurrent: true,
        invitation: { status: InvitationStatus.DRAFT, deletedAt: null }
      });
      const res = await service.getBySlug('slug');
      expect(res.type).toBe('NOT_FOUND');
    });

    it('should return NOT_FOUND if invitation is expired', async () => {
      mockPrisma.invitationSlug.findUnique.mockResolvedValue({
        slug: 'slug',
        isCurrent: true,
        invitation: { 
          status: InvitationStatus.ACTIVE, 
          deletedAt: null,
          expiresAt: new Date(Date.now() - 10000) // Past date
        }
      });
      const res = await service.getBySlug('slug');
      expect(res.type).toBe('NOT_FOUND');
    });

    it('should strip customerPhone and internal IDs from public DTO', async () => {
      mockPrisma.invitationSlug.findUnique.mockResolvedValue({
        slug: 'slug',
        isCurrent: true,
        invitation: {
          id: 'secret-id',
          status: InvitationStatus.ACTIVE,
          deletedAt: null,
          expiresAt: null,
          customerPhone: '123456789',
          groomName: 'Groom',
          brideName: 'Bride',
          template: { id: 'temp-1', name: 'Temp', slug: 'temp' },
          media: []
        }
      });
      const res = await service.getBySlug('slug');
      expect(res.type).toBe('FOUND');
      
      const data = (res as any).data;
      expect(data.customerPhone).toBeUndefined();
      expect(data.id).toBeUndefined();
      expect(data.groomName).toBe('Groom');
    });
  });
});
