const fs = require('fs');
const file = 'apps/web/src/app/admin/invitations/[id]/page.tsx';
let code = fs.readFileSync(file, 'utf8');

const slugEditorMarkup = `
        <SlugEditor 
          invitationId={inv.id} 
          currentSlug={inv.slugs?.find((s: any) => s.isCurrent)?.slug || inv.slugs?.[0]?.slug || ''} 
          apiToken={cookieStore.get("admin_session")?.value || ''} 
        />
`;

if (!code.includes('<SlugEditor')) {
  code = code.replace(
    /<div className="bg-white p-6 shadow rounded border">\s*<h2 className="font-bold text-lg border-b pb-2 mb-4">State Transitions<\/h2>/,
    slugEditorMarkup + '\n\n        <div className="bg-white p-6 shadow rounded border">\n          <h2 className="font-bold text-lg border-b pb-2 mb-4">State Transitions</h2>'
  );
  fs.writeFileSync(file, code);
  console.log('Fixed SlugEditor injection');
}
