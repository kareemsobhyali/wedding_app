# Backup & Recovery Readiness

This document outlines the theoretical and required recovery architecture for the Wedding SaaS Platform.

> **IMPORTANT**: The application code itself does not perform backups. Infrastructure backups MUST be explicitly enabled on the host providers (Render and Cloudflare).

## 1. PostgreSQL Database (Render)
- **Status**: [Externally Configured]
- **Requirements**:
  - The Render PostgreSQL instance must have automated daily backups enabled.
  - Point-In-Time Recovery (PITR) must be enabled (typically active for 7 days on Render Pro databases).
- **Recovery Procedure**:
  - In the event of catastrophic data corruption, navigate to the Render Database dashboard.
  - Trigger "Restore from Backup" and provide the target timestamp.
  - Render spins up a *new* database instance. You must update the `DATABASE_URL` environment variable on the API Web Service to point to the new instance.

## 2. Cloudflare R2 Media Storage
- **Status**: [Documented Only - Manual Configuration Required]
- **Requirements**:
  - R2 does not inherently support granular PITR out-of-the-box like AWS S3 Versioning.
  - If critical data protection is required, implement an R2-to-R2 replication rule routing files to a secondary "Cold" bucket, or enable S3-compatible Object Versioning via Cloudflare configuration APIs.
- **Recovery Procedure**:
  - If a specific file is accidentally overwritten, it can be fetched from the version history (if configured).
  - General media loss requires resolving the database state to match the surviving media files, as restoring missing images is impossible without a cold-storage backup.

## 3. Application State & Secrets
- **Status**: [Implemented]
- **Requirements**:
  - All source code is version-controlled via GitHub.
  - Environment variables must be securely stored in a password manager (e.g., 1Password, Bitwarden) belonging to the organization.
- **Recovery Procedure**:
  - In a "total provider loss" scenario (e.g., migrating away from Render/Vercel entirely), spin up any Docker-capable host, inject the saved environment variables, update DNS, and the stateless application will resume perfectly.
