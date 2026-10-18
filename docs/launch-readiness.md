# Launch Readiness Gate

| Category | Requirement | Status | Owner / Notes |
|---|---|---|---|
| **Application** | Core Invitation Flows Functioning | READY | Verified in Phase 14 E2E |
| **Application** | Template Registry Complete | READY | Verified in Phase 14 QA |
| **Database** | Migrations Ready for Production | READY | No destructive ops pending |
| **Database** | Connection pooling (Prisma) configured | READY | Handled via NestJS lifecycles |
| **Storage (R2)** | Production bucket isolated & private | NEEDS MANUAL ACTION | DevOps to configure Cloudflare |
| **Storage (R2)** | CORS allowed specifically for `wedding.com` | NEEDS MANUAL ACTION | DevOps to configure Cloudflare |
| **Authentication** | `DraftAuthGuard` & `AdminAuthGuard` Active | READY | Security reviewed |
| **Authentication** | Admin Provisioning Secure | READY | `npm run provision-admin` created |
| **Security** | Secrets absent from GitHub repo | READY | `.env` strictly ignored |
| **Security** | Production Cookies configured (Secure, HttpOnly) | READY | Active in `process.env.NODE_ENV === 'production'` |
| **DNS / SSL** | Domains configured correctly | NEEDS MANUAL ACTION | `wedding.com` / `api.wedding.com` |
| **CI/CD** | GitHub Actions Workflow Active | READY | Prevents failing code from merging |
| **Monitoring** | External Health Ping / Log Ingestion | NEEDS MANUAL ACTION | Render natively logs; external DataDog/Sentry optional |
| **Backups** | PostgreSQL PITR Enabled | NEEDS MANUAL ACTION | Must activate on Render Dashboard |
| **Recovery** | Runbooks / Incident Response documented | READY | See `docs/incident-response.md` |
| **SEO** | `robots.txt` dynamically blocks drafts/admin | READY | Confirmed |
| **Legal** | Privacy Policy & Terms of Service Present | BLOCKED | Requires manual copy from Legal team |

**OVERALL LAUNCH READINESS:** `BLOCKED` pending Legal Copy and Manual Infrastructure configurations.
