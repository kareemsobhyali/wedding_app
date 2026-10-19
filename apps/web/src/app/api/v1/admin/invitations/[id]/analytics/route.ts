import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';
import { AnalyticsEventType } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const daysStr = searchParams.get('days');
    const where: any = { invitationId: params.id };

    if (daysStr) {
      const days = parseInt(daysStr, 10);
      if (!isNaN(days) && days > 0) {
        const d = new Date();
        d.setDate(d.getDate() - days);
        where.timestamp = { gte: d };
      }
    }

    const events = await prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      where,
      _count: true
    });

    const uniqueVisitorsResult = await prisma.analyticsEvent.findMany({
      where,
      select: { visitorId: true },
      distinct: ['visitorId']
    });

    const lastVisitEvent = await prisma.analyticsEvent.findFirst({
      where: { invitationId: params.id, eventType: AnalyticsEventType.VIEW },
      orderBy: { timestamp: 'desc' },
      select: { timestamp: true }
    });

    const metrics = {
      totalViews: 0,
      uniqueVisitors: uniqueVisitorsResult.length,
      musicPlays: 0,
      mapClicks: 0,
      groomContactClicks: 0,
      brideContactClicks: 0,
      shares: 0,
      lastVisit: lastVisitEvent?.timestamp || null
    };

    events.forEach((e: any) => {
      switch (e.eventType) {
        case AnalyticsEventType.VIEW:
          metrics.totalViews = e._count;
          break;
        case AnalyticsEventType.MUSIC_PLAY:
          metrics.musicPlays = e._count;
          break;
        case AnalyticsEventType.MAP_CLICK:
          metrics.mapClicks = e._count;
          break;
        case AnalyticsEventType.GROOM_CONTACT:
          metrics.groomContactClicks = e._count;
          break;
        case AnalyticsEventType.BRIDE_CONTACT:
          metrics.brideContactClicks = e._count;
          break;
        case AnalyticsEventType.SHARE:
          metrics.shares = e._count;
          break;
      }
    });

    return NextResponse.json({ data: metrics, ...metrics });
  } catch (error: any) {
    console.error('Error fetching invitation analytics:', error);
    return NextResponse.json({ message: 'Failed to fetch analytics', error: error.message }, { status: 500 });
  }
}
