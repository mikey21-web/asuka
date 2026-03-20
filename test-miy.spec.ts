import { test, expect } from '@playwright/test';

test('miy click test', async ({ page }) => {
  await page.goto('http://localhost:3000/products/zari-embroidered-black-sherwani');
  await page.waitForLoadState('networkidle');
  // Wait explicitly for the button containing Make it yourself to be attached and visible
  const button = page.getByRole('link', { name: 'MAKE IT YOURSELF' }).first();
  await button.waitFor({ state: 'visible', timeout: 15000 });
  await button.click();
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'miy_route_after_click_fixed.png', fullPage: true });
  expect(page.url()).toContain('/make-it-yourself');
});
