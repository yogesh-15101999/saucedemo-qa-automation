import { defineConfig, devices } from "@playwright/test";

/**
 * Reqres now expects an API key header on its endpoints.
 * Set your own key with the REQRES_API_KEY environment variable if the default is rejected.
 */
const REQRES_API_KEY = process.env.REQRES_API_KEY || 'reqres-free-v1';

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // fail CI if a test.only is left in the code
  retries: process.env.CI ? 2 : 0, // retry flaky tests only on CI
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    trace: "on-first-retry", // trace viewer data for failed retries
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "ui",
      testMatch: /tests\/ui\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "api",
      testMatch: /tests\/api\/.*\.spec\.ts/,
      use: {
        baseURL: "https://reqres.in",
        extraHTTPHeaders: {
          Accept: "application/json",
          "x-api-key": REQRES_API_KEY,
        },
      },
    },
  ],
});
