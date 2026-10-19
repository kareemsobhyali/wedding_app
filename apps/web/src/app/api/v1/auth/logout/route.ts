import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revokeAdminSession } from '../../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (token) {
    await revokeAdminSession(token);
  }

  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('admin_session');
  return response;
}
