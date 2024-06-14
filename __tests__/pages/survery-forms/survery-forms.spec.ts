import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("User - Survey Forms", () => {
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
    test("should not allow to view the survey forms", async ({ page }) => {
      await page.goto("/survey-forms")

      await expect(page).toHaveURL("/auth/login?callback=/survey-forms")
    })
  })

  test.describe("as Employee", () => {
    test("should render correctly", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/survey-forms")

      await mockRequest(page, "/user/survey-administrations", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 85,
              name: "Survey 1",
              survey_start_date: "2024-06-14T00:00:00.000Z",
              survey_end_date: "2024-12-31T00:00:00.000Z",
              survey_template_id: 1,
              remarks: "survey",
              email_subject: "1",
              email_content: "1",
              status: "Ongoing",
              created_by_id: null,
              updated_by_id: null,
              created_at: "2024-06-14T03:53:57.000Z",
              updated_at: "2024-06-14T03:55:00.000Z",
              deleted_at: null,
              survey_result_status: "Ongoing",
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

      await mockRequest(page, "/user/email-templates?template_type=No+Pending+Survey+Forms", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}),
      })

      await expect(page.getByRole("heading", { name: "Survey Forms" })).toBeVisible()

      await expect(
        page.getByRole("link", {
          name: "Survey 1 Ongoing Survey Period: Jun 14 - Dec 31, 2024 survey",
        })
      ).toBeVisible()
    })
  })
})
