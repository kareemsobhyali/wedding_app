import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../../lib/prisma';
import * as crypto from 'crypto';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

function generateSlugCandidate(groom: string, bride: string): string {
  const clean = `${groom}-${bride}`
    .trim()
    .toLowerCase()
    .replace(/[^\u0621-\u064Aa-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return clean || `wedding-${Date.now().toString(36)}`;
}

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
      return NextResponse.json({ message: 'Draft session invalid or expired' }, { status: 401 });
    }

    const inv = session.invitation;
    if (inv.status !== 'DRAFT') {
      return NextResponse.json({ message: 'Invitation is already submitted' }, { status: 400 });
    }

    // Generate unique slug
    let baseSlug = generateSlugCandidate(inv.groomName || 'wedding', inv.brideName || 'celebration');
    let finalSlug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.invitationSlug.findUnique({ where: { slug: finalSlug } });
      if (!existing) break;
      finalSlug = `${baseSlug}-${counter++}`;
    }

    // Submit invitation & create slug
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Create Slug
      await tx.invitationSlug.create({
        data: {
          invitationId: inv.id,
          slug: finalSlug,
          isCurrent: true
        }
      });

      // 2. Update Invitation status
      const saved = await tx.invitation.update({
        where: { id: inv.id },
        data: {
          status: 'PENDING_REVIEW',
          submittedAt: new Date()
        }
      });

      // 3. Revoke draft session
      await tx.draftSession.update({
        where: { id: session.id },
        data: { revokedAt: new Date() }
      });

      return saved;
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation submitted successfully',
      data: {
        id: updated.id,
        slug: finalSlug,
        status: updated.status
      }
    });
  } catch (error: any) {
    console.error('Error submitting draft:', error);
    return NextResponse.json({ message: error.message || 'Failed to submit invitation' }, { status: 500 });
  }
}
