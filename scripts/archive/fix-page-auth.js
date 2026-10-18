const fs = require('fs');
let code = fs.readFileSync('apps/web/src/app/create/page.tsx', 'utf8');

// Replace the GET /draft request to include the Authorization header
code = code.replace(
  'const draftRes = await fetch(`${apiUrl}/public/invitations/draft`, { credentials: \'include\' });',
  'const draftRes = await fetch(`${apiUrl}/public/invitations/draft`, { credentials: \'include\', headers: { \'Authorization\': `Bearer ${data.data.draftSessionToken}` } });'
);

// We also need to add it to the PATCH /draft request later in the file!
code = code.replace(
  'const res = await fetch(`${apiUrl}/public/invitations/draft`, {\n            method: \'PATCH\',\n            headers: { \'Content-Type\': \'application/json\' },\n            credentials: \'include\',',
  'const res = await fetch(`${apiUrl}/public/invitations/draft`, {\n            method: \'PATCH\',\n            headers: { \'Content-Type\': \'application/json\', \'Authorization\': `Bearer ${token}` },\n            credentials: \'include\','
);
code = code.replace(
  'const res = await fetch(`${apiUrl}/public/invitations/draft`, {\r\n            method: \'PATCH\',\r\n            headers: { \'Content-Type\': \'application/json\' },\r\n            credentials: \'include\',',
  'const res = await fetch(`${apiUrl}/public/invitations/draft`, {\r\n            method: \'PATCH\',\r\n            headers: { \'Content-Type\': \'application/json\', \'Authorization\': `Bearer ${token}` },\r\n            credentials: \'include\','
);

// We also need to add it to POST /submit
code = code.replace(
  'const res = await fetch(`${apiUrl}/public/invitations/submit`, {\n        method: \'POST\',\n        credentials: \'include\'\n      });',
  'const res = await fetch(`${apiUrl}/public/invitations/submit`, {\n        method: \'POST\',\n        credentials: \'include\',\n        headers: { \'Authorization\': `Bearer ${token}` }\n      });'
);
code = code.replace(
  'const res = await fetch(`${apiUrl}/public/invitations/submit`, {\r\n        method: \'POST\',\r\n        credentials: \'include\'\r\n      });',
  'const res = await fetch(`${apiUrl}/public/invitations/submit`, {\r\n        method: \'POST\',\r\n        credentials: \'include\',\r\n        headers: { \'Authorization\': `Bearer ${token}` }\r\n      });'
);


fs.writeFileSync('apps/web/src/app/create/page.tsx', code);
