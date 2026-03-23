import puppeteer from 'puppeteer-core';
import fs from 'fs';

let exes = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
];
let execPath = exes.find(fs.existsSync);

if (!execPath) {
  console.error("No Chrome found");
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: execPath, headless: "new" });
  const page = await browser.newPage();
  
  // Expose a function to collect items into a Node.js context map
  const allItems = {};
  await page.exposeFunction('collectItems', (items) => {
    for (let key in items) {
      if (!allItems[key]) {
         allItems[key] = items[key];
      }
    }
  });

  await page.goto('https://shop.ichefpos.com/store/JO16XDsl/ordering', { waitUntil: 'networkidle2' });

  for (let i = 0; i < 30; i++) {
    await page.evaluate(() => {
        const map = {};
        document.querySelectorAll('img').forEach(img => {
          if(img.src.includes('ichef-images') || img.src.includes('unsplash')) {
             let current = img;
             let txt = null;
             for (let j=0; j<5; j++) {
                current = current.parentElement;
                if (current && current.innerText && current.innerText.trim() !== '') {
                   let lines = current.innerText.split('\n').map(s=>s.trim()).filter(s=>s.length>0);
                   if (lines.length > 0) {
                       txt = lines[0];
                       break;
                   }
                }
             }
             if (txt) {
                map[txt] = img.src;
             }
          }
        });
        window.collectItems(map);
        window.scrollBy(0, 500);
    });
    await new Promise(r => setTimeout(r, 400));
  }

  // Also try scrolling UP just in case
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => {
        window.scrollBy(0, -1000);
    });
    await new Promise(r => setTimeout(r, 200));
  }
  
  // Collect one last time
  await page.evaluate(() => {
        const map = {};
        document.querySelectorAll('img').forEach(img => {
          if(img.src.includes('ichef-images') || img.src.includes('unsplash')) {
             let current = img;
             let txt = null;
             for (let j=0; j<5; j++) {
                current = current.parentElement;
                if (current && current.innerText && current.innerText.trim() !== '') {
                   let lines = current.innerText.split('\n').map(s=>s.trim()).filter(s=>s.length>0);
                   if (lines.length > 0) {
                       txt = lines[0];
                       break;
                   }
                }
             }
             if (txt) {
                map[txt] = img.src;
             }
          }
        });
        window.collectItems(map);
  });

  fs.writeFileSync('items.json', JSON.stringify(allItems, null, 2));
  console.log("Items saved successfully");
  await browser.close();
})();
