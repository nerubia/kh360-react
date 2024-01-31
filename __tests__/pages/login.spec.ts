import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"

setupPlaywright()

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    await mockRequest(page, "/auth/refresh", {
      status: 403,
      contentType: "application/json",
      body: JSON.stringify({ message: "Forbidden" }),
    })
    await mockRequest(page, "/gsi/client", {
      status: 200,
      contentType: "application/json",
    })
  })

  test("should render correctly", async ({ page }) => {
    await page.goto("/auth/login")
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible()
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Forgot password?" })).toBeVisible()
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
  })

  test("should login succesfully", async ({ page }) => {
    await page.goto("/auth/login")

    await mockRequest(page, "/auth/login", {
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ access_token: "sample access token" }),
    })

    await page.getByRole("textbox", { name: "Email" }).fill("me@gmail.com")
    await page.getByRole("textbox", { name: "Password" }).fill("password")
    await page.getByRole("button", { name: "Login" }).click()

    await expect(page).toHaveURL("/my-evaluations")
  })

  /* test("should not allow to view the dashboard", async ({ page }) => {
    await page.goto("/dashboard")

    await expect(page).toHaveURL("/auth/login?callback=/dashboard")
  }) */
  test("should not allow to view the my evaluations", async ({ page }) => {
    await page.goto("/my-evaluations")

    await expect(page).toHaveURL("/auth/login?callback=/my-evaluations")
  })
})
