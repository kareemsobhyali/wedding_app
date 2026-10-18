const fs = require('fs');

const file = 'apps/web/src/app/admin/invitations/[id]/AdminEditForm.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/className="grid grid-cols-2 gap-4"/g, 'className="grid grid-cols-1 md:grid-cols-2 gap-4"');

fs.writeFileSync(file, code);
console.log('Fixed AdminEditForm responsiveness');
