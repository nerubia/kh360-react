import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("User - Skill Map Forms", () => {
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
    test("should not allow to view the skill map forms", async ({ page }) => {
      await page.goto("/skill-map-forms")

      await expect(page).toHaveURL("/auth/login?callback=/skill-map-forms")
    })
  })

  test.describe("as Employee", () => {
    test("should render correctly", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/skill-map-forms")

      await mockRequest(page, "/user/skill-map-administrations", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 395,
              name: "Skill Map 2",
              skill_map_schedule_start_date: "2024-06-01T00:00:00.000Z",
              skill_map_schedule_end_date: "2024-06-30T00:00:00.000Z",
              skill_map_period_start_date: "2024-01-01T00:00:00.000Z",
              skill_map_period_end_date: "2024-04-30T00:00:00.000Z",
              remarks: "a",
              email_subject: "a",
              email_content: "a",
              status: "Ongoing",
              created_by_id: null,
              updated_by_id: null,
              created_at: "2024-06-10T00:17:05.000Z",
              updated_at: "2024-06-10T00:18:00.000Z",
              skill_map_result_status: "Ongoing",
            },
            {
              id: 394,
              name: "Skill Map 1",
              skill_map_schedule_start_date: "2024-06-01T00:00:00.000Z",
              skill_map_schedule_end_date: "2024-06-30T00:00:00.000Z",
              skill_map_period_start_date: "2023-01-01T00:00:00.000Z",
              skill_map_period_end_date: "2023-04-30T00:00:00.000Z",
              remarks: "a",
              email_subject: "a",
              email_content: "a",
              status: "Ongoing",
              created_by_id: null,
              updated_by_id: null,
              created_at: "2024-06-10T00:16:18.000Z",
              updated_at: "2024-06-11T07:03:29.000Z",
              skill_map_result_status: "Submitted",
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

      await mockRequest(page, "/user/email-templates?template_type=No+Pending+Skill+Map+Forms", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}),
      })

      await expect(page.getByRole("heading", { name: "Skill Map Forms" })).toBeVisible()

      await expect(
        page.getByRole("link", {
          name: "Skill Map 2 Ongoing Period: Jan 1 - Apr 30, 2024 Schedule: Jun 1 - 30, 2024 a",
        })
      ).toBeVisible()

      await expect(
        page.getByRole("link", {
          name: "Skill Map 1 Submitted Period: Jan 1 - Apr 30, 2023 Schedule: Jun 1 - 30, 2024 a",
        })
      ).toBeVisible()
    })
  })
})
