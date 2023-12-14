import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../../../../../../utils/setup-playwright"
import { mockRequest } from "../../../../../../../../utils/mock-request"
import { loginUser } from "../../../../../../../../utils/login-user"

setupPlaywright()

test.describe("Admin - Select Evaluators", () => {
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
    test("should not allow to view the add evaluator page", async ({ page }) => {
      await page.goto("/admin/evaluation-administrations/1/evaluees/1/evaluators/4/add-evaluator")

      await expect(page).toHaveURL(
        "/auth/login?callback=/admin/evaluation-administrations/1/evaluees/1/evaluators/4/add-evaluator"
      )
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the evaluation evaluees page", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees/1/evaluators/4/add-evaluator")

      await expect(page).toHaveURL("/dashboard")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees/1/evaluators/4/add-evaluator")

      await mockRequest(page, "/admin/evaluation-results/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            id: 1,
            status: "pending",
            users: {
              id: 1,
              slug: "sample-user",
              first_name: "Sample",
              last_name: "User",
              picture: null,
            },
          },
          nextId: 2,
        }),
      })

      await mockRequest(page, "/admin/evaluation-templates/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 4,
            name: "DEV Evaluation by PM",
            display_name: "PM Evaluation",
            project_role: {
              id: 5,
              name: "Developer",
              short_name: "DEV",
            },
          },
          {
            id: 5,
            name: "DEV Evaluation by Dev Peers",
            display_name: "Peer Evaluation",
            project_role: {
              id: 5,
              name: "Developer",
              short_name: "DEV",
            },
          },
          {
            id: 6,
            name: "DEV Evaluation by Code Reviewer",
            display_name: "Code Reviewer Evaluation",
            project_role: {
              id: 5,
              name: "Developer",
              short_name: "DEV",
            },
          },
          {
            id: 7,
            name: "DEV Evaluation by QA",
            display_name: "QA Evaluation",
            project_role: {
              id: 5,
              name: "Developer",
              short_name: "DEV",
            },
          },
        ]),
      })

      await mockRequest(
        page,
        "/admin/project-members?evaluation_administration_id=1&evaluation_result_id=1&evaluation_template_id=4",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        }
      )

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("heading", { name: "Add Evaluator" })).toBeVisible()
      await expect(page.getByText("Template Type")).toBeVisible()
      await expect(page.getByText("User", { exact: true })).toBeVisible()
      await expect(page.getByText("Project", { exact: true })).toBeVisible()

      await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Add" })).toBeVisible()
    })

    test("should render cancel & exit modal correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees/1/evaluators/4/add-evaluator")

      await mockRequest(page, "/admin/evaluation-results/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            id: 1,
            status: "pending",
            users: {
              id: 1,
              slug: "sample-user",
              first_name: "Sample",
              last_name: "User",
              picture: null,
            },
          },
          nextId: 2,
        }),
      })

      await mockRequest(page, "/admin/evaluation-templates/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 4,
            name: "DEV Evaluation by PM",
            display_name: "PM Evaluation",
            project_role: {
              id: 5,
              name: "Developer",
              short_name: "DEV",
            },
          },
          {
            id: 5,
            name: "DEV Evaluation by Dev Peers",
            display_name: "Peer Evaluation",
            project_role: {
              id: 5,
              name: "Developer",
              short_name: "DEV",
            },
          },
          {
            id: 6,
            name: "DEV Evaluation by Code Reviewer",
            display_name: "Code Reviewer Evaluation",
            project_role: {
              id: 5,
              name: "Developer",
              short_name: "DEV",
            },
          },
          {
            id: 7,
            name: "DEV Evaluation by QA",
            display_name: "QA Evaluation",
            project_role: {
              id: 5,
              name: "Developer",
              short_name: "DEV",
            },
          },
        ]),
      })

      await mockRequest(
        page,
        "/admin/project-members?evaluation_administration_id=1&evaluation_result_id=1&evaluation_template_id=4",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        }
      )

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Cancel" }).click()

      await expect(page.getByRole("heading", { name: "Cancel" })).toBeVisible()
      await expect(
        page.getByText("Are you sure you want to cancel? If you cancel, your data won't be save")
      ).toBeVisible()
      await expect(page.getByRole("button", { name: "No" })).toBeVisible()
      await expect(page.getByRole("link", { name: "Yes" })).toBeVisible()
    })

    test("should allow to cancel & exit", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees/1/evaluators/4/add-evaluator")

      await mockRequest(page, "/admin/evaluation-results/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            id: 1,
            status: "pending",
            users: {
              id: 1,
              slug: "sample-user",
              first_name: "Sample",
              last_name: "User",
              picture: null,
            },
          },
          nextId: 2,
        }),
      })

      await mockRequest(page, "/admin/evaluation-templates/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 4,
            name: "DEV Evaluation by PM",
            display_name: "PM Evaluation",
            project_role: {
              id: 5,
              name: "Developer",
              short_name: "DEV",
            },
          },
          {
            id: 5,
            name: "DEV Evaluation by Dev Peers",
            display_name: "Peer Evaluation",
            project_role: {
              id: 5,
              name: "Developer",
              short_name: "DEV",
            },
          },
          {
            id: 6,
            name: "DEV Evaluation by Code Reviewer",
            display_name: "Code Reviewer Evaluation",
            project_role: {
              id: 5,
              name: "Developer",
              short_name: "DEV",
            },
          },
          {
            id: 7,
            name: "DEV Evaluation by QA",
            display_name: "QA Evaluation",
            project_role: {
              id: 5,
              name: "Developer",
              short_name: "DEV",
            },
          },
        ]),
      })

      await mockRequest(
        page,
        "/admin/project-members?evaluation_administration_id=1&evaluation_result_id=1&evaluation_template_id=4",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
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
              id: 1,
              slug: "sample-user",
              first_name: "Sample",
              last_name: "User",
              picture: null,
            },
          },
          nextId: 2,
        }),
      })

      await mockRequest(page, "/admin/evaluation-templates?evaluation_result_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 4,
            name: "DEV Evaluation by PM",
            display_name: "PM Evaluation",
            project_role: {
              id: 5,
              name: "Developer",
              short_name: "DEV",
            },
          },
          {
            id: 5,
            name: "DEV Evaluation by Dev Peers",
            display_name: "Peer Evaluation",
            project_role: {
              id: 5,
              name: "Developer",
              short_name: "DEV",
            },
          },
          {
            id: 6,
            name: "DEV Evaluation by Code Reviewer",
            display_name: "Code Reviewer Evaluation",
            project_role: {
              id: 5,
              name: "Developer",
              short_name: "DEV",
            },
          },
          {
            id: 7,
            name: "DEV Evaluation by QA",
            display_name: "QA Evaluation",
            project_role: {
              id: 5,
              name: "Developer",
              short_name: "DEV",
            },
          },
        ]),
      })

      await mockRequest(
        page,
        "/admin/evaluations?evaluation_result_id=1&evaluation_template_id=4",
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

      await mockRequest(
        page,
        "/admin/project-members?evaluation_administration_id=1&evaluation_result_id=1&evaluation_template_id=4",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        }
      )

      await page.getByRole("button", { name: "Cancel" }).click()
      await page.getByRole("link", { name: "Yes" }).click()

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL(
        "http://localhost:3000/admin/evaluation-administrations/1/evaluees/1/evaluators/4"
      )
    })
  })
})
