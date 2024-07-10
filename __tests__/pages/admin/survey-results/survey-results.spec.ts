import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("Admin - Survey results", () => {
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
    test("should not allow to view the survey results", async ({ page }) => {
      await page.goto("/admin/survey-results")

      await expect(page).toHaveURL("/auth/login?callback=/admin/survey-results")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the survey results", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/survey-results")

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

      await page.goto("/admin/survey-results")

      await mockRequest(page, "/admin/survey-administrations?status=Closed", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              name: "Test 1",
              survey_start_date: "2024-07-09T00:00:00.000Z",
              survey_end_date: "2024-07-10T00:00:00.000Z",
              survey_template_id: 2,
              remarks: "Test",
              email_subject: "test",
              email_content: "test",
              status: "Closed",
              created_by_id: null,
              updated_by_id: null,
              created_at: "2024-07-09T08:35:43.000Z",
              updated_at: "2024-07-10T01:32:00.000Z",
              deleted_at: null,
            },
          ],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            currentPage: 1,
            totalPages: 1,
            totalItems: 1,
          },
        }),
      })

      await page.waitForLoadState("networkidle")

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("heading", { name: "Survey Results" })).toBeVisible()

      await expect(page.getByPlaceholder("Search by name")).toBeVisible()
      await expect(page.getByRole("button", { name: "Search" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Clear" })).toBeVisible()

      await expect(page.getByRole("heading", { name: "1 Result Found" })).toBeVisible()

      if (isMobile) {
        await expect(
          page.getByText("Test 1schedule:Jul 9, 2024 to Jul 10, 2024status:Closed")
        ).toBeVisible()
      } else {
        await expect(page.getByRole("columnheader", { name: "Name" })).toBeVisible()
        await expect(page.getByRole("columnheader", { name: "Description" })).toBeVisible()
        await expect(page.getByRole("columnheader", { name: "Schedule" })).toBeVisible()

        await expect(page.getByRole("cell", { name: "Test 1" })).toBeVisible()
        await expect(page.getByRole("cell", { name: "Test", exact: true })).toBeVisible()
        await expect(page.getByRole("cell", { name: "2024-07-09 to 2024-07-10" })).toBeVisible()
      }
    })
  })
})
