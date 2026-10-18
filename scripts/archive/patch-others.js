const fs = require('fs');
const path = require('path');

const baseDir = 'apps/web/src/templates/designs';
const templates = ['classic-elegance', 'modern-minimalist', 'floral-romance', 'botanical-rustic'];

for (const tmpl of templates) {
  const p = path.join(baseDir, tmpl, 'index.tsx');
  if (!fs.existsSync(p)) continue;
  
  let code = fs.readFileSync(p, 'utf8');
  if (code.includes('FloatingElements')) continue;

  // Add import
  code = code.replace(
    'import { RevealWrapper } from "../../utils/useScrollReveal";',
    'import { RevealWrapper } from "../../utils/useScrollReveal";\nimport { FloatingElements } from "../../utils/FloatingElements";'
  );
  
  // Inject inside the main wrapper
  const wrapperRegex = /<div className=\{`w-full min-h-screen relative font-sans .*?`\}>/;
  const match = code.match(wrapperRegex);
  if (match) {
    code = code.replace(
      match[0],
      `${match[0]}\n      <FloatingElements type={data.customData?.floatingType || (['floral-romance', 'botanical-rustic'].includes('${tmpl}') ? 'petals' : 'stars')} count={data.customData?.floatingCount || 15} />\n`
    );
  }
  
  fs.writeFileSync(p, code);
  console.log('Patched ' + tmpl);
}
