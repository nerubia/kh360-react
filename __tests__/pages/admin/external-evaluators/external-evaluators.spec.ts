import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../utils/setupPlaywright"
import { mockRequest } from "../../../utils/mockRequest"
import { loginUser } from "../../../utils/loginUser"

setupPlaywright()

test.describe("Admin - External Evaluators", () => {
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
    test("should not allow to view the external evaluators", async ({ page }) => {
      await page.goto("/admin/external-evaluators")

      await expect(page).toHaveURL("/auth/login?callback=/admin/external-evaluators")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the external evaluators", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/external-evaluators")

      await expect(page).toHaveURL("/dashboard")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page }) => {
      await loginUser("admin", page)

      await page.goto("/admin/external-evaluators")

      await mockRequest(page, "/admin/external-users", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              email: "john@nerubia.com",
              first_name: "John",
              middle_name: null,
              last_name: "Doe",
              role: "Developer",
              company: "Sample Agency",
              created_by_id: null,
              updated_by_id: null,
              created_at: null,
              updated_at: null,
            },
          ],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            totalPages: 1,
          },
        }),
      })

      await page.waitForLoadState("networkidle")

      await expect(page.getByRole("heading", { name: "External Evaluators" })).toBeVisible()
      await expect(page.getByPlaceholder("Search by name")).toBeVisible()
      await expect(page.getByPlaceholder("Search by company")).toBeVisible()
      await expect(page.getByPlaceholder("Search by role")).toBeVisible()
      await expect(page.getByRole("button", { name: "Search" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Clear" })).toBeVisible()

      await expect(page.getByRole("link", { name: "Add External Evaluator" })).toBeVisible()

      await expect(page.getByRole("cell", { name: "Name" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Email Address" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Company" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Role" })).toBeVisible()

      await expect(page.getByRole("cell", { name: "Doe, John" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "john@nerubia.com" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Sample Agency" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Developer" })).toBeVisible()
      await expect(page.getByTestId("EditButton")).toBeVisible()
      await expect(page.getByTestId("DeleteButton")).toBeVisible()
    })
  })
})
