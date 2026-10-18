const fs = require('fs');

const registryPath = 'apps/web/src/templates/registry.ts';
let registryCode = fs.readFileSync(registryPath, 'utf8');

const replacement = `supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'GALLERY', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'CONTACTS', 'SHARE'],
      customFields: [
        { key: 'floatingType', label: 'Floating Element Type (hearts, petals, stars, gold-dust)', type: 'text', defaultValue: 'hearts' },
        { key: 'floatingCount', label: 'Number of Floating Elements', type: 'text', defaultValue: '15' },
        { key: 'timeline1Title', label: 'Timeline Event 1 - Title', type: 'text', defaultValue: 'عقد القران' },
        { key: 'timeline1Desc', label: 'Timeline Event 1 - Desc', type: 'text', defaultValue: 'يبدأ استقبال الضيوف وعقد القران' },
        { key: 'timeline1Time', label: 'Timeline Event 1 - Time', type: 'text', defaultValue: '08:00 PM' },
        { key: 'timeline2Title', label: 'Timeline Event 2 - Title', type: 'text', defaultValue: 'الزفة' },
        { key: 'timeline2Desc', label: 'Timeline Event 2 - Desc', type: 'text', defaultValue: 'زفة العروسين وبداية الحفل' },
        { key: 'timeline2Time', label: 'Timeline Event 2 - Time', type: 'text', defaultValue: '09:00 PM' },
        { key: 'timeline3Title', label: 'Timeline Event 3 - Title', type: 'text', defaultValue: 'العشاء' },
        { key: 'timeline3Desc', label: 'Timeline Event 3 - Desc', type: 'text', defaultValue: 'بوفيه العشاء المفتوح' },
        { key: 'timeline3Time', label: 'Timeline Event 3 - Time', type: 'text', defaultValue: '10:30 PM' },
      ]`;

// Find heavenly-roses block
const blocks = registryCode.split("'heavenly-roses': {");
if (blocks.length > 1) {
  blocks[1] = blocks[1].replace(
    "supportedFeatures: ['HERO', 'VENUE', 'MAPS', 'MUSIC', 'GALLERY', 'CUSTOM_MESSAGE', 'COUNTDOWN', 'CONTACTS', 'SHARE']",
    replacement
  );
  registryCode = blocks.join("'heavenly-roses': {");
  fs.writeFileSync(registryPath, registryCode);
  console.log('Added timeline fields to registry');
}
