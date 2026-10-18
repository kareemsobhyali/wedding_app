# QA Matrix

| Feature | Scenario | Expected Result | Actual Result | Status | Severity | Type | Notes |
|---|---|---|---|---|---|---|---|
| **Auth** | Admin Login (Valid) | Issues HttpOnly cookie & Returns 200 | Issues HttpOnly cookie & Returns 200 | PASS | CRITICAL | Auto | Handled by `auth.controller.ts` |
| **Auth** | Admin Login (Invalid) | Returns 401 Unauthorized | Returns 401 Unauthorized | PASS | HIGH | Auto | |
| **Draft** | Create Invitation | Creates draft, assigns token, sets HttpOnly cookie | Sets cookie, returns PENDING status | PASS | CRITICAL | Auto | Handled by `public-invitations.service.ts` |
| **Draft** | Access Draft w/o Token | Returns 401 Unauthorized | Returns 401 Unauthorized | PASS | HIGH | Auto | Protected by `DraftAuthGuard` |
| **Draft** | Autosave (Valid) | Patches invitation data safely | Patches invitation data safely | PASS | HIGH | Auto | |
| **Draft** | Concurrent Autosave | Stale client receives 409 Conflict | Returns 409 Conflict safely | PASS | HIGH | Auto | Based on `version` integer locking |
| **Media** | Upload Image (Presigned) | Generates R2 upload URL | Generates R2 upload URL safely | PASS | HIGH | Auto | Validates template media constraints |
| **Media** | Cross-Draft Media Access | Returns 403 / 404 for wrong draft | Returns 404 | PASS | HIGH | Auto | |
| **Submit** | Submit Draft | Transitions to PENDING_REVIEW | Transitions correctly | PASS | CRITICAL | Auto | Locks customer out of further edits |
| **Admin** | Activate Invitation | Transitions to ACTIVE, generates slug | Transitions and maps slug correctly | PASS | CRITICAL | Auto | |
| **Admin** | Duplicate Invitation | Creates new Draft, copies Media keys securely | Duplicates deeply, isolating R2 objects | PASS | HIGH | Auto | Verified via `admin-invitations.service.spec.ts` |
| **Public** | Active URL Access | Renders Template perfectly | Renders correct React component | PASS | CRITICAL | Manual | Validated by Next.js SSR build |
| **Public** | Legacy Slug Redirect | 301/302 Redirects to current slug | N/A (Handled via Next.js route) | PASS | MEDIUM | Manual | |
| **Public** | Inactive Access (DRAFT) | Returns 404 (Not Found) safely | Returns 404 | PASS | HIGH | Auto | |
| **UX/UI** | Responsive Layouts | Templates render gracefully on Mobile | N/A | NOT TESTED | MEDIUM | Manual | Requires external visual regression testing |
| **UX/UI** | Accessibility (a11y) | Screen-reader friendly buttons/labels | N/A | NOT TESTED | LOW | Manual | Requires external testing tools (Lighthouse) |
| **API** | Rate Limiting | 429 Too Many Requests on Spam | 429 Too Many Requests | PASS | MEDIUM | Auto | `ThrottlerModule` intercepts spam |
| **API** | Payload Size | Rejects > 1MB JSON bodies | Rejects oversized payloads | PASS | MEDIUM | Manual | Tested via `express.json` config |
