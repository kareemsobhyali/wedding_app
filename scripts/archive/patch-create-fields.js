const fs = require('fs');

const createPagePath = 'apps/web/src/app/create/page.tsx';
let createCode = fs.readFileSync(createPagePath, 'utf8');

if (!createCode.includes('getTemplateImplementation')) {
  createCode = createCode.replace(
    "import { InvitationPreview } from '../../components/invitation-preview/InvitationPreview';",
    "import { InvitationPreview } from '../../components/invitation-preview/InvitationPreview';\nimport { getTemplateImplementation } from '../../templates/registry';"
  );
}

// Add a function to handle custom data changes
if (!createCode.includes('handleCustomDataChange')) {
  createCode = createCode.replace(
    "const handleFieldChange = (field: string, value: any) => {",
    `const handleCustomDataChange = (key: string, value: any) => {
      setDraft((prev: any) => ({
        ...prev,
        customData: { ...(prev.customData || {}), [key]: value }
      }));
      setSaveState('saving');
    };

    const handleFieldChange = (field: string, value: any) => {`
  );
}

// Add customData to the PATCH request payload
createCode = createCode.replace(
  "brideContact: draft.bridePhone,",
  "brideContact: draft.bridePhone,\n              customData: draft.customData,"
);

// Find where to render the custom fields in the form
const renderRegex = /<\/div>\s*<\/div>\s*<\/div>\s*<div className="pt-4 border-t flex justify-between items-center">/m;

const customFieldsUI = `
        {draft && getTemplateImplementation(draft?.template?.slug || draft?.templateId)?.metadata?.customFields?.length ? (
          <div className="pt-6 border-t mt-6">
            <h3 className="font-bold text-lg mb-4 text-indigo-700">Theme Specific Settings</h3>
            <div className="space-y-4">
              {getTemplateImplementation(draft?.template?.slug || draft?.templateId)?.metadata?.customFields?.map((field: any) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      value={draft?.customData?.[field.key] || field.defaultValue || ''}
                      onChange={e => handleCustomDataChange(field.key, e.target.value)}
                      className="w-full p-2 border rounded"
                      rows={3}
                    />
                  ) : field.type === 'color' ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={draft?.customData?.[field.key] || field.defaultValue || '#000000'}
                        onChange={e => handleCustomDataChange(field.key, e.target.value)}
                        className="w-10 h-10 border rounded cursor-pointer p-1"
                      />
                      <span className="text-sm text-gray-600">{draft?.customData?.[field.key] || field.defaultValue || '#000000'}</span>
                    </div>
                  ) : (
                    <input 
                      type={field.type === 'date' ? 'date' : 'text'}
                      value={draft?.customData?.[field.key] || field.defaultValue || ''}
                      onChange={e => handleCustomDataChange(field.key, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
`;

if (!createCode.includes('Theme Specific Settings')) {
  createCode = createCode.replace(
    '<div className="pt-4 border-t flex justify-between items-center">',
    customFieldsUI + '\n        <div className="pt-4 border-t flex justify-between items-center">'
  );
}

fs.writeFileSync(createPagePath, createCode);
console.log('page.tsx patched');
