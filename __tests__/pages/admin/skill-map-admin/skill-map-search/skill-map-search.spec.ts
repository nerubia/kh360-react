import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("Admin - Skill Map Search", () => {
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
    test("should not allow to view the skill map search", async ({ page }) => {
      await page.goto("/admin/skill-map-administrations-search")

      await expect(page).toHaveURL("/auth/login?callback=/admin/skill-map-administrations-search")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the skill map search", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/skill-map-administrations-search")

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
    // TODO:
  })
})
