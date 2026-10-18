const fs = require('fs');

const file = 'apps/web/src/app/admin/layout.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  '<div className="flex min-h-screen bg-gray-50">',
  '<div className="flex flex-col md:flex-row min-h-screen bg-gray-50">'
);

code = code.replace(
  '<aside className="w-64 bg-stone-900 text-white shrink-0 p-6 flex flex-col">',
  '<aside className="w-full md:w-64 bg-stone-900 text-white shrink-0 p-4 md:p-6 flex flex-col sm:flex-row md:flex-col items-center md:items-start justify-between gap-4 md:gap-0 z-10">'
);

code = code.replace(
  '<h1 className="text-xl font-bold mb-12">Admin Portal</h1>',
  '<h1 className="text-xl font-bold md:mb-12">Admin Portal</h1>'
);

code = code.replace(
  '<nav className="flex-1 space-y-4">',
  '<nav className="flex sm:flex-1 md:flex-none flex-row md:flex-col gap-4 md:gap-0 md:space-y-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">'
);

fs.writeFileSync(file, code);
console.log('Fixed admin layout responsiveness');
