import { test, expect } from "@playwright/test"

test.describe("Login", () => {
  test("should render correctly", async ({ page }) => {
    await page.goto("/auth/login")
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible()
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible()
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Forgot password?" })
    ).toBeVisible()
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible()
  })
})
