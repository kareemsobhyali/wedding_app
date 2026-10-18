const fs = require('fs');
const file = 'apps/web/src/app/LandingClient.tsx';
let code = fs.readFileSync(file, 'utf8');

const styleBlock = `
      <style jsx global>{\`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D4A373;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #BC8A5F;
        }
      \`}</style>
`;

if (!code.includes('custom-scrollbar::-webkit-scrollbar')) {
  code = code.replace('<main', styleBlock + '      <main');
  fs.writeFileSync(file, code);
}
console.log('Added custom scrollbar style');
