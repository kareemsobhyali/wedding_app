const fs = require('fs');

let code = fs.readFileSync('apps/web/src/app/create/page.tsx', 'utf8');

// Replace startDraft logic
const startDraftRegex = /if \(\!res\.ok\) \{\s*const errorData = await res\.json\(\)\.catch\(\(\) => null\);\s*throw new Error\(errorData\?\.message \|\| 'Failed to start invitation draft\. Please try again\.'\);\s*\}\s*const draftRes = await fetch\(`\$\{apiUrl\}\/public\/invitations\/draft`, \{ credentials: 'include' \}\);/m;
const newStartDraft = `if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.message || 'Failed to start invitation draft. Please try again.');
        }
        
        const data = await res.json();
        const draftToken = data.draftSessionToken || data.data?.draftSessionToken || '';
        setToken(draftToken);
        
        const draftRes = await fetch(\`\${apiUrl}/public/invitations/draft\`, { 
          credentials: 'include',
          headers: draftToken ? { 'Authorization': \`Bearer \${draftToken}\` } : undefined
        });`;
code = code.replace(startDraftRegex, newStartDraft);

// Replace PATCH draft
const patchDraftRegex = /const res = await fetch\(`\$\{apiUrl\}\/public\/invitations\/draft`, \{\s*method: 'PATCH',\s*headers: \{ 'Content-Type': 'application\/json' \},\s*credentials: 'include',/m;
const newPatchDraft = `const res = await fetch(\`\${apiUrl}/public/invitations/draft\`, {
            method: 'PATCH',
            headers: { 
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': \`Bearer \${token}\` } : {})
            },
            credentials: 'include',`;
code = code.replace(patchDraftRegex, newPatchDraft);

// Replace handleMediaLink POST
const mediaPostRegex = /await fetch\(`\$\{apiUrl\}\/public\/media\/link`, \{\s*method: 'POST',\s*headers: \{ 'Content-Type': 'application\/json' \},\s*credentials: 'include',\s*body: JSON\.stringify\(\{ url, type, role \}\)\s*\}\);\s*const draftRes = await fetch\(`\$\{apiUrl\}\/public\/invitations\/draft`, \{ credentials: 'include' \}\);/m;
const newMediaPost = `await fetch(\`\${apiUrl}/public/media/link\`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': \`Bearer \${token}\` } : {})
          },
          credentials: 'include',
          body: JSON.stringify({ url, type, role })
        });
        const draftRes = await fetch(\`\${apiUrl}/public/invitations/draft\`, { 
          credentials: 'include',
          headers: token ? { 'Authorization': \`Bearer \${token}\` } : undefined
        });`;
code = code.replace(mediaPostRegex, newMediaPost);

// Replace POST submit
const submitPostRegex = /const res = await fetch\(`\$\{apiUrl\}\/public\/invitations\/submit`, \{\s*method: 'POST',\s*credentials: 'include'\s*\}\);/m;
const newSubmitPost = `const res = await fetch(\`\${apiUrl}/public/invitations/submit\`, {
          method: 'POST',
          credentials: 'include',
          headers: token ? { 'Authorization': \`Bearer \${token}\` } : undefined
        });`;
code = code.replace(submitPostRegex, newSubmitPost);

fs.writeFileSync('apps/web/src/app/create/page.tsx', code);
