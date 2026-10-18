const fs = require('fs');
const file = 'apps/web/src/app/LandingClient.tsx';
let code = fs.readFileSync(file, 'utf8');

// Update grid container padding and gap for mobile
code = code.replace(
  '<div className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory px-4 sm:px-8 custom-scrollbar">',
  '<div className="flex overflow-x-auto gap-4 md:gap-8 pb-12 snap-x snap-mandatory px-4 md:px-8 custom-scrollbar">'
);

// Update card wrapper sizing
code = code.replace(
  'className="bg-[#FDFBF7] rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-[#D4A373]/20 transition-all duration-500 group flex flex-col min-w-[85vw] md:min-w-[450px] snap-center shrink-0"',
  'className="bg-[#FDFBF7] rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-[#D4A373]/20 transition-all duration-500 group flex flex-col w-[85vw] sm:w-[350px] md:w-[400px] shrink-0 snap-center"'
);

// Update image container aspect ratio and height
// Right now it's: <div className="aspect-[3/4] relative bg-gray-200 overflow-hidden">
// We change it to a fixed height or different aspect ratio so it doesn't become extremely tall on mobile.
code = code.replace(
  '<div className="aspect-[3/4] relative bg-gray-200 overflow-hidden">',
  '<div className="h-64 sm:h-80 md:h-[450px] relative bg-gray-200 overflow-hidden w-full">'
);

fs.writeFileSync(file, code);
console.log('Fixed card responsiveness');
