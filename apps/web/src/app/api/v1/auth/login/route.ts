import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { verifyPassword, createAdminSession, hashPassword } from '../../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const cleanInput = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    // Read environment variables configured in Render or local .env
    const envAdminEmail = (process.env.ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL || 'admin@wedding.com').trim().toLowerCase();
    const envAdminPassword = (process.env.ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD || 'admin123456').trim();
    const envAdminUser = (process.env.ADMIN_USER || process.env.ADMIN_USERNAME || envAdminEmail.split('@')[0] || 'admin').trim().toLowerCase();

    // Check if the input identifier matches the environment admin
    const isEnvAdminIdentifier = 
      cleanInput === envAdminEmail ||
      cleanInput === envAdminUser ||
      (cleanInput === 'admin' && envAdminEmail.startsWith('admin@'));

    // Check if the provided password matches the environment admin password
    const matchesEnvPassword = isEnvAdminIdentifier && cleanPassword === envAdminPassword;

    // 1. Find user in database by either input or configured admin email
    let user = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email: cleanInput },
          ...(isEnvAdminIdentifier ? [{ email: envAdminEmail }] : [])
        ]
      }
    });

    if (matchesEnvPassword) {
      // Direct match with environment variables!
      const passwordHash = await hashPassword(envAdminPassword);
      if (!user) {
        // Auto-provision admin user in database
        user = await prisma.adminUser.create({
          data: {
            email: envAdminEmail,
            name: 'System Admin',
            passwordHash,
            isActive: true
          }
        });
      } else {
        // Ensure user is active and password hash in DB is synced with Render's ADMIN_PASSWORD
        user = await prisma.adminUser.update({
          where: { id: user.id },
          data: {
            passwordHash,
            isActive: true
          }
        });
      }
    } else {
      // Verify against database password hash
      if (!user || !user.isActive) {
        return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
      }

      const isValid = await verifyPassword(user.passwordHash, cleanPassword);
      if (!isValid) {
        return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
      }
    }

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    // 2. Create Session
    const ip = req.headers.get('x-forwarded-for') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;
    const { rawToken, expiresAt } = await createAdminSession(user.id, ip, userAgent);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

    // 3. Set admin_session HTTP-only cookie
    response.cookies.set('admin_session', rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt
    });

    return response;
  } catch (error: any) {
    console.error('Error during admin login:', error);
    return NextResponse.json({ message: error.message || 'Login failed' }, { status: 500 });
  }
}
