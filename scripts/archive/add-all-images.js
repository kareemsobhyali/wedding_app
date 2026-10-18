const fs = require('fs');

const registryPath = 'apps/web/src/templates/registry.ts';
let registryCode = fs.readFileSync(registryPath, 'utf8');

// I will just add bgImage, mainImage to ALL templates' customFields arrays.
const allTemplates = ['classic-elegance', 'modern-minimalist', 'floral-romance', 'botanical-rustic', 'golden-arabic'];
allTemplates.forEach(id => {
  // if customFields exists, append to it. if not, add it.
  const regex = new RegExp(`('${id}':\\s*{\\s*component:\\s*\\w+,\\s*metadata:\\s*{[^}]*?supportedFeatures:\\s*\\[[^\\]]*\\])(,\\s*customFields:\\s*\\[([^\\]]*)\\])?`);
  
  registryCode = registryCode.replace(regex, (match, beforeCustomFields, hasCustomFields, existingFields) => {
    let newFields = `
          { key: 'bgImage', label: 'Background Image URL', type: 'text', defaultValue: '' },
          { key: 'mainImage', label: 'Main Hero Image URL', type: 'text', defaultValue: '' }`;
    
    if (hasCustomFields) {
      return `${beforeCustomFields}, customFields: [${existingFields}${existingFields.trim() ? ',' : ''}${newFields}]`;
    } else {
      return `${beforeCustomFields}, customFields: [${newFields}]`;
    }
  });
});

fs.writeFileSync(registryPath, registryCode);
console.log('Added image custom fields to all templates');
