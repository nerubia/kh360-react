import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("Admin - Projects", () => {
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
    test("should not allow to view the projects", async ({ page }) => {
      await page.goto("/admin/projects")

      await expect(page).toHaveURL("/auth/login?callback=/admin/projects")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the projects", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/projects")

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

      await page.goto("/admin/projects")

      await mockRequest(page, "/projects", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              slug: "abc",
              name: "ABC",
              type: null,
              client_id: 23,
              start_date: "2024-02-23T00:00:00.000Z",
              end_date: "2024-03-23T00:00:00.000Z",
              status: "Closed",
              description: "abc test abc test abc test",
              created_at: "2024-03-04T06:04:49.000Z",
              updated_at: "2024-06-06T07:02:42.000Z",
              deleted_at: null,
              client: {
                id: 23,
                name: "Sooch Consulting Corporation",
              },
            },
          ],
          pageInfo: {
            currentPage: 1,
            hasPreviousPage: false,
            hasNextPage: false,
            totalPages: 1,
            totalItems: 1,
          },
        }),
      })

      await mockRequest(page, "/status", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            status: "Ongoing",
          },
          {
            status: "Closed",
          },
          {
            status: "Draft",
          },
          {
            status: "Cancelled",
          },
          {
            status: "Hold",
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible()

      await expect(page.locator("label").filter({ hasText: "Name" })).toBeVisible()
      await expect(page.getByPlaceholder("Search by name")).toBeVisible()

      await expect(page.locator("label").filter({ hasText: "Client" })).toBeVisible()
      await expect(page.getByPlaceholder("Search by client")).toBeVisible()

      await expect(page.locator("label").filter({ hasText: "Skills" })).toBeVisible()
      await expect(page.getByPlaceholder("Search by skills")).toBeVisible()

      await expect(page.locator("label").filter({ hasText: "Status" })).toBeVisible()
      await expect(page.locator("div").filter({ hasText: /^All$/ }).nth(1)).toBeVisible()

      await expect(page.getByRole("button", { name: "Search" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Clear" })).toBeVisible()

      await expect(page.getByRole("heading", { name: "1 Result Found" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Add Project" })).toBeVisible()

      await expect(page.getByRole("columnheader", { name: "Name" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Client" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Status" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Actions" })).toBeVisible()

      await expect(page.getByRole("cell", { name: "ABC" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Sooch Consulting Corporation" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "CLOSED" })).toBeVisible()
      await expect(page.getByRole("cell").nth(3)).toBeVisible()
    })
  })
})
