const fs = require('fs');

const registryPath = 'apps/web/src/templates/registry.ts';
let registryCode = fs.readFileSync(registryPath, 'utf8');

const additionalFields = `,
        { key: 'bgImage', label: 'Background Image URL (Leave blank for default)', type: 'text', defaultValue: '' }
      ]`;

registryCode = registryCode.replace(
  "{ key: 'closingMessage', label: 'Closing Message (e.g. بكم تكتمل فرحتنا)', type: 'text', defaultValue: 'بكم تكتمل فرحتنا' }\n      ]",
  "{ key: 'closingMessage', label: 'Closing Message (e.g. بكم تكتمل فرحتنا)', type: 'text', defaultValue: 'بكم تكتمل فرحتنا' }" + additionalFields
);
fs.writeFileSync(registryPath, registryCode);


const tmplPath = 'apps/web/src/templates/designs/heavenly-roses/index.tsx';
let tmplCode = fs.readFileSync(tmplPath, 'utf8');

// Change the background image to be dynamic
tmplCode = tmplCode.replace(
  "background-image: url('/assets/templates/heavenly-roses-bg.jpg');",
  "background-image: url('${data.customData?.bgImage || \"/assets/templates/heavenly-roses-bg.jpg\"}');"
);

fs.writeFileSync(tmplPath, tmplCode);
console.log('Added dynamic background image field');
