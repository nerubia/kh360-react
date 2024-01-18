import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../../utils/setup-playwright"
import { mockRequest } from "../../../../utils/mock-request"
import { loginUser } from "../../../../utils/login-user"

setupPlaywright()

test.describe("Admin - View Project", () => {
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
    test("should not allow to view the view project screen", async ({ page }) => {
      await page.goto("/admin/projects/1")

      await expect(page).toHaveURL("/auth/login?callback=/admin/projects/1")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the view project screen", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/projects/1")

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

      await page.goto("/admin/projects/1")

      await mockRequest(page, "/admin/projects/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Project 1",
          client: {
            name: "John Doe",
          },
          start_date: "2023-01-01T00:00:00.000Z",
          end_date: "2023-12-31T00:00:00.000Z",
          status: "Ongoing",
          project_skills: [
            {
              id: 1,
              skill_category_id: 1,
              name: "Adobe Flex",
              sequence_no: 1,
              skill_categories: {
                id: 1,
                name: "Programming Languages",
                sequence_no: 1,
                description: null,
                status: true,
                created_at: "2024-01-11T01:53:43.000Z",
                updated_at: "2024-01-11T01:53:43.000Z",
              },
              created_at: "2024-01-11T01:53:43.000Z",
              description: null,
              status: true,
              updated_at: "2024-01-11T01:53:43.000Z",
            },
            {
              id: 2,
              skill_category_id: 1,
              name: "Action Script",
              sequence_no: 2,
              skill_categories: {
                id: 1,
                name: "Programming Languages",
                sequence_no: 1,
                description: null,
                status: true,
                created_at: "2024-01-11T01:53:43.000Z",
                updated_at: "2024-01-11T01:53:43.000Z",
              },
              created_at: "2024-01-11T01:53:43.000Z",
              description: null,
              status: true,
              updated_at: "2024-01-11T01:53:43.000Z",
            },
          ],
          project_members: [
            {
              id: 21,
              user_id: 5,
              project_id: 15,
              project_role_id: 3,
              allocation_rate: "50",
              end_date: "2023-12-31T00:00:00.000Z",
              project: {
                id: 15,
                name: "Project 1",
                start_date: "2024-06-13T00:00:00.000Z",
                end_date: "2024-08-13T00:00:00.000Z",
                client_id: 18,
                status: "Ongoing",
              },
              role: "Project Manager",
              start_date: "2023-01-01T00:00:00.000Z",
              user: {
                id: 5,
                email: "projectmember@email.com",
                first_name: "Project",
                last_name: "Member",
                picture: null,
                slug: "project-member",
              },
            },
          ],
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("heading", { name: "Project 1" })).toBeVisible()
      await expect(page.getByText("Client Name: John Doe")).toBeVisible()

      await expect(page.getByText("Project Duration: Jan 1 - Dec 31, 2023")).toBeVisible()
      await expect(page.getByText("Status: Ongoing")).toBeVisible()
      await expect(page.getByText("Skills Used")).toBeVisible()
      await expect(page.getByRole("cell", { name: "Category" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Programming Languages" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Skills" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Adobe Flex , Action Script" })).toBeVisible()
      await expect(page.getByText("Project Members")).toBeVisible()
      await expect(page.getByText("Name", { exact: true })).toBeVisible()
      await expect(page.locator("div").filter({ hasText: /^Skills$/ })).toBeVisible()
      await expect(
        page
          .locator("g")
          .filter({
            hasText:
              "DecemberJanuaryFebruaryMarchAprilMayJuneJulyAugustSeptemberOctoberNovemberDecemb",
          })
          .locator("rect")
      ).toBeVisible()
      await expect(page.getByTitle("Member, Project").locator("div").first()).toBeVisible()

      await expect(page.getByTestId("BackButton")).toBeVisible()
      await expect(page.getByTestId("EditButton")).toBeVisible()
    })

    test("should allow to go back", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/projects/1")

      await mockRequest(page, "/admin/projects/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Project 1",
          client: {
            name: "John Doe",
          },
          start_date: "2023-01-01T00:00:00.000Z",
          end_date: "2023-12-31T00:00:00.000Z",
          status: "Ongoing",
          project_skills: [
            {
              id: 1,
              skill_category_id: 1,
              name: "Adobe Flex",
              sequence_no: 1,
              skill_categories: {
                id: 1,
                name: "Programming Languages",
                sequence_no: 1,
                description: null,
                status: true,
                created_at: "2024-01-11T01:53:43.000Z",
                updated_at: "2024-01-11T01:53:43.000Z",
              },
              created_at: "2024-01-11T01:53:43.000Z",
              description: null,
              status: true,
              updated_at: "2024-01-11T01:53:43.000Z",
            },
            {
              id: 2,
              skill_category_id: 1,
              name: "Action Script",
              sequence_no: 2,
              skill_categories: {
                id: 1,
                name: "Programming Languages",
                sequence_no: 1,
                description: null,
                status: true,
                created_at: "2024-01-11T01:53:43.000Z",
                updated_at: "2024-01-11T01:53:43.000Z",
              },
              created_at: "2024-01-11T01:53:43.000Z",
              description: null,
              status: true,
              updated_at: "2024-01-11T01:53:43.000Z",
            },
          ],
          project_members: [
            {
              id: 21,
              user_id: 5,
              project_id: 15,
              project_role_id: 3,
              allocation_rate: "50",
              end_date: "2023-12-31T00:00:00.000Z",
              project: {
                id: 15,
                name: "Project 1",
                start_date: "2024-06-13T00:00:00.000Z",
                end_date: "2024-08-13T00:00:00.000Z",
                client_id: 18,
                status: "Ongoing",
              },
              role: "Project Manager",
              start_date: "2023-01-01T00:00:00.000Z",
              user: {
                id: 5,
                email: "projectmember@email.com",
                first_name: "Project",
                last_name: "Member",
                picture: null,
                slug: "project-member",
              },
            },
          ],
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/admin/projects/status", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              status: "Ongoing",
            },
            {
              status: "Closed",
            },
          ],
        }),
      })

      await mockRequest(page, "/admin/projects", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              slug: "kaisha-hero",
              name: "Kaisha Hero",
              type: null,
              client_id: null,
              client: null,
              created_at: "2015-02-09T17:58:11.000Z",
              deleted_at: null,
              description: null,
              end_date: "2024-09-13T00:00:00.000Z",
              start_date: "2024-01-13T00:00:00.000Z",
              status: "Ongoing",
              updated_at: "2015-02-09T17:58:11.000Z",
            },
          ],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            totalItems: 1,
            totalPages: 1,
          },
        }),
      })

      await page.waitForLoadState("networkidle")

      await page.getByTestId("BackButton").click()

      await expect(page).toHaveURL("/admin/projects")
    })
  })
})
