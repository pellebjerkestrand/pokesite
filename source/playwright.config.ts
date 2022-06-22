/// <reference types="node" />
import { type PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  forbidOnly: !!process.env.CI,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  reporter: [
    [process.env.CI ? "dot" : "list"],
    ["html", { open: "never", outputFolder: "../dist-test" }],
    ["junit", { outputFile: "../dist-test/results.xml" }],
  ],
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://localhost:7071/",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm start",
    port: 7071,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
