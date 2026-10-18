const { Jimp } = require('jimp');

async function processImage() {
  console.log('Reading butterfly-realistic.jpg...');
  const image = await Jimp.read('apps/web/public/assets/templates/butterfly-realistic.jpg');
  
  console.log(`Processing ${image.bitmap.width}x${image.bitmap.height} image...`);
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const r = image.bitmap.data[idx + 0];
    const g = image.bitmap.data[idx + 1];
    const b = image.bitmap.data[idx + 2];
    
    // Check how close to white
    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    const diff = maxVal - minVal;

    // Pure white background pixels
    if (minVal >= 242 && diff <= 18) {
      image.bitmap.data[idx + 3] = 0; // Fully transparent!
    } else if (minVal > 220 && diff <= 25) {
      // Smooth anti-aliased edge
      const alpha = (242 - minVal) / 22;
      image.bitmap.data[idx + 3] = Math.min(image.bitmap.data[idx + 3], Math.max(0, Math.round(255 * alpha)));
    }
  });

  const outputPath = 'apps/web/public/assets/templates/butterfly-transparent.png';
  await image.write(outputPath);
  console.log(`Saved transparent butterfly to ${outputPath}`);
}

processImage().catch(err => {
  console.error('Error processing image:', err);
  process.exit(1);
});
