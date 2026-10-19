import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import * as crypto from 'crypto';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cookieStore = cookies();
    const rawToken = (authHeader && authHeader.startsWith('Bearer ')) 
      ? authHeader.substring(7) 
      : cookieStore.get('draft_session')?.value;

    if (!rawToken) {
      return NextResponse.json({ message: 'Session token required' }, { status: 401 });
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const session = await prisma.draftSession.findUnique({
      where: { tokenHash },
      include: { invitation: true }
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      return NextResponse.json({ message: 'Session invalid or expired' }, { status: 401 });
    }

    const body = await req.json();
    const { url, type = 'IMAGE', role = 'COVER' } = body;

    if (!url) {
      return NextResponse.json({ message: 'URL is required' }, { status: 400 });
    }

    const media = await prisma.media.create({
      data: {
        invitationId: session.invitationId,
        type: type === 'AUDIO' ? 'AUDIO' : 'IMAGE',
        role: role === 'ORIGINAL' ? 'ORIGINAL' : 'COVER',
        storageKey: url,
        originalFilename: url.split('/').pop() || 'media',
        isCurrent: true,
      }
    });

    return NextResponse.json({
      success: true,
      data: media
    });
  } catch (error: any) {
    console.error('Error linking media:', error);
    return NextResponse.json({ message: error.message || 'Failed to link media' }, { status: 500 });
  }
}
