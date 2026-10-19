import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import * as crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { templateId } = body;

    if (!templateId) {
      return NextResponse.json({ message: 'Template ID is required' }, { status: 400 });
    }

    // 1. Find or auto-upsert template in DB
    let template = await prisma.template.findFirst({
      where: {
        OR: [
          { id: templateId },
          { slug: templateId }
        ]
      }
    });

    if (!template) {
      // Auto-create template entry so user never gets blocked by empty DB
      template = await prisma.template.create({
        data: {
          name: templateId,
          slug: templateId,
          description: 'Wedding Invitation Template',
          sortOrder: 0
        }
      });
    }

    // 2. Generate raw draft session token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    // 3. Create Invitation in Draft status
    const invitation = await prisma.invitation.create({
      data: {
        status: 'DRAFT',
        template: { connect: { id: template.id } },
        groomName: '',
        brideName: '',
        venueName: '',
        customerPhone: '',
        weddingDate: new Date(),
        customData: {}
      }
    });

    // 4. Create Draft Session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    await prisma.draftSession.create({
      data: {
        invitationId: invitation.id,
        tokenHash,
        expiresAt,
      }
    });

    const response = NextResponse.json({
      success: true,
      data: {
        id: invitation.id,
        version: invitation.version,
        status: invitation.status,
        draftSessionToken: rawToken
      },
      draftSessionToken: rawToken
    });

    // 5. Set draft_session cookie
    response.cookies.set('draft_session', rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt
    });

    return response;
  } catch (error: any) {
    console.error('Error starting invitation draft:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to start draft' },
      { status: 500 }
    );
  }
}
