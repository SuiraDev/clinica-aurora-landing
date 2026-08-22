import { test, expect } from '@playwright/test';

const widths = [320, 390, 768, 1024, 1280];

for (const w of widths) {
  test(`no horizontal page scroll at ${w}px`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto('/');
    const overflow = await page.evaluate(
      () =>
        Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
        document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('main-nav anchors resolve to existing sections', async ({ page }) => {
  await page.goto('/');
  const hrefs = await page.$$eval('header nav a[href^="#"]', (as) =>
    as.map((a) => a.getAttribute('href'))
  );
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    const id = href.slice(1);
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test('FAQ <details> disclosure opens on toggle', async ({ page }) => {
  await page.goto('/');
  const first = page.locator('details.faq').first();
  await expect(first).not.toHaveAttribute('open');
  await first.locator('summary').click();
  await expect(first).toHaveAttribute('open');
});

test('landmarks header/main/footer are present', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('footer')).toHaveCount(1);
});
