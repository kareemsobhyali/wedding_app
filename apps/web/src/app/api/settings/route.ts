import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { getSettings } from '@/lib/settings';

const settingsFile = path.join(process.cwd(), 'landing-settings.json');

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function POST(req: Request) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    fs.writeFileSync(settingsFile, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true, data: body });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
