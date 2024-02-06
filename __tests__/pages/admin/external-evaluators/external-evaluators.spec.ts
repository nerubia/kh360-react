import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

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

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/my-evaluations")
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

      await expect(page.getByRole("button", { name: "Add External Evaluator" })).toBeVisible()

      await expect(page.locator("tr >th")).toHaveText([
        "Name",
        "Email Address",
        "Company",
        "Role",
        "Actions",
      ])

      await expect(page.getByRole("cell", { name: "Doe, John" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "john@nerubia.com" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Sample Agency" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Developer" })).toBeVisible()
      await expect(page.getByTestId("EditButton")).toBeVisible()
      await expect(page.getByTestId("DeleteButton")).toBeVisible()
    })
  })
})
