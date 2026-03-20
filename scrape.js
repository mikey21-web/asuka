const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    // Load live site
    await page.goto('https://asukacouture.com/collections/sherwani', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Capture first product item
    const el = await page.$('.grid__item');
    if (el) {
        await el.screenshot({ path: 'live_product_card.png' });
    }

    // Extract text layout
    const textData = await page.evaluate(() => {
        const item = document.querySelector('.grid__item');
        if (!item) return null;
        return {
            html: item.outerHTML
        };
    });

    fs.writeFileSync('live_card_data.html', textData ? textData.html : 'no item');

    await browser.close();
})();
