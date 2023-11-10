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

      await expect(page).toHaveURL("/auth/login")
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

      await expect(
        page.getByRole("heading", { name: "User Evaluation Administrations" })
      ).toBeVisible()

      await expect(page.getByRole("cell", { name: "Name" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Period" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Schedule" })).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "Total Evaluations" })
      ).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "Total Submitted" })
      ).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "Total Pending" })
      ).toBeVisible()

      await expect(
        page.getByRole("cell", { name: "Evaluation 1" })
      ).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "Evaluation 2" })
      ).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "Evaluation 3" })
      ).toBeVisible()
    })
  })
})
