# Phase 12: Production Hardening, Performance & Reliability

This document outlines the final production hardening configurations applied to the Wedding SaaS Platform.

## 1. Environment & Configuration Safety
- **Validation**: All server-side environment variables are strictly validated on boot using Joi (`env.validation.ts`). If a critical secret (e.g., `DATABASE_URL`, `JWT_SECRET`) is missing, the application fails instantly.
- **Client Bundles**: No sensitive backend secrets (database, storage, admin keys) are exposed to the Next.js client environment.

## 2. API Error Handling & Request Logging
- **Obfuscated Errors**: The `GlobalExceptionFilter` intercepts all `500 Internal Server Error` variants in production. Stack traces, raw SQL queries, and Prisma internals (like `P2002` violations) are caught and returned as clean JSON responses:
  ```json
  { "success": false, "error": { "code": "RESOURCE_CONFLICT", "message": "...", "requestId": "..." } }
  ```
- **Request Identification**: Every incoming request passes through the `RequestIdInterceptor`. It either sanitizes an incoming `X-Request-ID` or assigns a fresh UUID. This ID is logged by the `RequestLoggerMiddleware` alongside method, route, and duration, and returned safely in the headers and error payloads.

## 3. Graceful Lifecycle
- **NestJS Shutdown**: `app.enableShutdownHooks()` is active. On `SIGTERM`/`SIGINT`, the process halts new connections and finishes active streams.
- **Prisma Connection**: The `PrismaService` hooks into `OnModuleInit` and `OnModuleDestroy` to guarantee exactly one connection pool per API process and clean disconnection upon shutdown.

## 4. Security Headers & Limits
- **Helmet & CORS**: Configured securely. CORS restricts origins in production while allowing `localhost` dynamically in development.
- **Cookies**: `visitor_id`, `admin_session`, and `draft_session` explicitly leverage `HttpOnly`, `SameSite=lax`, and `Secure` (in production) flags to mitigate CSRF/XSS vectors.
- **Payload Limits**: The `express.json({ limit: '1mb' })` globally protects against oversized payloads, whereas huge media streams are strictly delegated to the pre-signed R2 architecture.

## 5. Performance & Database Efficiency
- **Caching**: Endpoints implement `no-store` where transactional freshness is required (admin dashboards), while public slugs utilize robust Next.js ISR configurations (`revalidate: 60`).
- **Database Indexes**: Prisma schema utilizes rigorous compounding (e.g., `[invitationId, eventType]`) to accelerate filtering queries and aggregated analytics without scanning entire tables.
- **Pagination**: Capped strictly via `@Max(100)` in `pagination.dto.ts`.

## 6. Dependency Audit
- Standard `npm audit` was conducted. Minor vulnerabilities within transitive dependencies were reviewed. No critical vulnerabilities affecting the active Next.js/NestJS application scope were detected.

## 7. Known Limitations & Backup Readiness
- **Backups**: Implementers must explicitly configure RDS / PostgreSQL point-in-time recovery (PITR) and Cloudflare R2 bucket replication independently, as the application layer does not execute external Cron-driven SQL dumps.
- **Content Security Policy (CSP)**: A strict CSP is not hard-coded via Helmet for the V1 frontend to permit maximal flexibility with iframe embeds (Google Maps) and blob execution (various template scripts), but it is recommended to tighten this when the template array solidifies.
