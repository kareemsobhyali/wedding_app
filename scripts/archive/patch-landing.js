const fs = require('fs');
const file = 'apps/web/src/app/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// Change siteName
code = code.replace(
  '<div className="font-bold text-2xl text-indigo-900">زفافي</div>',
  '<div className="font-bold text-2xl text-indigo-900">{settings.siteName || "دعوتي Daawati"}</div>'
);

code = code.replace(
  '<p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} منصة زفافي</p>',
  '<p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} {settings.siteName || "دعوتي Daawati"}</p>'
);

// Apply custom previewImage logic
code = code.replace(
  'src={tpl.previewImage}',
  'src={settings.previewImages?.[tpl.id] || tpl.previewImage}'
);

fs.writeFileSync(file, code);
console.log('Fixed page.tsx');
