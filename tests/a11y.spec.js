import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const viewports = [
  { name: '<=480', width: 480, height: 900 },
  { name: '~768', width: 768, height: 900 },
  { name: '~1024', width: 1024, height: 900 },
  { name: '>=1200', width: 1200, height: 900 },
];

function seriousViolations(results) {
  return results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious'
  );
}

for (const vp of viewports) {
  test(`axe: zero critical/serious violations at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    const bad = seriousViolations(results);
    expect(bad, JSON.stringify(bad, null, 2)).toEqual([]);
  });
}

test('axe: zero critical/serious with prefers-reduced-motion: reduce', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 480, height: 900 });
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  const bad = seriousViolations(results);
  expect(bad, JSON.stringify(bad, null, 2)).toEqual([]);
});

test('axe: zero critical/serious in dark theme (contrast AA)', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  const bad = seriousViolations(results);
  expect(bad, JSON.stringify(bad, null, 2)).toEqual([]);
});
