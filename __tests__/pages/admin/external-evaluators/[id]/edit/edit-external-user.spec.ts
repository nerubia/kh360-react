import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("Admin - Update External Evaluator", () => {
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
    test("should not allow to view the admin edit external evaluator", async ({ page }) => {
      await page.goto("/admin/external-evaluators/1/edit")

      await expect(page).toHaveURL("/auth/login?callback=/admin/external-evaluators/1/edit")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the admin edit external evaluator", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/external-evaluators/1/edit")

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
      await mockRequest(page, "/user/score-ratings", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            created_at: null,
            display_name: "Navigational Challenge",
            evaluee_description:
              "You face occasional difficulty in navigating job responsibilities.\nYour performance consistently falls below expectations and significant improvement is needed in various aspects of job responsibilities.\nYour goals and objectives are not met consistently.",
            id: 1,
            max_score: "1.99",
            min_score: "0",
            name: "Needs Improvement",
            result_description:
              "Employee faces occasional difficulty in navigating job responsibilities.\nPerformance consistently falls below expectations and significant improvement is needed in various aspects of job responsibilities.\nGoals and objectives are not met consistently.",
            status: null,
            updated_at: null,
          },
        ]),
      })
      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/my-evaluations")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/external-evaluators/1/edit")

      await mockRequest(page, "/admin/external-users/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          email: "external@gmail.com",
          first_name: "First",
          middle_name: "Middle",
          last_name: "Last",
          role: "Developer",
          company: "KH",
          created_at: "2023-11-23T02:50:59.000Z",
          updated_at: "2023-11-23T08:05:54.000Z",
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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByPlaceholder("First name")).toHaveValue("First")
      await expect(page.getByPlaceholder("Middle name")).toHaveValue("Middle")
      await expect(page.getByPlaceholder("Last name")).toHaveValue("Last")
      await expect(page.getByPlaceholder("Email")).toHaveValue("external@gmail.com")
      await expect(page.getByPlaceholder("Role")).toHaveValue("Developer")
      await expect(page.getByPlaceholder("Company")).toHaveValue("KH")

      await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Save" })).toBeVisible()
    })

    test("should show validation errors", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/external-evaluators/1/edit")

      await mockRequest(page, "/admin/external-users/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}),
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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Save" }).click()

      await expect(page.getByText("First name is required")).toBeVisible()
      await expect(page.getByText("Last name is required")).toBeVisible()
      await expect(page.getByText("Email is required")).toBeVisible()
      await expect(page.getByText("Role is required")).toBeVisible()
      await expect(page.getByText("Company is required")).toBeVisible()
    })

    test("should update external evaluator succesfully", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/external-evaluators/1/edit")

      await mockRequest(page, "/admin/external-users/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          email: "external@gmail.com",
          first_name: "First",
          middle_name: "Middle",
          last_name: "Last",
          role: "Developer",
          company: "KH",
          created_at: "2023-11-23T02:50:59.000Z",
          updated_at: "2023-11-23T08:05:54.000Z",
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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/admin/external-users", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
        }),
      })

      await page.getByPlaceholder("First name").fill("First name")
      await page.getByPlaceholder("Middle name").fill("Middle name")
      await page.getByPlaceholder("Last name").fill("Last name")
      await page.getByPlaceholder("Email").fill("first@gmail.com")
      await page.getByPlaceholder("Role").fill("Role")
      await page.getByPlaceholder("Company").fill("Company")

      await page.getByRole("button", { name: "Save" }).click()

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/admin/external-evaluators")
    })

    test("should render cancel & exit modal correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/external-evaluators/1/edit")

      await mockRequest(page, "/admin/external-users/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          email: "external@gmail.com",
          first_name: "First",
          middle_name: "Middle",
          last_name: "Last",
          role: "Developer",
          company: "KH",
          created_at: "2023-11-23T02:50:59.000Z",
          updated_at: "2023-11-23T08:05:54.000Z",
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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Cancel" }).click()

      await expect(page.getByRole("heading", { name: "Cancel" })).toBeVisible()
      await expect(
        page.getByText("Are you sure you want to cancel? If you cancel, your data won't be save")
      ).toBeVisible()
      await expect(page.getByRole("button", { name: "No" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Yes" })).toBeVisible()
    })

    test("should allow to cancel & exit", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/external-evaluators/1/edit")

      await mockRequest(page, "/admin/external-users/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          email: "external@gmail.com",
          first_name: "First",
          middle_name: "Middle",
          last_name: "Last",
          role: "Developer",
          company: "KH",
          created_at: "2023-11-23T02:50:59.000Z",
          updated_at: "2023-11-23T08:05:54.000Z",
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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/admin/external-users", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              email: "john@nerubia.com",
              first_name: "John",
              middle_name: null,
              last_name: "Doe",
              role: "Developer",
              company: "Sample Agency",
              created_by_id: null,
              updated_by_id: null,
              created_at: null,
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

      await page.getByRole("button", { name: "Cancel" }).click()
      await page.getByRole("button", { name: "Yes" }).click()

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/admin/external-evaluators")
    })
  })
})
