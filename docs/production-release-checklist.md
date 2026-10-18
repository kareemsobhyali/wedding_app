# Production Release Checklist

Use this checklist during every initial deployment and major subsequent deployment.

## 1. Pre-Deployment Configuration
- [ ] **DNS**: `wedding.com` points to Vercel. `api.wedding.com` points to Render.
- [ ] **R2 Setup**: Production bucket created. Permissions verified. Public URL configured.
- [ ] **Secrets**: Production `JWT_SECRET`, `DATABASE_URL`, and R2 credentials are mathematically secure and loaded into Render.
- [ ] **Frontend Env**: `NEXT_PUBLIC_API_URL` is configured in Vercel.

## 2. CI/CD Validation
- [ ] **GitHub Actions**: Linting, typechecking, and unit tests are passing on the `main` branch.
- [ ] **Database Build**: `prisma generate` succeeds in the CI pipeline.

## 3. Database Deployment
- [ ] **Migration Check**: Review `prisma/migrations` for destructive operations.
- [ ] **Migration Execute**: `npx prisma migrate deploy` executed successfully against the Render database.
- [ ] **Seed Security**: Verify that development seed scripts did NOT run against production.

## 4. Security & Isolation Verification
- [ ] **CORS**: `CORS_ORIGIN` is explicitly set to `https://wedding.com`.
- [ ] **Cookies**: Verify `admin_session` and `draft_session` are `Secure` and `HttpOnly` in the browser devtools on production.
- [ ] **No Secret Exposure**: Verify `window` object in the browser console does not leak environment variables.

## 5. Smoke Testing (Public)
- [ ] **Homepage**: Loads correctly without console errors.
- [ ] **Creation Workflow**: Can generate a draft and autosave.
- [ ] **Media Upload**: Can successfully upload an image to R2 and retrieve it.
- [ ] **Submission**: Can successfully submit an invitation for review.
- [ ] **Active Page**: Can load a finalized, active public invitation (`/slug`).
- [ ] **SEO**: Verify `robots.txt` blocks `/admin` and `/api`.

## 6. Smoke Testing (Admin)
- [ ] **Authentication**: Admin can log in successfully.
- [ ] **Dashboard**: Global analytics and recent requests load quickly.
- [ ] **Invitation Transition**: Can successfully activate, disable, and expire an invitation.
- [ ] **Duplication**: Can safely duplicate an invitation (including copying R2 media independently).
