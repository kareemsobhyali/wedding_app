# Deployment Guide

This document outlines the deployment topology and configuration for the Wedding SaaS Platform.

## 1. Cloudflare Configuration (DNS & Storage)
### DNS Settings
- **`wedding.com` / `www.wedding.com`**: CNAME to Vercel.
- **`api.wedding.com`**: CNAME to Render Web Service.
- **SSL/TLS**: Set to "Full (strict)".

### R2 Storage
- **Bucket Configuration**: Must be explicitly marked as Private.
- **Public Access**: Managed via Custom Domain routing if required by architecture, or heavily restricted signed URLs.
- **Credentials**: Generate an R2 API Token with exactly `Object Read & Write` scope limited strictly to the production bucket.

## 2. Vercel Configuration (Next.js Frontend)
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web` (or leave root and let Turborepo handle build commands).
- **Build Command**: `npm run build --workspace=web`
- **Install Command**: `npm ci`
- **Required Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: `https://api.wedding.com/api/v1`

> **SECURITY WARNING**: NEVER expose `DATABASE_URL`, `JWT_SECRET`, or `R2_*` variables in the Vercel dashboard.

## 3. Render Configuration (NestJS API)
The repository includes a `render.yaml` Blueprint for Infrastructure-as-Code deployments on Render.
- **Service Type**: Web Service
- **Build Command**: `npm install && npx prisma generate && npm run build --workspace=api`
- **Start Command**: `npm run start:prod --workspace=api`
- **Required Environment Variables**:
  - `DATABASE_URL` (mapped from attached PostgreSQL instance)
  - `NODE_ENV=production`
  - `PORT=4000`
  - `CORS_ORIGIN=https://wedding.com`
  - `JWT_SECRET` (Cryptographically secure random string)
  - `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET`, `R2_PUBLIC_URL`.

## 4. Database Migrations
Migrations are strictly executed post-build but prior to taking live traffic.
- **Command**: `npx prisma migrate deploy`
- **Warning**: NEVER run `npx prisma migrate dev` or `npx prisma db push` against the production Render database.

## 5. Seed Data Isolation
Production deployments DO NOT run seed scripts. The initial Production Administrator must be provisioned either through a secured one-time API bootstrap script, or via a direct database injection utilizing standard organizational protocols. Development seeds (`npm run seed`) are prohibited from executing in CI/CD against production credentials.
