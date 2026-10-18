const fs = require('fs');
let code = fs.readFileSync('apps/web/src/app/create/page.tsx', 'utf8');
code = code.replace(
  'templateId={draft?.template?.slug || draft?.data?.template?.slug || draft?.template?.id || draft?.data?.template?.id || ""}',
  'templateId={draft?.templateId || draft?.template?.slug || draft?.data?.template?.slug || draft?.template?.id || draft?.data?.template?.id || ""}'
);
fs.writeFileSync('apps/web/src/app/create/page.tsx', code);
