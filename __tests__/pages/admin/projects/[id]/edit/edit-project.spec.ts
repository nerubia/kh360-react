import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("Admin - Edit Project", () => {
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
    test("should not allow to view the edit project screen", async ({ page }) => {
      await page.goto("/admin/projects/1/edit")

      await expect(page).toHaveURL("/auth/login?callback=/admin/projects/1/edit")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the edit project screen", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/projects/1/edit")

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
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/projects/1/edit")

      await mockRequest(page, "/admin/projects/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Project 1",
          client: {
            id: 1,
            name: "John Doe",
          },
          start_date: "2023-01-01T00:00:00.000Z",
          end_date: "2023-12-31T00:00:00.000Z",
          status: "Ongoing",
          description: "Test description",
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

      await mockRequest(page, "/admin/clients/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Sample Client",
            display_name: "Sample",
            status: "Active",
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("heading", { name: "Edit Project" })).toBeVisible()

      await expect(page.getByPlaceholder("Name")).toHaveValue("Project 1")
      await expect(page.getByPlaceholder("Description")).toHaveValue("Test description")
      await expect(page.getByLabel("Project Duration")).toHaveValue("2023-01-01 ~ 2023-12-31")

      await expect(page.getByRole("button", { name: "Add Skill" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Save" })).toBeVisible()
    })

    test("should show validation errors", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/projects/1/edit")

      await mockRequest(page, "/admin/clients/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Sample Client",
            display_name: "Sample",
            status: "Active",
          },
        ]),
      })

      await mockRequest(page, "/admin/projects/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          start_date: "",
          end_date: "",
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Save" }).click()
      await page.getByRole("button", { name: "Yes" }).click()

      await expect(page.getByText("Name is required")).toBeVisible()
      await expect(page.getByText("Status is required.")).toBeVisible()
    })

    test("should edit project succesfully", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/projects/1/edit")

      await mockRequest(page, "/admin/projects/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Project 1",
          client: {
            id: 1,
            name: "John Doe",
          },
          start_date: "2023-01-01T00:00:00.000Z",
          end_date: "2023-12-31T00:00:00.000Z",
          status: "Ongoing",
          description: "Test description",
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

      await mockRequest(page, "/admin/clients/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Sample Client",
            display_name: "Sample",
            status: "Active",
          },
          {
            id: 2,
            name: "Sample Edit",
            display_name: "Sample Edit",
            status: "Active",
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByPlaceholder("Name").fill("Create Sample Project edited")
      await page.getByLabel("Client").click()
      await page.getByText("Sample Edit", { exact: true }).click()
      await expect(page.getByLabel("Project Duration")).toHaveValue("2023-01-01 ~ 2023-12-31")
      await page.getByPlaceholder("Description").fill("Test Edit")
      await page.getByLabel("Status").fill("Ongoing")
      await page.getByText("Ongoing", { exact: true }).click()

      await page.getByRole("button", { name: "Save" }).click()
      await page.getByRole("button", { name: "Yes" }).click()

      await mockRequest(page, "/admin/projects/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              slug: "create-sample-project-edited",
              name: "Create Sample Project edited",
              type: null,
              client_id: 1,
              start_date: "2023-01-05T00:00:00.000Z",
              end_date: "2023-12-05T00:00:00.000Z",
              status: "Ongoing",
              description: "Test Edit",
              created_at: "2015-02-09T17:58:11.000Z",
              updated_at: "2015-02-09T17:58:11.000Z",
              deleted_at: null,
              client: {
                id: 1,
                name: "Sample Edit",
              },
            },
          ],
        }),
      })

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/admin/projects/1")
    })

    test("should render cancel & exit modal correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/projects/1/edit")

      await mockRequest(page, "/admin/projects/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Project 1",
          client: {
            id: 1,
            name: "John Doe",
          },
          start_date: "2023-01-01T00:00:00.000Z",
          end_date: "2023-12-31T00:00:00.000Z",
          status: "Ongoing",
          description: "Test description",
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

      await mockRequest(page, "/admin/clients/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Sample Client",
            display_name: "Sample",
            status: "Active",
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Cancel" }).click()

      await expect(page.getByRole("heading", { name: "Cancel" })).toBeVisible()
      await expect(
        page.getByText("Are you sure you want to cancel? If you cancel, your data won't be saved")
      ).toBeVisible()
      await expect(page.getByRole("button", { name: "No" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Yes" })).toBeVisible()
    })

    test("should allow to cancel & exit", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/projects/1/edit")

      await mockRequest(page, "/admin/projects/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Project 1",
          client: {
            id: 1,
            name: "John Doe",
          },
          start_date: "2023-01-01T00:00:00.000Z",
          end_date: "2023-12-31T00:00:00.000Z",
          status: "Ongoing",
          description: "Test description",
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

      await mockRequest(page, "/admin/clients/active", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Sample Client",
            display_name: "Sample",
            status: "Active",
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/admin/projects/status", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { status: "Ongoing" },
          { status: "Closed" },
          { status: "Draft" },
          { status: "Hold" },
        ]),
      })

      await mockRequest(page, "/admin/projects", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              slug: "create-sample-project",
              name: "Create Sample Project",
              type: null,
              client_id: 1,
              start_date: "2023-01-01T00:00:00.000Z",
              end_date: "2023-12-01T00:00:00.000Z",
              status: "Draft",
              description: "Test",
              created_at: "2015-02-09T17:58:11.000Z",
              updated_at: "2015-02-09T17:58:11.000Z",
              deleted_at: null,
              client: null,
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
      await page.getByRole("button", { name: "Yes" }).click()

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/admin/projects/1")
    })
  })
})
