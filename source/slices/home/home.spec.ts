import { test, expect } from "@playwright/test";

test("Title", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".title")).toContainText(/.?/);
});

test("List", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("li")).not.toHaveCount(0);
});
