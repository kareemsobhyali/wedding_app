const fs = require('fs');
const file = 'apps/web/src/app/LandingClient.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. We will make the Hero section taller (min-h-screen). It already is `min-h-screen`.
// Let's add a new section before Templates, like "Our Process" to push templates further down.

const newProcessSection = `
      {/* How it Works Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-[#4A4036] mb-16"
          >
            كيف تصمم دعوتك معنا؟
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-[#D4A373]/30 to-transparent"></div>
            
            {[
              { step: '1', title: 'اختر ثيمك المفضل', desc: 'تصفح تشكيلة الثيمات الفاخرة واختر التصميم الذي يناسب ذوقك' },
              { step: '2', title: 'تواصل معنا', desc: 'أرسل لنا بيانات زفافك (الأسماء، الموعد، المكان) عبر الواتساب' },
              { step: '3', title: 'استلم دعوتك', desc: 'سنقوم بتجهيز الدعوة وإرسال رابطها الخاص لك في أسرع وقت' }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-[#D4A373] to-[#BC8A5F] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-xl shadow-[#D4A373]/20 border-4 border-white">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold text-[#4A4036] mb-4">{s.title}</h3>
                <p className="text-gray-600 max-w-xs">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
`;

code = code.replace(
  '{/* Templates Showcase */}',
  newProcessSection + '\n\n      {/* Templates Showcase */}'
);

// 2. Change Templates Showcase to Horizontal Scroll
const oldGridStart = '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">';
const newGridStart = '<div className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory px-4 sm:px-8 custom-scrollbar">';

// Find the template card and modify its classes for horizontal scrolling
// The card starts with <motion.div ... className="bg-[#FDFBF7] rounded-[2rem] ... group flex flex-col">
// We need to add min-w-[300px] md:min-w-[400px] snap-center shrink-0

code = code.replace(oldGridStart, newGridStart);

// Let's replace the motion.div class
code = code.replace(
  /className="bg-\[#FDFBF7\] rounded-\[2rem\] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-\[#D4A373\]\/20 transition-all duration-500 group flex flex-col"/g,
  'className="bg-[#FDFBF7] rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-[#D4A373]/20 transition-all duration-500 group flex flex-col min-w-[85vw] md:min-w-[450px] snap-center shrink-0"'
);

// 3. Update the buttons in the template card
// We replace the entire absolute inset-0 flex block
const buttonRegex = /<div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">[\s\S]*?<\/div>/;

const newButtons = `<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 p-6 bg-black/40 backdrop-blur-sm">
                    {settings.demoLinks?.[tpl.id] && (
                      <a href={settings.demoLinks[tpl.id]} target="_blank" className="w-full max-w-xs text-center py-3 bg-white text-[#8E6E53] rounded-full font-bold hover:bg-gray-50 shadow-xl transition-transform hover:scale-105">
                        مشاهدة الديمو
                      </a>
                    )}
                    <a href="#contact" className="w-full max-w-xs text-center py-3 bg-gradient-to-r from-[#D4A373] to-[#BC8A5F] text-white rounded-full font-bold shadow-xl transition-transform hover:scale-105">
                      طلب هذا الثيم
                    </a>
                  </div>`;

code = code.replace(buttonRegex, newButtons);


fs.writeFileSync(file, code);
console.log('Applied horizontal scroll and new sections');
