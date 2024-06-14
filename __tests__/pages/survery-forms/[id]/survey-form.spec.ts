import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("User - Survey Form", () => {
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
      await page.goto("/survey-forms/85")

      await expect(page).toHaveURL("/auth/login?callback=/survey-forms/85")
    })
  })

  test.describe("as Employee", () => {
    test("should render correctly", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/survey-forms/85")

      await mockRequest(page, "/user/survey-questions?survey_administration_id=85", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          survey_template_questions: [],
          survey_administration: {
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
          },
          survey_result_status: "Ongoing",
          survey_answers: [],
          survey_user_companions: [],
        }),
      })

      await expect(page.getByRole("heading", { name: "Survey 1" })).toBeVisible()

      await expect(page.getByText("survey", { exact: true })).toBeVisible()

      await expect(page.getByText("Companions:")).toBeVisible()

      await expect(page.getByText("No companions added. Click here to add.")).toBeVisible()

      await expect(page.getByRole("button", { name: "Cancel & Exit" })).toBeVisible()

      await expect(page.getByRole("button", { name: "Save & Submit" })).toBeVisible()
    })
  })
})
