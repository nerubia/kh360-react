import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../utils/setupPlaywright"
import { mockRequest } from "../utils/mockRequest"

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

  test("should login succesfully", async ({ page }) => {
    await page.goto("/auth/login")

    await mockRequest(page, "/auth/login", {
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ accessToken: "sample access token" }),
    })

    await page.getByRole("textbox", { name: "Email" }).fill("me@gmail.com")
    await page.getByRole("textbox", { name: "Password" }).fill("password")
    await page.getByRole("button", { name: "Login" }).click()

    await expect(page).toHaveURL("/dashboard")
  })
})
