const fs = require('fs');
const file = 'apps/web/src/app/create/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `              customData: draft.customData,
            caption: draft.caption,
            weddingMessage: draft.weddingMessage,
            customData: draft.customData,`,
  `            caption: draft.caption,
            weddingMessage: draft.weddingMessage,
            customData: draft.customData,`
);

fs.writeFileSync(file, code);
console.log('Fixed page.tsx');
