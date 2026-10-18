const fs = require('fs');

let code = fs.readFileSync('apps/web/src/app/create/page.tsx', 'utf8');

// 1. Add token state
code = code.replace(
  'const [submitError, setSubmitError] = useState(\'\');',
  'const [submitError, setSubmitError] = useState(\'\');\n  const [token, setToken] = useState(\'\');'
);

// 2. Fix startDraft to parse token and use it
const oldStartDraft = `        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.message || 'Failed to start invitation draft. Please try again.');
        }
        
        const draftRes = await fetch(\`\${apiUrl}/public/invitations/draft\`, { credentials: 'include' });`;

const newStartDraft = `        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.message || 'Failed to start invitation draft. Please try again.');
        }
        const data = await res.json();
        const draftToken = data.draftSessionToken || data.data?.draftSessionToken || '';
        setToken(draftToken);
        
        const draftRes = await fetch(\`\${apiUrl}/public/invitations/draft\`, { 
          credentials: 'include', 
          headers: draftToken ? { 'Authorization': \`Bearer \${draftToken}\` } : {}
        });`;

code = code.replace(oldStartDraft, newStartDraft);

// 3. Fix useEffect for PATCH to use token
const oldPatch = `          const res = await fetch(\`\${apiUrl}/public/invitations/draft\`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',`;

const newPatch = `          const res = await fetch(\`\${apiUrl}/public/invitations/draft\`, {
            method: 'PATCH',
            headers: { 
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': \`Bearer \${token}\` } : {})
            },
            credentials: 'include',`;

code = code.replace(oldPatch, newPatch);
// Handle Windows line endings too
code = code.replace(oldPatch.replace(/\n/g, '\r\n'), newPatch.replace(/\n/g, '\r\n'));

// 4. Fix submitDraft
const oldSubmit = `        const res = await fetch(\`\${apiUrl}/public/invitations/submit\`, {
          method: 'POST',
          credentials: 'include'
        });`;

const newSubmit = `        const res = await fetch(\`\${apiUrl}/public/invitations/submit\`, {
          method: 'POST',
          credentials: 'include',
          headers: token ? { 'Authorization': \`Bearer \${token}\` } : {}
        });`;

code = code.replace(oldSubmit, newSubmit);
code = code.replace(oldSubmit.replace(/\n/g, '\r\n'), newSubmit.replace(/\n/g, '\r\n'));

// 5. Fix handleMediaLink
const oldMedia = `        await fetch(\`\${apiUrl}/public/media/link\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ url, type, role })
        });
        const draftRes = await fetch(\`\${apiUrl}/public/invitations/draft\`, { credentials: 'include' });`;

const newMedia = `        await fetch(\`\${apiUrl}/public/media/link\`, {
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
          headers: token ? { 'Authorization': \`Bearer \${token}\` } : {}
        });`;

code = code.replace(oldMedia, newMedia);
code = code.replace(oldMedia.replace(/\n/g, '\r\n'), newMedia.replace(/\n/g, '\r\n'));

fs.writeFileSync('apps/web/src/app/create/page.tsx', code);
