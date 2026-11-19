import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = 'c:\\Users\\Yusuf\\Desktop\\SİTE\\docs\\screenshots';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 800 },
  });

  const page = await browser.newPage();

  // 1. Task 1: Home page after test content cleanup
  console.log('Capturing home...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'home-after-content-cleanup.png') });

  // 2. Task 1: Akis after cleanup
  console.log('Capturing akis...');
  await page.goto('http://localhost:3000/akis', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'akis-after-content-cleanup.png') });

  // 3. Task 1: Blog after cleanup
  console.log('Capturing blog...');
  await page.goto('http://localhost:3000/blog', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'blog-after-content-cleanup.png') });

  // 4. Task 1: Videolar after cleanup
  console.log('Capturing videolar...');
  await page.goto('http://localhost:3000/videolar', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'videolar-after-content-cleanup.png') });

  // 5. Task 2: Rafım dynamic tabs
  console.log('Capturing rafim dynamic tabs...');
  await page.goto('http://localhost:3000/rafim', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'rafim-dynamic-tabs.png') });

  // 6. Task 3: PWA state
  console.log('Capturing PWA state...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'pwa-install-prompt-state.png') });

  await browser.close();
  console.log('ALL SCREENSHOTS CAPTURED!');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
