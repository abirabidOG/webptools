const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const screenshotsDir = path.join(__dirname, 'verification-screenshots');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true
  });

  const page = await browser.newPage();

  // 1. Mobile 390px empty state
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotsDir, 'mobile-390px-empty-state.png'), fullPage: false });

  // Upload the 3 images
  const fileInput = await page.$('input[type="file"]');
  await fileInput.uploadFile(
    path.join(__dirname, 'test-assets/test-photo.jpg'),
    path.join(__dirname, 'test-assets/test-transparent.png'),
    path.join(__dirname, 'test-assets/test-vector.svg')
  );
  await page.waitForFunction(() => document.body.innerText.includes('3 of 3 Converted'), { timeout: 15000 });

  // 2. Mobile 390px with converted batch
  await page.screenshot({ path: path.join(screenshotsDir, 'mobile-390px-converted-batch.png'), fullPage: false });

  // 3. Mobile 390px full page scroll
  await page.screenshot({ path: path.join(screenshotsDir, 'mobile-390px-fullpage.png'), fullPage: true });

  // 4. Desktop 1280px view
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
  await page.screenshot({ path: path.join(screenshotsDir, 'desktop-1280px-converted-batch.png'), fullPage: false });

  // 5. Desktop full page
  await page.screenshot({ path: path.join(screenshotsDir, 'desktop-1280px-fullpage.png'), fullPage: true });

  console.log('Screenshots generated successfully!');
  await browser.close();
})();
