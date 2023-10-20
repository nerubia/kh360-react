import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../../utils/setupPlaywright"
import { mockRequest } from "../../../../utils/mockRequest"
import { loginUser } from "../../../../utils/loginUser"

setupPlaywright()

test.describe("Admin - Select Employees", () => {
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
    test("should not allow to view the admin select employees", async ({
      page,
    }) => {
      await page.goto("/admin/evaluations/1/select")

      await expect(page).toHaveURL("/auth/login")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the admin select employees", async ({
      page,
    }) => {
      await loginUser("employee", page)

      await page.goto("/admin/evaluations/1/select")

      await expect(page).toHaveURL("/dashboard")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluations/1/select")

      await mockRequest(page, "/admin/employees", {
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

      await page.waitForLoadState("networkidle")

      await expect(page.getByPlaceholder("Search by name")).toBeVisible()
      await expect(page.getByRole("combobox")).toBeVisible()
      await expect(page.getByRole("button", { name: "Search" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Clear" })).toBeVisible()

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(
        page.getByRole("heading", { name: "Select Employees" })
      ).toBeVisible()

      await expect(page.getByRole("cell", { name: "Name" })).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "Date Started" })
      ).toBeVisible()
      await expect(page.getByRole("cell", { name: "Position" })).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "Employee Type" })
      ).toBeVisible()

      await expect(page.getByRole("cell", { name: "Adam Baker" })).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "Clark Davis" })
      ).toBeVisible()
      await expect(page.getByRole("cell", { name: "Hill Evans" })).toBeVisible()
      await expect(page).toHaveURL("/admin/evaluations/1/select")
    })
  })
})
