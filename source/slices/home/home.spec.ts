import { test, expect } from "@playwright/test";

test("Title", async ({ page }) => {
  await page.goto("/");
  const title = page.locator(".title");
  await expect(title).toHaveText("Home");
});
