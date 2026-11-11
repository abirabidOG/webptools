const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const testDir = path.join(__dirname, 'test-assets');
const jpgPath = path.join(testDir, 'test-photo.jpg');
const pngPath = path.join(testDir, 'test-transparent.png');
const svgPath = path.join(testDir, 'test-vector.svg');
const dlDir = path.join(__dirname, 'test-downloads');

if (!fs.existsSync(dlDir)) {
  fs.mkdirSync(dlDir, { recursive: true });
}

async function testZip() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: dlDir
  });

  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000/webptools', { waitUntil: 'networkidle0' });

  const fileInput = await page.$('input[type="file"]');
  await fileInput.uploadFile(jpgPath, pngPath, svgPath);

  // Wait for conversions
  await page.waitForFunction(() => {
    return document.querySelectorAll('button[title*="Download"]').length === 3;
  }, { timeout: 10000 });

  console.log('3 individual download buttons ready!');

  // Log all button texts
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim());
  });
  console.log('Buttons on page:', buttons);

  // Click ZIP button
  const clicked = await page.evaluate(() => {
    const allButtons = Array.from(document.querySelectorAll('button'));
    const zipBtn = allButtons.find(b => b.textContent && b.textContent.includes('Download All as ZIP'));
    if (zipBtn) {
      zipBtn.click();
      return true;
    }
    return false;
  });

  console.log('ZIP button found & clicked:', clicked);
  await new Promise(r => setTimeout(r, 3000));

  const files = fs.readdirSync(dlDir);
  console.log('Files downloaded into dlDir:', files);

  // Check file sizes
  const stats = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('[title$=".jpg"], [title$=".png"], [title$=".svg"]').forEach(el => {
      const card = el.closest('div.rounded-2xl');
      list.push(card ? card.textContent : '');
    });
    return list;
  });
  console.log('Cards converted details:', stats);

  await browser.close();
}

testZip().catch(console.error);
