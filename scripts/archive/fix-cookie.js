const fs = require('fs');
let code = fs.readFileSync('apps/web/src/app/admin/invitations/[id]/page.tsx', 'utf8');
code = code.replace(
  'export default async function AdminInvitationDetail({ params }: { params: { id: string } }) {',
  'export default async function AdminInvitationDetail({ params }: { params: { id: string } }) {\r\n  const cookieStore = cookies();\r\n  const sessionCookie = cookieStore.get("admin_session");'
);
fs.writeFileSync('apps/web/src/app/admin/invitations/[id]/page.tsx', code);
