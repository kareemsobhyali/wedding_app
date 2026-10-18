import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { AnalyticsEventType, InvitationStatus } from '@prisma/client';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let mockPrisma: any;
  let mockReq: any;
  let mockRes: any;

  beforeEach(async () => {
    mockPrisma = {
      invitationSlug: { findUnique: jest.fn() },
      analyticsEvent: { create: jest.fn().mockResolvedValue({}), groupBy: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() }
    };

    mockReq = { cookies: {} };
    mockRes = { cookie: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: mockPrisma }
      ]
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('rejects invalid event type silently', async () => {
    const res = await service.trackEvent(mockReq, mockRes, 'slug', 'INVALID_EVENT');
    expect(res.success).toBe(false);
  });

  it('resolves new visitor ID if missing and creates event', async () => {
    mockPrisma.invitationSlug.findUnique.mockResolvedValue({
      invitation: { id: 'inv-1', status: InvitationStatus.ACTIVE, deletedAt: null, expiresAt: null }
    });

    const res = await service.trackEvent(mockReq, mockRes, 'slug', 'VIEW');
    
    expect(mockRes.cookie).toHaveBeenCalledWith('visitor_id', expect.any(String), expect.objectContaining({ httpOnly: true }));
    expect(res.success).toBe(true);
    expect(mockPrisma.analyticsEvent.create).toHaveBeenCalled();
  });

  it('rejects inactive invitation', async () => {
    mockPrisma.invitationSlug.findUnique.mockResolvedValue({
      invitation: { id: 'inv-1', status: InvitationStatus.DRAFT, deletedAt: null, expiresAt: null }
    });

    const res = await service.trackEvent(mockReq, mockRes, 'slug', 'VIEW');
    expect(res.success).toBe(false);
    expect(mockPrisma.analyticsEvent.create).not.toHaveBeenCalled();
  });

  it('deduplicates immediate repeating events for same visitor', async () => {
    mockPrisma.invitationSlug.findUnique.mockResolvedValue({
      invitation: { id: 'inv-1', status: InvitationStatus.ACTIVE, deletedAt: null, expiresAt: null }
    });

    mockReq.cookies['visitor_id'] = 'known-visitor';
    
    // First track
    const res1 = await service.trackEvent(mockReq, mockRes, 'slug', 'VIEW');
    expect(res1.success).toBe(true);
    expect(mockPrisma.analyticsEvent.create).toHaveBeenCalledTimes(1);

    // Second track immediately
    const res2 = await service.trackEvent(mockReq, mockRes, 'slug', 'VIEW');
    expect(res2.success).toBe(true);
    expect((res2 as any).deduped).toBe(true);
    expect(mockPrisma.analyticsEvent.create).toHaveBeenCalledTimes(1); // Still 1
  });
});
