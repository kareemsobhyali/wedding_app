import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AnalyticsEventType, InvitationStatus } from '@prisma/client';
import { Request, Response } from 'express';
import { randomBytes } from 'crypto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  
  // Basic in-memory deduplication for V1
  // Structure: { [visitorId_invitationId_eventType]: timestamp }
  private readonly dedupeCache = new Map<string, number>();
  private readonly DEDUPE_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

  constructor(private readonly prisma: PrismaService) {}

  private resolveVisitorId(req: Request, res: Response): string {
    let visitorId = req.cookies['visitor_id'];
    if (!visitorId) {
      visitorId = randomBytes(16).toString('hex');
      res.cookie('visitor_id', visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
    }
    return visitorId;
  }

  async trackEvent(req: Request, res: Response, slug: string, eventTypeStr: string) {
    try {
      if (!slug || typeof slug !== 'string') throw new BadRequestException('Invalid slug');
      
      const allowedEvents = Object.values(AnalyticsEventType);
      if (!allowedEvents.includes(eventTypeStr as AnalyticsEventType)) {
        throw new BadRequestException('Invalid event type');
      }
      const eventType = eventTypeStr as AnalyticsEventType;

      // Resolve visitor
      const visitorId = this.resolveVisitorId(req, res);

      // Check deduplication
      const cacheKey = `${visitorId}_${slug}_${eventType}`;
      const lastSeen = this.dedupeCache.get(cacheKey);
      const now = Date.now();
      
      if (lastSeen && (now - lastSeen) < this.DEDUPE_WINDOW_MS) {
        return { success: true, deduped: true }; // Silently ignore duplicate
      }

      // Resolve active invitation
      const slugRecord = await this.prisma.invitationSlug.findUnique({
        where: { slug },
        include: { invitation: { select: { id: true, status: true, deletedAt: true, expiresAt: true } } }
      });

      if (!slugRecord) throw new NotFoundException('Not found');
      
      const inv = slugRecord.invitation;
      if (
        inv.status !== InvitationStatus.ACTIVE || 
        inv.deletedAt !== null ||
        (inv.expiresAt && new Date(inv.expiresAt) < new Date())
      ) {
        throw new BadRequestException('Invitation is not active');
      }

      // Update dedupe cache
      this.dedupeCache.set(cacheKey, now);

      // We do not block the request for the DB insert
      this.prisma.analyticsEvent.create({
        data: {
          invitationId: inv.id,
          eventType,
          visitorId,
          // userAgent and ipAddress can be omitted for privacy, as requested
        }
      }).catch(err => {
        this.logger.error(`Failed to insert analytics event: ${err.message}`);
      });

      // Cleanup cache occasionally (simple approach)
      if (this.dedupeCache.size > 10000) {
        const threshold = now - this.DEDUPE_WINDOW_MS;
        for (const [k, v] of this.dedupeCache.entries()) {
          if (v < threshold) this.dedupeCache.delete(k);
        }
      }

      return { success: true };
    } catch (err: any) {
      this.logger.error(`Analytics ingestion failed: ${err.message}`);
      // Always return 200/202 to the browser so it doesn't log scary errors for end-users, 
      // but for strict REST it's fine to return errors if they are well formed.
      // Requirements: "Analytics errors must be isolated. Never show an analytics error to the public visitor."
      // If we throw, NestJS will return 4xx/5xx to client. 
      // Let's just return a generic success shape instead of failing the request, to make it silent.
      return { success: false };
    }
  }

  async getAdminAggregates() {
    const events = await this.prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      _count: true
    });

    // Unique visitors global
    const uniqueVisitorsResult = await this.prisma.analyticsEvent.findMany({
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

    events.forEach(e => {
      switch(e.eventType) {
        case AnalyticsEventType.VIEW: aggregates.TOTAL_VIEWS = e._count; break;
        case AnalyticsEventType.MUSIC_PLAY: aggregates.MUSIC_PLAYS = e._count; break;
        case AnalyticsEventType.MAP_CLICK: aggregates.MAP_CLICKS = e._count; break;
        case AnalyticsEventType.GROOM_CONTACT:
        case AnalyticsEventType.BRIDE_CONTACT: 
          aggregates.CONTACT_CLICKS += e._count; 
          break;
        case AnalyticsEventType.SHARE: aggregates.SHARES = e._count; break;
      }
    });

    return aggregates;
  }

  async getInvitationAnalytics(invitationId: string, days?: number) {
    const where: any = { invitationId };
    if (days) {
      const d = new Date();
      d.setDate(d.getDate() - days);
      where.timestamp = { gte: d };
    }

    const events = await this.prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      where,
      _count: true
    });

    const uniqueVisitorsResult = await this.prisma.analyticsEvent.findMany({
      where,
      select: { visitorId: true },
      distinct: ['visitorId']
    });

    const lastVisitEvent = await this.prisma.analyticsEvent.findFirst({
      where: { invitationId, eventType: AnalyticsEventType.VIEW },
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

    events.forEach(e => {
      switch(e.eventType) {
        case AnalyticsEventType.VIEW: metrics.totalViews = e._count; break;
        case AnalyticsEventType.MUSIC_PLAY: metrics.musicPlays = e._count; break;
        case AnalyticsEventType.MAP_CLICK: metrics.mapClicks = e._count; break;
        case AnalyticsEventType.GROOM_CONTACT: metrics.groomContactClicks = e._count; break;
        case AnalyticsEventType.BRIDE_CONTACT: metrics.brideContactClicks = e._count; break;
        case AnalyticsEventType.SHARE: metrics.shares = e._count; break;
      }
    });

    return metrics;
  }
}
