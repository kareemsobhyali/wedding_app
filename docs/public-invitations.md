# Public Invitation System (Phase 9)

## Routing Architecture

The Next.js App Router exposes the dynamic slug route `apps/web/src/app/[slug]/page.tsx`.

1. **Concrete Route Precedence**: By relying on Next.js standard routing, concrete routes like `/create` and `/api` naturally shadow the dynamic `[slug]` catch-all, mitigating accidental collisions.
2. **Server-Side SEO**: `generateMetadata` makes a server-side fetch to the backend to retrieve the `InvitationRenderData`. It uses this to construct `<title>`, `<meta name="description">`, and `openGraph` tags using only safe, sanitized data (groom/bride names, venue, cover image).
3. **No-Index Guarding**: If the API returns `NOT_FOUND` (which happens for disabled/expired/draft invitations), `generateMetadata` injects `<meta name="robots" content="noindex, nofollow" />`.

## Slug Resolution & Fallbacks

- `GET /api/v1/public/invitations/:slug` performs a strict `isCurrent` lookup.
- If `isCurrent === false`, the API returns `{ type: 'LEGACY_SLUG', canonicalSlug: '...' }` and the Next.js page uses `redirect(canonicalSlug)` to issue a permanent 301.
- If the Invitation is missing, or not `ACTIVE`, or `deletedAt !== null`, or `expiresAt < now`, the API returns a generic `{ type: 'NOT_FOUND' }` object. The Next.js page then calls `notFound()` preventing any leakage of internal statuses.

## Public DTO Security

The `getBySlug` API method rigidly constructs the public DTO.
- `id`, `invitationId`, `customerPhone`, and token hashes are physically omitted.
- Media URLs are extracted using `publicUrl || storageKey`.

## Reusable Template Behavior

`TemplateRegistry` drives the UI identically to the Live Preview in Phase 8. The only difference is `TemplateRenderContext.mode = 'PUBLIC'`.

- **Share/QR Widget**: Templates with `metadata.supportedFeatures.includes('SHARE')` conditionally render the newly built `<ShareWidget />`.
- This widget leverages `react-qr-code` to encode the canonical `window.location.href` and provides a Web Share API/Clipboard copy action without duplicating logic per template.
- The Share Widget gracefully disables itself in `mode === 'PREVIEW'`.

## Caching Strategy

- ISR (Incremental Static Regeneration) is configured with `revalidate: 60`. 
- Cached hits serve instantly, while providing a maximum 60-second window before Status (`DISABLED`) or Expiration (`expiresAt`) changes are propagated.
- Media Caching: Media is bound to immutable storage keys behind the backend, preventing stale asset delivery when assets are deleted or replaced by the admin.
