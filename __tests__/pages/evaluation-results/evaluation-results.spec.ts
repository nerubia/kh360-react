import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../utils/setup-playwright"
import { mockRequest } from "../../utils/mock-request"
import { loginUser } from "../../utils/login-user"

setupPlaywright()

test.describe("CM - Evaluation results", () => {
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
    test("should not allow to view the evaluation results", async ({ page }) => {
      await page.goto("/evaluation-results")

      await expect(page).toHaveURL("/auth/login?callback=/evaluation-results")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the evaluation results", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/evaluation-results")

      await mockRequest(page, "/user/evaluation-administrations", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              name: "Evaluation 1",
              eval_schedule_start_date: "2024-04-06T00:00:00.000Z",
              eval_schedule_end_date: "2023-03-14T00:00:00.000Z",
              eval_period_start_date: "2023-07-22T00:00:00.000Z",
              eval_period_end_date: "2023-09-22T00:00:00.000Z",
              remarks: "This is description",
              status: "ongoing",
              totalEvaluations: 3,
              totalSubmitted: 0,
              totalPending: 3,
            },
            {
              id: 2,
              name: "Evaluation 2",
              eval_schedule_start_date: "2024-04-06T00:00:00.000Z",
              eval_schedule_end_date: "2023-03-14T00:00:00.000Z",
              eval_period_start_date: "2023-07-22T00:00:00.000Z",
              eval_period_end_date: "2023-09-22T00:00:00.000Z",
              remarks: "This is description",
              status: "ongoing",
              totalEvaluations: 3,
              totalSubmitted: 1,
              totalPending: 2,
            },
            {
              id: 3,
              name: "Evaluation 3",
              eval_schedule_start_date: "2024-04-06T00:00:00.000Z",
              eval_schedule_end_date: "2023-03-14T00:00:00.000Z",
              eval_period_start_date: "2023-07-22T00:00:00.000Z",
              eval_period_end_date: "2023-09-22T00:00:00.000Z",
              remarks: "This is description",
              status: "ongoing",
              totalEvaluations: 4,
              totalSubmitted: 2,
              totalPending: 2,
            },
          ],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            totalPages: 1,
          },
        }),
      })

      await mockRequest(page, "/user/email-templates?template_type=No+Pending+Evaluation+Forms", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}),
      })

      await expect(page).toHaveURL("/evaluation-administrations")
    })
  })

  test.describe("as CM", () => {
    test("should render correctly", async ({ page }) => {
      await loginUser("cm", page)

      await page.goto("/evaluation-results")

      await mockRequest(page, "/admin/evaluation-administrations?status=Closed,Published", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              name: "Evaluation 1",
              eval_schedule_start_date: "2024-04-06T00:00:00.000Z",
              eval_schedule_end_date: "2023-03-14T00:00:00.000Z",
              eval_period_start_date: "2023-07-22T00:00:00.000Z",
              eval_period_end_date: "2023-09-22T00:00:00.000Z",
              remarks: null,
              email_subject: "",
              email_content: null,
              status: "closed",
              created_by_id: null,
              updated_by_id: null,
              created_at: "2023-10-17T03:41:43.000Z",
              updated_at: null,
              evaluees_count: 1,
            },
            {
              id: 2,
              name: "Evaluation 2",
              eval_schedule_start_date: "2023-04-12T00:00:00.000Z",
              eval_schedule_end_date: "2024-07-02T00:00:00.000Z",
              eval_period_start_date: "2023-05-10T00:00:00.000Z",
              eval_period_end_date: "2023-10-23T00:00:00.000Z",
              remarks: null,
              email_subject: "",
              email_content: null,
              status: "published",
              created_by_id: null,
              updated_by_id: null,
              created_at: "2023-10-17T03:41:43.000Z",
              updated_at: null,
              evaluees_count: 1,
            },
          ],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            totalPages: 1,
          },
        }),
      })

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
          {
            id: 2,
            name: "Fair",
            display_name: "Needs a GPS",
            min_score: "2",
            max_score: "3.99",
            result_description:
              "Employee is on the right track but occasionally takes detours.\nPerformance meets some basic expectations but falls short in key areas.\nLike a GPS signal with occasional hiccups, improvement is required to meet all performance expectations.\nGoals and objectives are partially achieved occasionally taking the scenic route.",
            evaluee_description:
              "You are on the right track but occasionally takes detours.\nYour performance meets some basic expectations but falls short in key areas.\nLike a GPS signal with occasional hiccups, improvement is required to meet all performance expectations.\nGoals and objectives are partially achieved occasionally taking the scenic route.",
            status: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 3,
            name: "Satisfactory",
            display_name: "Smooth Sailing",
            min_score: "4",
            max_score: "5.99",
            result_description:
              "Employee navigates job responsibilities with ease, performing consistently and meeting the established expectations.\nLike a well-oiled machine, goals and objectives are typically reached.\nEmployee fulfills job responsibilities adequately.\nGoals and objectives are generally met.",
            evaluee_description:
              "You navigate job responsibilities with ease, performing consistently and meeting the established expectations.\nLike a well-oiled machine, goals and objectives are typically reached.\nYou fulfill job responsibilities adequately.\nGoals and objectives are generally met.",
            status: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 4,
            name: "Good",
            display_name: "Rocket Booster",
            min_score: "6",
            max_score: "7.99",
            result_description:
              "Employee's performance is out of this world, reaching new heights.\nLike a rocket with booster engines, employee demonstrates exceptional skills and achievements in various aspects of the job.\nGoals and objectives are consistently surpassed on a trajectory toward the stars.",
            evaluee_description:
              "Your performance is out of this world, reaching new heights.\nLike a rocket with booster engines, you demonstrate exceptional skills and achievements in various aspects of the job.\nGoals and objectives are consistently surpassed on a trajectory toward the stars.",
            status: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 5,
            name: "Excellent",
            display_name: "Unicorn Status",
            min_score: "8",
            max_score: "10",
            result_description:
              "Employee is as rare and magical as a unicorn, consistently exceeding expectations.\nLike finding a four-leaf clover, outstanding achievements are consistently realized.\nEmployee consistently demonstrates exceptional skills, innovation, and leadership.\nGoals and objectives are consistently exceeded with outstanding results.",
            evaluee_description:
              "You are as rare and magical as a unicorn, consistently exceeding expectations.\nLike finding a four-leaf clover, outstanding achievements are consistently realized.\nYou consistently demonstrate exceptional skills, innovation, and leadership.\nGoals and objectives are consistently exceeded with outstanding results.",
            status: null,
            created_at: null,
            updated_at: null,
          },
        ]),
      })

      await mockRequest(page, "/user/evaluation-results", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              score: "10",
              status: "Completed",
              score_ratings: {
                id: 5,
                display_name: "Unicorn Status",
              },
              zscore: "50",
              banding: "Average",
              users: {
                id: 20049,
                slug: "first-user",
                first_name: "First",
                last_name: "User",
                picture: null,
              },
              evaluation_administration: {
                id: 1,
                name: "AA",
                eval_schedule_start_date: "2023-12-01T00:00:00.000Z",
                eval_schedule_end_date: "2023-12-31T00:00:00.000Z",
                eval_period_start_date: "2023-01-01T00:00:00.000Z",
                eval_period_end_date: "2023-11-30T00:00:00.000Z",
                remarks: "AA",
                email_subject: "Request for Evaluation",
                email_content: "",
                status: "Closed",
                created_by_id: null,
                updated_by_id: null,
                created_at: null,
                updated_at: null,
              },
            },
            {
              id: 2,
              score: "9",
              status: "Completed",
              score_ratings: {
                id: 5,
                display_name: "Unicorn Status",
              },
              zscore: "0",
              banding: "Average",
              users: {
                id: 20050,
                slug: "second-user",
                first_name: "Second",
                last_name: "User",
                picture: null,
              },
              evaluation_administration: {
                id: 2,
                name: "BB",
                eval_schedule_start_date: "2023-12-01T00:00:00.000Z",
                eval_schedule_end_date: "2023-12-31T00:00:00.000Z",
                eval_period_start_date: "2023-01-01T00:00:00.000Z",
                eval_period_end_date: "2023-11-30T00:00:00.000Z",
                remarks: "BB",
                email_subject: "[TEST] Request for Evaluation",
                email_content: "",
                status: "Closed",
                created_by_id: null,
                updated_by_id: null,
                created_at: null,
                updated_at: null,
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

      await expect(page.getByRole("heading", { name: "Evaluation Results" })).toBeVisible()

      await expect(page.getByText("Name", { exact: true })).toBeVisible()
      await expect(page.getByText("Evaluation Administration")).toBeVisible()
      await expect(page.getByText("Rating", { exact: true })).toBeVisible()
      await expect(page.locator("label").filter({ hasText: "Banding" })).toBeVisible()
      await expect(page.getByText("Sort by")).toBeVisible()

      await expect(page.getByRole("button", { name: "Search" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Clear" })).toBeVisible()

      await expect(page.getByRole("cell", { name: "Evaluee Name" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Eval Admin Name" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Eval Period" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Score", exact: true })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Standard Score" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Banding" })).toBeVisible()

      await expect(page.getByRole("cell", { name: "User, First" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "User, Second" })).toBeVisible()
    })
  })
})
