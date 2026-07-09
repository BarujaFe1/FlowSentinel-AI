import { test, expect } from "@playwright/test";

test.describe("FlowSentinel smoke", () => {
  test("landing page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Simule falhas/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Começar demo grátis/i })).toBeVisible();
  });

  test("pricing page shows plans", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByText("Starter")).toBeVisible();
    await expect(page.getByText("Pro")).toBeVisible();
    await expect(page.getByText("Business")).toBeVisible();
  });

  test("login redirects to app in demo mode", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Entrar/i }).click();
    await page.waitForURL("/app", { timeout: 10000 });
    await expect(page.getByRole("heading", { name: /Dashboard/i })).toBeVisible();
  });
});
