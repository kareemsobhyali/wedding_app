const fs = require('fs');
const file = 'apps/web/src/app/LandingClient.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace Instagram icon with Image icon
code = code.replace(/Instagram/g, 'Image');

fs.writeFileSync(file, code);
console.log('Fixed icon import in LandingClient.tsx');
