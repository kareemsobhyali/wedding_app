const fs = require('fs');

const file = 'apps/web/src/app/admin/layout.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('href="/admin/settings"')) {
  code = code.replace(
    '<Link href="/admin/invitations" className="block py-2 text-stone-300 hover:text-white transition-colors">Invitations</Link>',
    '<Link href="/admin/invitations" className="block py-2 text-stone-300 hover:text-white transition-colors">Invitations</Link>\n          <Link href="/admin/settings" className="block py-2 text-stone-300 hover:text-white transition-colors">Site Settings</Link>'
  );
  fs.writeFileSync(file, code);
  console.log('Added Site Settings link to layout');
}
