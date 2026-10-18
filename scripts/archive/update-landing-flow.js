const fs = require('fs');
const file = 'apps/web/src/app/LandingClient.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Navbar
code = code.replace(
  '<Link href="/create" className="px-6 py-2.5 bg-gradient-to-r from-[#D4A373] to-[#BC8A5F] text-white rounded-full font-bold hover:shadow-lg hover:shadow-[#D4A373]/30 transition-all transform hover:-translate-y-0.5">\n            صمم دعوتك الآن\n          </Link>',
  '<a href="#contact" className="px-6 py-2.5 bg-gradient-to-r from-[#D4A373] to-[#BC8A5F] text-white rounded-full font-bold hover:shadow-lg hover:shadow-[#D4A373]/30 transition-all transform hover:-translate-y-0.5">\n            اطلب دعوتك الآن\n          </a>'
);

// 2. Hero Section
code = code.replace(
  '<Link href="/create" className="px-10 py-4 bg-gradient-to-r from-[#D4A373] to-[#BC8A5F] text-white rounded-full font-bold text-lg hover:shadow-xl hover:shadow-[#D4A373]/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">\n              ابدأ التصميم مجاناً\n              <Sparkles className="w-5 h-5" />\n            </Link>',
  '<a href="#contact" className="px-10 py-4 bg-gradient-to-r from-[#D4A373] to-[#BC8A5F] text-white rounded-full font-bold text-lg hover:shadow-xl hover:shadow-[#D4A373]/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">\n              تواصل معنا للطلب\n              <Sparkles className="w-5 h-5" />\n            </a>'
);

// 3. Templates Showcase
code = code.replace(
  '<Link href={`/create?template=${tpl.id}`} className="px-6 py-3 bg-white text-[#8E6E53] rounded-full font-bold hover:bg-gray-50 shadow-xl flex items-center gap-2">\n                      <Sparkles className="w-4 h-4" />\n                      استخدم الثيم\n                    </Link>',
  '<a href="#contact" className="px-6 py-3 bg-white text-[#8E6E53] rounded-full font-bold hover:bg-gray-50 shadow-xl flex items-center gap-2">\n                      <Sparkles className="w-4 h-4" />\n                      اطلب الثيم\n                    </a>'
);

// 4. CTA Section
code = code.replace(
  '<Link href="/create" className="inline-block px-12 py-5 bg-[#D4A373] text-white rounded-full font-bold text-xl hover:bg-[#BC8A5F] hover:shadow-2xl hover:shadow-[#D4A373]/50 transition-all transform hover:-translate-y-1">\n              ابدأ الآن\n            </Link>',
  '<a href="#contact" className="inline-block px-12 py-5 bg-[#D4A373] text-white rounded-full font-bold text-xl hover:bg-[#BC8A5F] hover:shadow-2xl hover:shadow-[#D4A373]/50 transition-all transform hover:-translate-y-1">\n              اطلب الآن\n            </a>'
);

// 5. Footer
code = code.replace(
  '<li><Link href="/create" className="text-gray-600 hover:text-[#D4A373] transition-colors">صمم دعوتك</Link></li>',
  '<li><a href="#contact" className="text-gray-600 hover:text-[#D4A373] transition-colors">اطلب دعوتك</a></li>'
);

fs.writeFileSync(file, code);
console.log('Updated LandingClient with new flow');
