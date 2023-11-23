import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../../../utils/setupPlaywright"
import { mockRequest } from "../../../../../utils/mockRequest"
import { loginUser } from "../../../../../utils/loginUser"

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

      await expect(page).toHaveURL("/dashboard")
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
      await page.getByRole("link", { name: "Yes" }).click()

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/admin/external-evaluators")
    })
  })
})
