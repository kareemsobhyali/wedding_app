const fs = require('fs');

const adminFormPath = 'apps/web/src/app/admin/invitations/[id]/AdminEditForm.tsx';
let adminCode = fs.readFileSync(adminFormPath, 'utf8');

if (!adminCode.includes('getTemplateImplementation')) {
  adminCode = adminCode.replace(
    "import { useRouter } from 'next/navigation';",
    "import { useRouter } from 'next/navigation';\nimport { getTemplateImplementation } from '../../../../../templates/registry';"
  );
}

if (!adminCode.includes('customData: invitation.customData || {}')) {
  adminCode = adminCode.replace(
    "bridePhone: invitation.bridePhone || '',",
    "bridePhone: invitation.bridePhone || '',\n    customData: invitation.customData || {},"
  );
}
// Add to useEffect too
if (!adminCode.includes('customData: invitation.customData || {},')) {
  adminCode = adminCode.replace(
    "bridePhone: invitation.bridePhone || '',\n    });",
    "bridePhone: invitation.bridePhone || '',\n      customData: invitation.customData || {},\n    });"
  );
}
// In case Windows line endings mess it up
adminCode = adminCode.replace(
  "bridePhone: invitation.bridePhone || '',\r\n    });",
  "bridePhone: invitation.bridePhone || '',\r\n      customData: invitation.customData || {},\r\n    });"
);

if (!adminCode.includes('handleCustomDataChange')) {
  adminCode = adminCode.replace(
    "const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {",
    `const handleCustomDataChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      customData: { ...(prev.customData || {}), [key]: value }
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {`
  );
}

const customFieldsUI = `
      {invitation?.template?.slug && getTemplateImplementation(invitation.template.slug)?.metadata?.customFields?.length ? (
        <div className="pt-6 border-t mt-6 col-span-1 md:col-span-2">
          <h3 className="font-bold text-lg mb-4 text-indigo-700">Theme Specific Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getTemplateImplementation(invitation.template.slug)?.metadata?.customFields?.map((field: any) => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-1">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea 
                    value={(formData as any).customData?.[field.key] || field.defaultValue || ''}
                    onChange={e => handleCustomDataChange(field.key, e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                ) : field.type === 'color' ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={(formData as any).customData?.[field.key] || field.defaultValue || '#000000'}
                      onChange={e => handleCustomDataChange(field.key, e.target.value)}
                      className="w-10 h-10 border rounded cursor-pointer p-1"
                    />
                    <span className="text-sm text-gray-600">{(formData as any).customData?.[field.key] || field.defaultValue || '#000000'}</span>
                  </div>
                ) : (
                  <input 
                    type={field.type === 'date' ? 'date' : 'text'}
                    value={(formData as any).customData?.[field.key] || field.defaultValue || ''}
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

if (!adminCode.includes('Theme Specific Settings')) {
  adminCode = adminCode.replace(
    '<button type="submit"',
    customFieldsUI + '\n      <button type="submit"'
  );
}

fs.writeFileSync(adminFormPath, adminCode);
console.log('AdminEditForm.tsx patched');
