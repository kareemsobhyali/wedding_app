const fs = require('fs');
let code = fs.readFileSync('apps/web/src/app/admin/invitations/[id]/page.tsx', 'utf8');
code = "import AdminEditForm from './AdminEditForm';\n" + code;
code = code.replace('<p className="text-sm text-gray-600">Full editing form goes here...</p>', '<AdminEditForm invitation={inv} apiToken={sessionCookie?.value || \'\'} />');
fs.writeFileSync('apps/web/src/app/admin/invitations/[id]/page.tsx', code);
