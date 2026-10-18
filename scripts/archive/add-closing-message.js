const fs = require('fs');

const registryPath = 'apps/web/src/templates/registry.ts';
let registryCode = fs.readFileSync(registryPath, 'utf8');

const additionalFields = `,
        { key: 'closingMessage', label: 'Closing Message (e.g. بكم تكتمل فرحتنا)', type: 'text', defaultValue: 'بكم تكتمل فرحتنا' }
      ]`;

registryCode = registryCode.replace(
  "{ key: 'timeline3Time', label: 'Timeline Event 3 - Time', type: 'text', defaultValue: '10:30 PM' },\n      ]",
  "{ key: 'timeline3Time', label: 'Timeline Event 3 - Time', type: 'text', defaultValue: '10:30 PM' }" + additionalFields
);
fs.writeFileSync(registryPath, registryCode);


const tmplPath = 'apps/web/src/templates/designs/heavenly-roses/index.tsx';
let tmplCode = fs.readFileSync(tmplPath, 'utf8');

tmplCode = tmplCode.replace(
  /<p className="font-arabic text-3xl text-gold-dark shimmer-text leading-loose">.*?<\/p>/,
  '<p className="font-arabic text-3xl text-gold-dark shimmer-text leading-loose">{data.customData?.closingMessage || "بكم تكتمل فرحتنا"}</p>'
);

fs.writeFileSync(tmplPath, tmplCode);
console.log('Added closingMessage custom field');
