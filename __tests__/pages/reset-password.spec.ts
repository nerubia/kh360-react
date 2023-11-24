import { test, expect } from "@playwright/test"

test.describe("Reset Password", () => {
  test("should render correctly", async ({ page }) => {
    await page.goto("/auth/reset")
    await expect(page.getByRole("heading", { name: "Reset Password" })).toBeVisible()
    await expect(page.getByRole("textbox", { name: "New password" }).first()).toBeVisible()
    await expect(page.getByRole("textbox", { name: "Confirm new password" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Reset" })).toBeVisible()
  })
})
