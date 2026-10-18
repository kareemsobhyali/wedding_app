const fs = require('fs');
const file = 'apps/web/src/app/LandingClient.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/settings\.contactImage/g, 'settings.contactInstagram');
code = code.replace(/Image className/g, 'Camera className');
code = code.replace(/import \{ (.*)Image(.*) \} from 'lucide-react'/, "import { $1Camera$2 } from 'lucide-react'");

fs.writeFileSync(file, code);
console.log('Fixed property names');
