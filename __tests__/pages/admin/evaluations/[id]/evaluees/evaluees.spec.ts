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
  })
})
