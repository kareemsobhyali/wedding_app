const fs = require('fs');
const registryPath = 'apps/web/src/templates/registry.ts';
let code = fs.readFileSync(registryPath, 'utf8');

const templates = [
  { id: 'classic-elegance', defaultType: 'stars' },
  { id: 'modern-minimalist', defaultType: 'stars' },
  { id: 'floral-romance', defaultType: 'petals' },
  { id: 'botanical-rustic', defaultType: 'petals' }
];

for (const tmpl of templates) {
  const replacement = `supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'GALLERY', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'floatingType', label: 'Floating Element Type (hearts, petals, stars, gold-dust)', type: 'text', defaultValue: '${tmpl.defaultType}' },
        { key: 'floatingCount', label: 'Number of Floating Elements', type: 'text', defaultValue: '15' }
      ]`;

  const blocks = code.split(`'${tmpl.id}': {`);
  if (blocks.length > 1) {
    if (!blocks[1].includes('customFields: [')) {
      blocks[1] = blocks[1].replace(
        "supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'GALLERY', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'CONTACTS', 'SHARE']",
        replacement
      );
      code = blocks.join(`'${tmpl.id}': {`);
    }
  }
}

fs.writeFileSync(registryPath, code);
console.log('registry.ts updated with customFields for all templates');
