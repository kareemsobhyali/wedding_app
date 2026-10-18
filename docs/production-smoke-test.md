# Production Smoke Test Checklist

Execute this checklist manually against the live production environment (`wedding.com`) after every major deployment.

## 1. Public Facing (Customer Journey)
- [ ] **Homepage & Templates**: Navigate to `wedding.com`. Ensure the template listing loads quickly.
- [ ] **Start Draft**: Select a template. Enter a mock phone number. Verify you proceed to the builder without errors.
- [ ] **Draft Autosave**: Type into "Groom Name". Pause for 2 seconds. Verify the "Saving..." indicator switches to "Saved".
- [ ] **Media Upload**: Upload a test image to the gallery. Verify it displays in the local preview.
- [ ] **Submit**: Click "Submit for Review". Verify redirection to `/create/success`.

## 2. Admin Operational Journey
- [ ] **Admin Login**: Navigate to `/admin-login`. Log in with valid credentials. Verify redirection to the dashboard.
- [ ] **Locate Submission**: Find the mock invitation created in Step 1 under "Recent Submissions" or via search.
- [ ] **Detail View**: Open the invitation. Verify the uploaded media and filled text match exactly.
- [ ] **Activate**: Click "Activate". Ensure the status changes to `ACTIVE` and a public link/slug is generated.

## 3. Public Artifact Validation
- [ ] **Public Rendering**: Open the generated slug (`wedding.com/mock-slug-name`) in an Incognito window.
- [ ] **Visuals**: Verify the correct template is used.
- [ ] **Interactivity**: Test Music (if applicable), Google Maps links, and Contact buttons.
- [ ] **Analytics (Optional)**: Refresh the Admin Dashboard and verify the "Views" count incremented.

## 4. Teardown
- [ ] **Clean Up**: In the Admin Dashboard, Archive or Delete the mock invitation.
- [ ] **Verification**: Reload the public slug and ensure it returns a `404 Not Found`.
