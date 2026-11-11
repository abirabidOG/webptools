const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const dir = path.join(__dirname, 'test-assets');

async function createImages() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Create a PNG with transparency
  await page.setViewport({ width: 800, height: 800, deviceScaleFactor: 1 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; background: transparent; display: flex; align-items: center; justify-content: center; height: 100vh; }
          .badge {
            width: 500px;
            height: 500px;
            background: linear-gradient(135deg, #1F8C7F, #0B0B0D);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: sans-serif;
            font-size: 32px;
            font-weight: bold;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          }
        </style>
      </head>
      <body>
        <div class="badge">Transparent PNG</div>
      </body>
    </html>
  `);

  await page.screenshot({
    path: path.join(dir, 'test-transparent.png'),
    omitBackground: true,
    type: 'png'
  });
  console.log('Created test-transparent.png with alpha transparency');

  // 2. Create a heavy JPG image
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            height: 100vh;
            background: radial-gradient(circle at 30% 40%, #1F8C7F 0%, #0E2433 40%, #0B0B0D 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-family: sans-serif;
          }
          h1 { font-size: 64px; margin: 0 0 16px 0; }
          p { font-size: 28px; opacity: 0.8; margin: 0; }
          .noise {
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 8px);
          }
        </style>
      </head>
      <body>
        <div class="noise"></div>
        <h1>High-Resolution Landscape</h1>
        <p>Original Uncompressed 1920x1080 Photo</p>
      </body>
    </html>
  `);

  await page.screenshot({
    path: path.join(dir, 'test-photo.jpg'),
    type: 'jpeg',
    quality: 95
  });
  console.log('Created test-photo.jpg');

  await browser.close();
}

createImages().catch(console.error);
