const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
fs.mkdirSync(publicDir, { recursive: true });

const files = ['index.html', 'dashboard.html', 'docs.html', 'get-started.html', 'favicon.svg'];
for (const file of files) {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(publicDir, file));
  }
}

const assetsSrc = path.join(__dirname, 'assets');
const assetsDest = path.join(publicDir, 'assets');
if (fs.existsSync(assetsSrc)) {
  fs.cpSync(assetsSrc, assetsDest, { recursive: true });
}

console.log('Static site files prepared in public/ for Vercel.');
