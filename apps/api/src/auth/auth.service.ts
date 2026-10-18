import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const email = loginDto.email.trim().toLowerCase();
    
    // Find active user
    const user = await this.prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.passwordHash, loginDto.password);
    if (!isPasswordValid) {
      // Avoid time-based enumeration attacks by always doing the argon2 hash even if user doesn't exist?
      // For V1, the generic error message suffices.
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Generate secure session token (raw token for cookie)
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    // Create session in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days session

    await this.prisma.adminSession.create({
      data: {
        adminUserId: user.id,
        tokenHash,
        expiresAt,
        ipAddress,
        userAgent,
      },
    });

    // Update last login
    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    
    // Audit log
    await this.prisma.auditLog.create({
      data: {
        adminUserId: user.id,
        action: 'ADMIN_LOGIN',
        entityType: 'AdminUser',
        entityId: user.id,
        ipAddress,
        userAgent
      }
    });

    return {
      rawToken,
      expiresAt,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async logout(token: string) {
    if (!token) return;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const session = await this.prisma.adminSession.findUnique({ where: { tokenHash } });
    if (session) {
      await this.prisma.adminSession.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });
      
      await this.prisma.auditLog.create({
        data: {
          adminUserId: session.adminUserId,
          action: 'ADMIN_LOGOUT',
          entityType: 'AdminUser',
          entityId: session.adminUserId,
        }
      });
    }
  }

  async validateSession(token: string) {
    if (!token) throw new UnauthorizedException();
    
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const session = await this.prisma.adminSession.findUnique({
      where: { tokenHash },
      include: { adminUser: true },
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException();
    }

    if (!session.adminUser.isActive) {
      throw new UnauthorizedException();
    }

    // Update last used at in background (fire and forget to not block request)
    this.prisma.adminSession.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() }
    }).catch(e => this.logger.error('Failed to update session lastUsedAt', e));

    return {
      id: session.adminUser.id,
      email: session.adminUser.email,
      name: session.adminUser.name,
    };
  }
}
