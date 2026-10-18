# Wedding SaaS Platform

A production-ready monorepo foundation for a wedding invitation SaaS platform.

## Architecture

- **Frontend (`/apps/web`)**: Next.js App Router (TypeScript, Tailwind CSS)
- **Backend (`/apps/api`)**: NestJS API
- **Database (`/packages/database`)**: Prisma ORM, PostgreSQL
- **Storage**: Cloudflare R2 (S3 Compatible) - *prepared*
- **Monorepo Tooling**: npm/pnpm workspaces, Turborepo

See `/docs/architecture.md` for architectural decisions.

## Prerequisites

- Node.js (v18+)
- npm or pnpm
- Docker and Docker Compose

## Environment Setup

1. Copy `.env.example` to `.env` in the root (and app directories if needed).
   ```bash
   cp .env.example .env
   ```

2. Start the local database:
   ```bash
   docker compose up -d
   ```

## Local Development

Install dependencies:
```bash
npm install
```

Push database schema (creates tables):
```bash
npm run db:push
```

Start all applications in development mode:
```bash
npm run dev
```

### URLs
- Web: http://localhost:3000
- API Health Check: http://localhost:3001/api/v1/health

## Production Deployment
- **Frontend**: Vercel (connects to `/apps/web`)
- **Backend**: Render (connects to `/apps/api`)
- **Database**: Managed PostgreSQL (e.g., Supabase, Neon, Render)

## Security
- No secrets are hardcoded. Ensure `.env` is never committed.
- API is prepared for CORS configuration based on environment variables.
