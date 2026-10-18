const fs = require('fs');
let code = fs.readFileSync('apps/web/src/templates/designs/heavenly-roses/index.tsx', 'utf8');

// Add class to root div
code = code.replace(
  'className={`min-h-screen relative font-arabic bg-warm-white text-text-dark',
  'className={`heavenly-roses-bg min-h-screen relative font-arabic bg-warm-white text-text-dark'
);

// Add CSS rules
const newStyles = `
          .heavenly-roses-bg {
            background-image: url('/assets/templates/heavenly-roses-bg.jpg');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-repeat: no-repeat;
            position: relative;
          }
          .heavenly-roses-bg::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(255, 230, 240, 0.4) 0%, rgba(255, 200, 220, 0.2) 100%);
            pointer-events: none;
            z-index: 1;
          }
          .glass-panel {
            background: rgba(255, 255, 255, 0.65);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 8px 32px 0 rgba(255, 180, 200, 0.3);
          }
          .rose-text {
            background: linear-gradient(45deg, #d87093, #ff1493);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .rose-button {
            background: linear-gradient(45deg, #ffb6c1, #ff69b4);
            color: white;
            box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
            transition: all 0.3s ease;
          }
          .rose-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 105, 180, 0.6);
          }
`;

// Inject into style block
code = code.replace(/<style dangerouslySetInnerHTML={{__html: `/g, '<style dangerouslySetInnerHTML={{__html: `' + newStyles);

// Change text and bg colors dynamically inside the component:
code = code.replace(/bg-stone-900\/70/g, 'glass-panel');
code = code.replace(/bg-stone-950\/90/g, 'glass-panel');
code = code.replace(/text-gold-primary/g, 'rose-text');
code = code.replace(/text-gold-light/g, 'text-pink-600');
code = code.replace(/border-gold-primary\/30/g, 'border-pink-300');
code = code.replace(/border-gold-primary\/50/g, 'border-pink-400');
code = code.replace(/border-gold-primary/g, 'border-pink-400');
code = code.replace(/bg-gold-primary\/10/g, 'bg-pink-100/50');
code = code.replace(/bg-gold-primary/g, 'rose-button text-white');

// Ensure z-index is positive for relative elements so they appear above the gradient pseudo-element
code = code.replace(/className="max-w-md mx-auto/g, 'className="max-w-md mx-auto relative z-10');
code = code.replace(/className="text-center mb-16/g, 'className="text-center mb-16 relative z-10');
code = code.replace(/className="space-y-4/g, 'className="space-y-4 relative z-10');

fs.writeFileSync('apps/web/src/templates/designs/heavenly-roses/index.tsx', code);
