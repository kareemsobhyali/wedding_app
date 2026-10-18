import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class DraftAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let rawToken = request.cookies?.['draft_session'];
    if (!rawToken && request.headers.authorization) {
      const authHeader = request.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        rawToken = authHeader.substring(7);
      }
    }

    if (!rawToken) {
      throw new UnauthorizedException('No draft session cookie found');
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const session = await this.prisma.draftSession.findUnique({
      where: { tokenHash },
    });

    if (!session || !!session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired draft session');
    }

    // Attach invitation ID to request safely
    request.currentInvitationId = session.invitationId;
    request.draftSessionId = session.id;

    // Async update lastUsedAt without blocking
    this.prisma.draftSession.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() }
    }).catch(() => {});

    return true;
  }
}
