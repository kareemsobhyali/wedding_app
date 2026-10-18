const fs = require('fs');
const file = 'apps/web/src/app/admin/invitations/[id]/AdminActionButtons.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace("import { toast } from 'react-hot-toast';", "");
code = code.replace("toast.success(`Invitation ${action}d successfully!`);", "alert(`Invitation ${action}d successfully!`);");
code = code.replace("toast.error(err.message || 'Action failed');", "alert(err.message || 'Action failed');");

fs.writeFileSync(file, code);
