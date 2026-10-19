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

    const cleanEmail = email.trim().toLowerCase();

    // 1. Find user in database
    let user = await prisma.adminUser.findUnique({
      where: { email: cleanEmail }
    });

    // If no admin exists yet in database, auto-provision default admin
    if (!user) {
      const defaultEmail = process.env.SEED_ADMIN_EMAIL || 'admin@wedding.com';
      if (cleanEmail === defaultEmail.toLowerCase()) {
        const defaultPassword = process.env.SEED_ADMIN_PASSWORD || 'super-secure-password';
        const passwordHash = await hashPassword(defaultPassword);
        user = await prisma.adminUser.create({
          data: {
            email: defaultEmail,
            name: 'System Admin',
            passwordHash,
            isActive: true
          }
        });
      }
    }

    if (!user || !user.isActive) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    // 2. Verify password
    const isValid = await verifyPassword(user.passwordHash, password);
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    // 3. Create Session
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

    // 4. Set admin_session HTTP-only cookie
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
