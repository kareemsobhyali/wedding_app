# Production Release Procedure

## 1. Before Release
1. Verify Git status is clean and pulled from `main`.
2. Confirm the CI pipeline (`validate-and-test`) passes green for the target commit.
3. Review `prisma/migrations/` to ensure no newly merged migrations execute destructive operations blindly.
4. Verify Render and Vercel Environment Variables match requirements.

## 2. Deploy
1. **Frontend (Vercel)**: Trigger deployment manually or via Git push. Vercel will build Next.js.
2. **API (Render)**: Trigger deployment via Render Dashboard. Render will execute:
   - `npm install`
   - `npx prisma generate`
   - `npm run build --workspace=api`
3. **Database Migrations**: Render automatically executes `npx prisma migrate deploy` prior to taking live traffic.

## 3. After Deploy
1. Wait for Render and Vercel to mark health checks as "Live".
2. Open `https://wedding.com`. Verify landing layout.
3. Open `https://wedding.com/admin-login`. Log in via securely provisioned credentials.
4. Execute the `docs/production-smoke-test.md` checklist.
5. Record the deployment SHA in internal engineering logs.
6. Monitor Render API logs for 5xx errors for the first 15 minutes.
