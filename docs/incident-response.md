# Incident Response Plan

## 1. Application Outage (API down)
- **Detect**: Frontend users report "Failed to fetch" or 5xx errors across the board.
- **Contain**: Render platform will automatically attempt to restart unhealthy Node instances.
- **Diagnose**: Inspect Render Logs. Look for `PrismaClientInitializationError` (Database down) or `OutOfMemoryError`.
- **Recover**: If a recent deployment caused this, initiate an immediate rollback via Render dashboard. If it's a traffic spike, scale vertical instances on Render.

## 2. Database Outage
- **Detect**: API logs spewing connection timeouts. 
- **Contain**: No data is being corrupted; transactions fail safely. Place site in maintenance mode if natively supported.
- **Diagnose**: Check Render Database dashboard for CPU/Memory exhaustion or network interruptions.
- **Recover**: Wait for Render auto-recovery. If the database is irrevocably corrupted, trigger PITR (Point-In-Time Recovery) to a safe timestamp. (Requires updating API `DATABASE_URL` post-recovery).

## 3. R2 Storage Outage
- **Detect**: Images fail to load (`403` or `5xx` on presigned URLs). Image uploads hang.
- **Contain**: Draft submissions will fail if media uploads are incomplete.
- **Diagnose**: Check Cloudflare Status Page. Verify R2 credentials haven't expired.
- **Recover**: If Cloudflare is down globally, wait for upstream resolution.

## 4. Accidental Data Exposure (Security Incident)
- **Detect**: Discovery of exposed Draft IDs or Admin Dashboard bypass.
- **Contain**: Immediately cycle the `JWT_SECRET` in Render environment variables. This forces ALL users (Admins and active Drafts) to log out / lose session access immediately.
- **Diagnose**: Identify the vulnerability vector in the code (e.g., missing `AdminAuthGuard`).
- **Recover**: Deploy a patch and communicate transparently if sensitive PII was leaked.

## 5. Corrupted Migration
- **Detect**: Deployment fails during `prisma migrate deploy` or API crashes post-deployment due to missing columns.
- **Contain**: Prevent further code deployments.
- **Diagnose**: Identify the exact SQL script in `prisma/migrations` that failed.
- **Recover**: DO NOT down-migrate automatically. Restore the database from the pre-deployment backup, revert the Git commit, and redeploy safely.
