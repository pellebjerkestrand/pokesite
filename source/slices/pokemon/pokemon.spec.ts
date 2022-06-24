import { test, expect } from "@playwright/test";

test("Random", async ({ page }) => {
  await page.goto("/");

  const links = page.locator("a");
  const count = await links.count();
  const link = links.nth(Math.floor(Math.random() * count));
  const name = await link.innerText();

  await Promise.all([page.waitForNavigation(), link.click()]);

  expect(await page.locator("h1").innerText()).toBe(name);
});
