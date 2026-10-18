const fs = require('fs');

const file = 'apps/web/src/app/admin/invitations/[id]/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'className="p-8 max-w-7xl mx-auto flex gap-8"',
  'className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 overflow-hidden"'
);

// We need to replace all w-1/2 with w-full lg:w-1/2
code = code.replace(
  'className="w-1/2 space-y-6"',
  'className="w-full lg:w-1/2 space-y-6 max-w-full overflow-hidden"'
);

code = code.replace(
  'className="w-1/2 bg-gray-50 border rounded-xl overflow-hidden relative shadow-inner"',
  'className="w-full lg:w-1/2 bg-gray-50 border rounded-xl overflow-hidden relative shadow-inner min-h-[600px]"'
);

code = code.replace(
  '<h1 className="text-3xl font-bold">Manage Invitation</h1>',
  '<h1 className="text-2xl sm:text-3xl font-bold">Manage Invitation</h1>'
);

fs.writeFileSync(file, code);
console.log('Fixed details page responsiveness');
