import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../../utils/setup-playwright"
import { mockRequest } from "../../../../utils/mock-request"
import { loginUser } from "../../../../utils/login-user"

setupPlaywright()

test.describe("Admin - View Evaluation Template", () => {
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
    test("should not allow to view the view evaluation template", async ({ page }) => {
      await page.goto("/admin/evaluation-templates/1")

      await expect(page).toHaveURL("/auth/login?callback=/admin/evaluation-templates/1")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the view evaluation template", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/evaluation-templates/1")

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
    test("should render correctly", async ({ page }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-templates/1")

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

      await expect(
        page.getByRole("heading", { name: "PM Evaluation by BOD (BOD Evaluation)" })
      ).toBeVisible()
      await expect(page.getByText("Template type: Project Evaluation")).toBeVisible()
      await expect(page.getByText("Template class: Internal")).toBeVisible()
      await expect(page.getByText("With Recommendation:")).toBeVisible()
      await expect(page.getByText("YES")).toBeVisible()
      await expect(page.getByText("Evaluator Role: BOD")).toBeVisible()
      await expect(page.getByText("Evaluee Role: PM")).toBeVisible()
      await expect(page.getByText("Answer: 5 Point Scale")).toBeVisible()

      await expect(page.getByText("Evaluation Template Contents")).toBeVisible()

      await expect(page.getByRole("cell", { name: "Name" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Description" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Description" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Rate" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Status", exact: true })).toBeVisible()
      await expect(page.getByRole("cell", { name: "PM Skillset" })).toBeVisible()
      await expect(
        page.getByRole("cell", {
          name: "Manage overall team in terms of cost, schedule and quality, how organized PM is",
        })
      ).toBeVisible()
      await expect(page.getByRole("cell", { name: "Primary Skillset" }).first()).toBeVisible()

      await expect(page.getByRole("cell", { name: "15.00%" }).first()).toBeVisible()
      await expect(page.locator("td:nth-child(5)").first()).toBeVisible()

      await expect(page.getByTestId("EditButton1")).toBeVisible()
      await expect(page.getByTestId("DeleteButton1")).toBeVisible()

      await expect(page.getByRole("cell", { name: "Problem Solving" })).toBeVisible()
      await expect(
        page.getByRole("cell", {
          name: "Also include ability to prioritize which problems to fix first, know when to escalate",
        })
      ).toBeVisible()
      await expect(page.getByRole("cell", { name: "Primary Skillset" }).first()).toBeVisible()

      await expect(page.getByRole("cell", { name: "15.00%" }).first()).toBeVisible()
      await expect(page.getByRole("cell", { name: "ACTIVE" }).nth(1)).toBeVisible()

      await expect(page.getByTestId("EditButton2")).toBeVisible()
      await expect(page.getByTestId("DeleteButton2")).toBeVisible()
    })
  })
})
