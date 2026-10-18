import { DraftAuthGuard } from './draft-auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

describe('DraftAuthGuard', () => {
  let guard: DraftAuthGuard;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      draftSession: {
        findUnique: jest.fn(),
        update: jest.fn().mockResolvedValue({}),
      },
    };
    guard = new DraftAuthGuard(mockPrisma);
  });

  it('should throw Unauthorized if cookie is missing', async () => {
    const mockContext: any = {
      switchToHttp: () => ({
        getRequest: () => ({ cookies: {} }),
      }),
    };
    
    await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
  });

  it('should hash the cookie and query the database', async () => {
    const mockRawToken = 'test-token-123';
    const mockHash = crypto.createHash('sha256').update(mockRawToken).digest('hex');

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    mockPrisma.draftSession.findUnique.mockResolvedValue({
      id: 'session-1',
      invitationId: 'inv-1',
      expiresAt: futureDate,
      revokedAt: null,
    });

    const mockRequest: any = { cookies: { draft_session: mockRawToken } };
    const mockContext: any = {
      switchToHttp: () => ({ getRequest: () => mockRequest }),
    };

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockPrisma.draftSession.findUnique).toHaveBeenCalledWith({ where: { tokenHash: mockHash } });
    expect(mockRequest.currentInvitationId).toBe('inv-1');
  });

  it('should throw Unauthorized if session is expired', async () => {
    const mockRawToken = 'test-token-123';
    
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    mockPrisma.draftSession.findUnique.mockResolvedValue({
      id: 'session-1',
      invitationId: 'inv-1',
      expiresAt: pastDate,
      revokedAt: null,
    });

    const mockContext: any = {
      switchToHttp: () => ({
        getRequest: () => ({ cookies: { draft_session: mockRawToken } }),
      }),
    };

    await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
  });
});
