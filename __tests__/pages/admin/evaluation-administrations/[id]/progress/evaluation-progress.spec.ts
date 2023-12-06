import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../../../utils/setup-playwright"
import { mockRequest } from "../../../../../utils/mock-request"
import { loginUser } from "../../../../../utils/login-user"

setupPlaywright()

test.describe("Admin - Evaluation Progress", () => {
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
    test("should not allow to view the admin evaluation progress", async ({ page }) => {
      await page.goto("/admin/evaluation-administrations/1/progress")

      await expect(page).toHaveURL(
        "/auth/login?callback=/admin/evaluation-administrations/1/progress"
      )
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the admin evaluation progress", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/evaluation-administrations/1/progress")

      await expect(page).toHaveURL("/dashboard")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/progress")

      await mockRequest(page, "/admin/evaluation-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Evaluation 1",
          eval_schedule_start_date: "2024-01-01T00:00:00.000Z",
          eval_schedule_end_date: "2024-01-03T00:00:00.000Z",
          eval_period_start_date: "2023-01-01T00:00:00.000Z",
          eval_period_end_date: "2023-12-31T00:00:00.000Z",
          remarks: "Remarks 1",
          email_subject: "Subject 1",
          email_content: "Content 1",
          status: "Pending",
        }),
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/evaluators", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            email: "johndoe@email.com",
            first_name: "John",
            id: 1,
            last_name: "Doe",
            picture: null,
            slug: "john-doe",
            totalEvaluations: 4,
            totalSubmitted: 2,
          },
          {
            email: "janedoe@email.com",
            first_name: "Jane",
            id: 1,
            last_name: "Doe",
            picture: null,
            slug: "Jane-doe",
            totalEvaluations: 2,
            totalSubmitted: 2,
          },
        ]),
      })

      await mockRequest(
        page,
        "/admin/evaluations?evaluation_administration_id=1&for_evaluation=true&evaluator_id=1",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 1,
              eval_start_date: "2023-10-16T00:00:00.000Z",
              eval_end_date: "2023-12-31T00:00:00.000Z",
              percent_involvement: "75",
              evaluee: {
                first_name: "First",
                last_name: "Evaluee",
              },
              project: {
                name: "iAssess",
              },
              project_role: {
                name: "Developer",
              },
            },
            {
              id: 2,
              eval_start_date: "2023-01-01T00:00:00.000Z",
              eval_end_date: "2023-10-15T00:00:00.000Z",
              percent_involvement: "100",
              evaluee: {
                first_name: "Second",
                last_name: "Evaluee",
              },
              project: {
                name: "ProductHQ",
              },
              project_role: {
                name: "Developer",
              },
            },
            {
              id: 3,
              eval_start_date: "2023-01-01T00:00:00.000Z",
              eval_end_date: "2023-10-15T00:00:00.000Z",
              percent_involvement: "100",
              evaluee: {
                first_name: "Third",
                last_name: "Evaluee",
              },
              project: {
                name: "ProductHQ",
              },
              project_role: {
                name: "Developer",
              },
            },
          ]),
        }
      )

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("heading", { name: "Evaluation Progress" })).toBeVisible()
      await expect(page.getByText("Evaluation 1")).toBeVisible()
      await expect(page.getByText("Pending")).toBeVisible()
      await expect(page.getByText("Evaluation Period: 2023-01-01 to 2023-12-31")).toBeVisible()
      await expect(page.getByText("Evaluation Schedule: 2024-01-01 to 2024-01-03")).toBeVisible()
      await expect(page.getByRole("button", { name: "Description:" })).toBeVisible()
      await expect(page.getByRole("heading", { name: "Evaluators" })).toBeVisible()

      await expect(page.getByRole("button", { name: "Doe, Jane" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Doe, John" })).toBeVisible()

      await page.getByRole("button", { name: "Doe, Jane" }).click()

      await expect(page.getByRole("cell", { name: "Evaluee", exact: true })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Project" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Role" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Status" })).toBeVisible()
    })

    test("should allow to go back", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/progress")

      await mockRequest(page, "/admin/evaluation-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Evaluation 1",
          eval_schedule_start_date: "2024-01-01T00:00:00.000Z",
          eval_schedule_end_date: "2024-01-03T00:00:00.000Z",
          eval_period_start_date: "2023-01-01T00:00:00.000Z",
          eval_period_end_date: "2023-12-31T00:00:00.000Z",
          remarks: "Remarks 1",
          email_subject: "Subject 1",
          email_content: "Content 1",
          status: "Pending",
        }),
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/evaluators", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            email: "johndoe@email.com",
            first_name: "John",
            id: 1,
            last_name: "Doe",
            picture: null,
            slug: "john-doe",
            totalEvaluations: 4,
            totalSubmitted: 2,
          },
          {
            email: "janedoe@email.com",
            first_name: "Jane",
            id: 1,
            last_name: "Doe",
            picture: null,
            slug: "Jane-doe",
            totalEvaluations: 2,
            totalSubmitted: 2,
          },
        ]),
      })

      await mockRequest(
        page,
        "/admin/evaluations?evaluation_administration_id=1&for_evaluation=true&evaluator_id=1",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 1,
              eval_start_date: "2023-10-16T00:00:00.000Z",
              eval_end_date: "2023-12-31T00:00:00.000Z",
              percent_involvement: "75",
              evaluee: {
                first_name: "First",
                last_name: "Evaluee",
              },
              project: {
                name: "iAssess",
              },
              project_role: {
                name: "Developer",
              },
            },
            {
              id: 2,
              eval_start_date: "2023-01-01T00:00:00.000Z",
              eval_end_date: "2023-10-15T00:00:00.000Z",
              percent_involvement: "100",
              evaluee: {
                first_name: "Second",
                last_name: "Evaluee",
              },
              project: {
                name: "ProductHQ",
              },
              project_role: {
                name: "Developer",
              },
            },
            {
              id: 3,
              eval_start_date: "2023-01-01T00:00:00.000Z",
              eval_end_date: "2023-10-15T00:00:00.000Z",
              percent_involvement: "100",
              evaluee: {
                first_name: "Third",
                last_name: "Evaluee",
              },
              project: {
                name: "ProductHQ",
              },
              project_role: {
                name: "Developer",
              },
            },
          ]),
        }
      )

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/admin/evaluation-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Evaluation 1",
          eval_schedule_start_date: "2024-01-01T00:00:00.000Z",
          eval_schedule_end_date: "2024-01-03T00:00:00.000Z",
          eval_period_start_date: "2023-01-01T00:00:00.000Z",
          eval_period_end_date: "2023-12-31T00:00:00.000Z",
          remarks: "Remarks 1",
          email_subject: "Subject 1",
          email_content: "Content 1",
          status: "Pending",
        }),
      })

      await mockRequest(page, "/admin/evaluation-results?evaluation_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              status: "For Review",
              users: {
                first_name: "Sample",
                last_name: "User",
                picture: null,
              },
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

      await page.getByTestId("BackButton").click()

      await expect(page).toHaveURL("/admin/evaluation-administrations/1")
    })
  })
})
