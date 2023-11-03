import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../utils/setupPlaywright"
import { mockRequest } from "../utils/mockRequest"
import { loginUser } from "../utils/loginUser"

setupPlaywright()

test.describe("User - Evaluations", () => {
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

  test.describe("as Guest", () => {
    test("should not allow to view the evaluations", async ({ page }) => {
      await page.goto("/evaluations")

      await expect(page).toHaveURL("/auth/login")
    })

    test.describe("as Employee", () => {
      test("should render correctly", async ({ page }) => {
        await loginUser("employee", page)

        await page.goto("/evaluations")

        await expect(
          page.getByRole("heading", { name: "Evaluations" })
        ).toBeVisible()
      })
    })
  })
})
