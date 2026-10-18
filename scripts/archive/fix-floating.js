const fs = require('fs');
const file = 'apps/web/src/templates/utils/FloatingElements.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/\\`/g, '`');
code = code.replace(/\\\$/g, '$');

fs.writeFileSync(file, code);
console.log('Fixed FloatingElements.tsx syntax');
