const fs = require('fs');
let code = fs.readFileSync('apps/web/src/app/create/page.tsx', 'utf8');

code = code.replace(
  /const res = await fetch\(`\$\{apiUrl\}\/public\/invitations\/draft`, \{\s*method: 'PATCH',\s*headers: \{ 'Content-Type': 'application\/json' \},\s*credentials: 'include',/g,
  `const res = await fetch(\`\${apiUrl}/public/invitations/draft\`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
            credentials: 'include',`
);

code = code.replace(
  /const res = await fetch\(`\$\{apiUrl\}\/public\/invitations\/submit`, \{\s*method: 'POST',\s*credentials: 'include'\s*\}\);/g,
  `const res = await fetch(\`\${apiUrl}/public/invitations/submit\`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Authorization': \`Bearer \${token}\` }
      });`
);

fs.writeFileSync('apps/web/src/app/create/page.tsx', code);
