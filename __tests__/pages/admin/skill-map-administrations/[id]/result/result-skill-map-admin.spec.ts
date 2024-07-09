import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("Admin - Skill Map Admin - Result", () => {
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
    test("should not allow to view the skill map administration result screen", async ({
      page,
    }) => {
      await page.goto("/admin/skill-map-administrations/1/results")

      await expect(page).toHaveURL(
        "/auth/login?callback=/admin/skill-map-administrations/1/results"
      )
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the skill map administration result screen", async ({
      page,
    }) => {
      await loginUser("employee", page)

      await page.goto("/admin/skill-map-administrations/1/results")

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

      await page.goto("/admin/skill-map-administrations/1/results")

      await mockRequest(page, "/admin/skill-map-results/all?skill_map_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1247,
            user_id: 20219,
            status: "Ongoing",
            users: {
              id: 20219,
              first_name: "Chadie Gil",
              last_name: "Augis",
              email: "caugis+kh360+@nerubia.com",
            },
            skill_map_administration_id: 1,
            skill_map_ratings: [],
            email_logs: [],
          },
          {
            id: 1249,
            user_id: 20222,
            status: "Submitted",
            users: {
              id: 20222,
              first_name: "Emmalyn",
              last_name: "Acha",
              email: "caugis+kh360+eacha@nerubia.com",
            },
            skill_map_administration_id: 1,
            skill_map_ratings: [
              {
                id: 16472,
                skill_map_administration_id: 1,
                skill_map_result_id: 1249,
                user_id: 20222,
                skill_id: 50,
                skill_category_id: 2,
                other_skill_name: null,
                answer_option_id: 7,
                comments: null,
                status: "Submitted",
                created_at: "2024-07-08T02:05:48.000Z",
                updated_at: "2024-07-08T02:05:48.000Z",
                deleted_at: null,
              },
              {
                id: 16473,
                skill_map_administration_id: 1,
                skill_map_result_id: 1249,
                user_id: 20222,
                skill_id: 2,
                skill_category_id: 1,
                other_skill_name: null,
                answer_option_id: 8,
                comments: null,
                status: "Submitted",
                created_at: "2024-07-08T02:05:48.000Z",
                updated_at: "2024-07-08T02:05:48.000Z",
                deleted_at: null,
              },
              {
                id: 16474,
                skill_map_administration_id: 1,
                skill_map_result_id: 1249,
                user_id: 20222,
                skill_id: null,
                skill_category_id: null,
                other_skill_name: "Next Js",
                answer_option_id: 9,
                comments: null,
                status: "Submitted",
                created_at: "2024-07-08T02:05:48.000Z",
                updated_at: "2024-07-08T02:05:48.000Z",
                deleted_at: null,
              },
            ],
            email_logs: [],
          },
          {
            id: 1250,
            user_id: 20032,
            status: "Ongoing",
            users: {
              id: 20032,
              first_name: "Darwin",
              last_name: "Anor",
              email: "caugis+kh360+danor@nerubia.com",
            },
            skill_map_administration_id: 642,
            skill_map_ratings: [],
            email_logs: [],
          },
        ]),
      })

      await mockRequest(page, "/admin/skill-map-results/latest", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1251,
              skill_map_administration_id: 1,
              status: "Submitted",
              submitted_date: "2024-07-08T10:06:09.000Z",
              users: {
                id: 20222,
                first_name: "Emmalyn",
                last_name: "Acha",
              },
              skill_map_administrations: {
                skill_map_period_end_date: "2021-07-23T00:00:00.000Z",
              },
            },
            {
              id: 1246,
              skill_map_administration_id: 1,
              status: "Submitted",
              submitted_date: "2024-07-05T03:33:53.000Z",
              users: {
                id: 20219,
                first_name: "Chadie Gil",
                last_name: "Augis",
              },
              skill_map_administrations: {
                skill_map_period_end_date: "2021-07-23T00:00:00.000Z",
              },
            },
          ],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            currentPage: 1,
            totalPages: 1,
            totalItems: 2,
          },
        }),
      })

      await mockRequest(page, "/admin/skill-map-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 642,
          name: "s3",
          skill_map_schedule_start_date: "2024-07-03T00:00:00.000Z",
          skill_map_schedule_end_date: "2024-07-11T00:00:00.000Z",
          skill_map_period_start_date: "2022-07-01T00:00:00.000Z",
          skill_map_period_end_date: "2022-07-15T00:00:00.000Z",
          remarks: "Skill Map Description",
          email_subject: "d",
          email_content: "d",
          status: "Ongoing",
          created_by_id: null,
          updated_by_id: null,
          created_at: "2024-07-05T02:56:57.000Z",
          updated_at: "2024-07-05T02:58:00.000Z",
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
        await expect(page.getByText("Period:Jul 1, 2022 to Jul 15, 2022")).toBeVisible()
        await expect(page.getByText("Schedule:Jul 3, 2024 to Jul 11, 2024")).toBeVisible()
      }

      await expect(page.getByRole("heading", { name: "s3" })).toBeVisible()
      if (!isMobile) {
        await expect(page.getByText("Skill Map Period:July 1, 2022 to July 15, 2022")).toBeVisible()
        await expect(
          page.getByText("Skill Map Schedule:July 3, 2024 to July 11, 2024")
        ).toBeVisible()
      }
      await expect(page.getByText("Skill Map Description", { exact: true })).toBeVisible()
      await expect(page.getByRole("heading", { name: "Employees" })).toBeVisible()
      await expect(page.getByTestId("BackButton")).toBeVisible()
      await expect(page.getByText("Augis, Chadie Gil")).toBeVisible()
      await expect(page.getByText("Acha, Emmalyn")).toBeVisible()
      await expect(page.getByText("Anor, Darwin")).toBeVisible()
      await expect(page.locator("span").filter({ hasText: "Ongoing" }).nth(2)).toBeVisible()
      await expect(page.locator("span").filter({ hasText: /^Submitted$/ })).toBeVisible()
      await expect(page.locator("span").filter({ hasText: "Ongoing" }).nth(4)).toBeVisible()
    })
  })
})
