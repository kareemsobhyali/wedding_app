import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getAdminFromCookies } from '../../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const counts = await prisma.invitation.groupBy({
      by: ['status'],
      _count: true,
      where: { deletedAt: null }
    });

    const summary: Record<string, number> = {
      TOTAL: 0,
      DRAFT: 0,
      PENDING_REVIEW: 0,
      ACTIVE: 0,
      DISABLED: 0,
      EXPIRED: 0,
      ARCHIVED: 0,
    };

    counts.forEach((c: any) => {
      summary[c.status] = c._count;
      summary.TOTAL += c._count;
    });

    const recentSubmissions = await prisma.invitation.findMany({
      where: { status: 'PENDING_REVIEW', deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { id: true, groomName: true, brideName: true, customerPhone: true, updatedAt: true }
    });

    return NextResponse.json({
      success: true,
      data: { summary, recentSubmissions }
    });
  } catch (error: any) {
    console.error('Error fetching dashboard summary:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch summary' }, { status: 500 });
  }
}
