import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("Admin - Project Assignments", () => {
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
    test("should not allow to view the project assignments", async ({ page }) => {
      await page.goto("/admin/project-assignments")

      await expect(page).toHaveURL("/auth/login?callback=/admin/project-assignments")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the admin project assignments", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/project-assignments")

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
      await mockRequest(page, "/user/score-ratings", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            created_at: null,
            display_name: "Navigational Challenge",
            evaluee_description:
              "You face occasional difficulty in navigating job responsibilities.\nYour performance consistently falls below expectations and significant improvement is needed in various aspects of job responsibilities.\nYour goals and objectives are not met consistently.",
            id: 1,
            max_score: "1.99",
            min_score: "0",
            name: "Needs Improvement",
            result_description:
              "Employee faces occasional difficulty in navigating job responsibilities.\nPerformance consistently falls below expectations and significant improvement is needed in various aspects of job responsibilities.\nGoals and objectives are not met consistently.",
            status: null,
            updated_at: null,
          },
        ]),
      })
      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/my-evaluations")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page }) => {
      await loginUser("admin", page)

      await page.goto("/admin/project-assignments")

      await mockRequest(page, "/admin/project-members/search", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            user_id: 4,
            project_id: 6,
            project_role_id: 5,
            project_member_skills: [],
            start_date: "2023-01-01T00:00:00.000Z",
            end_date: "2023-12-31T00:00:00.000Z",
            allocation_rate: "100",
            user: {
              id: 4,
              email: "jondoe@gmail.com",
              first_name: "Jon",
              last_name: "Doe",
              slug: "jon-doe",
              picture: null,
            },
            project: {
              id: 6,
              name: "project-assignment",
              description:
                "Comaea focuses on what is critical for your business to achieve the objectives. It supports your talent and creates a clear plan of action to attract, hire, develop and retain your employees.",
              start_date: null,
              end_date: null,
              status: "Ongoing",
              client_id: 7,
            },
            role: "Developer",
          },
        ]),
      })

      await mockRequest(page, "/admin/project-roles", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 3,
            name: "Project Manager",
            short_name: "PM",
            is_evaluee: true,
            for_project: true,
          },
          {
            id: 4,
            name: "System Analyst",
            short_name: "SA",
            is_evaluee: false,
            for_project: true,
          },
          {
            id: 5,
            name: "Developer",
            short_name: "DEV",
            is_evaluee: true,
            for_project: true,
          },
          {
            id: 6,
            name: "Quality Assurance",
            short_name: "QA",
            is_evaluee: true,
            for_project: true,
          },
          {
            id: 7,
            name: "Code Reviewer",
            short_name: "CR",
            is_evaluee: false,
            for_project: true,
          },
        ]),
      })

      await expect(page.getByRole("heading", { name: "Project Assignments" })).toBeVisible()

      await expect(page.getByText("Name")).toBeVisible()
      await expect(page.getByPlaceholder("Search by name")).toBeVisible()

      await expect(page.getByText("Project", { exact: true })).toBeVisible()
      await expect(page.getByPlaceholder("Search by project")).toBeVisible()

      await expect(page.getByText("Role")).toBeVisible()
      await expect(page.locator("div").filter({ hasText: /^All$/ }).nth(2)).toBeVisible()

      await expect(page.getByText("Duration")).toBeVisible()
      await expect(page.getByPlaceholder("YYYY-MM-DD ~ YYYY-MM-DD")).toBeVisible()

      await expect(page.getByRole("button", { name: "Search" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Clear" })).toBeVisible()

      await expect(page.getByRole("heading", { name: "1 Result Found" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Create Assignment" })).toBeVisible()

      await expect(page.getByTitle("Doe, Jon")).toBeVisible()
      await expect(page.getByTitle("project-assignment").locator("div").first()).toBeVisible()

      await expect(page.locator(".rows > rect:nth-child(2)")).toBeVisible()
    })
  })
})
