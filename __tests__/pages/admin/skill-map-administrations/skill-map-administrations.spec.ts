import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("Admin - Skill Map Administrations", () => {
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
    test("should not allow to view the skill map administrations", async ({ page }) => {
      await page.goto("/admin/skill-map-administrations")

      await expect(page).toHaveURL("/auth/login?callback=/admin/skill-map-administrations")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the skill map administrations", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/skill-map-administrations")

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

      await page.goto("/admin/skill-map-administrations")

      await mockRequest(page, "/admin/skill-map-administrations", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              name: "Skill Map 1",
              skill_map_period_start_date: "2024-04-06T00:00:00.000Z",
              skill_map_period_end_date: "2023-03-14T00:00:00.000Z",
              skill_map_schedule_start_date: "2023-03-15T00:00:00.000Z",
              skill_map_schedule_end_date: "2023-03-16T00:00:00.000Z",
              remarks: "Remarks",
              email_subject: "",
              email_content: null,
              status: "Draft",
              created_by_id: null,
              updated_by_id: null,
              created_at: "2023-10-17T03:41:43.000Z",
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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByPlaceholder("Search by name")).toBeVisible()
      await expect(page.getByRole("combobox")).toBeVisible()
      await expect(page.getByRole("button", { name: "Search" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Clear" })).toBeVisible()

      await expect(page.locator("tr > th")).toHaveText([
        "Name",
        "Description",
        "Period",
        "Schedule",
        "Status",
      ])

      await expect(page.getByRole("heading", { name: "Skill Map Administrations" })).toBeVisible()

      if (!isMobile) {
        await expect(page.getByRole("button", { name: "Create Skill Map" })).toBeVisible()
        await expect(page.getByRole("cell", { name: "Skill Map 1" })).toBeVisible()
        await expect(page.getByRole("cell", { name: "Remarks" })).toBeVisible()
        await expect(page.getByRole("cell", { name: "2023-03-15 to 2023-03-16" })).toBeVisible()
        await expect(page.getByRole("cell", { name: "Draft" }).locator("span")).toBeVisible()
      } else {
        await expect(page.getByTestId("skill-map-admin-list")).toBeVisible()
        const nameElement = page.locator('[data-testid="name"]').nth(0)
        await expect(nameElement).toBeVisible()

        const scheduleElement = page.locator('[data-testid="schedule"]').nth(0)
        await expect(scheduleElement).toBeVisible()
        if (isMobile) {
          const nameElement = page.locator('[data-testid="status"]').nth(0)
          await expect(nameElement).toBeVisible()
        }
      }
    })
  })
})
