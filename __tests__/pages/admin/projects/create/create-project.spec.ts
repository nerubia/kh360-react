import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../../utils/setup-playwright"
import { mockRequest } from "../../../../utils/mock-request"
import { loginUser } from "../../../../utils/login-user"

setupPlaywright()

test.describe("Admin - Create Project", () => {
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
    test("should not allow to view the create project page", async ({ page }) => {
      await page.goto("/admin/message-templates/create")

      await expect(page).toHaveURL("/auth/login?callback=/admin/message-templates/create")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the create project page", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/message-templates/create")

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

      await page.goto("/admin/projects/create")

      await mockRequest(page, "/admin/clients/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Sample Client",
            display_name: "Sample",
            status: "Active",
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("heading", { name: "Add Project" })).toBeVisible()
      await expect(page.getByPlaceholder("Name")).toBeVisible()
      await expect(page.getByText("Client")).toBeVisible()
      await expect(page.getByPlaceholder("Start date")).toBeVisible()
      await expect(page.getByPlaceholder("End date")).toBeVisible()
      await expect(page.getByPlaceholder("Description")).toBeVisible()
      await expect(page.getByText("Skills")).toBeVisible()
      await expect(page.getByRole("cell", { name: "Category" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Name" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Actions" })).toBeVisible()

      await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Save" })).toBeVisible()
    })

    test("should show validation errors", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/projects/create")

      await mockRequest(page, "/admin/clients/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Sample Client",
            display_name: "Sample",
            status: "Active",
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Save" }).click()
      await page.getByRole("button", { name: "Yes" }).click()

      await expect(page.getByText("Name is required")).toBeVisible()
      await expect(page.getByText("Client is required")).toBeVisible()
      await expect(page.getByText("End period must not be earlier than start date.")).toBeVisible()
      await expect(page.getByText("Description is required")).toBeVisible()
      await expect(page.getByText("Status is required.")).toBeVisible()
    })

    test("should create project succesfully", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/projects/create")

      await mockRequest(page, "/admin/clients/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Sample Client",
            display_name: "Sample",
            status: "Active",
          },
        ]),
      })

      await mockRequest(page, "/admin/projects", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Create Sample Project",
          client_id: "1",
          start_date: "2023-01-01",
          end_date: "2023-12-01",
          description: "Test",
          status: "Draft",
          skill_ids: [],
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByPlaceholder("Name").fill("Create Sample Project")
      await page.getByLabel("Client").click()
      await page.getByText("Sample", { exact: true }).click()
      await page.getByPlaceholder("Start date").fill("2023-01-01")
      await page.getByPlaceholder("End date").fill("2023-12-01")
      await page.getByPlaceholder("Description").fill("Test")
      await page.getByLabel("Status").fill("Draft")
      await page.getByText("Draft", { exact: true }).click()

      await page.getByRole("button", { name: "Save" }).click()
      await page.getByRole("button", { name: "Yes" }).click()

      await mockRequest(page, "/admin/projects/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              slug: "create-sample-project",
              name: "Create Sample Project",
              type: null,
              client_id: 1,
              start_date: "2023-01-01T00:00:00.000Z",
              end_date: "2023-12-01T00:00:00.000Z",
              status: "Draft",
              description: "Test",
              created_at: "2015-02-09T17:58:11.000Z",
              updated_at: "2015-02-09T17:58:11.000Z",
              deleted_at: null,
              client: {
                name: "Sample Client",
              },
            },
          ],
        }),
      })

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/admin/projects/1")
    })

    test("should render cancel & exit modal correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/projects/create")

      await mockRequest(page, "/admin/clients/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Sample Client",
            display_name: "Sample",
            status: "Active",
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Cancel" }).click()

      await expect(page.getByRole("heading", { name: "Cancel" })).toBeVisible()
      await expect(
        page.getByText("Are you sure you want to cancel? If you cancel, your data won't be saved")
      ).toBeVisible()
      await expect(page.getByRole("button", { name: "No" })).toBeVisible()
      await expect(page.getByRole("link", { name: "Yes" })).toBeVisible()
    })

    test("should allow to cancel & exit", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/projects/create")

      await mockRequest(page, "/admin/clients/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Sample Client",
            display_name: "Sample",
            status: "Active",
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/admin/projects/status", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { status: "Ongoing" },
          { status: "Closed" },
          { status: "Draft" },
          { status: "Hold" },
        ]),
      })

      await mockRequest(page, "/admin/projects", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              slug: "create-sample-project",
              name: "Create Sample Project",
              type: null,
              client_id: 1,
              start_date: "2023-01-01T00:00:00.000Z",
              end_date: "2023-12-01T00:00:00.000Z",
              status: "Draft",
              description: "Test",
              created_at: "2015-02-09T17:58:11.000Z",
              updated_at: "2015-02-09T17:58:11.000Z",
              deleted_at: null,
              client: null,
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
      await page.getByRole("link", { name: "Yes" }).click()

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/admin/projects")
    })
  })
})