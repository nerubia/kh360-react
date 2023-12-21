import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../utils/setup-playwright"
import { mockRequest } from "../../../utils/mock-request"
import { loginUser } from "../../../utils/login-user"

setupPlaywright()

test.describe("User - My Evaluation Results", () => {
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
    test("should not allow to view my evaluations", async ({ page }) => {
      await page.goto("/my-evaluations/1")

      await expect(page).toHaveURL("/auth/login?callback=/my-evaluations/1")
    })
  })

  test.describe("as Employee", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("employee", page)

      await page.goto("/my-evaluations/1")

      await mockRequest(page, "/my-evaluations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          action_plans: null,
          banding: "Average",
          cm_comments: null,
          comments: ["Wowzie!", "Awe!"],
          created_at: "2023-12-01T07:41:07.000Z",
          created_by_id: 20222,
          employee_comments: null,
          eval_period_end_date: "2023-11-30T00:00:00.000Z",
          eval_period_start_date: "2023-01-01T00:00:00.000Z",
          evaluation_administration_id: 18,
          evaluation_result_details: [
            {
              id: 280,
              template_name: "PM Evaluation",
              total_score: "100",
              score_rating: {
                display_name: "Needs a GPS",
                evaluee_description:
                  "You are on the right track but occasionally take detours.\nYour performance meets some basic expectations but falls short in key areas.\nLike a GPS signal with occasional hiccups, improvement is required to meet all performance expectations.\nGoals and objectives are partially achieved occasionally taking the scenic route.",
                id: 2,
                name: "Fair",
              },
            },
          ],
          id: 67,
          total_score: "100",
          status: "Closed",
          submitted_date: null,
          updated_at: "2023-12-01T07:42:34.000Z",
          updated_by_id: 20222,
          user_id: 20049,
          users: {
            id: 20049,
            email: "eacha+kh360+nardiente@nerubia.com",
            first_name: "Sample",
            last_name: "User",
            picture: null,
            slug: "sample-user",
          },
          score_rating: {
            display_name: "Needs a GPS",
            evaluee_description:
              "You are on the right track but occasionally take detours.\nYour performance meets some basic expectations but falls short in key areas.\nLike a GPS signal with occasional hiccups, improvement is required to meet all performance expectations.\nGoals and objectives are partially achieved occasionally taking the scenic route.",
            id: 2,
            name: "Fair",
          },
        }),
      })

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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByText("User, Sample")).toBeVisible()
      await expect(page.getByText("Jan 1 - Nov 30, 2023")).toBeVisible()
      await expect(page.getByText("Total Score: ")).toBeVisible()
      await expect(page.getByRole("cell", { name: "Evaluations" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Score" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Rating" })).toBeVisible()
      await expect(page.getByText("Detailed Evaluation")).toBeVisible()

      await expect(page.getByRole("cell", { name: "PM Evaluation" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "100%" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Needs a GPS" })).toBeVisible()

      await expect(page.getByText("Comments")).toBeVisible()
      await expect(page.getByText("Wowzie!")).toBeVisible()
      await expect(page.getByText("Awe!")).toBeVisible()

      await expect(page.getByTestId("BackButton")).toBeVisible()
    })

    test("should allow to go back", async ({ page, isMobile }) => {
      await loginUser("employee", page)

      await page.goto("/my-evaluations/1")

      await mockRequest(page, "/my-evaluations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          action_plans: null,
          banding: "Average",
          cm_comments: null,
          comments: ["Wowzie!", "Awe!"],
          created_at: "2023-12-01T07:41:07.000Z",
          created_by_id: 20222,
          employee_comments: null,
          eval_period_end_date: "2023-11-30T00:00:00.000Z",
          eval_period_start_date: "2023-01-01T00:00:00.000Z",
          evaluation_administration_id: 18,
          evaluation_result_details: [
            {
              id: 280,
              template_name: "PM Evaluation",
              total_score: "100",
              score_rating: {
                display_name: "Needs a GPS",
                evaluee_description:
                  "You are on the right track but occasionally take detours.\nYour performance meets some basic expectations but falls short in key areas.\nLike a GPS signal with occasional hiccups, improvement is required to meet all performance expectations.\nGoals and objectives are partially achieved occasionally taking the scenic route.",
                id: 2,
                name: "Fair",
              },
            },
          ],
          id: 67,
          total_score: "100",
          status: "Closed",
          submitted_date: null,
          updated_at: "2023-12-01T07:42:34.000Z",
          updated_by_id: 20222,
          user_id: 20049,
          users: {
            id: 20049,
            email: "eacha+kh360+nardiente@nerubia.com",
            first_name: "Sample",
            last_name: "User",
            picture: null,
            slug: "sample-user",
          },
          score_rating: {
            display_name: "Needs a GPS",
            evaluee_description:
              "You are on the right track but occasionally take detours.\nYour performance meets some basic expectations but falls short in key areas.\nLike a GPS signal with occasional hiccups, improvement is required to meet all performance expectations.\nGoals and objectives are partially achieved occasionally taking the scenic route.",
            id: 2,
            name: "Fair",
          },
        }),
      })

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

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/my-evaluations", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              banding: "Average",
              eval_period_end_date: "2023-11-30T00:00:00.000Z",
              eval_period_start_date: "2023-01-01T00:00:00.000Z",
              eval_schedule_end_date: "2023-12-22T00:00:00.000Z",
              eval_schedule_start_date: "2023-12-01T00:00:00.000Z",
              id: 18,
              name: "Evaluation 11",
              remarks: "Remarks",
              totalEvaluations: 2,
              totalPending: 0,
              totalSubmitted: 2,
            },
          ],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            totalPages: 1,
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
            content:
              "Uh-oh! 🤷‍♂️\n\nLooks like our magical elves are still working their charm behind the scenes, and your results haven't arrived just yet. Don't worry, though – good things come to those who wait!\n\nIn the meantime, why not grab a cup of coffee or practice your superhero pose? 🦸‍♀️ We'll have those results ready for you in no time.\n\nStay tuned and keep the positive vibes flowing! ✨",
            id: 65,
            is_default: true,
            name: "No Available Evaluation Results",
            subject: "",
            template_type: "No Available Evaluation Results",
          }),
        }
      )

      await page.waitForLoadState("networkidle")

      await page.getByTestId("BackButton").click()

      await expect(page).toHaveURL("/my-evaluations")
    })
  })
})
