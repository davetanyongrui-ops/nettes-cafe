import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://shop.ichefpos.com/store/JO16XDsl/ordering', { waitUntil: 'networkidle2' });
  
  const items = await page.evaluate(() => {
    const results = [];
    const itemEls = document.querySelectorAll('div[role="button"]');
    for (const el of itemEls) {
        const nameEl = el.querySelector('h2');
        if (!nameEl) continue;
        const name = nameEl.innerText.trim();
        const imgEl = el.querySelector('img');
        const imgUrl = imgEl ? imgEl.src : null;
        results.push({ name, image_url: imgUrl });
    }
    return results;
  });
  
  fs.writeFileSync('ichef_scraped.json', JSON.stringify(items, null, 2));
  console.log('Saved to ichef_scraped.json');
  await browser.close();
})();
