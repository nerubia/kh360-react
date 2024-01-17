import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../utils/setup-playwright"
import { mockRequest } from "../../../utils/mock-request"
import { loginUser } from "../../../utils/login-user"

setupPlaywright()

test.describe("Admin - Email Templates", () => {
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
    test("should not allow to view the email templates", async ({ page }) => {
      await page.goto("/admin/message-templates")

      await expect(page).toHaveURL("/auth/login?callback=/admin/message-templates")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the email templates", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/message-templates")

      await expect(page).toHaveURL("/dashboard")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page }) => {
      await loginUser("admin", page)

      await page.goto("/admin/message-templates")

      await mockRequest(page, "/admin/email-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              name: "Test",
              template_type: "Test Template",
              is_default: true,
              subject: "[Test] Sample Email",
              content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
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

      await expect(page.getByRole("heading", { name: "Message Templates" })).toBeVisible()
      await expect(page.getByPlaceholder("Search by name")).toBeVisible()
      await expect(page.getByRole("button", { name: "Search" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Clear" })).toBeVisible()

      await expect(page.getByRole("button", { name: "Add Message Template" })).toBeVisible()

      await expect(page.getByRole("cell", { name: "Name" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Template Type" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Default" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Subject" })).toBeVisible()

      await expect(page.getByRole("cell", { name: "Test Template" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Yes" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "[Test] Sample Email" })).toBeVisible()
      await expect(page.getByTestId("EditButton")).toBeVisible()
      await expect(page.getByTestId("DeleteButton")).toBeVisible()
    })
  })
})