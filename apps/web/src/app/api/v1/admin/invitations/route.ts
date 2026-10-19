import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';
import { InvitationStatus, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const sort = searchParams.get('sort') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder')?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const skip = (page - 1) * limit;
    const where: Prisma.InvitationWhereInput = { deletedAt: null };

    if (status && Object.values(InvitationStatus).includes(status as InvitationStatus)) {
      where.status = status as InvitationStatus;
    }

    if (search) {
      where.OR = [
        { groomName: { contains: search, mode: 'insensitive' } },
        { brideName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search } },
        { slugs: { some: { slug: { contains: search, mode: 'insensitive' }, isCurrent: true } } }
      ];
    }

    const validSortFields = ['createdAt', 'updatedAt', 'weddingDate', 'groomName', 'brideName', 'status'];
    const orderByField = validSortFields.includes(sort) ? sort : 'createdAt';

    const [items, total] = await Promise.all([
      prisma.invitation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderByField]: sortOrder },
        include: {
          slugs: { where: { isCurrent: true }, select: { slug: true } },
          template: { select: { id: true, name: true, slug: true } }
        }
      }),
      prisma.invitation.count({ where })
    ]);

    const result = {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };

    return NextResponse.json({ data: result, ...result });
  } catch (error: any) {
    console.error('Error fetching admin invitations:', error);
    return NextResponse.json({ message: 'Failed to fetch invitations', error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const result = await prisma.$transaction(async (tx) => {
      let template = null;
      if (body.templateId) {
        template = await tx.template.findFirst({
          where: { OR: [{ id: body.templateId }, { slug: body.templateId }] }
        });
      }
      if (!template) {
        template = await tx.template.findFirst();
      }
      if (!template) {
        template = await tx.template.create({
          data: {
            slug: 'butterfly-elegance',
            name: 'Butterfly Elegance',
            description: 'Luxury interactive wedding invitation',
            isActive: true,
          }
        });
      }

      const created = await tx.invitation.create({
        data: {
          groomName: body.groomName || 'العريس',
          brideName: body.brideName || 'العروس',
          customerPhone: body.customerPhone || '',
          venueName: body.venueName || '',
          venueAddress: body.venueAddress || '',
          weddingDate: body.weddingDate ? new Date(body.weddingDate) : new Date(),
          status: 'DRAFT',
          template: { connect: { id: template.id } },
          version: 1,
        }
      });

      const cleanGroom = (body.groomName || 'g').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanBride = (body.brideName || 'b').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const slugStr = `${cleanGroom || 'g'}-${cleanBride || 'b'}-${Math.random().toString(36).substring(2, 7)}`.replace(/-+/g, '-');

      await tx.invitationSlug.create({
        data: { invitationId: created.id, slug: slugStr, isCurrent: true }
      });

      await tx.auditLog.create({
        data: {
          action: 'INVITATION_CREATED_QUICK',
          adminUserId: admin.id,
          entityType: 'INVITATION',
          entityId: created.id,
          metadata: {}
        }
      });

      return created;
    });

    return NextResponse.json({ data: result, ...result }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating invitation:', error);
    return NextResponse.json({ message: 'Failed to create invitation', error: error.message }, { status: 500 });
  }
}
