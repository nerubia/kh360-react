import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../../utils/setup-playwright"
import { mockRequest } from "../../../../utils/mock-request"
import { loginUser } from "../../../../utils/login-user"

setupPlaywright()

test.describe("Admin - Create Email Template", () => {
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
    test("should not allow to view the admin create email template", async ({ page }) => {
      await page.goto("/admin/message-templates/create")

      await expect(page).toHaveURL("/auth/login?callback=/admin/message-templates/create")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the admin create email template", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/message-templates/create")

      await expect(page).toHaveURL("/dashboard")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/message-templates/create")

      await mockRequest(page, "/admin/email-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 32,
            name: "Msg Template - Test Only",
            template_type: "Evaluation Complete Thank You Message External",
            is_default: true,
            subject: "[BETA] Evaluation Completed External?",
            content: null,
            created_by_id: null,
            updated_by_id: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 11,
            name: "Create Evaluation Administration Template",
            template_type: "Create Evaluation",
            is_default: true,
            subject: "[TEST] Request for Evaluation",
            content: "Test",
            created_by_id: null,
            updated_by_id: null,
            created_at: null,
            updated_at: null,
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByPlaceholder("Name")).toBeVisible()
      await expect(page.getByPlaceholder("Subject")).toBeVisible()
      await expect(page.getByPlaceholder("Content")).toBeVisible()

      await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Save" })).toBeVisible()
    })

    test("should show validation errors", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/message-templates/create")

      await mockRequest(page, "/admin/email-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 32,
            name: "Msg Template - Test Only",
            template_type: "Evaluation Complete Thank You Message External",
            is_default: true,
            subject: "[BETA] Evaluation Completed External?",
            content: null,
            created_by_id: null,
            updated_by_id: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 11,
            name: "Create Evaluation Administration Template",
            template_type: "Create Evaluation",
            is_default: true,
            subject: "[TEST] Request for Evaluation",
            content: "Test",
            created_by_id: null,
            updated_by_id: null,
            created_at: null,
            updated_at: null,
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Save" }).click()

      await expect(page.getByText("Name is required")).toBeVisible()
      await expect(page.getByText("Template type is required")).toBeVisible()
      await expect(page.getByText("Subject is required")).toBeVisible()
      await expect(page.getByText("Content is required")).toBeVisible()
    })

    test("should create email template succesfully", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/message-templates/create")

      await mockRequest(page, "/admin/email-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 32,
            name: "Msg Template - Test Only",
            template_type: "Evaluation Complete Thank You Message External",
            is_default: true,
            subject: "[BETA] Evaluation Completed External?",
            content: null,
            created_by_id: null,
            updated_by_id: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 11,
            name: "Create Evaluation Administration Template",
            template_type: "Create Evaluation",
            is_default: true,
            subject: "[TEST] Request for Evaluation",
            content: "Test",
            created_by_id: null,
            updated_by_id: null,
            created_at: null,
            updated_at: null,
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/admin/email-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
        }),
      })

      await page.getByPlaceholder("Name").fill("Test")
      await page.getByPlaceholder("Subject").fill("[TEST] Subject")
      await page.getByPlaceholder("Content").fill("Sample content only")

      await page.getByRole("button", { name: "Save" }).click()

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/admin/message-templates/create")
    })

    test("should render cancel & exit modal correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/message-templates/create")

      await mockRequest(page, "/admin/email-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 32,
            name: "Msg Template - Test Only",
            template_type: "Evaluation Complete Thank You Message External",
            is_default: true,
            subject: "[BETA] Evaluation Completed External?",
            content: null,
            created_by_id: null,
            updated_by_id: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 11,
            name: "Create Evaluation Administration Template",
            template_type: "Create Evaluation",
            is_default: true,
            subject: "[TEST] Request for Evaluation",
            content: "Test",
            created_by_id: null,
            updated_by_id: null,
            created_at: null,
            updated_at: null,
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Cancel" }).click()

      await expect(page.getByRole("heading", { name: "Cancel" })).toBeVisible()
      await expect(
        page.getByText("Are you sure you want to cancel? If you cancel, your data won't be save")
      ).toBeVisible()
      await expect(page.getByRole("button", { name: "No" })).toBeVisible()
      await expect(page.getByRole("link", { name: "Yes" })).toBeVisible()
    })

    test("should allow to cancel & exit", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/message-templates/create")

      await mockRequest(page, "/admin/email-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 32,
            name: "Msg Template - Test Only",
            template_type: "Evaluation Complete Thank You Message External",
            is_default: true,
            subject: "[BETA] Evaluation Completed External?",
            content: null,
            created_by_id: null,
            updated_by_id: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 11,
            name: "Create Evaluation Administration Template",
            template_type: "Create Evaluation",
            is_default: true,
            subject: "[TEST] Request for Evaluation",
            content: "Test",
            created_by_id: null,
            updated_by_id: null,
            created_at: null,
            updated_at: null,
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/admin/email-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 11,
              name: "Create Evaluation Administration Template",
              template_type: "Create Evaluation",
              is_default: true,
              subject: "[TEST] Request for Evaluation",
              content: "Test",
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

      await page.getByRole("button", { name: "Cancel" }).click()
      await page.getByRole("link", { name: "Yes" }).click()

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/admin/message-templates")
    })
  })
})
