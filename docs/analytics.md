# Phase 11: Analytics & Tracking

This document outlines the architecture for the lightweight, privacy-conscious analytics tracking system implemented for the Wedding SaaS Platform.

## Goals
- Provide invitation-level and global aggregate analytics (Views, Visitors, Plays, Clicks).
- Ensure privacy: No PII, No raw IPs, No Browser Fingerprinting.
- Ensure reliability: Analytics ingestion is fire-and-forget and gracefully isolated to prevent rendering issues.

## Visitor Identification
A unique `visitor_id` is generated securely (`crypto.randomBytes(16)`) and stored in a first-party HttpOnly cookie.
- **Lifetime**: 30 Days.
- **Privacy**: If a user clears their cookies or uses incognito, they count as a new visitor. This is an accepted tradeoff over fingerprinting.

## Deduplication Strategy
- Analytics events are passed through a basic sliding in-memory cache to prevent accidental double-counts on immediate refreshes. 
- Repeated events (same visitor, same slug, same eventType) within a **30-minute window** are acknowledged as successful but not written to the database.

## Public Ingestion API
- `POST /api/v1/public/analytics/events`
- Only accepts known schemas.
- Validates the target invitation is `ACTIVE`.
- Operates asynchronously (fire-and-forget DB inserts) to return 200 OK immediately.
- Rate-limited natively using NestJS global Throttler module (50 req/min).

## Event Types Supported
- `VIEW`: Emitted on initialization of the public page.
- `MUSIC_PLAY`: Emitted when the AudioPlayer successfully begins playback.
- `MAP_CLICK`: Emitted when the "View on Map" external action is clicked.
- `GROOM_CONTACT` & `BRIDE_CONTACT`: Emitted on clicking external contact actions.
- `SHARE`: Emitted upon successful execution of the Web Share API or Clipboard copy.

## Preview Isolation
`PREVIEW` mode rendering (used during Draft Creation and Admin Dashboard viewing) strictly avoids emitting analytics by branching the event context conditionally.

## Known Limitations
- Data retention is theoretically indefinite unless manually cleaned up (no CRON prune job).
- Analytics metrics are approximate (due to ad blockers, in-memory dedupe drops upon server restarts, and cookie clearance).
