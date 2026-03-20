const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const LIVE_URL = 'https://asukacouture.com';
const LOCAL_URL = 'http://localhost:3000';

const PAGES = [
    { name: 'homepage', path: '/' },
    { name: 'western_search', path: '/collections/buy-shirts-for-men' },
    { name: 'ethnic_search', path: '/collections/sherwani' },
    { name: 'product_detail', path: '/products/tiger-shroff-in-charcoal-grey-woolen-suit-set' }
];

async function runAudit() {
    console.log('Starting 1:1 Parity Audit...');
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

    const auditResults = [];

    for (const pageInfo of PAGES) {
        console.log(`Auditing ${pageInfo.name}...`);

        // 1. Audit Live
        const livePage = await context.newPage();
        await livePage.goto(`${LIVE_URL}${pageInfo.path}`, { waitUntil: 'networkidle' });
        await livePage.waitForTimeout(2000); // Allow fonts/images

        const liveSnapshot = await livePage.evaluate(() => {
            const getStyles = (sel) => {
                const el = document.querySelector(sel);
                if (!el) return null;
                const style = window.getComputedStyle(el);
                return {
                    color: style.color,
                    fontSize: style.fontSize,
                    fontFamily: style.fontFamily,
                    padding: style.padding,
                    bg: style.backgroundColor,
                    textTransform: style.textTransform
                };
            };

            return {
                title: document.title,
                headerStyles: getStyles('header'),
                navLinksCount: document.querySelectorAll('header nav a').length,
                footerLinksCount: document.querySelectorAll('footer a').length,
                hasAnnouncement: !!document.querySelector('.announcement-bar') || !!document.querySelector('[class*="announcement"]'),
                mainHeading: document.querySelector('h1')?.innerText,
                productPrice: document.querySelector('.price')?.innerText || document.querySelector('[class*="price"]')?.innerText,
            };
        });
        await livePage.screenshot({ path: `audit_live_${pageInfo.name}.png` });
        await livePage.close();

        // 2. Audit Local
        const localPage = await context.newPage();
        try {
            await localPage.goto(`${LOCAL_URL}${pageInfo.path}`, { waitUntil: 'networkidle' });
            await localPage.waitForTimeout(2000);

            const localSnapshot = await localPage.evaluate(() => {
                const getStyles = (sel) => {
                    const el = document.querySelector(sel) || document.querySelector(`[class*="${sel}"]`);
                    if (!el) return null;
                    const style = window.getComputedStyle(el);
                    return {
                        color: style.color,
                        fontSize: style.fontSize,
                        fontFamily: style.fontFamily,
                        padding: style.padding,
                        bg: style.backgroundColor,
                        textTransform: style.textTransform
                    };
                };

                return {
                    title: document.title,
                    headerStyles: getStyles('header'),
                    navLinksCount: document.querySelectorAll('header nav a').length,
                    footerLinksCount: document.querySelectorAll('footer a').length,
                    hasAnnouncement: !!document.querySelector('.announcement-bar') || !!document.querySelector('[class*="announcement"]'),
                    mainHeading: document.querySelector('h1')?.innerText,
                    productPrice: document.querySelector('.price')?.innerText || document.querySelector('[class*="price"]')?.innerText,
                };
            });
            await localPage.screenshot({ path: `audit_local_${pageInfo.name}.png` });

            auditResults.push({
                page: pageInfo.name,
                live: liveSnapshot,
                local: localSnapshot,
                match: JSON.stringify(liveSnapshot) === JSON.stringify(localSnapshot)
            });
        } catch (e) {
            console.error(`Local page failed: ${pageInfo.name}`, e.message);
        }
        await localPage.close();
    }

    fs.writeFileSync('audit_results.json', JSON.stringify(auditResults, null, 2));
    console.log('Audit complete. Results saved to audit_results.json');
    await browser.close();
}

runAudit().catch(err => {
    console.error(err);
    process.exit(1);
});
