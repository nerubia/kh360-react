import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../../../utils/setupPlaywright"
import { mockRequest } from "../../../../../utils/mockRequest"
import { loginUser } from "../../../../../utils/loginUser"

setupPlaywright()

test.describe("Admin - Preview Employees", () => {
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
    test("should not allow to view the admin preview employees", async ({
      page,
    }) => {
      await page.goto("/admin/evaluation-administrations/1/preview")

      await expect(page).toHaveURL("/auth/login")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the admin preview employees", async ({
      page,
    }) => {
      await loginUser("employee", page)

      await page.goto("/admin/evaluation-administrations/1/preview")

      await expect(page).toHaveURL("/dashboard")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/preview")

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
        }),
      })

      await page.waitForLoadState("networkidle")

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(
        page.getByRole("heading", { name: "Review Employees" })
      ).toBeVisible()

      await expect(page.getByRole("cell", { name: "Name" })).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "Date Started" })
      ).toBeVisible()
      await expect(page.getByRole("cell", { name: "Role" })).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "Employee Type" })
      ).toBeVisible()

      await expect(
        page.getByRole("button", { name: "0 Included" })
      ).toBeVisible()
      await expect(
        page.getByRole("button", { name: "3 Excluded" })
      ).toBeVisible()

      await expect(
        page.getByRole("cell", { name: "Baker, Adam" })
      ).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "Davis, Clark" })
      ).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "Evans, Hill" })
      ).toBeVisible()
      await expect(page).toHaveURL(
        "/admin/evaluation-administrations/1/preview"
      )
    })

    test("should render cancel & exit modal correctly", async ({
      page,
      isMobile,
    }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/preview")

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
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Cancel & Exit" }).click()

      await expect(
        page.getByRole("heading", { name: "Cancel & Exit" })
      ).toBeVisible()
      await expect(
        page.getByText(
          "Are you sure you want to cancel and exit? If you cancel, your data won't be save"
        )
      ).toBeVisible()
      await expect(page.getByRole("button", { name: "No" })).toBeVisible()
      await expect(page.getByRole("link", { name: "Yes" })).toBeVisible()
    })

    test("should allow to cancel & exit", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/select")

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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Cancel & Exit" }).click()
      await page.getByRole("link", { name: "Yes" }).click()

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

    test("should allow to go back", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/preview")

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

      await expect(page).toHaveURL("/admin/evaluation-administrations/1/select")
    })

    test("should save and proceed succesfully", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/select")

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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page
        .getByRole("row", { name: "Name Date Started Position Employee Type" })
        .getByRole("checkbox")
        .check()

      await page.getByRole("link", { name: "Check & Preview" }).click()

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
        }),
      })

      await mockRequest(page, "/admin/evaluation-results", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([1]),
      })

      await page.getByRole("button", { name: "Save & Proceed" }).click()

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
                  first_name: "Adam",
                  last_name: "Baker",
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

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL(
        "/admin/evaluation-administrations/1/evaluees"
      )
    })
  })
})
