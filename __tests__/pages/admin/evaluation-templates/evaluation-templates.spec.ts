import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../utils/setup-playwright"
import { mockRequest } from "../../../utils/mock-request"
import { loginUser } from "../../../utils/login-user"

setupPlaywright()

test.describe("Admin - Evaluation Templates", () => {
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
    test("should not allow to view the evaluation templates", async ({ page }) => {
      await page.goto("/admin/evaluation-templates")

      await expect(page).toHaveURL("/auth/login?callback=/admin/evaluation-templates")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the evaluation templates", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/evaluation-templates")

      await expect(page).toHaveURL("/dashboard")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-templates")

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
            rate: "35",
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
            rate: "80",
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

      await mockRequest(page, "/admin/evaluation-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              name: "PM Evaluation by BOD",
              display_name: "BOD Evaluation",
              template_type: "Project Evaluation",
              template_class: "Internal",
              with_recommendation: true,
              evaluator_role_id: 1,
              evaluee_role_id: 3,
              rate: "35",
              answer_id: 1,
              description: null,
              is_active: true,
              created_at: null,
              updated_at: null,
              deleted_at: null,
            },
          ],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            totalPages: 1,
            totalItems: 2,
          },
        }),
      })

      await page.waitForLoadState("networkidle")

      await expect(page.getByRole("heading", { name: "Evaluation Templates" })).toBeVisible()
      await expect(page.getByPlaceholder("Search by name")).toBeVisible()
      await expect(page.getByPlaceholder("Search by display name")).toBeVisible()
      await expect(page.locator("label").filter({ hasText: "Template Type" })).toBeVisible()
      await expect(page.locator("label").filter({ hasText: "Evaluator Role" })).toBeVisible()
      await expect(page.locator("label").filter({ hasText: "Evaluee Role" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Search" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Clear" })).toBeVisible()

      await expect(page.getByRole("button", { name: "Add Evaluation Template" })).toBeVisible()

      await expect(page.getByRole("cell", { name: "Name", exact: true })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Display Name" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Template Type" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "With Recommendation" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Evaluator Role" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Evaluee Role" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Rate" })).toBeVisible()

      await expect(page.getByRole("cell", { name: "PM Evaluation by BOD" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "BOD Evaluation" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Project Evaluation" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "True" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "1" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "3", exact: true })).toBeVisible()
      await expect(page.getByRole("cell", { name: "35" })).toBeVisible()

      await expect(page.getByTestId("EditButton")).toBeVisible()
      await expect(page.getByTestId("DeleteButton")).toBeVisible()
    })
  })
})
