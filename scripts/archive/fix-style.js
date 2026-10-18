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
      \`}</style>`;

// Remove the injected block before <main
code = code.replace(styleBlock + '\n      <main', '<main');

// Add it inside <main
code = code.replace('<main className="min-h-screen bg-[#FDFBF7] font-cairo text-gray-800 overflow-hidden" dir="rtl">', '<main className="min-h-screen bg-[#FDFBF7] font-cairo text-gray-800 overflow-hidden" dir="rtl">\n' + styleBlock);

fs.writeFileSync(file, code);
console.log('Fixed style injection');
