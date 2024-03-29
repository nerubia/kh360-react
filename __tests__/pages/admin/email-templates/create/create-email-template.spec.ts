import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

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

      await mockRequest(page, "/user/my-evaluations", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            totalPages: 0,
          },
        }),
      })

      await mockRequest(
        page,
        "/user/email-templates?template_type=No+Available+Evaluation+Results",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: 11,
            name: "No Available Evaluation Results",
            template_type: "No Available Evaluation Results",
            is_default: true,
            subject: "",
            content:
              "Uh-oh! 🤷‍♂️\n\nLooks like our magical elves are still working their charm behind the scenes, and your results haven't arrived just yet. Don't worry, though – good things come to those who wait!\n\nIn the meantime, why not grab a cup of coffee or practice your superhero pose? 🦸‍♀️ We'll have those results ready for you in no time.\n\nStay tuned and keep the positive vibes flowing! ✨",
            created_by_id: null,
            updated_by_id: null,
            created_at: null,
            updated_at: null,
          }),
        }
      )
      await mockRequest(page, "/user/score-ratings", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            created_at: null,
            display_name: "Navigational Challenge",
            evaluee_description:
              "You face occasional difficulty in navigating job responsibilities.\nYour performance consistently falls below expectations and significant improvement is needed in various aspects of job responsibilities.\nYour goals and objectives are not met consistently.",
            id: 1,
            max_score: "1.99",
            min_score: "0",
            name: "Needs Improvement",
            result_description:
              "Employee faces occasional difficulty in navigating job responsibilities.\nPerformance consistently falls below expectations and significant improvement is needed in various aspects of job responsibilities.\nGoals and objectives are not met consistently.",
            status: null,
            updated_at: null,
          },
        ]),
      })

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/my-evaluations")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/message-templates/create")

      await mockRequest(page, "/admin/email-templates/11", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 11,
            name: "Create Evaluation Administration Template",
            template_type: "Create Evaluation",
            is_default: 1,
            subject: "[BETA] Request for Evaluation",
            content: "Test",
            created_by_id: null,
            updated_by_id: null,
            created_at: null,
            updated_at: null,
          },
        ]),
      })

      await mockRequest(page, "/admin/email-templates/types", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              label: "Create Evaluation",
              value: "Create Evaluation",
            },
            {
              label: "Reset Verification Code",
              value: "Reset Verification Code",
            },
            {
              label: "Performance Evaluation NA Rating",
              value: "Performance Evaluation NA Rating",
            },
            {
              label: "Performance Evaluation High Rating",
              value: "Performance Evaluation High Rating",
            },
          ],
        }),
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

      await mockRequest(page, "/admin/email-templates/types", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              label: "Create Evaluation",
              value: "Create Evaluation",
            },
            {
              label: "Reset Verification Code",
              value: "Reset Verification Code",
            },
            {
              label: "Performance Evaluation NA Rating",
              value: "Performance Evaluation NA Rating",
            },
            {
              label: "Performance Evaluation High Rating",
              value: "Performance Evaluation High Rating",
            },
          ],
        }),
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
      await expect(page.getByRole("button", { name: "Yes" })).toBeVisible()
    })

    test("should show validation errors", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/message-templates/create")

      await mockRequest(page, "/admin/email-templates/types", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              label: "Create Evaluation",
              value: "Create Evaluation",
            },
            {
              label: "Reset Verification Code",
              value: "Reset Verification Code",
            },
            {
              label: "Performance Evaluation NA Rating",
              value: "Performance Evaluation NA Rating",
            },
            {
              label: "Performance Evaluation High Rating",
              value: "Performance Evaluation High Rating",
            },
          ],
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Save" }).click()

      await expect(page.getByText("Name is required")).toBeVisible()
      await expect(page.getByText("Template type is required")).toBeVisible()
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

      await mockRequest(page, "/admin/email-templates/types", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              label: "Create Evaluation",
              value: "Create Evaluation",
            },
            {
              label: "Reset Verification Code",
              value: "Reset Verification Code",
            },
            {
              label: "Performance Evaluation NA Rating",
              value: "Performance Evaluation NA Rating",
            },
            {
              label: "Performance Evaluation High Rating",
              value: "Performance Evaluation High Rating",
            },
          ],
        }),
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

    test("should allow to cancel & exit", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/message-templates/create")

      await mockRequest(page, "/admin/email-templates/types", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              label: "Create Evaluation",
              value: "Create Evaluation",
            },
            {
              label: "Reset Verification Code",
              value: "Reset Verification Code",
            },
            {
              label: "Performance Evaluation NA Rating",
              value: "Performance Evaluation NA Rating",
            },
            {
              label: "Performance Evaluation High Rating",
              value: "Performance Evaluation High Rating",
            },
          ],
        }),
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

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/admin/message-templates/create")
    })
  })
})
