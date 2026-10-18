const fs = require('fs');

const path = 'apps/web/src/templates/designs/heavenly-roses/index.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('FloatingElements')) {
  code = code.replace(
    'import { RevealWrapper } from "../../utils/useScrollReveal";',
    'import { RevealWrapper } from "../../utils/useScrollReveal";\nimport { FloatingElements } from "../../utils/FloatingElements";\nimport { motion, AnimatePresence } from "framer-motion";'
  );
  
  // Replace the first div in the return statement
  code = code.replace(
    '<div className={`w-full min-h-screen relative font-sans heavenly-roses-theme ${direction === "RTL" ? "rtl" : "ltr"}`}>',
    '<div className={`w-full min-h-screen relative font-sans heavenly-roses-theme ${direction === "RTL" ? "rtl" : "ltr"}`}>\n      {/* Floating Hearts Animation */}\n      <FloatingElements type={data.customData?.floatingType || "hearts"} count={data.customData?.floatingCount || 15} />\n'
  );

  // Enhance the envelope opening with framer-motion
  // Find the top envelope section:
  code = code.replace(
    '<div className="envelope-wrapper">',
    '<AnimatePresence>\n        {!isOpen && (\n          <motion.div \n            initial={{ opacity: 1, scale: 1 }}\n            exit={{ opacity: 0, scale: 1.2, y: -200 }}\n            transition={{ duration: 1.5, ease: "easeInOut" }}\n            className="envelope-wrapper" style={{ zIndex: 100 }}\n          >'
  );
  
  code = code.replace(
    '</div>\n      </div>\n\n      <div className={`invitation-content transition-opacity duration-1000 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>',
    '</motion.div>\n        )}\n      </AnimatePresence>\n\n      <div className={`invitation-content transition-all duration-1000 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>'
  );
  
  // If the envelope had an AnimatePresence, we need to wrap the envelope content.
  // Wait, let's just make sure the tags are correct.
  fs.writeFileSync(path, code);
  console.log('heavenly-roses patched with framer-motion and FloatingElements');
} else {
  console.log('heavenly-roses already has FloatingElements');
}
