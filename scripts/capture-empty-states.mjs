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

  // 1. Rafım Tabs Check
  console.log('Capturing Rafim with Film tabs...');
  await page.goto('http://localhost:3000/rafim', { waitUntil: 'networkidle2' });
  const tabs = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('section button'));
    return buttons.map((b) => b.textContent.trim());
  });
  console.log('VISIBLE TABS ON RAFIM:', tabs);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'rafim-filmler-tab.png') });

  // 2. Blog Empty State - Dark
  console.log('Capturing Blog Empty Dark...');
  await page.goto('http://localhost:3000/blog', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    localStorage.setItem('theme', 'dark');
  });
  await new Promise((r) => setTimeout(r, 200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'blog-empty-dark.png') });

  // 3. Blog Empty State - Light
  console.log('Capturing Blog Empty Light...');
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'light');
  });
  await new Promise((r) => setTimeout(r, 200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'blog-empty-light.png') });

  // 4. Videolar Empty State - Dark
  console.log('Capturing Videolar Empty Dark...');
  await page.goto('http://localhost:3000/videolar', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    localStorage.setItem('theme', 'dark');
  });
  await new Promise((r) => setTimeout(r, 200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'videolar-empty-dark.png') });

  // 5. Videolar Empty State - Light
  console.log('Capturing Videolar Empty Light...');
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'light');
  });
  await new Promise((r) => setTimeout(r, 200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'videolar-empty-light.png') });

  await browser.close();
  console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
