const fs = require('fs');
let code = fs.readFileSync('apps/web/src/components/invitation-preview/InvitationPreview.tsx', 'utf8');
code = code.replace(
  'Template missing or inactive.',
  'Template missing or inactive. Debug templateId: "{templateId}". Draft Keys: "{Object.keys(data || {}).join(\', \')}"'
);
fs.writeFileSync('apps/web/src/components/invitation-preview/InvitationPreview.tsx', code);
