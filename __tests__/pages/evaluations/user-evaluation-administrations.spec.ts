import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../utils/setupPlaywright"
import { mockRequest } from "../../utils/mockRequest"
import { loginUser } from "../../utils/loginUser"

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
              totalPending: 2,
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
              totalPending: 2,
            },
          ],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            totalPages: 1,
          },
        }),
      })

      await expect(page.getByRole("heading", { name: "Performance Evaluations" })).toBeVisible()

      await expect(page.getByRole("button", { name: "Evaluation 1" })).toBeVisible()
      await expect(page.getByText("Evaluation Period: Jul 22 - Sep 22, 2023").first()).toBeVisible()
      await expect(page.getByText("This is description").first()).toBeVisible()
      await expect(page.getByText("0 out of 3 Evaluations Submitted")).toBeVisible()
      await expect(page.getByText("Evaluate By: March 14, 2023").first()).toBeVisible()

      await expect(page.getByRole("button", { name: "Evaluation 2" })).toBeVisible()
      await expect(page.getByText("Evaluation Period: Jul 22 - Sep 22, 2023").nth(1)).toBeVisible()
      await expect(page.getByText("This is description").nth(1)).toBeVisible()
      await expect(page.getByText("1 out of 3 Evaluations Submitted")).toBeVisible()
      await expect(page.getByText("Evaluate By: March 14, 2023").nth(1)).toBeVisible()

      await expect(page.getByRole("button", { name: "Evaluation 3" })).toBeVisible()
      await expect(page.getByText("Evaluation Period: Jul 22 - Sep 22, 2023").nth(2)).toBeVisible()
      await expect(page.getByText("This is description").nth(2)).toBeVisible()
      await expect(page.getByText("2 out of 4 Evaluations Submitted")).toBeVisible()
      await expect(page.getByText("Evaluate By: March 14, 2023").nth(2)).toBeVisible()
    })
  })
})
