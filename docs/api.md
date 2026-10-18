# API Architecture

This document describes the foundational conventions and structure of the NestJS API.

## Versioning & Routing
All business endpoints are prefixed with `/api/v1`. 

### Public vs Admin Boundary
The API strictly segregates unauthenticated public routes from authenticated admin routes:
- **Admin**: Endpoints managing core data are routed under `/api/v1/admin/*` and protected by `AdminAuthGuard`.
- **Public**: Endpoints designed for rendering customer-facing invitations are routed under `/api/v1/*` (without the `admin` prefix) and do not require admin authentication.

*Example:*
- `GET /api/v1/admin/invitations` (List all invitations, protected)
- `GET /api/v1/invitations/:slug` (Render public invitation details, unprotected)

## Standardized Responses
All successful API responses are intercepted by the `TransformInterceptor` and wrapped to guarantee a predictable format.
```json
{
  "success": true,
  "data": { "id": "123", "name": "..." }
}
```
**Exceptions**: HTTP 204 No Content responses and binary streams (e.g., file downloads) are NOT wrapped, preserving valid HTTP semantics.

## Global Error Handling
The `GlobalExceptionFilter` intercepts all thrown errors, preventing stack trace or raw SQL leakage. Database exceptions like Prisma Unique Constraint Violations (P2002) are safely mapped to application-level HTTP errors.
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_CONFLICT",
    "message": "A resource with this unique field already exists."
  }
}
```

## Request Correlation & Logging
- **Request ID**: The API processes the `x-request-id` header. If valid, it is reused; if missing or unsafe, a new UUID is generated. This ID is appended to the response headers (`X-Request-ID`) and bound to logs.
- **Logging Strategy**: The `RequestLoggerMiddleware` logs route, status, response time, and Request ID. Sensitive data (passwords, tokens, cookies) is explicitly excluded from application logs.

## Pagination
List endpoints must utilize the `PaginationDto` via query parameters: `?page=1&limit=20`.
- Limits are clamped between 1 and 100.
Responses match the `PaginatedResponse<T>` interface:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

## Database Boundary (Prisma)
- The NestJS app utilizes a central `PrismaModule` and `PrismaService` which manage `$connect` on module initialization and `$disconnect` on module destruction.
- There is strictly **ONE** instance of `PrismaClient` active across the API lifecycle.
- **Soft Deletions**: In Prisma operations, queries generally must exclude `deletedAt: { not: null }`.

## Audit Logging
An `AuditLogService` is available in the `AuditLogModule`. It operates via a "fire-and-forget" pattern so it never adds latency to HTTP requests or fails business transactions due to logging failures. It safely writes `action`, `entityType`, and `adminUserId` to the database.

## Health Check
- `GET /api/v1/health` (Liveness)
- `GET /api/v1/health/ready` (Readiness: executes a test database query to confirm Prisma functionality).

## Swagger Documentation
Swagger is configured at `/api/docs`. 
By default, it is **DISABLED** in production. It will only initialize if `NODE_ENV !== 'production'` or if `ENABLE_SWAGGER=true` is explicitly set in the environment.

## Configuration & Environment Validation
The app uses `@nestjs/config` alongside `joi`. It enforces strict startup validation: if variables like `DATABASE_URL` or `CORS_ORIGIN` are missing or malformed, the application crashes immediately on boot with descriptive errors, rather than failing silently later.
