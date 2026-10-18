const fs = require('fs');
const file = 'apps/web/src/app/create/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "{ id: 'golden-arabic', name: 'Golden Arabic' },\n      { id: 'heavenly-roses', name: 'Heavenly Roses' }",
  "{ id: 'heavenly-roses', name: 'Heavenly Roses' }"
);

// Fallback if \r\n
code = code.replace(
  "{ id: 'golden-arabic', name: 'Golden Arabic' },\r\n      { id: 'heavenly-roses', name: 'Heavenly Roses' }",
  "{ id: 'heavenly-roses', name: 'Heavenly Roses' }"
);

fs.writeFileSync(file, code);
console.log('Removed golden-arabic from available templates in create/page.tsx');
