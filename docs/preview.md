# Live Preview (Phase 8)

The Live Preview architecture provides an instant, responsive preview of the customer's draft invitation while they edit the form.

## Architecture & Data Flow

```text
Form State (React `draft`) -> InvitationRenderData -> TemplateRegistry -> Rendered Preview Component
```

1. **Local State is King**: The preview does *not* wait for network autosave to complete. Every keystroke instantly maps from the React form state to the `InvitationRenderData` view-model.
2. **Template Reuse**: The preview strictly imports `TemplateRegistry` (built in Phase 6). It uses the exact same React components that the final public Phase 9 invitation will use.
3. **PREVIEW Context**: The `TemplateRenderContext` passes `mode: 'PREVIEW'`. Templates can use this to disable destructive actions or external redirects (like breaking out of an iframe/wrapper).

## Presentation Sandbox (Viewport & Device Modes)

The preview renders inside `apps/web/src/components/invitation-preview/InvitationPreview.tsx`.
- The Template is rendered into a fixed `width` / `height` `div` mimicking Mobile (390x844), Tablet (768x1024), or Desktop (1440x900).
- Using CSS `transform: scale(...)`, the strict viewport is visually zoomed out to fit within the `lg:w-1/2` side-panel on desktop devices.
- This ensures the responsive media queries inside the templates are realistically activated based on logical pixels, rather than arbitrary dashboard layout widths.

## Mobile UX

On small screens, a side-by-side layout is impossible without breaking usability.
The interface automatically collapses into a tabbed layout:
- **Form Tab**: Full-screen scrolling form.
- **Preview Tab**: Full-screen scaling preview frame.
The local state is preserved completely when navigating between tabs.

## Security & SEO

- The draft URL (`/create`) does not embed the raw UUID of the draft. It relies purely on the secure `DraftSession` cookie.
- The `layout.tsx` for `/create` explicitly injects `<meta name="robots" content="noindex, nofollow" />` to prevent search engine indexing of incomplete drafts.
- Draft sessions cannot be shared. There is no "Copy Link" functionality for the preview since it requires the authenticated customer cookie.

## Features & Behaviors

- **Audio**: Audio utilizes a custom `AudioPlayer` that disables HTML5 autoplay (to comply with browser restrictions) and requires explicit user interaction to Play/Pause. Only one audio instance exists per preview.
- **Countdown**: A custom `Countdown.tsx` primitive calculates days/hours/minutes accurately. It gracefully transitions to "Today is the day!" on the date, and "Happily Ever After" in the past, completely averting negative timers.
- **Gallery**: Consumes the Phase 5/6 Media architecture, displaying grids natively responsive to the active Template.
- **Maps & Contacts**: Only rendered if the customer provided safe HTTPS maps URLs or contact numbers (`groomPhone` / `bridePhone`). The private `customerPhone` is never mapped to the template.
- **Autosave Interlock**: The "Review & Submit" button validates that the local `saveState` is not actively `'saving'` before triggering the final POST transaction.
