const fs = require('fs');
const file = 'apps/web/src/app/create/page.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `  const availableTemplates = [
    { id: 'classic-elegance', name: 'Classic Elegance' },
    { id: 'modern-minimalist', name: 'Modern Minimalist' },
    { id: 'floral-romance', name: 'Floral Romance' },
    { id: 'botanical-rustic', name: 'Botanical Rustic' },
    { id: 'heavenly-roses', name: 'Heavenly Roses' }
  ];`;

const replacement = `  const availableTemplates = [
    { id: 'butterfly-elegance', name: 'Butterfly Elegance 🦋' },
    { id: 'heavenly-roses', name: 'Heavenly Roses 🌹' },
    { id: 'classic-elegance', name: 'Classic Elegance' },
    { id: 'modern-minimalist', name: 'Modern Minimalist' },
    { id: 'floral-romance', name: 'Floral Romance' },
    { id: 'botanical-rustic', name: 'Botanical Rustic' }
  ];`;

if (code.includes('classic-elegance') && !code.includes('butterfly-elegance')) {
  // Use regex to handle CRLF / LF flexibly
  code = code.replace(/const availableTemplates = \[[^\]]*\];/, replacement.trim());
  fs.writeFileSync(file, code);
  console.log('Added butterfly-elegance to create page successfully!');
} else {
  console.log('Already added or pattern not matched');
}
