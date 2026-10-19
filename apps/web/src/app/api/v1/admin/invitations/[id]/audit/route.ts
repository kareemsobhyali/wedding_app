import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const take = 20;
    const skip = (page - 1) * take;

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: { entityId: params.id, entityType: 'INVITATION' },
        orderBy: { timestamp: 'desc' },
        skip,
        take,
      }),
      prisma.auditLog.count({ where: { entityId: params.id, entityType: 'INVITATION' } })
    ]);

    return NextResponse.json({
      data: { items, total, page, totalPages: Math.ceil(total / take) },
      items,
      total,
      page,
      totalPages: Math.ceil(total / take)
    });
  } catch (error: any) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ message: 'Failed to fetch audit logs', error: error.message }, { status: 500 });
  }
}
