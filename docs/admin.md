# Admin Dashboard & Invitation Management

## Authentication & Authorization
- The admin dashboard reuses the `AdminSession` token strategy from Phase 3.
- NestJS API routes use `AdminAuthGuard`.
- Next.js Admin Layout performs a fresh server-side check against `/api/v1/auth/me` on mount. It never trusts client cookies blindly.

## State Transitions
Transitions are strictly enforced via a centralized graph:
- `DRAFT` → `PENDING_REVIEW`
- `PENDING_REVIEW` → `ACTIVE`
- `ACTIVE` → `DISABLED`, `EXPIRED`, `ARCHIVED`
- `DISABLED` → `ACTIVE`, `ARCHIVED`
- `EXPIRED` → `ACTIVE`
- `ARCHIVED` → `ACTIVE`

## Activation & Validation
Before an invitation switches to `ACTIVE`, `InvitationPublishValidator` runs. It guarantees:
- Groom/Bride names exist
- Phone/Venue/Dates exist
- Invitation has a canonical Slug
- Template is administratively active
- Expiration is valid (future)
Validation errors are structured so the admin UI can present them gracefully.

## Revalidation Architecture
Because the Next.js cache boundary sits outside NestJS:
- A protected endpoint exists at `POST /api/internal/revalidate`.
- It requires `REVALIDATION_SECRET` as a Bearer token.
- NestJS triggers this endpoint asynchronously inside `triggerRevalidation` immediately following a successful PostgreSQL commit.
- If the revalidation HTTP request fails, the failure is logged and swallowed; the successful database mutation is never rolled back due to secondary cache failures.

## Duplicate Behavior
- Duplicating an invitation starts a fresh `DRAFT`.
- It does **not** copy audit logs, view analytics, or active states.
- Media handling: 
  - To prevent catastrophic shared state when replacing media, the R2 backend issues an explicit server-side object copy (`CopyObjectCommand`) to a brand new storage key (`duplicates/timestamp-filename`).
  - If a media copy fails, the system rolls back successfully copied media within that transaction block and prevents the database from completing the duplication, ensuring zero orphaned records or mangled originals.

## Slug Management
- Admins can rename the canonical slug.
- The new slug takes `isCurrent = true`.
- The legacy slug remains in `InvitationSlug` to facilitate Phase 9 permanent redirects.

## Auditing
- A comprehensive `AuditLog` row is created synchronously in the exact same database `$transaction` for every critical mutation (`UPDATED`, `ACTIVATED`, `DISABLED`, `DUPLICATED`, `DELETED`, `RESTORED`, `SLUG_CHANGED`).
