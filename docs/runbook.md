# Operational Runbook

### Restart API
- **Tool**: Render Dashboard
- **Action**: Navigate to API Web Service -> Manual Deploy -> **Restart Service**.
- **Impact**: In-flight requests will safely drain (due to graceful shutdown hooks), and the service will resume in ~30 seconds.

### Roll back deployment
- **Tool**: Render / Vercel Dashboard
- **Action (API)**: Render Events -> Select previous successful build -> **Rollback to this deploy**.
- **Action (Web)**: Vercel Deployments -> Select previous build -> **Promote to Production**.
- **Impact**: API schema must remain compatible with code. Do not rollback code if database schema was altered destructively.

### Check database health
- **Tool**: Render Dashboard
- **Action**: Navigate to PostgreSQL -> Metrics. Observe CPU, Memory, and Active Connections.
- **Alternative**: Connect locally via `psql` or DBeaver using the External Database URL provided by Render.

### Check R2
- **Tool**: Cloudflare Dashboard
- **Action**: R2 -> `wedding-media-prod` -> Metrics. Observe egress, ingress, and total object count.
- **Troubleshooting**: If uploads fail, verify the `R2_ACCESS_KEY_ID` hasn't expired.

### Restore from backup
- **Tool**: Render Dashboard
- **Action**: Navigate to Database -> Backups -> **Restore**.
- **Warning**: Restoring provisions a brand new database instance. You must update the API's `DATABASE_URL` environment variable and restart the API to finalize the recovery.
