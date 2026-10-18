# Environments Strategy

The Wedding SaaS Platform utilizes a strict 3-tier environment isolation architecture to ensure production safety.

## 1. Local Development
- **Frontend**: Next.js (`npm run dev --workspace=web`) running on `http://localhost:3000`.
- **Backend**: NestJS (`npm run start:dev --workspace=api`) running on `http://localhost:4000`.
- **Database**: Local PostgreSQL instance (can be run via Docker).
- **Storage**: R2 development bucket (e.g., `wedding-media-dev`) or local mock.
- **Variables**: Stored in uncommitted `.env` files.

## 2. Staging / Preview
Used for QA and validation before hitting production.
- **Frontend**: Vercel Preview Deployments (triggered per Pull Request).
- **Backend**: Render Staging Web Service.
- **Database**: Dedicated Render Staging PostgreSQL.
- **Storage**: Dedicated R2 staging namespace (`wedding-media-staging`).
- **Safety**: Strict segregation of credentials. Staging NEVER shares the production database.

## 3. Production
The live environment mapped to the canonical domain (`wedding.com`).
- **Frontend**: Vercel Production deployment mapped to the primary domain.
- **Backend**: Render Production API (`api.wedding.com`).
- **Database**: Render Production PostgreSQL.
- **Storage**: Cloudflare R2 Production Bucket (`wedding-media-prod`).
- **Safety**: Only branch `main` pushes or manual promotions deploy to production.
