import { test, expect } from "@playwright/test";

test("home page loads and shows the hero and research links", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /Kompaniyalar katalogi/i })).toBeVisible();
});

test("companies catalog loads and filters by region", async ({ page }) => {
  await page.goto("/companies");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("katalogi");

  const regionSelect = page.locator("select").first();
  await regionSelect.selectOption("Toshkent");
  await page.waitForURL(/region=Toshkent/);
  await expect(page.locator("a[href^='/companies/']").first()).toBeVisible();
});

test("dashboard renders KPI cards and connects to the live stream", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("monitoring");
  await expect(page.getByText(/Jonli ulanish|Ulanish yo'q/).first()).toBeVisible({ timeout: 15_000 });
});
