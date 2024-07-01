import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("Admin - Skill Map Results", () => {
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
    test("should not allow to view the skill map results", async ({ page }) => {
      await page.goto("/admin/skill-map-administrations-results")

      await expect(page).toHaveURL("/auth/login?callback=/admin/skill-map-administrations-results")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the skill map results", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/skill-map-administrations-results")

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

      await page.goto("/admin/skill-map-administrations-results")

      await mockRequest(page, "/admin/skill-map-results/latest", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 556,
              skill_map_administration_id: 400,
              status: "Submitted",
              submitted_date: "2024-06-20T06:13:08.000Z",
              users: {
                id: 20203,
                first_name: "User",
                last_name: "One",
              },
            },
            {
              id: 559,
              skill_map_administration_id: 395,
              status: "Submitted",
              submitted_date: "2024-06-20T05:19:38.000Z",
              users: {
                id: 20219,
                first_name: "user",
                last_name: "Two",
              },
            },
          ],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            currentPage: 1,
            totalPages: 1,
            totalItems: 2,
          },
        }),
      })

      await mockRequest(page, "/active?answer_name=Skill+Map+Scale", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 7,
            answer_id: 2,
            sequence_no: 2,
            name: "Beginner",
            display_name: "Beginner",
            answer_type: "lowest",
            rate: "2",
            description: null,
            is_active: null,
            created_at: null,
            updated_at: null,
          },
        ]),
      })

      await page.waitForLoadState("networkidle")

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("heading", { name: "Skill Map Results" })).toBeVisible()

      await expect(page.getByText("Name", { exact: true })).toBeVisible()
      await expect(page.getByPlaceholder("Search by name")).toBeVisible()
      await expect(page.getByRole("button", { name: "Search" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Clear" })).toBeVisible()

      await expect(page.getByRole("heading", { name: "2 Results Found" })).toBeVisible()

      await expect(page.getByRole("columnheader", { name: "Employee Name" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Latest Period Date" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Latest Submitted Date" })).toBeVisible()

      await expect(page.getByRole("cell", { name: "One, User" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Two, user" })).toBeVisible()
    })
  })
})
