# Database Architecture

## Overview
The Wedding SaaS Platform uses PostgreSQL via Prisma ORM for type-safe database interactions.
The schema enforces relationships, unique constraints, and creates specific indexes to support high-performance lookups.

## Entities

### `AdminUser`
Stores system administrators.
- `passwordHash`: Never stored in plain text.
- `isActive`: Allows disabling admins without deleting them.

### `Template`
Metadata for visual invitation templates.
- `slug`: Unique identifier for the template.
- `config`: A JSON blob storing flexible configuration (sections, themes, toggles) which will be parsed by the Next.js frontend.

### `Invitation`
The core entity storing all customer and event details.
- **Identity**: Linked to customer identity via `customerPhone`.
- **Soft Deletion**: Uses `deletedAt` rather than physical deletion.
- **Relationships**: Connects to `Template`, `InvitationSlug`, `Media`, and `AnalyticsEvent`.
- **Duplication**: A self-relation `sourceInvitationId` tracks if an invitation was duplicated from another.

### `InvitationSlug`
Maintains a history of slugs for an invitation.
- **Uniqueness**: The `slug` field is universally unique.
- **Preservation**: Slugs are preserved (not deleted) when changed so old URLs can redirect.

### `Media`
Stores references to images and audio hosted on Cloudflare R2.
- **No Binaries**: Files are strictly excluded from the DB.
- **Replacement logic**: If a user replaces background music, a new `Media` row is inserted, the old `isCurrent` is set to `false`, but it remains in the database (with `isOriginal = true`). This allows restoring the original.

### `AnalyticsEvent`
Tracks public activity (views, map clicks, etc).
- **Enums**: Event types are strictly typed.
- **JSON Metadata**: Open-ended JSON metadata allows dynamic analytics payloads.

### `AuditLog`
Tracks admin actions.
- **Polymorphism**: `entityType` and `entityId` allow tracking changes across all models without strict foreign keys breaking on deletion.

### `AppSetting`
Global settings map for toggles (e.g., site name, maintenance mode).

## Boundary Documentation
- Prisma Client is used **only** by the NestJS backend and Next.js Server Actions / API Routes.
- Next.js Client Components (`"use client"`) **never** import `@prisma/client`.
- No raw passwords, `DATABASE_URL`, or `R2` secrets are sent to the client.

## Migration & Seed
- **Initial Setup**: Run `npx prisma migrate dev`
- **Seeding**: Run `npm run seed --workspace=database` to populate templates and an admin user.
