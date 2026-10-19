import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AnalyticsEventType, InvitationStatus } from '@prisma/client';
import crypto from 'crypto';

const dedupeCache = new Map<string, number>();
const DEDUPE_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const slug = body.invitationSlug || body.slug;
    const eventTypeStr = body.eventType;

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ success: false, message: 'Invalid slug' }, { status: 400 });
    }

    const allowedEvents = Object.values(AnalyticsEventType);
    if (!allowedEvents.includes(eventTypeStr as AnalyticsEventType)) {
      return NextResponse.json({ success: false, message: 'Invalid event type' }, { status: 400 });
    }
    const eventType = eventTypeStr as AnalyticsEventType;

    // Resolve or generate visitorId
    let visitorId = req.cookies.get('visitor_id')?.value;
    let shouldSetCookie = false;
    if (!visitorId) {
      visitorId = crypto.randomBytes(16).toString('hex');
      shouldSetCookie = true;
    }

    // Deduplication check
    const cacheKey = `${visitorId}_${slug}_${eventType}`;
    const now = Date.now();
    const lastSeen = dedupeCache.get(cacheKey);

    if (lastSeen && now - lastSeen < DEDUPE_WINDOW_MS) {
      const response = NextResponse.json({ success: true, deduped: true });
      if (shouldSetCookie) {
        response.cookies.set('visitor_id', visitorId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60,
        });
      }
      return response;
    }

    // Find invitation by slug
    const slugRecord = await prisma.invitationSlug.findUnique({
      where: { slug },
      include: { invitation: { select: { id: true, status: true, deletedAt: true, expiresAt: true } } }
    });

    if (!slugRecord || !slugRecord.invitation) {
      return NextResponse.json({ success: false, message: 'Invitation not found' }, { status: 404 });
    }

    const inv = slugRecord.invitation;
    if (
      inv.status !== InvitationStatus.ACTIVE ||
      inv.deletedAt !== null ||
      (inv.expiresAt && new Date(inv.expiresAt) < new Date())
    ) {
      return NextResponse.json({ success: false, message: 'Invitation is not active' }, { status: 400 });
    }

    // Update dedupe cache
    dedupeCache.set(cacheKey, now);

    // Save event asynchronously
    prisma.analyticsEvent.create({
      data: {
        invitationId: inv.id,
        eventType,
        visitorId,
      }
    }).catch((err) => {
      console.error('Failed to insert analytics event:', err.message);
    });

    // Cleanup dedupeCache if too large
    if (dedupeCache.size > 5000) {
      const threshold = now - DEDUPE_WINDOW_MS;
      for (const [k, v] of dedupeCache.entries()) {
        if (v < threshold) dedupeCache.delete(k);
      }
    }

    const response = NextResponse.json({ success: true });
    if (shouldSetCookie) {
      response.cookies.set('visitor_id', visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
      });
    }
    return response;
  } catch (error: any) {
    console.error('Analytics tracking error:', error);
    // Never show an analytics error to public visitors
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
