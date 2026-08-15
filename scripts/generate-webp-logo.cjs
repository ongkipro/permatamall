const sharp = require('/home/ongki/Projects/cmsads/node_modules/sharp');
const path = require('path');

const projectRoot = '/home/ongki/Projects/cmsads';
const publicDir = path.join(projectRoot, 'public');
const imagesDir = path.join(publicDir, 'images');

async function buildWebpLogo() {
  const input = sharp('/tmp/cmsads-logo.png');
  const { data, info } = await input.raw().toBuffer({ resolveWithObject: true });

  // Isolate logo object from dark outer frame
  const cleanBuf = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i*4];
    const g = data[i*4+1];
    const b = data[i*4+2];
    const a = data[i*4+3];

    // Background dark frame threshold
    const isDarkBg = (r < 32 && g < 32 && b < 32) || a < 20;
    if (isDarkBg) {
      cleanBuf[i*4] = 0;
      cleanBuf[i*4+1] = 0;
      cleanBuf[i*4+2] = 0;
      cleanBuf[i*4+3] = 0;
    } else {
      cleanBuf[i*4] = r;
      cleanBuf[i*4+1] = g;
      cleanBuf[i*4+2] = b;
      cleanBuf[i*4+3] = a;
    }
  }

  // Trim to tight bounding box
  const croppedImage = sharp(cleanBuf, { raw: { width: info.width, height: info.height, channels: 4 } }).trim();
  const croppedBuf = await croppedImage.png().toBuffer();
  const meta = await sharp(croppedBuf).metadata();
  console.log(`Trimmed logo dimensions: ${meta.width}x${meta.height}`);

  // Save webp logo (both master sizes)
  await sharp(croppedBuf)
    .webp({ quality: 95, alphaQuality: 100, lossless: false })
    .toFile(path.join(imagesDir, 'logo.webp'));

  await sharp(croppedBuf)
    .webp({ quality: 95, alphaQuality: 100, lossless: false })
    .toFile(path.join(imagesDir, 'adscms-logo.webp'));

  await sharp(croppedBuf)
    .png({ quality: 100 })
    .toFile(path.join(imagesDir, 'logo.png'));

  console.log('Saved logo.webp and logo.png successfully');
}

buildWebpLogo().catch(err => {
  console.error('Error generating webp logo:', err);
  process.exit(1);
});
