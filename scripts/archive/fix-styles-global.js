const fs = require('fs');
const file = 'apps/web/src/app/LandingClient.tsx';
let code = fs.readFileSync(file, 'utf8');

// Remove the <style jsx global> block
code = code.replace(/<style jsx global>\{`[\s\S]*?`\}<\/style>/, '');

fs.writeFileSync(file, code);
console.log('Removed styled-jsx from LandingClient');

// Append to globals.css
const cssFile = 'apps/web/src/app/globals.css';
let css = fs.readFileSync(cssFile, 'utf8');
css += `
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
`;
fs.writeFileSync(cssFile, css);
console.log('Added scrollbar styles to globals.css');
