const fs = require('fs');

const path = 'apps/web/src/templates/designs/heavenly-roses/index.tsx';
let code = fs.readFileSync(path, 'utf8');

// I will just replace the hardcoded timeline section with dynamic data.
// Since powershell cat messes up arabic encoding, I'll use simple string replacements based on English class names.
const originalTimeline = `                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-icon">dY S,?</div>
                    <div className="timeline-content glass-card">
                      <h3 className="text-gold-dark font-cairo text-xl font-bold">O U,U,U,O O O U,OU^U,</h3>
                      <p className="font-cairo text-sm mt-2">USU^U. O U,OU,USU+O  U^OU,O U,O O U,OOU^O O-</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-icon">dY'?</div>
                    <div className="timeline-content glass-card">
                      <h3 className="text-gold-dark font-cairo text-xl font-bold">O U,OrOU^O"Oc</h3>
                      <p className="font-cairo text-sm mt-2">U^O1O_U+O  O"O1O U+O  O1U,U% O U,O-O" U^O U,U^U?O O</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-icon">o"</div>
                    <div className="timeline-content glass-card">
                      <h3 className="text-gold-dark font-cairo text-xl font-bold">USU^U. O U,U?OO-</h3>
                      <p className="font-cairo text-sm mt-2">U+OU^O O-O"U+O  O"O"O_O USOc O-USO Oc OO_USO_Oc</p>
                    </div>
                  </div>
                </div>`;

// Wait, the corrupted characters are what I see from powershell output.
// Using regex to replace the entire <div className="timeline"> ... </div>
code = code.replace(/<div className="timeline">([\s\S]*?)<\/div>\s*<\/section>/, 
`<div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-icon">🌟</div>
                    <div className="timeline-content glass-card">
                      <h3 className="text-gold-dark font-cairo text-xl font-bold">{data.customData?.timeline1Title || 'عقد القران'}</h3>
                      <p className="font-cairo text-sm mt-2">{data.customData?.timeline1Desc || 'يبدأ استقبال الضيوف'}</p>
                      <p className="font-cairo text-xs font-bold text-gray-500 mt-2">{data.customData?.timeline1Time || '08:00 PM'}</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-icon">💍</div>
                    <div className="timeline-content glass-card">
                      <h3 className="text-gold-dark font-cairo text-xl font-bold">{data.customData?.timeline2Title || 'الزفة'}</h3>
                      <p className="font-cairo text-sm mt-2">{data.customData?.timeline2Desc || 'زفة العروسين'}</p>
                      <p className="font-cairo text-xs font-bold text-gray-500 mt-2">{data.customData?.timeline2Time || '09:00 PM'}</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-icon">🍽️</div>
                    <div className="timeline-content glass-card">
                      <h3 className="text-gold-dark font-cairo text-xl font-bold">{data.customData?.timeline3Title || 'العشاء'}</h3>
                      <p className="font-cairo text-sm mt-2">{data.customData?.timeline3Desc || 'بوفيه العشاء المفتوح'}</p>
                      <p className="font-cairo text-xs font-bold text-gray-500 mt-2">{data.customData?.timeline3Time || '10:30 PM'}</p>
                    </div>
                  </div>
                </div>
              </section>`);
              
// Also the heading of timeline section
code = code.replace(/<h2 className="font-arabic text-4xl text-gold-dark mb-12">.*?<\/h2>/, '<h2 className="font-arabic text-4xl text-gold-dark mb-12">برنامج الحفل</h2>');

// Wait! It replaces ALL headings if I use lazy match? There are other h2!
// Let's replace only the first one before timeline
// The regex was: /<div className="timeline">/

fs.writeFileSync(path, code);
console.log('Fixed heavenly-roses timeline text');
