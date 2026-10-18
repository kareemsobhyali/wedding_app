const fs = require('fs');

let code = fs.readFileSync('apps/web/src/app/create/page.tsx', 'utf8');

const regex = /const res = await fetch\(`\$\{apiUrl\}\/public\/invitations\/submit`, \{\s*method: 'POST',\s*credentials: 'include',\s*\}\);/m;
code = code.replace(regex, `const res = await fetch(\`\${apiUrl}/public/invitations/submit\`, {
          method: 'POST',
          credentials: 'include',
          headers: token ? { 'Authorization': \`Bearer \${token}\` } : undefined
        });`);

fs.writeFileSync('apps/web/src/app/create/page.tsx', code);
