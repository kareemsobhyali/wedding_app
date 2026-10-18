const fs = require('fs');
const file = 'apps/web/src/templates/types.ts';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('TemplateCustomField')) {
  code = code.replace(
    'export interface TemplateMetadata {',
    `export interface TemplateCustomField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'color' | 'date';
  defaultValue?: string;
}

export interface TemplateMetadata {`
  );
  
  code = code.replace(
    'supportedFeatures: TemplateFeature[];',
    'supportedFeatures: TemplateFeature[];\n  customFields?: TemplateCustomField[];'
  );
  
  code = code.replace(
    'music?: AudioViewModel;',
    'music?: AudioViewModel;\n  customData?: Record<string, any>;'
  );
  
  fs.writeFileSync(file, code);
  console.log('types.ts updated');
} else {
  console.log('types.ts already updated');
}
