import { defineConfig, devices } from "@playwright/test";
import "dotenv/config"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers:1,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  globalSetup: "./e2e/global-setup.ts",
});