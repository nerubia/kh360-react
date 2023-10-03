import { test, expect } from "@playwright/test"

test.describe("Forgot Password", () => {
  test("should render correctly", async ({ page }) => {
    await page.goto("/auth/forgot")
    await expect(
      page.getByRole("heading", { name: "Forgot Password" })
    ).toBeVisible()
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Send email" })).toBeVisible()
  })
})
