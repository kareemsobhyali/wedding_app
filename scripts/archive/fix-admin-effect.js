const fs = require('fs');
const file = 'apps/web/src/app/admin/invitations/[id]/AdminEditForm.tsx';
let code = fs.readFileSync(file, 'utf8');

// The `setFormData` inside useEffect needs `customData`
const regex = /bridePhone: invitation\.bridePhone \|\| '',\s*\}\);/g;
code = code.replace(regex, "bridePhone: invitation.bridePhone || '',\n      customData: invitation.customData || {},\n    });");

fs.writeFileSync(file, code);
console.log('Fixed useEffect customData');
