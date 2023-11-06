import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../../utils/setupPlaywright"
import { mockRequest } from "../../../../utils/mockRequest"
import { loginUser } from "../../../../utils/loginUser"

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
    test("should not allow to view the admin view evaluation", async ({
      page,
    }) => {
      await page.goto("/admin/evaluation-administrations/1")

      await expect(page).toHaveURL("/auth/login")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the admin view evaluation", async ({
      page,
    }) => {
      await loginUser("employee", page)

      await page.goto("/admin/evaluation-administrations/1")

      await expect(page).toHaveURL("/dashboard")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1")

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

      await mockRequest(
        page,
        "/admin/evaluation-results?evaluation_administration_id=1",
        {
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
        }
      )

      await mockRequest(
        page,
        "/admin/evaluation-results/1/templates?id=1&evaluation_result_id=1&for_evaluation=true",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 4,
              name: "DEV Evaluation by PM",
              display_name: "PM Evaluation",
            },
            {
              id: 5,
              name: "DEV Evaluation by Dev Peers",
              display_name: "Peer Evaluation",
            },
            {
              id: 6,
              name: "DEV Evaluation by Code Reviewer",
              display_name: "Code Reviewer Evaluation",
            },
            {
              id: 7,
              name: "DEV Evaluation by QA",
              display_name: "QA Evaluation",
            },
          ]),
        }
      )

      await mockRequest(
        page,
        "/admin/evaluations?evaluation_result_id=1&evaluation_template_id=4&for_evaluation=true",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 1,
              eval_start_date: "2023-10-16T00:00:00.000Z",
              eval_end_date: "2023-12-31T00:00:00.000Z",
              percent_involvement: "75",
              evaluator: {
                first_name: "First",
                last_name: "Evaluator",
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
              evaluator: {
                first_name: "Second",
                last_name: "Evaluator",
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
              evaluator: {
                first_name: "Third",
                last_name: "Evaluator",
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

      await expect(
        page.getByText("Evaluation Schedule(Jan 1, 2024 to Jan 3, 2024)")
      ).toBeVisible()
      await expect(page.getByRole("link", { name: "Progress" })).toBeVisible()
      await expect(page.getByRole("link", { name: "Edit" })).toBeVisible()
      await expect(
        page.getByRole("heading", { name: "Employees" })
      ).toBeVisible()

      await expect(
        page.getByRole("button", { name: "User, Sample" })
      ).toBeVisible()

      await expect(page.getByTestId("EditButton")).toBeVisible()
      await page.getByRole("button", { name: "User, Sample" }).click()

      await expect(
        page.getByRole("button", { name: "PM Evaluation" })
      ).toBeVisible()
      await expect(
        page.getByRole("button", { name: "Peer Evaluation" })
      ).toBeVisible()
      await expect(
        page.getByRole("button", { name: "Code Reviewer Evaluation" })
      ).toBeVisible()
      await expect(
        page.getByRole("button", { name: "QA Evaluation" })
      ).toBeVisible()

      await page.getByRole("button", { name: "PM Evaluation" }).click()

      await expect(
        page.getByRole("cell", { name: "Evaluator", exact: true })
      ).toBeVisible()
      await expect(page.getByRole("cell", { name: "Project" })).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "Evaluee Role" })
      ).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "%", exact: true })
      ).toBeVisible()
      await expect(page.getByRole("cell", { name: "Duration" })).toBeVisible()

      await expect(
        page.getByRole("cell", { name: "Evaluator, First" })
      ).toBeVisible()
      await expect(page.getByRole("cell", { name: "iAssess" })).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "Developer" }).first()
      ).toBeVisible()
      await expect(page.getByRole("cell", { name: "75%" })).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "2023-10-16 to 2023-12-31" })
      ).toBeVisible()
    })

    test("should go to edit evaluation administration page succesfully", async ({
      page,
      isMobile,
    }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1")

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

      await mockRequest(
        page,
        "/admin/evaluation-results?evaluation_administration_id=1",
        {
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
        }
      )

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("link", { name: "Edit" }).click()

      await expect(page).toHaveURL("/admin/evaluation-administrations/1/edit")
    })

    test("should go to evaluators page succesfully", async ({
      page,
      isMobile,
    }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1")

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

      await mockRequest(
        page,
        "/admin/evaluation-results?evaluation_administration_id=1",
        {
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
        }
      )

      await mockRequest(
        page,
        "/admin/evaluation-results/1/templates?id=1&evaluation_result_id=1&for_evaluation=true",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 4,
              name: "DEV Evaluation by PM",
              display_name: "PM Evaluation",
            },
            {
              id: 5,
              name: "DEV Evaluation by Dev Peers",
              display_name: "Peer Evaluation",
            },
            {
              id: 6,
              name: "DEV Evaluation by Code Reviewer",
              display_name: "Code Reviewer Evaluation",
            },
            {
              id: 7,
              name: "DEV Evaluation by QA",
              display_name: "QA Evaluation",
            },
          ]),
        }
      )

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/admin/evaluation-results/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            id: 1,
            status: "pending",
            users: {
              slug: "sample-user",
              first_name: "Sample",
              last_name: "User",
              picture: null,
            },
          },
          previousId: 1,
          nextId: 3,
        }),
      })

      await mockRequest(
        page,
        "/admin/evaluation-results/1/templates?id=1&evaluation_result_id=1",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 4,
              name: "DEV Evaluation by PM",
              display_name: "PM Evaluation",
            },
            {
              id: 5,
              name: "DEV Evaluation by Dev Peers",
              display_name: "Peer Evaluation",
            },
            {
              id: 6,
              name: "DEV Evaluation by Code Reviewer",
              display_name: "Code Reviewer Evaluation",
            },
            {
              id: 7,
              name: "DEV Evaluation by QA",
              display_name: "QA Evaluation",
            },
          ]),
        }
      )

      await mockRequest(
        page,
        "/admin/evaluations?evaluation_result_id=1&evaluation_template_id=4",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        }
      )

      await page.getByTestId("EditButton").click()

      await expect(page).toHaveURL(
        "/admin/evaluation-administrations/1/evaluees/1/evaluators/4"
      )
    })
  })
})
