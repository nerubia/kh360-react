import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("Admin - View Skill Map Administrations", () => {
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
    test("should not allow to access the view skill map administration", async ({ page }) => {
      await page.goto("/admin/skill-map-administrations/1")

      await expect(page).toHaveURL("/auth/login?callback=/admin/skill-map-administrations/1")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to access the view skill map administration", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/skill-map-administrations/1")

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
            id: 1,
            name: "Needs Improvement",
            display_name: "Navigational Challenge",
            min_score: "0",
            max_score: "1.99",
            result_description:
              "Employee faces occasional difficulty in navigating job responsibilities.\nPerformance consistently falls below expectations and significant improvement is needed in various aspects of job responsibilities.\nGoals and objectives are not met consistently.",
            evaluee_description:
              "You face occasional difficulty in navigating job responsibilities.\nYour performance consistently falls below expectations and significant improvement is needed in various aspects of job responsibilities.\nYour goals and objectives are not met consistently.",
            status: null,
            created_at: null,
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

      await page.goto("/admin/skill-map-administrations/1")

      await mockRequest(page, "/admin/skill-map-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "This is a sample skill map admin",
          skill_map_period_start_date: "2024-01-01T00:00:00.000Z",
          skill_map_period_end_date: "2024-01-03T00:00:00.000Z",
          skill_map_schedule_start_date: "2023-03-15T00:00:00.000Z",
          skill_map_schedule_end_date: "2023-03-16T00:00:00.000Z",
          remarks: "Remarks 1",
          email_subject: "Subject 1",
          email_content: "Content 1",
          status: "Draft",
        }),
      })

      const response = {
        id: 1,
        name: "This is a sample skill map admin",
        skill_map_period_start_date: "2024-01-01T00:00:00.000Z",
        skill_map_period_end_date: "2024-01-03T00:00:00.000Z",
        skill_map_schedule_start_date: "2023-03-15T00:00:00.000Z",
        skill_map_schedule_end_date: "2023-03-16T00:00:00.000Z",
        remarks: "Remarks 1",
        email_subject: "Subject 1",
        is_uploaded: true,
        email_content: "Content 1",
        status: "Draft",
      }

      await mockRequest(page, "/admin/skill-map-results/all?skill_map_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            user_id: 1,
            status: "Ongoing",
            users: {
              id: 1,
              first_name: "Adam",
              last_name: "Baker",
              email: "sample1@gmail.com",
            },
            skill_map_administration_id: 1,
            skill_map_ratings: [],
            email_logs: [],
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(
        page.getByRole("heading", { name: "This is a sample skill map admin" })
      ).toBeVisible()
      await expect(page.getByText("Draft")).toBeVisible()

      if (isMobile) {
        await expect(page.getByText("Period:Jan 1, 2024 to Jan 3, 2024")).toBeVisible()
        await expect(page.getByText("Schedule:Mar 15, 2023 to Mar 16, 2023")).toBeVisible()
      } else {
        await expect(page.getByText("Skill Map Period: ")).toBeVisible()
        await expect(page.getByText("January 1, 2024 to January 3, 2024")).toBeVisible()
        await expect(page.getByText("Skill Map Schedule: ")).toBeVisible()
        await expect(page.getByText("March 15, 2023 to March 16, 2023")).toBeVisible()
      }

      if (response.is_uploaded) {
        await expect(page.getByRole("button", { name: "More actions" })).not.toBeVisible()
      } else {
        await expect(page.getByRole("button", { name: "More actions" })).toBeVisible()
      }

      await expect(page.getByRole("heading", { name: "Employees" })).toBeVisible()
      await expect(page.getByText("- Baker, Adam")).toBeVisible()

      await expect(page.getByTestId("BackButton")).toBeVisible()
    })

    test("should allow to go back", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/skill-map-administrations/1")

      await mockRequest(page, "/admin/skill-map-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "This is a sample skill map admin",
          skill_map_period_start_date: "2024-04-06T00:00:00.000Z",
          skill_map_period_end_date: "2023-03-14T00:00:00.000Z",
          skill_map_schedule_start_date: "2023-03-15T00:00:00.000Z",
          skill_map_schedule_end_date: "2023-03-16T00:00:00.000Z",
          remarks: "Remarks 1",
          email_subject: "Subject 1",
          email_content: "Content 1",
          status: "Draft",
        }),
      })

      await mockRequest(page, "/admin/skill-map-results/all?skill_map_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            status: "For Review",
            users: {
              first_name: "Sample",
              last_name: "User",
              picture: null,
            },
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/admin/skill-map-administrations", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              name: "This is a sample skill map admin",
              skill_map_period_start_date: "2024-04-06T00:00:00.000Z",
              skill_map_period_end_date: "2023-03-14T00:00:00.000Z",
              skill_map_schedule_start_date: "2023-03-15T00:00:00.000Z",
              skill_map_schedule_end_date: "2023-03-16T00:00:00.000Z",
              remarks: null,
              email_subject: "",
              email_content: null,
              status: "Draft",
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

      await page.getByTestId("BackButton").click()

      await expect(page).toHaveURL("/admin/skill-map-administrations")
    })

    test("should allow to edit", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/skill-map-administrations/1")

      await mockRequest(page, "/admin/skill-map-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "This is a sample skill map admin",
          skill_map_period_start_date: "2024-04-06T00:00:00.000Z",
          skill_map_period_end_date: "2023-03-14T00:00:00.000Z",
          skill_map_schedule_start_date: "2023-03-15T00:00:00.000Z",
          skill_map_schedule_end_date: "2023-03-16T00:00:00.000Z",
          remarks: "Remarks 1",
          email_subject: "Subject 1",
          email_content: "Content 1",
          status: "Draft",
        }),
      })

      await mockRequest(page, "/admin/skill-map-results/all?skill_map_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            status: "For Review",
            users: {
              first_name: "Sample",
              last_name: "User",
              picture: null,
            },
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      const response = {
        id: 1,
        name: "This is a sample skill map admin",
        skill_map_period_start_date: "2024-01-01T00:00:00.000Z",
        skill_map_period_end_date: "2024-01-03T00:00:00.000Z",
        skill_map_schedule_start_date: "2023-03-15T00:00:00.000Z",
        skill_map_schedule_end_date: "2023-03-16T00:00:00.000Z",
        remarks: "Remarks 1",
        email_subject: "Subject 1",
        is_uploaded: true,
        email_content: "Content 1",
        status: "Draft",
      }
      if (!response.is_uploaded) {
        await page.getByRole("button", { name: "More actions" }).click()
        await page.getByRole("button", { name: "Edit" }).click()
        await expect(page).toHaveURL("/admin/skill-map-administrations/1/edit")
      }
    })

    test("should allow to delete", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/skill-map-administrations/1")

      await mockRequest(page, "/admin/skill-map-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "This is a sample skill map admin",
          skill_map_period_start_date: "2024-04-06T00:00:00.000Z",
          skill_map_period_end_date: "2023-03-14T00:00:00.000Z",
          skill_map_schedule_start_date: "2023-03-15T00:00:00.000Z",
          skill_map_schedule_end_date: "2023-03-16T00:00:00.000Z",
          remarks: "Remarks 1",
          email_subject: "Subject 1",
          email_content: "Content 1",
          status: "Draft",
        }),
      })

      await mockRequest(page, "/admin/skill-map-results/all?skill_map_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            status: "For Review",
            users: {
              first_name: "Sample",
              last_name: "User",
              picture: null,
            },
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      const response = {
        id: 1,
        name: "This is a sample skill map admin",
        skill_map_period_start_date: "2024-01-01T00:00:00.000Z",
        skill_map_period_end_date: "2024-01-03T00:00:00.000Z",
        skill_map_schedule_start_date: "2023-03-15T00:00:00.000Z",
        skill_map_schedule_end_date: "2023-03-16T00:00:00.000Z",
        remarks: "Remarks 1",
        email_subject: "Subject 1",
        is_uploaded: true,
        email_content: "Content 1",
        status: "Draft",
      }
      if (!response.is_uploaded) {
        await page.getByRole("button", { name: "More actions" }).click()
        await page.getByRole("button", { name: "Delete" }).click()
        await mockRequest(page, "/admin/skill-map-administrations/1", {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({}),
        })

        await page.getByRole("button", { name: "Yes" }).click()

        await mockRequest(page, "/admin/skill-map-administrations", {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [],
            pageInfo: {
              hasPreviousPage: false,
              hasNextPage: false,
              totalPages: 1,
            },
          }),
        })
        await expect(page).toHaveURL("/admin/skill-map-administrations")
      }
    })
  })
})
