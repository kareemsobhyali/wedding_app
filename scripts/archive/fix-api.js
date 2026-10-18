const fs = require('fs');
let code = fs.readFileSync('apps/api/src/invitations/public-invitations.service.ts', 'utf8');
code = code.replace(
  '      return {\n        version: invitation.version,\n        status: invitation.status,\n      };',
  '      return {\n        version: invitation.version,\n        status: invitation.status,\n        draftSessionToken: rawToken,\n      };'
);
code = code.replace(
  '      return {\r\n        version: invitation.version,\r\n        status: invitation.status,\r\n      };',
  '      return {\r\n        version: invitation.version,\r\n        status: invitation.status,\r\n        draftSessionToken: rawToken,\r\n      };'
);
fs.writeFileSync('apps/api/src/invitations/public-invitations.service.ts', code);
