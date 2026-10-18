const fs = require('fs');

let code = fs.readFileSync('apps/web/src/app/create/page.tsx', 'utf8');

code = code.replace(
  `const res = await fetch(\`\${apiUrl}/public/invitations/submit\`, {
          method: 'POST',
          credentials: 'include',
  
        });`,
  `const res = await fetch(\`\${apiUrl}/public/invitations/submit\`, {
          method: 'POST',
          credentials: 'include',
          headers: token ? { 'Authorization': \`Bearer \${token}\` } : undefined
        });`
);
code = code.replace(
  `const res = await fetch(\`\${apiUrl}/public/invitations/submit\`, {\r\n          method: 'POST',\r\n          credentials: 'include',\r\n  \r\n        });`,
  `const res = await fetch(\`\${apiUrl}/public/invitations/submit\`, {\r\n          method: 'POST',\r\n          credentials: 'include',\r\n          headers: token ? { 'Authorization': \`Bearer \${token}\` } : undefined\r\n        });`
);

fs.writeFileSync('apps/web/src/app/create/page.tsx', code);
