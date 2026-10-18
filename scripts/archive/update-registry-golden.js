const fs = require('fs');
const registryPath = 'apps/web/src/templates/registry.ts';
let code = fs.readFileSync(registryPath, 'utf8');

const replacement = `supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'GALLERY', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'floatingType', label: 'Floating Element Type (hearts, petals, stars, gold-dust)', type: 'text', defaultValue: 'gold-dust' },
        { key: 'floatingCount', label: 'Number of Floating Elements', type: 'text', defaultValue: '30' }
      ]`;

// We have multiple 'supportedFeatures: ...' lines in registry.ts. We specifically want to target golden-arabic.
// Let's use a smarter replace.
const blocks = code.split("'golden-arabic': {");
if (blocks.length > 1) {
  blocks[1] = blocks[1].replace(
    "supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'GALLERY', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'CONTACTS', 'SHARE']",
    replacement
  );
  code = blocks.join("'golden-arabic': {");
  fs.writeFileSync(registryPath, code);
  console.log('golden-arabic updated with customFields in registry');
}
