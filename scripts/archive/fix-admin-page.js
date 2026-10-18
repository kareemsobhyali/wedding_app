const fs = require('fs');

const file = 'apps/web/src/app/admin/invitations/[id]/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add import
code = code.replace(
  "import AdminEditForm from './AdminEditForm';",
  "import AdminEditForm from './AdminEditForm';\nimport AdminActionButtons from './AdminActionButtons';"
);

// Replace forms
const formsRegex = /<div className="flex gap-2 flex-wrap">[\s\S]*?<p className="text-xs text-gray-500 mt-2">Forms should post to API directly for V1 POC \(or via Client Component\)\.<\/p>/;
const replacement = `<AdminActionButtons invitationId={inv.id} apiToken={cookieStore.get("admin_session")?.value || ''} />`;
code = code.replace(formsRegex, replacement);

fs.writeFileSync(file, code);
