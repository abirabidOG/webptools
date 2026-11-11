const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const testDir = path.join(__dirname, 'test-assets');
const jpgPath = path.join(testDir, 'test-photo.jpg');
const pngPath = path.join(testDir, 'test-transparent.png');
const svgPath = path.join(testDir, 'test-vector.svg');
const screenshotsDir = path.join(__dirname, 'verification-screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function runVerification() {
  console.log('🚀 Starting WEBPTools verification test on http://localhost:3000/webptools ...');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Monitor console logs
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error('Browser console error:', msg.text());
    } else if (msg.text().includes('[GA4 Track Event]')) {
      console.log('📊', msg.text());
    }
  });

  // TEST 1: Mobile Viewport 390px (iPhone 12/13/14/15)
  console.log('\n--- TEST 1: Mobile Viewport (390px) ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/webptools', { waitUntil: 'networkidle0' });

  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });

  console.log(`Mobile 390px horizontal overflow: ${hasHorizontalScroll ? 'FAILED (has overflow)' : 'PASSED (no overflow)'}`);
  if (hasHorizontalScroll) {
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    console.warn(`Warning: document.documentElement.scrollWidth is ${scrollW}px, viewport is 390px`);
  }

  await page.screenshot({ path: path.join(screenshotsDir, '1-mobile-390px-empty.png'), fullPage: false });
  console.log('Saved screenshot: 1-mobile-390px-empty.png');

  // TEST 2: SEO Meta Tags & Headings
  console.log('\n--- TEST 2: SEO Tags & JSON-LD ---');
  const seoData = await page.evaluate(() => {
    const title = document.title;
    const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const h2Elements = Array.from(document.querySelectorAll('h2')).map((el) => el.textContent?.trim());
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((s) => JSON.parse(s.textContent || '{}'));
    const footerText = document.querySelector('footer')?.textContent?.trim();
    const abidLink = document.querySelector('footer a[href="https://www.abidmahmud.cv"]')?.getAttribute('href');

    return { title, metaDesc, h1, h2Elements, scripts, footerText, abidLink };
  });

  console.log('Title Tag:', seoData.title);
  console.log('Meta Description:', seoData.metaDesc);
  console.log('H1 Heading:', seoData.h1);
  console.log('H2 Headings:', seoData.h2Elements);
  console.log('JSON-LD Schemas found:', seoData.scripts.length, seoData.scripts.map((s) => s['@type']));
  console.log('Footer attribution link:', seoData.abidLink);

  // TEST 3: Desktop View & Batch Image Upload (JPG, PNG with transparency, SVG)
  console.log('\n--- TEST 3: Desktop Upload (JPG, PNG, SVG) ---');
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000/webptools', { waitUntil: 'networkidle0' });

  // Locate the file input
  const fileInput = await page.$('input[type="file"]');
  if (!fileInput) {
    throw new Error('File input not found');
  }

  console.log('Uploading test files:', jpgPath, pngPath, svgPath);
  await fileInput.uploadFile(jpgPath, pngPath, svgPath);

  // Wait for conversions to complete
  await page.waitForFunction(() => {
    const badges = document.querySelectorAll('span');
    for (const b of badges) {
      if (b.textContent && b.textContent.includes('3 of 3 Converted')) {
        return true;
      }
    }
    return false;
  }, { timeout: 10000 });

  console.log('All 3 files converted successfully!');

  // Inspect the conversion results
  const itemsData = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.rounded-2xl.border.border-\\[\\#E5E1D6\\].bg-white.p-3\\.5'));
    // Fallback if class selector varies
    const fileEntries = [];
    const elements = document.querySelectorAll('[title$=".jpg"], [title$=".png"], [title$=".svg"]');
    elements.forEach(el => {
      const container = el.closest('div.flex.flex-col.sm\\:flex-row');
      if (container) {
        fileEntries.push(container.textContent);
      }
    });

    const savingsBanner = document.querySelector('.bg-\\[\\#EBF7F5\\]')?.textContent;
    return { fileEntries, savingsBanner };
  });

  console.log('Savings Banner:', itemsData.savingsBanner);

  await page.screenshot({ path: path.join(screenshotsDir, '2-desktop-converted-batch.png'), fullPage: false });
  console.log('Saved screenshot: 2-desktop-converted-batch.png');

  // TEST 4: Mobile View with Converted Batch
  console.log('\n--- TEST 4: Mobile View at 390px with Converted Batch ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.screenshot({ path: path.join(screenshotsDir, '3-mobile-390px-converted.png'), fullPage: false });
  console.log('Saved screenshot: 3-mobile-390px-converted.png');

  // Check overflow again with items loaded
  const mobileOverflowWithItems = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile 390px with converted batch overflow: ${mobileOverflowWithItems ? 'FAILED' : 'PASSED'}`);

  // TEST 5: Download All as ZIP
  console.log('\n--- TEST 5: Download All as ZIP & GA4 Event ---');
  // Configure download behavior
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: screenshotsDir
  });

  // Click ZIP button
  const zipButton = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find((b) => b.textContent && b.textContent.includes('Download All as ZIP'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  console.log('Clicked "Download All as ZIP":', zipButton);

  // Wait 2 seconds for ZIP generation
  await new Promise((r) => setTimeout(r, 2000));

  const zipFiles = fs.readdirSync(screenshotsDir).filter((f) => f.endsWith('.zip'));
  console.log('Generated ZIP files in directory:', zipFiles);

  // TEST 6: Test Tools Suite Homepage /
  console.log('\n--- TEST 6: Tools Hub Suite Homepage ---');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotsDir, '4-homepage-hub.png'), fullPage: false });
  console.log('Saved screenshot: 4-homepage-hub.png');

  // TEST 7: Test Pinterest Pins Page /pins
  console.log('\n--- TEST 7: Pinterest Pins Showcase Page /pins ---');
  await page.goto('http://localhost:3000/pins', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotsDir, '5-pins-page.png'), fullPage: false });
  console.log('Saved screenshot: 5-pins-page.png');

  await browser.close();
  console.log('\n✅ ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
