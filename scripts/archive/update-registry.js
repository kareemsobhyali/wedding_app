const fs = require('fs');

const registryPath = 'apps/web/src/templates/registry.ts';
let code = fs.readFileSync(registryPath, 'utf8');

const replacement = `supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'GALLERY', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'floatingType', label: 'Floating Element Type (hearts, petals, stars, gold-dust)', type: 'text', defaultValue: 'hearts' },
        { key: 'floatingCount', label: 'Number of Floating Elements', type: 'text', defaultValue: '15' }
      ]`;

code = code.replace(
  "supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'GALLERY', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'CONTACTS', 'SHARE']",
  replacement
);

fs.writeFileSync(registryPath, code);
console.log('registry.ts updated with customFields');
