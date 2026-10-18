const fs = require('fs');
let buf = fs.readFileSync('apps/web/src/app/create/page.tsx');
let str = buf.toString('utf8');
str = str.replace(/\0/g, '');
fs.writeFileSync('apps/web/src/app/create/page.tsx', str, 'utf8');

// Also fix registry.ts which I also echoed to!
let buf2 = fs.readFileSync('apps/web/src/templates/registry.ts');
let str2 = buf2.toString('utf8');
str2 = str2.replace(/\0/g, '');
fs.writeFileSync('apps/web/src/templates/registry.ts', str2, 'utf8');
