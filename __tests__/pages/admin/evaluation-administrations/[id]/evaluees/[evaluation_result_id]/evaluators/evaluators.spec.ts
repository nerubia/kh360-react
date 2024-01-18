import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../../../../../utils/setup-playwright"
import { mockRequest } from "../../../../../../../utils/mock-request"
import { loginUser } from "../../../../../../../utils/login-user"

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
    test("should not allow to view the evaluation evaluees page", async ({ page }) => {
      await page.goto("/admin/evaluation-administrations/1/evaluees/1/evaluators/4")

      await expect(page).toHaveURL(
        "/auth/login?callback=/admin/evaluation-administrations/1/evaluees/1/evaluators/4"
      )
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the evaluation evaluees page", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees/1/evaluators/4")

      await mockRequest(page, "/user/my-evaluations", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            totalPages: 0,
          },
        }),
      })

      await mockRequest(
        page,
        "/user/email-templates?template_type=No+Available+Evaluation+Results",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: 11,
            name: "No Available Evaluation Results",
            template_type: "No Available Evaluation Results",
            is_default: true,
            subject: "",
            content:
              "Uh-oh! 🤷‍♂️\n\nLooks like our magical elves are still working their charm behind the scenes, and your results haven't arrived just yet. Don't worry, though – good things come to those who wait!\n\nIn the meantime, why not grab a cup of coffee or practice your superhero pose? 🦸‍♀️ We'll have those results ready for you in no time.\n\nStay tuned and keep the positive vibes flowing! ✨",
            created_by_id: null,
            updated_by_id: null,
            created_at: null,
            updated_at: null,
          }),
        }
      )

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/my-evaluations")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees/1/evaluators/4")

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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByText("User, Sample")).toBeVisible()
      await expect(page.getByText("pending")).toBeVisible()

      await expect(page.getByRole("button", { name: "Add Evaluator" })).toBeVisible()

      await expect(page.getByRole("link", { name: "PM Evaluation" })).toBeVisible()
      await expect(page.getByRole("link", { name: "Peer Evaluation" })).toBeVisible()
      await expect(page.getByRole("link", { name: "Code Reviewer Evaluation" })).toBeVisible()
      await expect(page.getByRole("link", { name: "QA Evaluation" })).toBeVisible()

      await expect(
        page.getByRole("heading", { name: "PM Evaluation for Developer Role" })
      ).toBeVisible()

      await expect(page.getByRole("cell", { name: "Evaluator", exact: true }).first()).toBeVisible()
      await expect(page.getByRole("cell", { name: "Project" }).first()).toBeVisible()
      await expect(page.getByRole("cell", { name: "%" }).first()).toBeVisible()
      await expect(page.getByRole("cell", { name: "Duration" }).first()).toBeVisible()

      await expect(page.getByRole("cell", { name: "Evaluator, First" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Evaluator, Second" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Evaluator, Third" })).toBeVisible()

      await expect(
        page.getByRole("heading", { name: "External Evaluators for Developer Role" })
      ).toBeVisible()

      await expect(page.getByRole("link", { name: "Back to Employee List" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Save as Draft" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Mark as Ready" })).toBeVisible()
    })

    test("should allow to go to next evaluation result", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees/1/evaluators/4")

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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/admin/evaluation-results/2", {
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

      await mockRequest(page, "/admin/evaluation-templates?evaluation_result_id=2", {
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
      })

      await mockRequest(
        page,
        "/admin/evaluations?evaluation_result_id=2&evaluation_template_id=4",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        }
      )

      await mockRequest(
        page,
        "/admin/project-members?evaluation_administration_id=1&evaluation_result_id=2&evaluation_template_id=4",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        }
      )

      await page.getByTestId("NextButton").click()

      await expect(page).toHaveURL("/admin/evaluation-administrations/1/evaluees/2/evaluators/4")
    })

    test("should allow to go back to employee list", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees/1/evaluators/4")

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

      await mockRequest(page, "/admin/evaluation-templates?evaluation_result_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      })

      await mockRequest(
        page,
        "/admin/evaluations?evaluation_result_id=1&evaluation_template_id=4",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("link", { name: "Back to Employee List" }).click()

      await mockRequest(page, "/admin/evaluation-results?evaluation_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            totalPages: 1,
          },
        }),
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/generate-status", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          canGenerate: false,
        }),
      })

      await expect(page).toHaveURL("/admin/evaluation-administrations/1/evaluees")
    })

    test("should allow to save as draft", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees/1/evaluators/4")

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

      await mockRequest(page, "/admin/evaluation-templates?evaluation_result_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      })

      await mockRequest(
        page,
        "/admin/evaluations?evaluation_result_id=1&evaluation_template_id=4",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/admin/evaluation-results/1/set-status", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: "1", status: "Draft" }),
      })

      await page.getByRole("button", { name: "Save as Draft" }).click()

      await mockRequest(page, "/admin/evaluation-results?evaluation_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            totalPages: 1,
          },
        }),
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/generate-status", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          canGenerate: false,
        }),
      })

      await expect(page).toHaveURL("/admin/evaluation-administrations/1/evaluees")
    })

    test("should allow to mark as ready", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees/1/evaluators/4")

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

      await mockRequest(page, "/admin/evaluation-templates?evaluation_result_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      })

      await mockRequest(
        page,
        "/admin/evaluations?evaluation_result_id=1&evaluation_template_id=4",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/admin/evaluation-results/1/set-status", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: "1", status: "Ready" }),
      })

      await page.getByRole("button", { name: "Mark as Ready" }).click()

      await mockRequest(page, "/admin/evaluation-results?evaluation_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            totalPages: 1,
          },
        }),
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/generate-status", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          canGenerate: false,
        }),
      })

      await expect(page).toHaveURL("/admin/evaluation-administrations/1/evaluees")
    })
  })
})
