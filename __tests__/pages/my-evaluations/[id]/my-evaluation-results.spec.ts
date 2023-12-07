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
              score: "1",
              zscore: "0",
              banding: "Average",
              template_name: "PM Evaluation",
            },
          ],
          id: 67,
          score: "1.88",
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
          zscore: "0",
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("heading", { name: "Evaluation Results" })).toBeVisible()
      await expect(page.getByText("Name: User, Sample")).toBeVisible()
      await expect(page.getByText("Evaluation Period: Jan 1 - Nov 30, 2023")).toBeVisible()
      await expect(page.getByText("Status: Closed")).toBeVisible()
      await expect(page.getByText("Evaluation Scores")).toBeVisible()
      await expect(page.getByRole("cell", { name: "Evaluation", exact: true })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Standard Score", exact: true })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Banding", exact: true })).toBeVisible()

      await expect(page.getByRole("cell", { name: "PM Evaluation" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "1.00" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "0.00" }).first()).toBeVisible()

      await expect(page.getByRole("cell", { name: "Total Weighted Score:" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "1.88" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "0" }).nth(1)).toBeVisible()

      await expect(page.getByText("Comments from Evaluators")).toBeVisible()
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
              score: "1",
              zscore: "0",
              banding: "Average",
              template_name: "PM Evaluation",
            },
          ],
          id: 67,
          score: "1.88",
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
          zscore: "0",
        }),
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
