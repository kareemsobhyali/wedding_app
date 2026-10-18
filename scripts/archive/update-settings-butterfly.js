const fs = require('fs');
const path = 'apps/web/landing-settings.json';

if (fs.existsSync(path)) {
  const settings = JSON.parse(fs.readFileSync(path, 'utf8'));
  
  if (!settings.previewImages) settings.previewImages = {};
  settings.previewImages['butterfly-elegance'] = 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop';
  
  if (!settings.demoLinks) settings.demoLinks = {};
  settings.demoLinks['butterfly-elegance'] = '/preview?template=butterfly-elegance';

  fs.writeFileSync(path, JSON.stringify(settings, null, 2));
  console.log('Added butterfly-elegance to landing-settings.json');
}
