import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const PAGES = [
  {
    name: 'Ana Sayfa (/)',
    path: '/',
    elements: [
      { name: 'Ana Başlık (h1)', selector: 'h1' },
      { name: 'Bölüm Başlığı (h2)', selector: 'h2' },
      { name: 'Now Bento Kart Metni', selector: '[data-slot="card"] p, .rounded-xl p' },
      { name: 'Genel Muted Metin', selector: '.text-muted-foreground' },
    ],
  },
  {
    name: 'Akış (/akis)',
    path: '/akis',
    elements: [
      { name: 'Sayfa Başlığı (h1)', selector: 'h1' },
      { name: 'Düşünce Kartı Metni', selector: 'article p, .text-foreground\\/90, p' },
      { name: 'Zaman Damgası / Rozet', selector: 'time, .text-xs.text-muted-foreground' },
    ],
  },
  {
    name: 'Blog (/blog)',
    path: '/blog',
    elements: [
      { name: 'Sayfa Başlığı (h1)', selector: 'h1' },
      { name: 'Yazı Kart Başlığı (h2)', selector: 'h2, h3' },
      { name: 'Yazı Açıklaması', selector: 'article p, .line-clamp-2' },
      { name: 'Meta / Tarih', selector: 'time, .text-xs.text-muted-foreground' },
    ],
  },
  {
    name: 'Rafım (/rafim)',
    path: '/rafim',
    elements: [
      { name: 'Sayfa Başlığı (h1)', selector: 'h1' },
      { name: 'Eser Başlığı', selector: 'h3, .font-medium.text-sm' },
      { name: 'Eser Tür/Kategori Rozeti', selector: '.rounded-full, .text-xs' },
      { name: 'Sıralama / Filtre Metni', selector: 'select, label, span' },
    ],
  },
  {
    name: 'Videolar (/videolar)',
    path: '/videolar',
    elements: [
      { name: 'Sayfa Başlığı (h1)', selector: 'h1' },
      { name: 'Video Başlığı', selector: 'h3' },
      { name: 'Video Açıklama Metni', selector: 'p.text-xs, p.text-sm' },
      { name: 'Video Tarihi', selector: 'time, span.text-xs' },
    ],
  },
  {
    name: 'Hakkımda (/about)',
    path: '/about',
    elements: [
      { name: 'İsim Başlığı (h1)', selector: 'h1' },
      { name: 'Unvan / Alt Başlık', selector: 'h2, p.text-lg, p.text-base' },
      { name: 'Biyografi Paragrafı', selector: '.prose p, p.leading-relaxed' },
      { name: 'Konum / Detay Metni', selector: '.text-muted-foreground' },
    ],
  },
  {
    name: 'İletişim (/contact)',
    path: '/contact',
    elements: [
      { name: 'Sayfa Başlığı (h1)', selector: 'h1' },
      { name: 'Form Kart Başlığı', selector: 'h2, h3' },
      { name: 'Form Etiketleri (label)', selector: 'label' },
      { name: 'Bilgi / Yardım Metni', selector: 'p.text-muted-foreground, p.text-\\[11px\\]' },
    ],
  },
];

function parseRgb(colorStr) {
  if (!colorStr) return { r: 0, g: 0, b: 0, a: 1 };
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return { r: 0, g: 0, b: 0, a: 1 };
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
    a: match[4] !== undefined ? parseFloat(match[4]) : 1,
  };
}

// Blend foreground rgba over background rgb
function blendRgba(fg, bg) {
  const alpha = fg.a;
  return {
    r: Math.round(fg.r * alpha + bg.r * (1 - alpha)),
    g: Math.round(fg.g * alpha + bg.g * (1 - alpha)),
    b: Math.round(fg.b * alpha + bg.b * (1 - alpha)),
  };
}

function getLuminance({ r, g, b }) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateContrast(fgRgb, bgRgb) {
  const lum1 = getLuminance(fgRgb);
  const lum2 = getLuminance(bgRgb);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 800 },
  });

  const page = await browser.newPage();
  const allResults = [];

  for (const pageConfig of PAGES) {
    await page.goto(`http://localhost:3000${pageConfig.path}`, { waitUntil: 'networkidle2' });

    for (const theme of ['dark', 'light']) {
      await page.evaluate((t) => {
        if (t === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
        localStorage.setItem('theme', t);
      }, theme);
      await new Promise((r) => setTimeout(r, 200));

      for (const elConfig of pageConfig.elements) {
        const measurement = await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (!el) return null;

          const style = window.getComputedStyle(el);
          const fgColor = style.color;

          // Find effective background color up the tree
          let bgEl = el;
          let bgColor = 'rgba(0, 0, 0, 0)';
          while (bgEl) {
            const bgStyle = window.getComputedStyle(bgEl);
            if (bgStyle.backgroundColor && bgStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && bgStyle.backgroundColor !== 'transparent') {
              bgColor = bgStyle.backgroundColor;
              break;
            }
            bgEl = bgEl.parentElement;
          }
          if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
            bgColor = window.getComputedStyle(document.body).backgroundColor;
          }

          return {
            fgColor,
            bgColor,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
          };
        }, elConfig.selector);

        if (measurement) {
          const bgParsed = parseRgb(measurement.bgColor);
          const fgParsed = parseRgb(measurement.fgColor);
          const blendedFg = fgParsed.a < 1 ? blendRgba(fgParsed, bgParsed) : fgParsed;
          const ratio = calculateContrast(blendedFg, bgParsed);

          const fontSizePx = parseFloat(measurement.fontSize) || 16;
          const isBold = parseInt(measurement.fontWeight, 10) >= 700 || measurement.fontWeight === 'bold';
          const isLargeText = fontSizePx >= 24 || (fontSizePx >= 18.66 && isBold);

          // Correct WCAG thresholds:
          // AA: 4.5 for normal, 3.0 for large
          // AAA: 7.0 for normal, 4.5 for large
          const aaThreshold = isLargeText ? 3.0 : 4.5;
          const aaaThreshold = isLargeText ? 4.5 : 7.0;

          let rating = 'FAIL';
          if (ratio >= aaaThreshold) {
            rating = 'AAA (Geçti)';
          } else if (ratio >= aaThreshold) {
            rating = 'AA (Geçti)';
          }

          allResults.push({
            page: pageConfig.name,
            theme,
            element: elConfig.name,
            fontSize: measurement.fontSize,
            fg: measurement.fgColor,
            bg: measurement.bgColor,
            ratio: ratio.toFixed(2) + ':1',
            isLargeText,
            thresholds: `AA: ${aaThreshold}:1 | AAA: ${aaaThreshold}:1`,
            rating,
          });
        }
      }
    }
  }

  await browser.close();

  fs.writeFileSync(
    'C:\\Users\\Yusuf\\.gemini\\antigravity\\brain\\c01a1bd4-eb7c-4bf3-bf1d-09abc190e2d9\\scratch\\granular-contrast-report.json',
    JSON.stringify(allResults, null, 2)
  );
  console.log('MEASUREMENTS COMPLETE:', allResults.length, 'data points collected.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
