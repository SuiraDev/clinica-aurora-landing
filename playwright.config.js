import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4473',
    headless: true,
    viewport: { width: 1200, height: 900 },
  },
  webServer: {
    command: 'npm run dev -- --port 4473 --strictPort',
    url: 'http://localhost:4473',
    reuseExistingServer: false,
    timeout: 60000,
  },
});
