import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../../utils/setup-playwright"
import { mockRequest } from "../../../../utils/mock-request"
import { loginUser } from "../../../../utils/login-user"

setupPlaywright()

test.describe("Admin - Create Evaluation Template", () => {
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
    test("should not allow to view the admin create email template", async ({ page }) => {
      await page.goto("/admin/evaluation-templates/create")

      await expect(page).toHaveURL("/auth/login?callback=/admin/evaluation-templates/create")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the admin create email template", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/evaluation-templates/create")

      await expect(page).toHaveURL("/dashboard")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-templates/create")

      await mockRequest(page, "/admin/evaluation-templates/template-types", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "PM Evaluation by BOD",
            display_name: "BOD Evaluation",
            template_type: "Project Evaluation",
            template_class: "Internal",
            with_recommendation: true,
            evaluator_role_id: 1,
            evaluee_role_id: 3,
            rate: 35,
            answer_id: 1,
            description: null,
            is_active: true,
            created_at: null,
            updated_at: null,
            deleted_at: null,
          },
          {
            id: 11,
            name: "HR Evaluation by Employees",
            display_name: "Employee Evaluation",
            template_type: "Unit Evaluation",
            template_class: "Internal",
            with_recommendation: false,
            evaluator_role_id: null,
            evaluee_role_id: 2,
            rate: 80,
            answer_id: 1,
            description: null,
            is_active: true,
            created_at: null,
            updated_at: null,
            deleted_at: null,
          },
        ]),
      })

      await mockRequest(page, "/admin/project-roles/all", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Board of Directors",
            short_name: "BOD",
            is_evaluee: false,
          },
          {
            id: 2,
            name: "Human Resource",
            short_name: "HR",
            is_evaluee: true,
          },
          {
            id: 3,
            name: "Project Manager",
            short_name: "PM",
            is_evaluee: true,
          },
          {
            id: 4,
            name: "System Analyst",
            short_name: "SA",
            is_evaluee: false,
          },
          {
            id: 5,
            name: "Developer",
            short_name: "DEV",
            is_evaluee: true,
          },
          {
            id: 6,
            name: "Quality Assurance",
            short_name: "QA",
            is_evaluee: true,
          },
          {
            id: 7,
            name: "Code Reviewer",
            short_name: "CR",
            is_evaluee: false,
          },
        ]),
      })

      await mockRequest(page, "/admin/answers/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "5 Point Scale",
            description: "Used from 2018 to present",
            is_active: true,
            created_at: "2022-04-06T02:16:54.000Z",
            updated_at: "2022-04-06T02:16:54.000Z",
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.waitForSelector('[placeholder="Name"]')
      await expect(page.locator('[placeholder="Name"]')).toBeVisible()
      await expect(page.getByPlaceholder("Display Name")).toBeVisible()

      await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Save" })).toBeVisible()
    })

    test("should show validation errors", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-templates/create")

      await mockRequest(page, "/admin/evaluation-templates/template-types", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "PM Evaluation by BOD",
            display_name: "BOD Evaluation",
            template_type: "Project Evaluation",
            template_class: "Internal",
            with_recommendation: true,
            evaluator_role_id: 1,
            evaluee_role_id: 3,
            rate: 35,
            answer_id: 1,
            description: null,
            is_active: true,
            created_at: null,
            updated_at: null,
            deleted_at: null,
          },
          {
            id: 11,
            name: "HR Evaluation by Employees",
            display_name: "Employee Evaluation",
            template_type: "Unit Evaluation",
            template_class: "Internal",
            with_recommendation: false,
            evaluator_role_id: null,
            evaluee_role_id: 2,
            rate: 80,
            answer_id: 1,
            description: null,
            is_active: true,
            created_at: null,
            updated_at: null,
            deleted_at: null,
          },
        ]),
      })

      await mockRequest(page, "/admin/project-roles/all", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Board of Directors",
            short_name: "BOD",
            is_evaluee: false,
          },
          {
            id: 2,
            name: "Human Resource",
            short_name: "HR",
            is_evaluee: true,
          },
          {
            id: 3,
            name: "Project Manager",
            short_name: "PM",
            is_evaluee: true,
          },
          {
            id: 4,
            name: "System Analyst",
            short_name: "SA",
            is_evaluee: false,
          },
          {
            id: 5,
            name: "Developer",
            short_name: "DEV",
            is_evaluee: true,
          },
          {
            id: 6,
            name: "Quality Assurance",
            short_name: "QA",
            is_evaluee: true,
          },
          {
            id: 7,
            name: "Code Reviewer",
            short_name: "CR",
            is_evaluee: false,
          },
        ]),
      })

      await mockRequest(page, "/admin/answers/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "5 Point Scale",
            description: "Used from 2018 to present",
            is_active: true,
            created_at: "2022-04-06T02:16:54.000Z",
            updated_at: "2022-04-06T02:16:54.000Z",
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Save" }).click()

      await page.waitForSelector('text="Name is required"')
      await expect(page.locator('text="Name is required"')).toBeVisible()
      await expect(page.getByText("Display name is required")).toBeVisible()
      await expect(page.getByText("Template type is required")).toBeVisible()
    })

    test("should create email template succesfully", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-templates/create")

      await mockRequest(page, "/admin/evaluation-templates/template-types", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "PM Evaluation by BOD",
            display_name: "BOD Evaluation",
            template_type: "Project Evaluation",
            template_class: "Internal",
            with_recommendation: true,
            evaluator_role_id: 1,
            evaluee_role_id: 3,
            rate: 35,
            answer_id: 1,
            description: null,
            is_active: true,
            created_at: null,
            updated_at: null,
            deleted_at: null,
          },
          {
            id: 11,
            name: "HR Evaluation by Employees",
            display_name: "Employee Evaluation",
            template_type: "Unit Evaluation",
            template_class: "Internal",
            with_recommendation: false,
            evaluator_role_id: null,
            evaluee_role_id: 2,
            rate: 80,
            answer_id: 1,
            description: null,
            is_active: true,
            created_at: null,
            updated_at: null,
            deleted_at: null,
          },
        ]),
      })

      await mockRequest(page, "/admin/project-roles/all", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Board of Directors",
            short_name: "BOD",
            is_evaluee: false,
          },
          {
            id: 2,
            name: "Human Resource",
            short_name: "HR",
            is_evaluee: true,
          },
          {
            id: 3,
            name: "Project Manager",
            short_name: "PM",
            is_evaluee: true,
          },
          {
            id: 4,
            name: "System Analyst",
            short_name: "SA",
            is_evaluee: false,
          },
          {
            id: 5,
            name: "Developer",
            short_name: "DEV",
            is_evaluee: true,
          },
          {
            id: 6,
            name: "Quality Assurance",
            short_name: "QA",
            is_evaluee: true,
          },
          {
            id: 7,
            name: "Code Reviewer",
            short_name: "CR",
            is_evaluee: false,
          },
        ]),
      })

      await mockRequest(page, "/admin/answers/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "5 Point Scale",
            description: "Used from 2018 to present",
            is_active: true,
            created_at: "2022-04-06T02:16:54.000Z",
            updated_at: "2022-04-06T02:16:54.000Z",
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/admin/evaluation-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
        }),
      })

      await page.waitForSelector('[placeholder="Name"]')
      await page.locator('[placeholder="Name"]').fill("PM Evaluation by BOD")
      await page.getByPlaceholder("Display Name").fill("BOD Evaluation")

      await page.getByRole("button", { name: "Save" }).click()

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/admin/evaluation-templates/create")
    })

    test("should render cancel & exit modal correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-templates/create")

      await mockRequest(page, "/admin/evaluation-templates/template-types", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "PM Evaluation by BOD",
            display_name: "BOD Evaluation",
            template_type: "Project Evaluation",
            template_class: "Internal",
            with_recommendation: true,
            evaluator_role_id: 1,
            evaluee_role_id: 3,
            rate: 35,
            answer_id: 1,
            description: null,
            is_active: true,
            created_at: null,
            updated_at: null,
            deleted_at: null,
          },
          {
            id: 11,
            name: "HR Evaluation by Employees",
            display_name: "Employee Evaluation",
            template_type: "Unit Evaluation",
            template_class: "Internal",
            with_recommendation: false,
            evaluator_role_id: null,
            evaluee_role_id: 2,
            rate: 80,
            answer_id: 1,
            description: null,
            is_active: true,
            created_at: null,
            updated_at: null,
            deleted_at: null,
          },
        ]),
      })

      await mockRequest(page, "/admin/project-roles/all", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Board of Directors",
            short_name: "BOD",
            is_evaluee: false,
          },
          {
            id: 2,
            name: "Human Resource",
            short_name: "HR",
            is_evaluee: true,
          },
          {
            id: 3,
            name: "Project Manager",
            short_name: "PM",
            is_evaluee: true,
          },
          {
            id: 4,
            name: "System Analyst",
            short_name: "SA",
            is_evaluee: false,
          },
          {
            id: 5,
            name: "Developer",
            short_name: "DEV",
            is_evaluee: true,
          },
          {
            id: 6,
            name: "Quality Assurance",
            short_name: "QA",
            is_evaluee: true,
          },
          {
            id: 7,
            name: "Code Reviewer",
            short_name: "CR",
            is_evaluee: false,
          },
        ]),
      })

      await mockRequest(page, "/admin/answers/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "5 Point Scale",
            description: "Used from 2018 to present",
            is_active: true,
            created_at: "2022-04-06T02:16:54.000Z",
            updated_at: "2022-04-06T02:16:54.000Z",
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
      await expect(page.getByRole("link", { name: "Yes" })).toBeVisible()
    })

    test("should allow to cancel & exit", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-templates/create")

      await mockRequest(page, "/admin/evaluation-templates/template-types", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "PM Evaluation by BOD",
            display_name: "BOD Evaluation",
            template_type: "Project Evaluation",
            template_class: "Internal",
            with_recommendation: true,
            evaluator_role_id: 1,
            evaluee_role_id: 3,
            rate: 35,
            answer_id: 1,
            description: null,
            is_active: true,
            created_at: null,
            updated_at: null,
            deleted_at: null,
          },
          {
            id: 11,
            name: "HR Evaluation by Employees",
            display_name: "Employee Evaluation",
            template_type: "Unit Evaluation",
            template_class: "Internal",
            with_recommendation: false,
            evaluator_role_id: null,
            evaluee_role_id: 2,
            rate: 80,
            answer_id: 1,
            description: null,
            is_active: true,
            created_at: null,
            updated_at: null,
            deleted_at: null,
          },
        ]),
      })

      await mockRequest(page, "/admin/project-roles/all", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Board of Directors",
            short_name: "BOD",
            is_evaluee: false,
          },
          {
            id: 2,
            name: "Human Resource",
            short_name: "HR",
            is_evaluee: true,
          },
          {
            id: 3,
            name: "Project Manager",
            short_name: "PM",
            is_evaluee: true,
          },
          {
            id: 4,
            name: "System Analyst",
            short_name: "SA",
            is_evaluee: false,
          },
          {
            id: 5,
            name: "Developer",
            short_name: "DEV",
            is_evaluee: true,
          },
          {
            id: 6,
            name: "Quality Assurance",
            short_name: "QA",
            is_evaluee: true,
          },
          {
            id: 7,
            name: "Code Reviewer",
            short_name: "CR",
            is_evaluee: false,
          },
        ]),
      })

      await mockRequest(page, "/admin/answers/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "5 Point Scale",
            description: "Used from 2018 to present",
            is_active: true,
            created_at: "2022-04-06T02:16:54.000Z",
            updated_at: "2022-04-06T02:16:54.000Z",
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/admin/evaluation-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 2,
              name: "PM Evaluation by DEV",
              display_type: "DEV Evaluation",
              template_name: "Project Evaluation",
              template_class: "Internal",
              with_recommendation: 0,
              evaluator_role_id: 5,
              evaluee_role_id: 3,
              rate: 35.0,
              answer_id: 1,
              is_active: 1,
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

      await expect(page).toHaveURL("/admin/evaluation-templates")
    })
  })
})
