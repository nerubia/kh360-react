import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("Admin - Edit Evaluation Template", () => {
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
    test("should not allow to view the edit evaluation template", async ({ page }) => {
      await page.goto("/admin/evaluation-administrations/1/edit")

      await expect(page).toHaveURL("/auth/login?callback=/admin/evaluation-administrations/1/edit")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the edit evaluation template", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/evaluation-administrations/1/edit")

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

      await page.goto("/admin/evaluation-templates/1/edit")

      await mockRequest(page, "/admin/evaluation-templates/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
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
          deleted_at: null,
          evaluatorRole: {
            id: 1,
            name: "Board of Directors",
            short_name: "BOD",
          },
          evalueeRole: {
            id: 3,
            name: "Project Manager",
            short_name: "PM",
          },
          answer: {
            id: 1,
            name: "5 Point Scale",
            description: "Used from 2018 to present",
            is_active: true,
          },
        }),
      })

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
            rate: "35.00",
            answer_id: 1,
            description: null,
            is_active: true,
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
            deleted_at: null,
          },
          {
            id: 12,
            name: "Employee Evaluation by HR",
            display_name: "HR Evaluation",
            template_type: "HR Evaluation",
            template_class: "Internal",
            with_recommendation: false,
            evaluator_role_id: 2,
            evaluee_role_id: null,
            rate: "20.00",
            answer_id: 1,
            description: null,
            is_active: true,
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
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.waitForLoadState("networkidle")

      await expect(page.getByRole("heading", { name: "Edit Evaluation Template" })).toBeVisible()

      await expect(page.getByPlaceholder("Name", { exact: true })).toHaveValue(
        "PM Evaluation by BOD"
      )
      await expect(page.getByPlaceholder("Display Name")).toHaveValue("BOD Evaluation")
      await expect(
        page
          .locator("div")
          .filter({ hasText: /^Project Evaluation$/ })
          .nth(1)
      ).toBeVisible()
      await expect(
        page
          .locator("div")
          .filter({ hasText: /^Internal$/ })
          .nth(2)
      ).toBeVisible()
      await expect(page.locator("div").filter({ hasText: /^BOD$/ }).nth(2)).toBeVisible()
      await expect(page.locator("div").filter({ hasText: /^PM$/ }).nth(1)).toBeVisible()
      await expect(page.getByPlaceholder("Rate")).toHaveValue("35.00")
      await expect(
        page
          .locator("div")
          .filter({ hasText: /^5 Point Scale$/ })
          .nth(2)
      ).toBeVisible()
      await expect(
        page
          .locator("div")
          .filter({ hasText: /^With Recommendation$/ })
          .getByRole("checkbox")
      ).toBeChecked()
      await expect(
        page
          .locator("div")
          .filter({ hasText: /^Is Active$/ })
          .getByRole("checkbox")
      ).toBeChecked()

      await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Save" })).toBeVisible()
    })

    test("should show validation errors", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-templates/1/edit")

      await mockRequest(page, "/admin/evaluation-templates/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}),
      })

      await mockRequest(page, "/admin/evaluation-templates/template-types", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      })

      await mockRequest(page, "/admin/project-roles/all", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      })

      await mockRequest(page, "/admin/answers/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByPlaceholder("Name", { exact: true }).fill("")
      await page.getByPlaceholder("Display Name").fill("")
      await page.getByLabel("Template Type").fill("")
      await page.getByLabel("Template Class").fill("")
      await page.getByLabel("Evaluator Role").fill("")
      await page.getByLabel("Evaluee Role").fill("")
      await page.getByLabel("Rate").fill("")
      await page.getByLabel("Answer").fill("")

      await page.getByRole("button", { name: "Save" }).click()
      await page.getByRole("button", { name: "Yes" }).click()

      await expect(page.getByText("Name is required", { exact: true })).toBeVisible()
      await expect(page.getByText("Display name is required")).toBeVisible()
      await expect(page.getByText("Template type is required")).toBeVisible()
      await expect(page.getByText("Template class is required")).toBeVisible()
      await expect(page.getByText("Evaluator role is required")).toBeVisible()
      await expect(page.getByText("Evaluee role is required")).toBeVisible()
      await expect(page.getByText("Rate is required")).toBeVisible()
      await expect(page.getByText("Answer is required")).toBeVisible()
    })

    test("should edit evaluation template succesfully", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-templates/1/edit")

      await mockRequest(page, "/admin/evaluation-templates/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
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
          deleted_at: null,
          evaluatorRole: {
            id: 1,
            name: "Board of Directors",
            short_name: "BOD",
          },
          evalueeRole: {
            id: 3,
            name: "Project Manager",
            short_name: "PM",
          },
          answer: {
            id: 1,
            name: "5 Point Scale",
            description: "Used from 2018 to present",
            is_active: true,
          },
        }),
      })

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
            deleted_at: null,
          },
          {
            id: 12,
            name: "Employee Evaluation by HR",
            display_name: "HR Evaluation",
            template_type: "HR Evaluation",
            template_class: "Internal",
            with_recommendation: false,
            evaluator_role_id: 2,
            evaluee_role_id: null,
            rate: "20",
            answer_id: 1,
            description: null,
            is_active: true,
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
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByPlaceholder("Name", { exact: true }).fill("Edited Project Evaluation")
      await page.getByPlaceholder("Display Name").fill("Display Name Edit")

      await page.getByRole("button", { name: "Save" }).click()
      await page.getByRole("button", { name: "Yes" }).click()

      await mockRequest(page, "/admin/evaluation-templates/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
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
          deleted_at: null,
          evaluatorRole: {
            id: 1,
            name: "Board of Directors",
            short_name: "BOD",
          },
          evalueeRole: {
            id: 3,
            name: "Project Manager",
            short_name: "PM",
          },
          answer: {
            id: 1,
            name: "5 Point Scale",
            description: "Used from 2018 to present",
            is_active: true,
          },
          evaluationTemplateContents: [
            {
              id: 1,
              name: "PM Skillset",
              description:
                "Manage overall team in terms of cost, schedule and quality, how organized PM is",
              category: "Primary Skillset",
              rate: "15",
              is_active: true,
            },
            {
              id: 2,
              name: "Problem Solving",
              description:
                "Also include ability to prioritize which problems to fix first, know when to escalate",
              category: "Primary Skillset",
              rate: "15",
              is_active: true,
            },
          ],
        }),
      })

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/admin/evaluation-templates/1")
    })

    test("should render cancel & exit modal correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-templates/1/edit")

      await mockRequest(page, "/admin/evaluation-templates/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
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
          deleted_at: null,
          evaluatorRole: {
            id: 1,
            name: "Board of Directors",
            short_name: "BOD",
          },
          evalueeRole: {
            id: 3,
            name: "Project Manager",
            short_name: "PM",
          },
          answer: {
            id: 1,
            name: "5 Point Scale",
            description: "Used from 2018 to present",
            is_active: true,
          },
        }),
      })

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
            deleted_at: null,
          },
          {
            id: 12,
            name: "Employee Evaluation by HR",
            display_name: "HR Evaluation",
            template_type: "HR Evaluation",
            template_class: "Internal",
            with_recommendation: false,
            evaluator_role_id: 2,
            evaluee_role_id: null,
            rate: "20",
            answer_id: 1,
            description: null,
            is_active: true,
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
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Cancel" }).click()

      await expect(page.getByRole("heading", { name: "Cancel" })).toBeVisible()
      await expect(
        page.getByText("Are you sure you want to cancel? If you cancel, your data won't be saved.")
      ).toBeVisible()
      await expect(page.getByRole("button", { name: "No" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Yes" })).toBeVisible()
    })

    test("should allow to cancel & exit", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-templates/1/edit")

      await mockRequest(page, "/admin/evaluation-templates/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
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
          deleted_at: null,
          evaluatorRole: {
            id: 1,
            name: "Board of Directors",
            short_name: "BOD",
          },
          evalueeRole: {
            id: 3,
            name: "Project Manager",
            short_name: "PM",
          },
          answer: {
            id: 1,
            name: "5 Point Scale",
            description: "Used from 2018 to present",
            is_active: true,
          },
        }),
      })

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
            deleted_at: null,
          },
          {
            id: 12,
            name: "Employee Evaluation by HR",
            display_name: "HR Evaluation",
            template_type: "HR Evaluation",
            template_class: "Internal",
            with_recommendation: false,
            evaluator_role_id: 2,
            evaluee_role_id: null,
            rate: "20",
            answer_id: 1,
            description: null,
            is_active: true,
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
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Cancel" }).click()
      await page.getByRole("button", { name: "Yes" }).click()

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

      await expect(page).toHaveURL("/admin/evaluation-templates/1")
    })
  })
})
