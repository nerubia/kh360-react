import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../../../../../utils/setupPlaywright"
import { mockRequest } from "../../../../../../../utils/mockRequest"
import { loginUser } from "../../../../../../../utils/loginUser"

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
    test("should not allow to view the evaluation evaluees page", async ({
      page,
    }) => {
      await page.goto(
        "/admin/evaluation-administrations/1/evaluees/1/evaluators/4"
      )

      await expect(page).toHaveURL("/auth/login")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the evaluation evaluees page", async ({
      page,
    }) => {
      await loginUser("employee", page)

      await page.goto(
        "/admin/evaluation-administrations/1/evaluees/1/evaluators/4"
      )

      await expect(page).toHaveURL("/dashboard")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto(
        "/admin/evaluation-administrations/1/evaluees/1/evaluators/4"
      )

      await mockRequest(page, "/admin/evaluation-results/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 22,
          status: "pending",
          users: {
            slug: "sample-user",
            first_name: "Sample",
            last_name: "User",
            picture: null,
          },
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

      await expect(page.getByText("Sample User")).toBeVisible()
      await expect(page.getByText("pending")).toBeVisible()

      await expect(
        page.getByRole("link", { name: "PM Evaluation" })
      ).toBeVisible()
      await expect(
        page.getByRole("link", { name: "Peer Evaluation" })
      ).toBeVisible()
      await expect(
        page.getByRole("link", { name: "Code Reviewer Evaluation" })
      ).toBeVisible()
      await expect(
        page.getByRole("link", { name: "QA Evaluation" })
      ).toBeVisible()

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
      await expect(
        page.getByRole("cell", { name: "Evaluator, Second" })
      ).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "Evaluator, Third" })
      ).toBeVisible()

      await expect(
        page.getByRole("link", { name: "Back to Employee List" })
      ).toBeVisible()
      await expect(
        page.getByRole("button", { name: "Save as Draft" })
      ).toBeVisible()
      await expect(
        page.getByRole("button", { name: "Mark as Ready" })
      ).toBeVisible()
    })

    test("should allow to go back to employee list", async ({
      page,
      isMobile,
    }) => {
      await loginUser("admin", page)

      await page.goto(
        "/admin/evaluation-administrations/1/evaluees/1/evaluators/4"
      )

      await mockRequest(page, "/admin/evaluation-results/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 22,
          status: "pending",
          users: {
            slug: "sample-user",
            first_name: "Sample",
            last_name: "User",
            picture: null,
          },
        }),
      })

      await mockRequest(
        page,
        "/admin/evaluation-results/1/templates?id=1&evaluation_result_id=1",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("link", { name: "Back to Employee List" }).click()

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
                status: "reviewed",
                users: {
                  first_name: "Cat",
                  last_name: "admin",
                  picture: null,
                },
              },
              {
                id: 2,
                status: "pending",
                users: {
                  first_name: "J",
                  last_name: "admin",
                  picture: null,
                },
              },
              {
                id: 3,
                status: "draft",
                users: {
                  first_name: "Nino",
                  last_name: "admin",
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

      await expect(page).toHaveURL(
        "/admin/evaluation-administrations/1/evaluees"
      )
    })
  })
})
