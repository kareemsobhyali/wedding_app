const fs = require('fs');

const path = 'apps/web/src/templates/designs/golden-arabic/index.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('FloatingElements')) {
  code = code.replace(
    'import { RevealWrapper } from "../../utils/useScrollReveal";',
    'import { RevealWrapper } from "../../utils/useScrollReveal";\nimport { FloatingElements } from "../../utils/FloatingElements";\nimport { motion, AnimatePresence } from "framer-motion";'
  );
  
  // Replace the first div in the return statement
  code = code.replace(
    '<div className={`w-full min-h-screen relative font-sans golden-arabic-theme ${direction === "RTL" ? "rtl" : "ltr"}`}>',
    '<div className={`w-full min-h-screen relative font-sans golden-arabic-theme ${direction === "RTL" ? "rtl" : "ltr"}`}>\n      <FloatingElements type={data.customData?.floatingType || "gold-dust"} count={data.customData?.floatingCount || 30} />\n'
  );

  // Envelope opening
  code = code.replace(
    '<div className="envelope-wrapper">',
    '<AnimatePresence>\n        {!isOpen && (\n          <motion.div \n            initial={{ opacity: 1, scale: 1 }}\n            exit={{ opacity: 0, scale: 1.5, y: "-100vh" }}\n            transition={{ duration: 1.5, ease: "circIn" }}\n            className="envelope-wrapper" style={{ zIndex: 100 }}\n          >'
  );
  
  code = code.replace(
    '</div>\n      </div>\n\n      <div className={`invitation-content transition-opacity duration-1000 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>',
    '</motion.div>\n        )}\n      </AnimatePresence>\n\n      <div className={`invitation-content transition-all duration-1000 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>'
  );
  
  fs.writeFileSync(path, code);
  console.log('golden-arabic patched with framer-motion and FloatingElements');
} else {
  console.log('golden-arabic already has FloatingElements');
}
