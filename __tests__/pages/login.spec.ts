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

  test("should show validation errors", async ({ page }) => {
    await page.goto("/auth/login")

    await page.getByRole("button", { name: "Login" }).click()
    await expect(page.getByText("Email is required")).toBeVisible()
    await expect(page.getByText("Password is required")).toBeVisible()

    await page.getByRole("textbox", { name: "Email" }).fill("email")
    await page.getByRole("textbox", { name: "Password" }).fill("1234")
    await page.getByRole("button", { name: "Login" }).click()
    await expect(page.getByText("Invalid email format")).toBeVisible()
    await expect(
      page.getByText("Password must be at least 8 characters")
    ).toBeVisible()
  })
})
