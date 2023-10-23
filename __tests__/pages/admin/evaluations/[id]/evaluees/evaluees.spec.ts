import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../../../utils/setupPlaywright"
import { mockRequest } from "../../../../../utils/mockRequest"
import { loginUser } from "../../../../../utils/loginUser"

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
    test("should not allow to view the evaluation evaluees page", async ({
      page,
    }) => {
      await page.goto("/admin/evaluations/1/evaluees")

      await expect(page).toHaveURL("/auth/login")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the evaluation evaluees page", async ({
      page,
    }) => {
      await loginUser("employee", page)

      await page.goto("/admin/evaluations/1/evaluees")

      await expect(page).toHaveURL("/dashboard")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluations/1/evaluees")

      await mockRequest(
        page,
        "/admin/evaluees?evaluation_administration_id=1",
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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByPlaceholder("Search by name")).toBeVisible()
      await expect(page.getByRole("combobox")).toBeVisible()
      await expect(page.getByRole("button", { name: "Search" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Clear" })).toBeVisible()

      await expect(
        page.getByRole("heading", { name: "Evaluees" })
      ).toBeVisible()

      await expect(page.getByText("admin, Catreviewed")).toBeVisible()
      await expect(page.getByText("admin, Jpending")).toBeVisible()
      await expect(page.getByText("admin, Ninodraft")).toBeVisible()

      await expect(
        page.getByRole("button", { name: "Cancel & Exit" })
      ).toBeVisible()
      await expect(page.getByTestId("BackButton")).toBeVisible()
      await expect(
        page.getByRole("button", { name: "Generate Evaluations" })
      ).toBeVisible()
    })

    test("should render delete evaluee modal correctly", async ({
      page,
      isMobile,
    }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluations/1/evaluees")

      await mockRequest(
        page,
        "/admin/evaluees?evaluation_administration_id=1",
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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page
        .locator("div")
        .filter({ hasText: /^admin, CatReviewed$/ })
        .getByRole("button")
        .click()

      await expect(
        page.getByRole("heading", { name: "Delete Evaluee" })
      ).toBeVisible()
      await expect(
        page.getByText(
          "Are you sure you want to remove Cat admin? This action cannot be reverted."
        )
      ).toBeVisible()
      await expect(page.getByRole("button", { name: "No" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Yes" })).toBeVisible()
    })

    test("should allow to delete evaluee", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluations/1/evaluees")

      await mockRequest(
        page,
        "/admin/evaluees?evaluation_administration_id=1",
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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page
        .locator("div")
        .filter({ hasText: /^admin, CatReviewed$/ })
        .getByRole("button")
        .click()

      await mockRequest(page, "/admin/evaluees/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: "1" }),
      })

      await page.getByRole("button", { name: "Yes" }).click()

      await expect(
        page.getByText("Cat admin successfully removed.")
      ).toBeVisible()
      await expect(page.getByText("admin, Catreviewed")).not.toBeVisible()
    })

    test("should allow to go back", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluations/1/evaluees")

      await mockRequest(
        page,
        "/admin/evaluees?evaluation_administration_id=1",
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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByTestId("BackButton").click()

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

      await expect(page).toHaveURL("/admin/evaluations/1/select")
    })
  })
})
