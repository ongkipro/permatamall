const sharp = require('/home/ongki/Projects/cmsads/node_modules/sharp');
const pngToIco = require('/tmp/node_modules/png-to-ico').default;
const potrace = require('/tmp/node_modules/potrace');
const fs = require('fs');
const path = require('path');

const projectRoot = '/home/ongki/Projects/cmsads';
const publicDir = path.join(projectRoot, 'public');
const imagesDir = path.join(publicDir, 'images');

async function buildAll() {
  const transparentPngPath = '/tmp/logo_transparent.png';
  const croppedBuf = fs.readFileSync(transparentPngPath);
  const meta = await sharp(croppedBuf).metadata();
  const width = meta.width;
  const height = meta.height;

  console.log(`Processing logo: ${width}x${height}`);

  // 1. Build crisp flat SVG (no frame, no border, clean paths)
  // Convert transparent PNG to thresholded mask for potrace
  const maskBuf = await sharp(croppedBuf)
    .threshold(15)
    .toBuffer();

  const svgPath = await new Promise((resolve, reject) => {
    potrace.trace(maskBuf, { threshold: 128, optCurve: true, turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY }, (err, svg) => {
      if (err) return reject(err);
      const matches = svg.matchAll(/d="([^"]+)"/g);
      const paths = [];
      for (const match of matches) {
        paths.push(match[1]);
      }
      resolve(paths.join(' '));
    });
  });

  // Color gradient / flat brand color fills
  const flatSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
  <path d="${svgPath}" fill="#0f172a" fill-rule="evenodd" />
</svg>`;

  // Write SVG files
  fs.writeFileSync(path.join(imagesDir, 'logo.svg'), flatSvgContent);
  fs.writeFileSync(path.join(imagesDir, 'adscms-logo.svg'), flatSvgContent);
  fs.writeFileSync(path.join(publicDir, 'favicon-admin.svg'), flatSvgContent);
  console.log('Saved SVG logos');

  // 2. Build high-res transparent PNG logo
  await sharp(croppedBuf)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(imagesDir, 'logo.png'));
  console.log('Saved logo.png');

  // 3. Build PNG Favicons
  const fav16 = await sharp(croppedBuf).resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const fav32 = await sharp(croppedBuf).resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const fav48 = await sharp(croppedBuf).resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const fav192 = await sharp(croppedBuf).resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();

  fs.writeFileSync(path.join(publicDir, 'favicon.png'), fav32);
  fs.writeFileSync(path.join(publicDir, 'favicon-192.png'), fav192);

  // 4. Build ICO Favicon
  const icoBuf = await pngToIco([fav16, fav32, fav48]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);
  console.log('Saved favicon.ico');
}

buildAll().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
