import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../../utils/setup-playwright"
import { mockRequest } from "../../../../utils/mock-request"
import { loginUser } from "../../../../utils/login-user"

setupPlaywright()

test.describe("Admin - Create External Evaluator", () => {
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
    test("should not allow to view the admin create external evaluator", async ({ page }) => {
      await page.goto("/admin/external-evaluators/create")

      await expect(page).toHaveURL("/auth/login?callback=/admin/external-evaluators/create")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the admin create external evaluator", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/external-evaluators/create")

      await expect(page).toHaveURL("/dashboard")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/external-evaluators/create")

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByPlaceholder("First name")).toBeVisible()
      await expect(page.getByPlaceholder("Middle name")).toBeVisible()
      await expect(page.getByPlaceholder("Last name")).toBeVisible()
      await expect(page.getByPlaceholder("Email")).toBeVisible()
      await expect(page.getByPlaceholder("Role")).toBeVisible()
      await expect(page.getByPlaceholder("Company")).toBeVisible()

      await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Save" })).toBeVisible()
    })

    test("should show validation errors", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/external-evaluators/create")

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

    test("should create external evaluator succesfully", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/external-evaluators/create")

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

      await page.goto("/admin/external-evaluators/create")

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

      await page.goto("/admin/external-evaluators/create")

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
