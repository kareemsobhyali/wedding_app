# Storage & Media Architecture (Phase 5)

This document describes the storage infrastructure used for managing wedding invitation assets (photos, audio) using Cloudflare R2.

## Cloudflare R2 Abstraction
The API abstracts Cloudflare R2 behind a global `StorageService` using the standard `StorageInterface`. 
The implementation (`R2StorageProvider`) uses the `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` packages.
- **Why Abstraction?** This ensures that business logic never directly references AWS SDK components, meaning we could theoretically swap R2 out for standard AWS S3, Google Cloud Storage, or local disk (for testing) without rewriting controllers/services.

## Object Key Strategy
Storage keys map directly to paths in the R2 bucket.
They are generated entirely server-side using UUIDs to prevent path traversal (`../../`) and preserve uniqueness.

Format:
`invitations/{invitationId}/{type}/{uuid}.{ext}`

Example:
`invitations/123e4567-e89b-12d3-a456-426614174000/images/abc-123.jpg`

## Upload Flow (Presigned URLs)
To avoid bottling up the NestJS API with large file streams, we utilize **Presigned Direct Uploads**:
1. Client requests an upload authorization (`/api/v1/admin/media/upload-url`) with intended metadata.
2. `MediaService` validates size, extension, and MIME type limits.
3. Server generates a signed `PUT` URL valid for 10 minutes, tightly binding the `ContentType` and `ContentLength`.
4. Client uploads directly to R2 using the presigned URL.
5. Client calls finalization (`/api/v1/admin/media/finalize`) with the `storageKey`.
6. Server issues a `HeadObject` command to R2 to strictly verify that the object exists and matches the intended constraints before finally creating the Prisma `Media` row.

## Audio Versioning Strategy
Original audio is **never** overwritten. 
When a replacement audio file is uploaded:
1. It is written to R2 as an entirely new object (new UUID key).
2. During finalization, a database transaction identifies the currently active audio for that invitation.
3. The previous audio is marked `isCurrent = false`.
4. The newly uploaded replacement is marked `isOriginal = false, isCurrent = true`.

## Public vs Private Media
- **Admin Media**: Accessed via a short-lived signed download URL (`/api/v1/admin/media/:id/download`). The entire bucket is NOT exposed publicly.
- **Public Invitation Delivery**: Handled dynamically. (Future customer-facing architecture will securely proxy or provide public CDN URLs ONLY for assets attached to published/active invitations).

## Orphaned Objects & Failure Handling
Because PostgreSQL and Cloudflare R2 do not share atomic transactions, failures can cause dangling state:
- If R2 upload succeeds but DB Finalization fails: The R2 object becomes orphaned. It will not appear in the UI since there is no `Media` record.
- **Cleanup Strategy**: A future chron job can scan R2 objects and delete any that do not have a corresponding `Media` record older than 24 hours.
- If a user deletes a media item: The system performs a DB soft-delete (`deletedAt = now()`) first. If the subsequent R2 deletion fails, the user still sees it as deleted, and a chron job can eventually purge the R2 object later.

## Environment Variables
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_URL` (Used to format public CDN URLs if needed).
