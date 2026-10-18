const fs = require('fs');
const file = 'apps/web/src/app/admin/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  '<div className="p-8">',
  '<div className="p-4 sm:p-8 max-w-full overflow-hidden">'
);

fs.writeFileSync(file, code);
console.log('Fixed dashboard responsiveness');
