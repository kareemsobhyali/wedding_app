const fs = require('fs');
const path = 'apps/web/landing-settings.json';

let settings = {};
if (fs.existsSync(path)) {
  settings = JSON.parse(fs.readFileSync(path, 'utf8'));
}

// Add gorgeous unsplash wedding images as default preview images
const images = {
  'classic-elegance': 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop', // classic wedding setup
  'modern-minimalist': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop', // minimalist rings
  'floral-romance': 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1000&auto=format&fit=crop', // floral arch
  'botanical-rustic': 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop', // rustic outdoors
  'golden-arabic': 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1000&auto=format&fit=crop', // golden lighting / elegant
  'heavenly-roses': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop' // roses
};

settings.previewImages = {
  ...images,
  ...(settings.previewImages || {}) // keep user overrides if any, but right now there are none
};
// Actually, let's force the images if they are empty
for (const key of Object.keys(images)) {
  if (!settings.previewImages[key]) {
    settings.previewImages[key] = images[key];
  }
}

fs.writeFileSync(path, JSON.stringify(settings, null, 2));
console.log('Updated landing-settings.json with beautiful images');
