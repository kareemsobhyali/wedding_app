import { prisma } from './prisma';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { cookies } from 'next/headers';

export async function hashPassword(plain: string): Promise<string> {
  return await argon2.hash(plain);
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    return false;
  }
}

export function generateTokenHash(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export async function createAdminSession(adminUserId: string, ipAddress?: string, userAgent?: string) {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = generateTokenHash(rawToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7-day session

  await prisma.adminSession.create({
    data: {
      adminUserId,
      tokenHash,
      expiresAt,
      ipAddress,
      userAgent,
    },
  });

  await prisma.adminUser.update({
    where: { id: adminUserId },
    data: { lastLoginAt: new Date() },
  });

  return { rawToken, expiresAt };
}

export async function validateAdminSessionToken(rawToken: string) {
  if (!rawToken) return null;
  const tokenHash = generateTokenHash(rawToken);

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash },
    include: { adminUser: true },
  });

  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    return null;
  }

  if (!session.adminUser || !session.adminUser.isActive) {
    return null;
  }

  return session.adminUser;
}

export async function getAdminFromRequest(req?: Request) {
  let token: string | undefined;

  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) {
    try {
      const cookieStore = cookies();
      token = cookieStore.get('admin_session')?.value;
    } catch {
      // ignore
    }
  }

  if (!token && req) {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/admin_session=([^;]+)/);
    if (match) {
      token = match[1];
    }
  }

  if (!token) return null;
  return await validateAdminSessionToken(token);
}

export async function getAdminFromCookies() {
  return await getAdminFromRequest();
}

export async function revokeAdminSession(rawToken: string) {
  if (!rawToken) return;
  const tokenHash = generateTokenHash(rawToken);
  await prisma.adminSession.updateMany({
    where: { tokenHash },
    data: { revokedAt: new Date() },
  });
}
