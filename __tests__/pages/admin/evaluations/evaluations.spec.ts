import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../utils/setupPlaywright"
import { mockRequest } from "../../../utils/mockRequest"
import { loginUser } from "../../../utils/loginUser"

setupPlaywright()

test.describe("Admin - Evaluations", () => {
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
    test("should not allow to view the admin evaluations", async ({ page }) => {
      await page.goto("/admin/evaluations")

      await expect(page).toHaveURL("/auth/login")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the admin evaluations", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/evaluations")

      await expect(page).toHaveURL("/dashboard")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluations")

      await mockRequest(page, "/admin/evaluations", {
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

      await expect(page.getByPlaceholder("Search by name")).toBeVisible()
      await expect(page.getByRole("combobox")).toBeVisible()
      await expect(page.getByRole("button", { name: "Search" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Clear" })).toBeVisible()

      await expect(
        page.getByRole("heading", { name: "Evaluations" })
      ).toBeVisible()
      await expect(
        page.getByRole("link", { name: "Create Evaluations" })
      ).toBeVisible()

      await expect(page.getByRole("cell", { name: "Name" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Period" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Schedule" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Status" })).toBeVisible()

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
