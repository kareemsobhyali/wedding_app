"use client";

// Simple frontend analytics client

export class AnalyticsClient {
  private slug: string;
  private isPublic: boolean;
  private apiUrl: string;

  constructor(slug: string, isPublic: boolean) {
    this.slug = slug;
    this.isPublic = isPublic;
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
  }

  track(eventType: string) {
    // Isolated failure, silent
    if (!this.isPublic) return;

    try {
      fetch(`${this.apiUrl}/public/analytics/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitationSlug: this.slug,
          eventType
        }),
        // Avoid blocking unload if possible
        keepalive: true,
      }).catch((e) => {
        // Silently swallow network failures to prevent UI breakage
        console.debug('Analytics event failed', e);
      });
    } catch (e) {
      // Catch any unexpected exceptions
      console.debug('Analytics error', e);
    }
  }
}
