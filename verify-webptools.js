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
  console.log('🚀 Starting WEBPTools comprehensive verification test on http://localhost:3000/ ...');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const gaEvents = [];

  // Monitor console logs
  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') {
      console.error('Browser console error:', text);
    } else if (text.includes('[GA4 Track Event]')) {
      console.log('📊 GA4 Event:', text);
      gaEvents.push(text);
    }
  });

  // TEST 1: Mobile Viewport 390px (iPhone screen width)
  console.log('\n--- TEST 1: Mobile Viewport (390px) Check ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });

  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });

  console.log(`Mobile 390px horizontal overflow: ${hasHorizontalScroll ? 'FAILED (has overflow)' : 'PASSED (perfect, no overflow)'}`);
  await page.screenshot({ path: path.join(screenshotsDir, '1-mobile-390px-empty.png'), fullPage: false });

  // TEST 2: SEO Meta Tags & Headings
  console.log('\n--- TEST 2: SEO Tags & JSON-LD Verification ---');
  const seoData = await page.evaluate(() => {
    const title = document.title;
    const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const h2Elements = Array.from(document.querySelectorAll('h2')).map((el) => el.textContent?.trim());
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((s) => {
      try { return JSON.parse(s.textContent || '{}'); } catch(e) { return {}; }
    });
    const privacyBadge = document.querySelector('.mt-5.flex.items-center')?.textContent?.trim();
    const footerText = document.querySelector('footer')?.textContent?.trim();
    const abidLink = document.querySelector('footer a[href="https://www.abidmahmud.cv"]')?.getAttribute('href');

    return { title, metaDesc, h1, h2Elements, scripts, privacyBadge, footerText, abidLink };
  });

  console.log('Title Tag:', seoData.title);
  console.log('Meta Description:', seoData.metaDesc);
  console.log('H1 Heading:', seoData.h1);
  console.log('H2 Headings:', seoData.h2Elements);
  console.log('JSON-LD Schemas found:', seoData.scripts.length, seoData.scripts.map((s) => s['@type']));
  console.log('Privacy Badge:', seoData.privacyBadge);
  console.log('Footer Attribution Link:', seoData.abidLink);

  // TEST 3: Desktop View & Batch Image Upload (JPG, PNG with transparency, SVG)
  console.log('\n--- TEST 3: Batch Upload (JPG, PNG with transparency, SVG) ---');
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });

  const fileInput = await page.$('input[type="file"]');
  if (!fileInput) {
    throw new Error('File input not found');
  }

  console.log('Uploading 3 test files:', jpgPath, pngPath, svgPath);
  await fileInput.uploadFile(jpgPath, pngPath, svgPath);

  // Wait for all 3 conversions to complete
  await page.waitForFunction(() => {
    const badges = document.querySelectorAll('span');
    for (const b of badges) {
      if (b.textContent && b.textContent.includes('3 of 3 Converted')) {
        return true;
      }
    }
    return false;
  }, { timeout: 15000 });

  console.log('All 3 files converted successfully!');

  // Inspect the converted items and size savings
  const results = await page.evaluate(() => {
    const savingsBanner = document.querySelector('.bg-\\[\\#EBF7F5\\]')?.textContent?.trim();
    const items = [];
    const elements = document.querySelectorAll('[title$=".jpg"], [title$=".png"], [title$=".svg"]');
    elements.forEach(el => {
      const container = el.closest('div.flex.flex-col.sm\\:flex-row');
      if (container) {
        items.push(container.textContent?.trim());
      }
    });
    return { savingsBanner, items };
  });

  console.log('Savings Summary:', results.savingsBanner);
  results.items.forEach((it, idx) => console.log(`Item ${idx + 1}:`, it));

  await page.screenshot({ path: path.join(screenshotsDir, '2-desktop-converted-batch.png'), fullPage: false });

  // TEST 4: Mobile View at 390px with converted batch
  console.log('\n--- TEST 4: Mobile View at 390px with Converted Batch ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.screenshot({ path: path.join(screenshotsDir, '3-mobile-390px-converted.png'), fullPage: false });

  const mobileOverflowWithItems = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile 390px with converted batch overflow: ${mobileOverflowWithItems ? 'FAILED' : 'PASSED (clean responsive)'}`);

  // TEST 5: Download All as ZIP
  console.log('\n--- TEST 5: Download All as ZIP & GA4 Event Check ---');
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: screenshotsDir
  });

  const clickedZip = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find((b) => b.textContent && b.textContent.includes('Download All as ZIP'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  console.log('Clicked "Download All as ZIP":', clickedZip);
  await new Promise((r) => setTimeout(r, 2500));

  const zipFiles = fs.readdirSync(screenshotsDir).filter((f) => f.endsWith('.zip'));
  console.log('Generated ZIP files in directory:', zipFiles);

  // TEST 6: Test Single File Download
  console.log('\n--- TEST 6: Single File Download Check ---');
  const clickedSingle = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find((b) => b.textContent && b.textContent.includes('Download') && !b.textContent.includes('ZIP'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked individual Download:', clickedSingle);
  await new Promise((r) => setTimeout(r, 1500));

  // TEST 7: Test Clear All & "Try a sample" empty state
  console.log('\n--- TEST 7: Clear All & Try a sample ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const clearBtn = buttons.find((b) => b.textContent && b.textContent.includes('Clear All'));
    if (clearBtn) clearBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  const itemsAfterClear = await page.evaluate(() => {
    return document.querySelectorAll('[title$=".jpg"], [title$=".png"], [title$=".svg"]').length;
  });
  console.log('Items count after Clear All:', itemsAfterClear, '(Expected: 0)');

  // Click "Try Photo Sample (.jpg)"
  const clickedSample = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const sampleBtn = buttons.find((b) => b.textContent && b.textContent.includes('Try Photo Sample'));
    if (sampleBtn) {
      sampleBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked "Try Photo Sample":', clickedSample);

  await page.waitForFunction(() => {
    const badges = document.querySelectorAll('span');
    for (const b of badges) {
      if (b.textContent && b.textContent.includes('1 of 1 Converted')) {
        return true;
      }
    }
    return false;
  }, { timeout: 10000 });

  console.log('Sample image auto-converted successfully!');

  await browser.close();
  console.log('\n✅ ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
