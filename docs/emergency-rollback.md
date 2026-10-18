# Rollback Strategy

In the event of a critical failure following a production deployment, the following strategies dictate system rollback behavior.

## 1. General Principle: Forward-Fix Preferred
Due to the relational nature of the PostgreSQL database and the decoupled frontend/backend architecture, rolling back code without rolling back database schema changes can result in cascading outages. **Forward-fixing** (patching the bug and redeploying rapidly) is heavily preferred over infrastructure rollback.

## 2. Next.js Frontend Rollback (Vercel)
If a critical UI/UX bug affects the frontend but does not intersect with backend API contracts:
- Navigate to the Vercel Deployments dashboard.
- Select the previous stable deployment.
- Click **"Promote to Production"** or **"Rollback"**.
- Vercel implements this instantly via Edge routing.

## 3. NestJS Backend Rollback (Render)
If the API introduces a critical bug (but NO destructive database migrations were applied):
- Navigate to the Render Dashboard for the API service.
- Locate the previous successful deployment in the "Events" tab.
- Select **"Rollback to this deploy"**.
- Ensure the selected rollback version maintains compatibility with the currently live Next.js Vercel deployment.

## 4. Database Rollback
If a destructive database migration was applied, an immediate code-only rollback will fail.
- **Data Loss Migrations**: A database backup restoration is required. (See `backup-recovery.md`).
- **Additive Migrations**: If the migration merely added tables or columns, rolling back the API code is safe. The previous API version will safely ignore the new columns.

## 5. Media State Rollback
Media items (images, audio) successfully uploaded to R2 during a faulty deployment should generally be left orphaned or cleaned up via asynchronous garbage collection scripts rather than attempting a synchronous bucket state rollback. NEVER wipe the bucket or restore an R2 bucket from a snapshot just to undo a deployment, as this will destroy unrelated client uploads.
