import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("User - Evaluations", () => {
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
    test("should not allow to view the evaluations", async ({ page }) => {
      await page.goto("/evaluation-administrations")

      await expect(page).toHaveURL("/auth/login?callback=/evaluation-administrations")
    })
  })

  test.describe("as Employee", () => {
    test("should render correctly", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/evaluation-administrations")

      await mockRequest(page, "/user/evaluation-administrations", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              name: "Evaluation 1",
              eval_schedule_start_date: "2024-04-06T00:00:00.000Z",
              eval_schedule_end_date: "2023-03-14T00:00:00.000Z",
              eval_period_start_date: "2023-07-22T00:00:00.000Z",
              eval_period_end_date: "2023-09-22T00:00:00.000Z",
              remarks: "This is description",
              status: "ongoing",
              totalEvaluations: 3,
              totalSubmitted: 0,
              totalPending: 3,
            },
            {
              id: 2,
              name: "Evaluation 2",
              eval_schedule_start_date: "2024-04-06T00:00:00.000Z",
              eval_schedule_end_date: "2023-03-14T00:00:00.000Z",
              eval_period_start_date: "2023-07-22T00:00:00.000Z",
              eval_period_end_date: "2023-09-22T00:00:00.000Z",
              remarks: "This is description",
              status: "ongoing",
              totalEvaluations: 3,
              totalSubmitted: 1,
              totalPending: 3,
            },
            {
              id: 3,
              name: "Evaluation 3",
              eval_schedule_start_date: "2024-04-06T00:00:00.000Z",
              eval_schedule_end_date: "2023-03-14T00:00:00.000Z",
              eval_period_start_date: "2023-07-22T00:00:00.000Z",
              eval_period_end_date: "2023-09-22T00:00:00.000Z",
              remarks: "This is description",
              status: "ongoing",
              totalEvaluations: 4,
              totalSubmitted: 2,
              totalPending: 4,
            },
          ],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            totalPages: 1,
          },
        }),
      })

      await mockRequest(page, "/user/email-templates?template_type=No+Pending+Evaluation+Forms", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}),
      })

      await expect(page.getByRole("heading", { name: "Performance Evaluations" })).toBeVisible()

      await expect(
        page.getByRole("link", {
          name: "Evaluation 1 0 out of 3 Evaluations Submitted Evaluate By: March 14, 2023 Evaluation Period: Jul 22 - Sep 22, 2023 This is description",
        })
      ).toBeVisible()
      await expect(
        page.getByRole("link", {
          name: "Evaluation 2 1 out of 3 Evaluations Submitted Evaluate By: March 14, 2023 Evaluation Period: Jul 22 - Sep 22, 2023 This is description",
        })
      ).toBeVisible()
      await expect(
        page.getByRole("link", {
          name: "Evaluation 3 2 out of 4 Evaluations Submitted Evaluate By: March 14, 2023 Evaluation Period: Jul 22 - Sep 22, 2023 This is description",
        })
      ).toBeVisible()
    })
  })
})
