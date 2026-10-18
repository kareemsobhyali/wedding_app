const fs = require('fs');
const file = 'apps/web/src/app/create/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/\s*\{\s*id:\s*'golden-arabic',\s*name:\s*'Golden Arabic'\s*\},/g, '');

fs.writeFileSync(file, code);
console.log('Removed golden-arabic with regex');
