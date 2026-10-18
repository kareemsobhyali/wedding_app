# Security Architecture

## Authentication
- **Architecture**: Database-backed sessions managed by NestJS. Next.js acts purely as a consumer and forwards cookies.
- **Passwords**: Hashed securely using `argon2id` via the `argon2` package. Plaintext passwords are NEVER logged or stored.
- **Tokens**: The session token sent to the client is a randomly generated hex string. The database only stores a SHA-256 hash of this token (`tokenHash`) to prevent token leakage in case of database compromise.

## Sessions & Cookies
- **Cookies**: Authentication relies on the `admin_session` cookie.
- **Security Flags**:
  - `HttpOnly`: Prevents access via client-side JavaScript, completely mitigating XSS token theft.
  - `Secure`: Ensures cookies are only sent over HTTPS (enforced when `NODE_ENV=production`).
  - `SameSite=Lax`: Provides robust default CSRF protection while allowing top-level navigations.
- **Expiration**: Sessions expire after 7 days automatically.

## CSRF Strategy
CSRF protection is layered:
1. **SameSite Cookie Attribute**: Set to `Lax` (and optionally `Strict` for highly sensitive endpoints).
2. **CORS Configuration**: The NestJS API strictly validates the `Origin` header. In production, only the Next.js frontend origin is allowed. Requests from unauthorized origins with cookies will be rejected.
3. **Future Proofing**: The architecture is ready for an explicit CSRF token (Double Submit Cookie or similar) if future requirements demand it, but the combination of HttpOnly + SameSite + CORS is sufficient for Phase 3.
*Note: CORS itself is an Origin control mechanism, not a complete CSRF defense, which is why SameSite cookies are the primary mitigation here.*

## Rate Limiting
- **Login Rate Limiting**: The `/api/v1/auth/login` endpoint is protected by `@nestjs/throttler`.
- **Threshold**: Limited to 5 attempts per 60 seconds per IP.
- **Future**: Currently uses an in-memory store. When the API is scaled horizontally, this must be swapped with `@nestjs/throttler-storage-redis`.

## Security Headers
- Helmet is configured globally in NestJS to enforce:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN` (prevents clickjacking)
  - `Strict-Transport-Security`
  - `Content-Security-Policy`

## Admin Route Protection
- **Frontend**: The `/admin` layout in Next.js serves as a UX guard. It fetches `/api/v1/auth/me` with the user's cookie. If the API rejects it (401), the user is redirected to `/admin-login`.
- **Backend (Authoritative)**: The `AdminAuthGuard` intercepts API requests, validates the cookie, and verifies the session exists and is active in the database.

## Environment Secrets
- `DATABASE_URL`: Essential for DB connections.
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`: Used strictly for initial development seeding.

## Production Security Checklist
- [ ] Ensure `NODE_ENV=production` is set so cookies get the `Secure` flag.
- [ ] Configure `CORS_ORIGIN` strictly to the actual production frontend domain.
- [ ] Swap throttler in-memory store for Redis.
- [ ] Ensure `SEED_ADMIN_PASSWORD` is not used in production. Create the first admin manually or via a secure deployment script.
