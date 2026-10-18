const fs = require('fs');
const file = 'apps/web/src/app/admin/invitations/[id]/page.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('SlugEditor')) {
  code = code.replace(
    "import AdminActionButtons from './AdminActionButtons';",
    "import AdminActionButtons from './AdminActionButtons';\nimport SlugEditor from './SlugEditor';"
  );
  
  const stateTransitions = `<div className="bg-white p-6 shadow rounded border">
            <h2 className="font-bold text-lg border-b pb-2 mb-4">State Transitions</h2>
            <AdminActionButtons invitationId={inv.id} apiToken={cookieStore.get("admin_session")?.value || ''} />
          </div>`;
          
  const slugEditorMarkup = `
          <SlugEditor 
            invitationId={inv.id} 
            currentSlug={inv.slugs?.find((s: any) => s.isCurrent)?.slug || inv.slugs?.[0]?.slug || ''} 
            apiToken={cookieStore.get("admin_session")?.value || ''} 
          />
`;

  code = code.replace(stateTransitions, slugEditorMarkup + '\n\n          ' + stateTransitions);
  fs.writeFileSync(file, code);
  console.log('Added SlugEditor to details page');
}
