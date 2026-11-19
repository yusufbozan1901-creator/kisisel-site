import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = 'C:\\Users\\Yusuf\\.gemini\\antigravity\\brain\\c01a1bd4-eb7c-4bf3-bf1d-09abc190e2d9\\screenshots';
const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'akis', path: '/akis' },
  { name: 'blog', path: '/blog' },
  { name: 'rafim', path: '/rafim' },
  { name: 'videolar', path: '/videolar' },
  { name: 'about', path: '/about' },
  { name: 'contact', path: '/contact' },
];

function parseRgb(colorStr) {
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
  };
}

function getLuminance({ r, g, b }) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateContrast(rgb1, rgb2) {
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
    defaultViewport: { width: 1280, height: 800 },
  });

  const page = await browser.newPage();
  const contrastResults = [];

  for (const route of ROUTES) {
    console.log(`Processing route: ${route.path}...`);
    await page.goto(`http://localhost:3000${route.path}`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 600));

    // 1. Dark Theme
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    });
    await new Promise((r) => setTimeout(r, 300));

    const darkImgPath = path.join(SCREENSHOT_DIR, `${route.name}-dark.png`);
    await page.screenshot({ path: darkImgPath, fullPage: false });

    // Measure Dark Contrast
    const darkMeasurements = await page.evaluate(() => {
      const body = document.body;
      const heading = document.querySelector('h1, h2, h3');
      const paragraph = document.querySelector('p');
      const muted = document.querySelector('.text-muted-foreground');

      return {
        bg: window.getComputedStyle(body).backgroundColor,
        headingColor: heading ? window.getComputedStyle(heading).color : null,
        bodyColor: paragraph ? window.getComputedStyle(paragraph).color : null,
        mutedColor: muted ? window.getComputedStyle(muted).color : null,
      };
    });

    const darkBgRgb = parseRgb(darkMeasurements.bg);
    const darkHeadingRatio = darkMeasurements.headingColor
      ? calculateContrast(parseRgb(darkMeasurements.headingColor), darkBgRgb)
      : null;
    const darkBodyRatio = darkMeasurements.bodyColor
      ? calculateContrast(parseRgb(darkMeasurements.bodyColor), darkBgRgb)
      : null;
    const darkMutedRatio = darkMeasurements.mutedColor
      ? calculateContrast(parseRgb(darkMeasurements.mutedColor), darkBgRgb)
      : null;

    // 2. Light Theme
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    });
    await new Promise((r) => setTimeout(r, 300));

    const lightImgPath = path.join(SCREENSHOT_DIR, `${route.name}-light.png`);
    await page.screenshot({ path: lightImgPath, fullPage: false });

    // Measure Light Contrast
    const lightMeasurements = await page.evaluate(() => {
      const body = document.body;
      const heading = document.querySelector('h1, h2, h3');
      const paragraph = document.querySelector('p');
      const muted = document.querySelector('.text-muted-foreground');

      return {
        bg: window.getComputedStyle(body).backgroundColor,
        headingColor: heading ? window.getComputedStyle(heading).color : null,
        bodyColor: paragraph ? window.getComputedStyle(paragraph).color : null,
        mutedColor: muted ? window.getComputedStyle(muted).color : null,
      };
    });

    const lightBgRgb = parseRgb(lightMeasurements.bg);
    const lightHeadingRatio = lightMeasurements.headingColor
      ? calculateContrast(parseRgb(lightMeasurements.headingColor), lightBgRgb)
      : null;
    const lightBodyRatio = lightMeasurements.bodyColor
      ? calculateContrast(parseRgb(lightMeasurements.bodyColor), lightBgRgb)
      : null;
    const lightMutedRatio = lightMeasurements.mutedColor
      ? calculateContrast(parseRgb(lightMeasurements.mutedColor), lightBgRgb)
      : null;

    contrastResults.push({
      route: route.path,
      dark: {
        bg: darkMeasurements.bg,
        headingRatio: darkHeadingRatio ? darkHeadingRatio.toFixed(2) + ':1' : 'N/A',
        bodyRatio: darkBodyRatio ? darkBodyRatio.toFixed(2) + ':1' : 'N/A',
        mutedRatio: darkMutedRatio ? darkMutedRatio.toFixed(2) + ':1' : 'N/A',
      },
      light: {
        bg: lightMeasurements.bg,
        headingRatio: lightHeadingRatio ? lightHeadingRatio.toFixed(2) + ':1' : 'N/A',
        bodyRatio: lightBodyRatio ? lightBodyRatio.toFixed(2) + ':1' : 'N/A',
        mutedRatio: lightMutedRatio ? lightMutedRatio.toFixed(2) + ':1' : 'N/A',
      },
    });
  }

  // 3. Test Contact Form Submission in Browser
  console.log('Testing contact form in browser...');
  await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle2' });
  await page.type('#name', 'Yusuf Test');
  await page.type('#email', 'test@yusufbozan.com.tr');
  await page.type('#subject', 'Canlı Doğrulama Testi');
  await page.type('#message', 'Bu, Puppeteer ve gerçek tarayıcı üzerinden gönderilen bir test mesajıdır.');

  let interceptedResponse = null;
  page.on('response', async (res) => {
    if (res.url().includes('web3forms.com/submit')) {
      try {
        const text = await res.text();
        interceptedResponse = {
          status: res.status(),
          headers: res.headers(),
          body: text,
        };
      } catch (e) {
        interceptedResponse = { status: res.status(), error: e.message };
      }
    }
  });

  const submitButton = await page.$('button[type="submit"]');
  if (submitButton) {
    await submitButton.click();
    await new Promise((r) => setTimeout(r, 4000));
  }

  const formStatus = await page.evaluate(() => {
    const errorBox = document.querySelector('.border-destructive');
    const successBox = document.querySelector('.border-zinc-200 h3, .border-zinc-800 h3');
    return {
      errorText: errorBox ? errorBox.textContent : null,
      successText: successBox ? successBox.textContent : null,
    };
  });

  await browser.close();

  const report = {
    contrastResults,
    formTest: {
      interceptedResponse,
      uiResult: formStatus,
    },
  };

  fs.writeFileSync(
    'C:\\Users\\Yusuf\\.gemini\\antigravity\\brain\\c01a1bd4-eb7c-4bf3-bf1d-09abc190e2d9\\scratch\\audit-report.json',
    JSON.stringify(report, null, 2)
  );
  console.log('DONE!');
}

run().catch((err) => {
  console.error('ERROR:', err);
  process.exit(1);
});
