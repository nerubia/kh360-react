import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../../../utils/setup-playwright"
import { mockRequest } from "../../../../../utils/mock-request"
import { loginUser } from "../../../../../utils/login-user"

setupPlaywright()

test.describe("Admin - Evaluation - Evaluee List", () => {
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
      await page.goto("/admin/evaluation-administrations/1/evaluees")

      await expect(page).toHaveURL(
        "/auth/login?callback=/admin/evaluation-administrations/1/evaluees"
      )
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the evaluation evaluees page", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees")

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

      await page.goto("/admin/evaluation-administrations/1/evaluees")

      await mockRequest(page, "/admin/evaluation-results?evaluation_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              status: "For Review",
              users: {
                first_name: "Cat",
                last_name: "admin",
                picture: null,
              },
            },
            {
              id: 2,
              status: "Draft",
              users: {
                first_name: "J",
                last_name: "admin",
                picture: null,
              },
            },
            {
              id: 3,
              status: "Ready",
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
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/generate-status", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          canGenerate: false,
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByPlaceholder("Search by name")).toBeVisible()
      await expect(page.getByRole("combobox")).toBeVisible()
      await expect(page.getByRole("button", { name: "Search" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Clear" })).toBeVisible()

      await expect(page.getByRole("heading", { name: "Evaluees" })).toBeVisible()

      await expect(page.getByText("admin, CatFor Review")).toBeVisible()
      await expect(page.getByText("admin, JDraft")).toBeVisible()
      await expect(page.getByText("admin, NinoReady")).toBeVisible()

      await expect(page.getByRole("button", { name: "Cancel & Exit" })).toBeVisible()
      await expect(page.getByTestId("BackButton")).toBeVisible()
      await expect(page.getByRole("button", { name: "Generate Evaluations" })).toBeVisible()
    })

    test("should render delete evaluee modal correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees")

      await mockRequest(page, "/admin/evaluation-results?evaluation_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              status: "For Review",
              users: {
                first_name: "Cat",
                last_name: "admin",
                picture: null,
              },
            },
            {
              id: 2,
              status: "Draft",
              users: {
                first_name: "J",
                last_name: "admin",
                picture: null,
              },
            },
            {
              id: 3,
              status: "Ready",
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
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/generate-status", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          canGenerate: false,
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page
        .locator("div")
        .filter({ hasText: /^admin, CatFor Review$/ })
        .getByRole("button")
        .first()
        .click()

      await expect(page.getByRole("heading", { name: "Delete Evaluee" })).toBeVisible()
      await expect(
        page.getByText(
          "Are you sure you want to remove admin, Cat? This action cannot be reverted."
        )
      ).toBeVisible()
      await expect(page.getByTestId("DialogNoButton")).toBeVisible()
      await expect(page.getByTestId("DialogYesButton")).toBeVisible()
    })

    test("should allow to delete evaluee", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees")

      await mockRequest(page, "/admin/evaluation-results?evaluation_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              status: "For Review",
              users: {
                first_name: "Cat",
                last_name: "admin",
                picture: null,
              },
            },
            {
              id: 2,
              status: "Draft",
              users: {
                first_name: "J",
                last_name: "admin",
                picture: null,
              },
            },
            {
              id: 3,
              status: "Ready",
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
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/generate-status", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          canGenerate: false,
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page
        .locator("div")
        .filter({ hasText: /^admin, CatFor Review$/ })
        .getByRole("button")
        .first()
        .click()

      await mockRequest(page, "/admin/evaluation-results/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: "1" }),
      })

      await page.getByTestId("DialogYesButton").click()

      await expect(page.getByText("Cat admin successfully removed.")).toBeVisible()
      await expect(page.getByText("admin, Catreviewed")).not.toBeVisible()
    })

    test("should allow to go back", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees")

      await mockRequest(page, "/admin/evaluation-results?evaluation_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              status: "For Review",
              users: {
                first_name: "Cat",
                last_name: "admin",
                picture: null,
              },
            },
            {
              id: 2,
              status: "Draft",
              users: {
                first_name: "J",
                last_name: "admin",
                picture: null,
              },
            },
            {
              id: 3,
              status: "Ready",
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
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/generate-status", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          canGenerate: false,
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByTestId("BackButton").click()

      await mockRequest(page, "/admin/users", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              email: "sample1@gmail.com",
              first_name: "Adam",
              last_name: "Baker",
              is_active: true,
              user_details: {
                start_date: "2023-04-12T00:00:00.000Z",
                user_id: 1,
                user_position: "Project Manager",
                user_type: "Regular",
              },
            },
            {
              id: 2,
              email: "sample2@gmail.com",
              first_name: "Clark",
              last_name: "Davis",
              is_active: true,
              user_details: {
                start_date: "2023-04-12T00:00:00.000Z",
                user_id: 2,
                user_position: "Quality Assurance",
                user_type: "Probationary",
              },
            },
            {
              id: 3,
              email: "sample2@gmail.com",
              first_name: "Hill",
              last_name: "Evans",
              is_active: true,
              user_details: {
                start_date: "2023-04-12T00:00:00.000Z",
                user_id: 3,
                user_position: "Intern",
                user_type: "Developer",
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

      await mockRequest(page, "/admin/users/all", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              email: "sample1@gmail.com",
              first_name: "Adam",
              last_name: "Baker",
              is_active: true,
              user_details: {
                start_date: "2023-04-12T00:00:00.000Z",
                user_id: 1,
                user_position: "Project Manager",
                user_type: "Regular",
              },
            },
          ],
        }),
      })

      await mockRequest(page, "/admin/users/all", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              email: "sample1@gmail.com",
              first_name: "Adam",
              last_name: "Baker",
              is_active: true,
              user_details: {
                start_date: "2023-04-12T00:00:00.000Z",
                user_id: 1,
                user_position: "Project Manager",
                user_type: "Regular",
              },
            },
          ],
        }),
      })

      await mockRequest(page, "/admin/evaluation-results/all?evaluation_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      })

      await expect(page).toHaveURL("/admin/evaluation-administrations/1/select")
    })

    test("should render cancel & exit modal correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees")

      await mockRequest(page, "/admin/evaluation-results?evaluation_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              status: "For Review",
              users: {
                first_name: "Cat",
                last_name: "admin",
                picture: null,
              },
            },
            {
              id: 2,
              status: "Draft",
              users: {
                first_name: "J",
                last_name: "admin",
                picture: null,
              },
            },
            {
              id: 3,
              status: "Ready",
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
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/generate-status", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          canGenerate: false,
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Cancel & Exit" }).click()

      await expect(page.getByRole("heading", { name: "Cancel & Exit" })).toBeVisible()
      await expect(
        page.getByText(
          "Are you sure you want to cancel and exit? If you cancel, your data won't be save"
        )
      ).toBeVisible()
      await expect(page.getByTestId("DialogNoButton")).toBeVisible()
      await expect(page.getByTestId("DialogYesButton")).toBeVisible()
    })

    test("should allow to cancel & exit", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees")

      await mockRequest(page, "/admin/evaluation-results?evaluation_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              status: "For Review",
              users: {
                first_name: "Cat",
                last_name: "admin",
                picture: null,
              },
            },
            {
              id: 2,
              status: "Draft",
              users: {
                first_name: "J",
                last_name: "admin",
                picture: null,
              },
            },
            {
              id: 3,
              status: "Ready",
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
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/generate-status", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          canGenerate: false,
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Cancel & Exit" }).click()
      await page.getByTestId("DialogYesButton").click()

      await mockRequest(page, "/admin/evaluation-administrations", {
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

      await expect(page).toHaveURL("/admin/evaluation-administrations")
    })

    test("should not allow to generate if evaluees are not ready", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees")

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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("button", { name: "Generate Evaluations" })).toBeDisabled()
    })

    test("should allow to generate if evaluees are ready", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/evaluees")

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
          canGenerate: true,
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/admin/evaluation-administrations/1/generate", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
        }),
      })

      await page.getByRole("button", { name: "Generate Evaluations" }).click()

      await mockRequest(page, "/admin/evaluation-administrations", {
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

      await expect(page).toHaveURL("/admin/evaluation-administrations")

      await expect(page.getByText("Evaluations have been generated successfully.")).toBeVisible()
    })
  })
})
