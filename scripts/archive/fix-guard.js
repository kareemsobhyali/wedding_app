const fs = require('fs');
let code = fs.readFileSync('apps/api/src/auth/guards/draft-auth.guard.ts', 'utf8');

code = code.replace(
  'const rawToken = request.cookies?.[\'draft_session\'];',
  `let rawToken = request.cookies?.['draft_session'];
    if (!rawToken && request.headers.authorization) {
      const authHeader = request.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        rawToken = authHeader.substring(7);
      }
    }`
);

fs.writeFileSync('apps/api/src/auth/guards/draft-auth.guard.ts', code);
