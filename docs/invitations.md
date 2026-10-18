# Invitations & Draft Workflow (Phase 7)

This document describes the customer-facing workflow for creating and submitting wedding invitations.
The core architectural principle is that **customers do not have accounts or persistent logins.**

## Customer Draft Session Architecture
Since there are no accounts, we rely on a secure `DraftSession` to track ownership of an in-progress invitation.
1. **Creation**: When a customer selects a template via `POST /api/v1/public/invitations`, the system creates an `Invitation` (status `DRAFT`) and a `DraftSession`.
2. **Security**: 
   - A raw 32-byte cryptographically secure token is generated.
   - The SHA-256 hash is stored in PostgreSQL.
   - The raw token is sent to the client via an `HttpOnly`, `SameSite=Lax`, `Secure` cookie named `draft_session`.
   - The cookie expires automatically in 14 days.
3. **Guard**: `DraftAuthGuard` authenticates all draft endpoints (`PATCH`, `GET`, Media). It extracts the cookie, hashes it, verifies it against the DB, and injects `currentInvitationId` into the Request pipeline.
4. **No URL Identifiers**: The UUID of the draft is never used as an authorization mechanism in the URL, preventing IDOR attacks.

## Draft Recovery
Because the session is an `HttpOnly` cookie, if the customer refreshes the page, the frontend calls `GET /api/v1/public/invitations/draft`. The API automatically resolves the cookie to the draft, allowing seamless session recovery without forcing the user to log in.

## Autosave & Optimistic Concurrency
To prevent data loss and race conditions when multiple autosaves fire:
- The `Invitation` model uses a `version` integer.
- The frontend debounces changes and calls `PATCH /api/v1/public/invitations/draft` with the current `version`.
- The database executes an atomic `UPDATE Invitation SET version = version + 1 WHERE id = X AND version = clientVersion`.
- If the client is out-of-sync (e.g. another tab saved newer data), the API returns `409 Conflict`.

## Submission & Lock
When the customer submits via `POST /api/v1/public/invitations/submit`:
1. The API strictly validates that all required fields are present.
2. The invitation status is moved from `DRAFT` to `PENDING_REVIEW` atomically.
3. A unique, admin-friendly `slug` is generated and assigned.
4. The `DraftSession` is permanently revoked and the cookie cleared. 
5. Any subsequent attempts to PATCH the invitation using the old cookie will return `401/403`. 
The customer can no longer edit the invitation; it is locked for Admin review.

## Data Privacy Definitions
- **`customerPhone`**: The private contact number the customer used to create the draft. This is for admin communication only. It is **never** rendered publicly.
- **`groomContact` / `brideContact`**: Optional fields the customer can fill out if they want guests to contact them (e.g. via WhatsApp). These are safe for public rendering.

## Media Ownership & Editing
Customer uploads go directly to Cloudflare R2 via presigned URLs.
- The `DraftAuthGuard` ensures customers can only request presigned URLs scoped to their `currentInvitationId`.
- **Image Editing**: Future UI croppers/rotators should generate new presigned uploads for the *derivative* image. The original uploaded image is never destroyed.
- **Gallery Ordering**: `PATCH /api/v1/public/media/:id/order` allows updating `Media.sortOrder`.
