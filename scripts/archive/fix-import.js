const fs = require('fs');
const file = 'apps/web/src/app/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "import { templateRegistry } from '../../templates/registry';",
  "import { templateRegistry } from '../templates/registry';"
);

fs.writeFileSync(file, code);
console.log('Fixed import in page.tsx');
