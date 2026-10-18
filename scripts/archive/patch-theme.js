const fs = require('fs');
let code = fs.readFileSync('apps/web/src/templates/designs/heavenly-roses/index.tsx', 'utf8');

// Replace component name
code = code.replace(/GoldenArabicTemplate/g, 'HeavenlyRosesTemplate');

// Replace CSS styles injection for the background
code = code.replace(
  /\.golden-arabic-bg \{[\s\S]*?\}/,
  `.heavenly-roses-bg {
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
  }`
);

// Replace class names in the render
code = code.replace(/className="min-h-screen bg-stone-950 text-amber-50 golden-arabic-bg overflow-hidden relative"/g, 'className="min-h-screen text-stone-800 heavenly-roses-bg overflow-hidden relative"');
code = code.replace(/bg-black\/40 backdrop-blur-md border border-amber-500\/30/g, 'glass-panel text-stone-800');
code = code.replace(/text-amber-400/g, 'text-pink-600');
code = code.replace(/text-amber-300/g, 'text-pink-500');
code = code.replace(/text-amber-50/g, 'text-stone-700');
code = code.replace(/text-amber-100/g, 'text-stone-600');
code = code.replace(/text-amber-200/g, 'text-pink-700');
code = code.replace(/border-amber-500\/20/g, 'border-pink-300');
code = code.replace(/border-amber-500\/30/g, 'border-pink-300');
code = code.replace(/border-amber-500\/50/g, 'border-pink-400');
code = code.replace(/border-amber-500\/70/g, 'border-pink-500');
code = code.replace(/from-amber-600 to-yellow-400/g, 'from-pink-400 to-rose-400');
code = code.replace(/from-amber-900\/80 to-black/g, 'from-white/60 to-pink-50/80');
code = code.replace(/bg-amber-500/g, 'bg-pink-500');
code = code.replace(/ring-amber-500\/50/g, 'ring-pink-300/50');
code = code.replace(/bg-black\/60/g, 'glass-panel');
code = code.replace(/hover:bg-amber-500\/20/g, 'hover:bg-pink-100');

// Fix button classes specifically
code = code.replace(/bg-gradient-to-r from-amber-600 to-yellow-500 text-black/g, 'rose-button text-white');

// Ensure z-index is correct so content appears above background pseudo element
code = code.replace(/<div className="max-w-md mx-auto relative px-4/g, '<div className="max-w-md mx-auto relative px-4 z-10');

// Find the abstract decorative SVG block and remove it to keep it clean
code = code.replace(/<svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20"[\s\S]*?<\/svg>/, '');

fs.writeFileSync('apps/web/src/templates/designs/heavenly-roses/index.tsx', code);
