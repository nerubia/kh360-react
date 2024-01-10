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

      await mockRequest(page, "/admin/evaluation-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "PM Evaluation by BOD",
            display_type: "BOD Evaluation",
            template_name: "Project Evaluation",
            template_class: "Internal",
            with_recommendation: 1,
            evaluator_role_id: 1,
            evaluee_role_id: 3,
            rate: 35.0,
            answer_id: 1,
            is_active: 1,
            created_at: null,
            updated_at: null,
          },
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
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByPlaceholder("Name")).toBeVisible()
      await expect(page.getByPlaceholder("Display Name")).toBeVisible()
      await expect(page.getByPlaceholder("Template Type")).toBeVisible()

      await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Save" })).toBeVisible()
    })

    test("should show validation errors", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-templates/create")

      await mockRequest(page, "/admin/evaluation-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "PM Evaluation by BOD",
            display_type: "BOD Evaluation",
            template_name: "Project Evaluation",
            template_class: "Internal",
            with_recommendation: 1,
            evaluator_role_id: 1,
            evaluee_role_id: 3,
            rate: 35.0,
            answer_id: 1,
            is_active: 1,
            created_at: null,
            updated_at: null,
          },
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
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Save" }).click()

      await expect(page.getByText("Name is required")).toBeVisible()
      await expect(page.getByText("Display name is required")).toBeVisible()
      await expect(page.getByText("Template type is required")).toBeVisible()
      await expect(page.getByText("Template class is required")).toBeVisible()
    })

    test("should create email template succesfully", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-templates/create")

      await mockRequest(page, "/admin/evaluation-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "PM Evaluation by BOD",
            display_type: "BOD Evaluation",
            template_name: "Project Evaluation",
            template_class: "Internal",
            with_recommendation: 1,
            evaluator_role_id: 1,
            evaluee_role_id: 3,
            rate: 35.0,
            answer_id: 1,
            is_active: 1,
            created_at: null,
            updated_at: null,
          },
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

      await page.getByPlaceholder("Name").fill("PM Evaluation by BOD")
      await page.getByPlaceholder("Display Name").fill("BOD Evaluation")
      await page.getByPlaceholder("Template Type").fill("Project Evaluation")

      await page.getByRole("button", { name: "Save" }).click()

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/admin/evaluation-templates/create")
    })

    test("should render cancel & exit modal correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-templates/create")

      await mockRequest(page, "/admin/evaluation-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "PM Evaluation by BOD",
            display_type: "BOD Evaluation",
            template_name: "Project Evaluation",
            template_class: "Internal",
            with_recommendation: 1,
            evaluator_role_id: 1,
            evaluee_role_id: 3,
            rate: 35.0,
            answer_id: 1,
            is_active: 1,
            created_at: null,
            updated_at: null,
          },
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

      await mockRequest(page, "/admin/evaluation-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "PM Evaluation by BOD",
            display_type: "BOD Evaluation",
            template_name: "Project Evaluation",
            template_class: "Internal",
            with_recommendation: 1,
            evaluator_role_id: 1,
            evaluee_role_id: 3,
            rate: 35.0,
            answer_id: 1,
            is_active: 1,
            created_at: null,
            updated_at: null,
          },
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
