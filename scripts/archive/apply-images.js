const fs = require('fs');

const cePath = 'apps/web/src/templates/designs/classic-elegance/index.tsx';
let ceCode = fs.readFileSync(cePath, 'utf8');

// For classic-elegance, maybe there is a main image
ceCode = ceCode.replace(
  'src="/assets/templates/placeholder-couple.jpg"',
  'src={data.customData?.mainImage || "/assets/templates/placeholder-couple.jpg"}'
);

fs.writeFileSync(cePath, ceCode);

// Same for floral-romance
const frPath = 'apps/web/src/templates/designs/floral-romance/index.tsx';
if (fs.existsSync(frPath)) {
  let frCode = fs.readFileSync(frPath, 'utf8');
  frCode = frCode.replace(
    'src="/assets/templates/placeholder-couple.jpg"',
    'src={data.customData?.mainImage || "/assets/templates/placeholder-couple.jpg"}'
  );
  frCode = frCode.replace(
    'backgroundImage: `url(/assets/templates/floral-bg.jpg)`',
    'backgroundImage: `url(${data.customData?.bgImage || "/assets/templates/floral-bg.jpg"})`'
  );
  fs.writeFileSync(frPath, frCode);
}

// botanical-rustic
const brPath = 'apps/web/src/templates/designs/botanical-rustic/index.tsx';
if (fs.existsSync(brPath)) {
  let brCode = fs.readFileSync(brPath, 'utf8');
  brCode = brCode.replace(
    'src="/assets/templates/placeholder-couple.jpg"',
    'src={data.customData?.mainImage || "/assets/templates/placeholder-couple.jpg"}'
  );
  brCode = brCode.replace(
    'backgroundImage: `url(/assets/templates/rustic-bg.jpg)`',
    'backgroundImage: `url(${data.customData?.bgImage || "/assets/templates/rustic-bg.jpg"})`'
  );
  fs.writeFileSync(brPath, brCode);
}

console.log('Applied mainImage and bgImage to templates');
