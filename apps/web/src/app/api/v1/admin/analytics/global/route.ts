import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';
import { AnalyticsEventType } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const events = await prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      _count: true
    });

    const uniqueVisitorsResult = await prisma.analyticsEvent.findMany({
      select: { visitorId: true },
      distinct: ['visitorId']
    });

    const aggregates: Record<string, number> = {
      TOTAL_VIEWS: 0,
      UNIQUE_VISITORS: uniqueVisitorsResult.length,
      MUSIC_PLAYS: 0,
      MAP_CLICKS: 0,
      CONTACT_CLICKS: 0,
      SHARES: 0
    };

    events.forEach((e) => {
      switch (e.eventType) {
        case AnalyticsEventType.VIEW:
          aggregates.TOTAL_VIEWS = e._count;
          break;
        case AnalyticsEventType.MUSIC_PLAY:
          aggregates.MUSIC_PLAYS = e._count;
          break;
        case AnalyticsEventType.MAP_CLICK:
          aggregates.MAP_CLICKS = e._count;
          break;
        case AnalyticsEventType.GROOM_CONTACT:
        case AnalyticsEventType.BRIDE_CONTACT:
          aggregates.CONTACT_CLICKS += e._count;
          break;
        case AnalyticsEventType.SHARE:
          aggregates.SHARES = e._count;
          break;
      }
    });

    return NextResponse.json({ data: aggregates, ...aggregates });
  } catch (error: any) {
    console.error('Error fetching global analytics:', error);
    return NextResponse.json({ message: 'Failed to fetch global analytics', error: error.message }, { status: 500 });
  }
}
