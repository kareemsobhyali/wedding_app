const fs = require('fs');
const file = 'apps/api/src/invitations/public-invitations.service.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /return\s*\{\s*version:\s*invitation\.version,\s*status:\s*invitation\.status,?\s*\};/,
  'return { version: invitation.version, status: invitation.status, draftSessionToken: rawToken };'
);

fs.writeFileSync(file, code);
