const fs = require('fs');

let code = fs.readFileSync('apps/web/src/app/create/page.tsx', 'utf8');

// Undo the bad partial replacements:

code = code.replace(
  `const draftRes = await fetch(\`\${apiUrl}/public/invitations/draft\`, { credentials: 'include', headers: { 'Authorization': \`Bearer \${data.data.draftSessionToken}\` } });`,
  `const draftRes = await fetch(\`\${apiUrl}/public/invitations/draft\`, { credentials: 'include' });`
);

code = code.replace(
  `            headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },`,
  `            headers: { 'Content-Type': 'application/json' },`
);

code = code.replace(
  `        headers: { 'Authorization': \`Bearer \${token}\` }`,
  ``
);

fs.writeFileSync('apps/web/src/app/create/page.tsx', code);
