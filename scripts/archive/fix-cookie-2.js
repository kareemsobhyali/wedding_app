const fs = require('fs');
let code = fs.readFileSync('apps/web/src/app/admin/invitations/[id]/page.tsx', 'utf8');
code = code.replace(
  'const sessionCookie = cookieStore.get("admin_session");',
  ''
);
code = code.replace(
  '<AdminEditForm invitation={inv} apiToken={sessionCookie?.value || \'\'} />',
  '<AdminEditForm invitation={inv} apiToken={cookieStore.get("admin_session")?.value || \'\'} />'
);
fs.writeFileSync('apps/web/src/app/admin/invitations/[id]/page.tsx', code);
