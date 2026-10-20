import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function findInvitationBySlug(slug: string) {
  const slugRecord = await prisma.invitationSlug.findUnique({
    where: { slug },
    include: {
      invitation: true
    }
  });

  return slugRecord?.invitation || null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const inv = await findInvitationBySlug(params.slug);
    if (!inv) {
      return NextResponse.json({ message: 'Invitation not found' }, { status: 404 });
    }

    const custom = (inv.customData as Record<string, any>) || {};
    const guestAliases = custom.guestAliases || {};

    return NextResponse.json({
      success: true,
      guestAliases
    });
  } catch (error) {
    console.error('Error fetching guest aliases:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const inv = await findInvitationBySlug(params.slug);
    if (!inv) {
      return NextResponse.json({ message: 'Invitation not found' }, { status: 404 });
    }

    const body = await req.json();
    const custom = (inv.customData as Record<string, any>) || {};
    const currentAliases: Record<string, string> = { ...(custom.guestAliases || {}) };

    if (body.aliases && typeof body.aliases === 'object') {
      for (const [k, v] of Object.entries(body.aliases)) {
        if (typeof k === 'string' && typeof v === 'string' && k.trim() && v.trim()) {
          currentAliases[k.trim().toLowerCase()] = v.trim();
        }
      }
    } else if (body.code && body.name) {
      const code = String(body.code).trim().toLowerCase();
      const name = String(body.name).trim();
      if (code && name) {
        currentAliases[code] = name;
      }
    }

    const updatedCustomData = {
      ...custom,
      guestAliases: currentAliases
    };

    await prisma.invitation.update({
      where: { id: inv.id },
      data: {
        customData: updatedCustomData
      }
    });

    return NextResponse.json({
      success: true,
      guestAliases: currentAliases
    });
  } catch (error) {
    console.error('Error updating guest aliases:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const inv = await findInvitationBySlug(params.slug);
    if (!inv) {
      return NextResponse.json({ message: 'Invitation not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const codeToDelete = searchParams.get('code')?.trim().toLowerCase();

    if (!codeToDelete) {
      return NextResponse.json({ message: 'Code is required' }, { status: 400 });
    }

    const custom = (inv.customData as Record<string, any>) || {};
    const currentAliases: Record<string, string> = { ...(custom.guestAliases || {}) };

    delete currentAliases[codeToDelete];

    const updatedCustomData = {
      ...custom,
      guestAliases: currentAliases
    };

    await prisma.invitation.update({
      where: { id: inv.id },
      data: {
        customData: updatedCustomData
      }
    });

    return NextResponse.json({
      success: true,
      guestAliases: currentAliases
    });
  } catch (error) {
    console.error('Error deleting guest alias:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
