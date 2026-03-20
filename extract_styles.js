const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://asukacouture.com/products/tiger-shroff-in-charcoal-grey-woolen-suit-set');
    const styles = await page.evaluate(() => {
        const btn = document.querySelector('button[name="add"]');
        const buyBtn = document.querySelector('.shopify-payment-button__button');
        const accordions = document.querySelectorAll('details');
        const sku = document.querySelector('.variant-sku');
        const title = document.querySelector('h1');
        return {
            addBtnBorder: btn ? window.getComputedStyle(btn).borderColor : 'N/A',
            buyBtnBg: buyBtn ? window.getComputedStyle(buyBtn).backgroundColor : 'N/A',
            accordionBorder: accordions.length > 0 ? window.getComputedStyle(accordions[0]).borderBottomColor : 'N/A',
            skuFontSize: sku ? window.getComputedStyle(sku).fontSize : 'N/A',
            titleFontSize: title ? window.getComputedStyle(title).fontSize : 'N/A',
            titleFontFamily: title ? window.getComputedStyle(title).fontFamily : 'N/A'
        };
    });
    console.log(JSON.stringify(styles, null, 2));
    await browser.close();
})();
