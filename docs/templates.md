# Template Engine Architecture

The Wedding SaaS Platform uses a decoupled template engine. The primary architectural principle is: **Invitation Data ≠ Template Design**.

## Data Source
Templates **never** query PostgreSQL or read raw Prisma objects. They are entirely stateless, pure React Functional Components that consume a sanitized view model: `TemplateRenderContext`.
This context provides:
- `data`: Standardized `InvitationRenderData` (groom, bride, media urls).
- `mode`: `'PREVIEW' | 'PUBLIC'` — ensuring the exact same code renders both the admin preview and the customer-facing site.
- `direction`: `'RTL' | 'LTR'` — explicit text direction.

## Template Registry
The engine relies on a strict implementation registry located in `apps/web/src/templates/registry.ts`.
- **Slugs**: Each template uses a stable slug (e.g., `classic-elegance`).
- **Safety**: Unrecognized slugs fallback gracefully; dynamic/arbitrary `import()` calls are prohibited to prevent execution vulnerabilities or bundle splitting disasters.

## Database vs Code Responsibility
The system utilizes two distinct "sources of truth" that work in tandem:
1. **The Database (`Template` table)**:
   - Dictates if a template is *administratively active* and selectable by customers.
   - Served via `GET /api/v1/templates`.
2. **The Codebase (`registry.ts`)**:
   - Provides the actual React component.
   - If the DB says a template is active, but the frontend lacks an implementation, the frontend safely ignores it (logging a warning) rather than crashing the application.

## Starter Templates
- `classic-elegance`: Serif fonts, traditional layout.
- `modern-minimalist`: Dark mode, bold grotesque typography, stripped back.
- `floral-romance`: Soft colors, floral visual cues.

## Adding a New Template
To add a new design to the platform:
1. Implement the React Server Component in `apps/web/src/templates/designs/my-new-template/index.tsx`.
2. Register it in `registry.ts`, detailing its supported capabilities (`HERO`, `GALLERY`, `MUSIC`, etc.).
3. Seed/Insert the corresponding `my-new-template` row into the `Template` PostgreSQL table.
4. Provide a preview thumbnail to R2 or public assets.
