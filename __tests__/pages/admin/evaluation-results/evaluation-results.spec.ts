import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../utils/setup-playwright"
import { mockRequest } from "../../../utils/mock-request"
import { loginUser } from "../../../utils/login-user"

setupPlaywright()

test.describe("Admin - Evaluation results", () => {
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
    test("should not allow to view the admin evaluation results", async ({ page }) => {
      await page.goto("/admin/evaluation-results")

      await expect(page).toHaveURL("/auth/login?callback=/admin/evaluation-results")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the admin evaluation results", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/evaluation-results")

      await expect(page).toHaveURL("/dashboard")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-results")

      await mockRequest(page, "/admin/evaluation-administrations?status=Closed,Published", {
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
              remarks: null,
              email_subject: "",
              email_content: null,
              status: "completed",
              created_by_id: null,
              updated_by_id: null,
              created_at: "2023-10-17T03:41:43.000Z",
              updated_at: null,
              evaluees_count: 1,
            },
            {
              id: 2,
              name: "Evaluation 2",
              eval_schedule_start_date: "2023-04-12T00:00:00.000Z",
              eval_schedule_end_date: "2024-07-02T00:00:00.000Z",
              eval_period_start_date: "2023-05-10T00:00:00.000Z",
              eval_period_end_date: "2023-10-23T00:00:00.000Z",
              remarks: null,
              email_subject: "",
              email_content: null,
              status: "ongoing",
              created_by_id: null,
              updated_by_id: null,
              created_at: "2023-10-17T03:41:43.000Z",
              updated_at: null,
              evaluees_count: 1,
            },
            {
              id: 3,
              name: "Evaluation 3",
              eval_schedule_start_date: "2023-04-12T00:00:00.000Z",
              eval_schedule_end_date: "2024-07-02T00:00:00.000Z",
              eval_period_start_date: "2023-05-10T00:00:00.000Z",
              eval_period_end_date: "2023-10-23T00:00:00.000Z",
              remarks: null,
              email_subject: "",
              email_content: null,
              status: "draft",
              created_by_id: null,
              updated_by_id: null,
              created_at: "2023-10-17T03:41:43.000Z",
              updated_at: null,
              evaluees_count: 1,
            },
          ],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            totalPages: 1,
          },
        }),
      })

      await expect(page.getByRole("heading", { name: "Evaluation Results" })).toBeVisible()

      await expect(
        page.getByRole("link", {
          name: "Evaluation 1 1 Evaluation Results Evaluation Period: Jul 22 - Sep 22, 2023 Comments:",
        })
      ).toBeVisible()

      await expect(
        page.getByRole("link", {
          name: "Evaluation 2 1 Evaluation Results Evaluation Period: May 10 - Oct 23, 2023 Comments:",
        })
      ).toBeVisible()

      await expect(
        page.getByRole("link", {
          name: "Evaluation 3 1 Evaluation Results Evaluation Period: May 10 - Oct 23, 2023 Comments:",
        })
      ).toBeVisible()
    })
  })
})
