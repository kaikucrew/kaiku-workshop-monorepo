import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  webServer: [
    {
      command: 'npm run dev:api',
      port: 3001,
      cwd: '..',
      reuseExistingServer: true,
    },
    {
      command: 'npm run dev:ui',
      port: 3000,
      cwd: '..',
      reuseExistingServer: true,
    },
  ],
});
