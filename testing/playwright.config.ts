import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  outputDir: './output/test-results',
  timeout: 60 * 1000,
  expect: { timeout: 10 * 1000 },
  retries: 2,
  workers: 1,
  
  reporter: [
    ['html', { outputFolder: './output/reports' }],
    ['json', { outputFile: './output/results.json' }],
    ['list'],
  ],
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'off',
    trace: 'off',
    locale: 'es-ES',
    timezoneId: 'America/Argentina/Buenos_Aires',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});