import { test, expect } from '@playwright/test';

test('search click test', async ({ page }) => {
  await page.goto('http://localhost:3000/search');
  await page.screenshot({ path: 'search_before.png', fullPage: true });
  await page.getByText('ACCESSORIES').hover();
  await page.getByPlaceholder('Search for products, collections...').click();
  await page.keyboard.type('shirt');
  await page.screenshot({ path: 'search_after.png', fullPage: true });
});
