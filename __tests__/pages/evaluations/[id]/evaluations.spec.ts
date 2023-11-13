import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../utils/setupPlaywright"
import { mockRequest } from "../../../utils/mockRequest"
import { loginUser } from "../../../utils/loginUser"

setupPlaywright()

test.describe("User - Evaluations", () => {
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
    test("should not allow to view the evaluations", async ({ page }) => {
      await page.goto("/evaluation-administrations/1/evaluations/1")

      await expect(page).toHaveURL("/auth/login")
    })
  })

  test.describe("as Employee", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("employee", page)

      await page.goto("/evaluation-administrations/1/evaluations/1")

      await mockRequest(
        page,
        "/user/evaluations?evaluation_administration_id=1&for_evaluation=1",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 1,
              comments: "Comment 1",
              eval_start_date: "2023-01-01T00:00:00.000Z",
              eval_end_date: "2023-10-15T00:00:00.000Z",
              percent_involvement: "50",
              status: "Ongoing",
              for_evaluation: true,
              evaluator: {
                id: 20222,
                first_name: "Evaluator",
                last_name: "User",
              },
              evaluee: {
                id: 5,
                slug: "sample-user",
                first_name: "Evaluee",
                last_name: "User",
                picture: null,
              },
              project: {
                id: 42,
                name: "Sample Project",
              },
              project_role: {
                id: 3,
                name: "Project Manager",
                short_name: "PM",
              },
            },
          ]),
        }
      )

      await mockRequest(
        page,
        "/user/evaluation-template-contents?evaluation_id=1",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 14,
              name: "PM Skillset",
              description:
                "Manage overall team in terms of cost, schedule and quality, how organized PM is",
              eval_start_date: "2023-01-01T00:00:00.000Z",
              eval_end_date: "2023-10-15T00:00:00.000Z",
              evaluationRating: {
                id: 84,
                answer_option_id: 5,
                ratingSequenceNumber: 5,
              },
              answerId: 1,
              answerOptions: [
                {
                  id: 1,
                  sequence_no: 1,
                },
                {
                  id: 2,
                  sequence_no: 2,
                },
                {
                  id: 3,
                  sequence_no: 3,
                },
                {
                  id: 4,
                  sequence_no: 4,
                },
                {
                  id: 5,
                  sequence_no: 5,
                },
                {
                  id: 6,
                  sequence_no: 6,
                },
              ],
            },
          ]),
        }
      )

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(
        page.getByRole("heading", { name: "Evaluations" })
      ).toBeVisible()
      await expect(
        page.getByRole("link", {
          name: "User, Evaluee Ongoing Sample Project [PM]",
        })
      ).toBeVisible()
      await expect(
        page.getByText("Project Assignment Duration(2023-01-01 to 2023-10-15)")
      ).toBeVisible()
      await expect(
        page.getByRole("heading", { name: "PM Skillset" })
      ).toBeVisible()
      await expect(
        page.getByText(
          "Manage overall team in terms of cost, schedule and quality, how organized PM is"
        )
      ).toBeVisible()
      await expect(
        page.getByRole("heading", { name: "Comments" })
      ).toBeVisible()

      await expect(page.getByText("Evaluation description/notes")).toBeVisible()
      await expect(page.getByPlaceholder("Comments")).toBeVisible()
      await expect(page.getByTestId("OptionButton1")).toBeVisible()
      await expect(page.getByTestId("OptionButton2")).toBeVisible()
      await expect(page.getByTestId("OptionButton3")).toBeVisible()
      await expect(page.getByTestId("OptionButton4")).toBeVisible()
      await expect(page.getByTestId("OptionButton5")).toBeVisible()
      await expect(page.getByTestId("OptionButton6")).toBeVisible()
    })

    test("should show validation errors", async ({ page, isMobile }) => {
      await loginUser("employee", page)

      await page.goto("/evaluation-administrations/1/evaluations/1")

      await mockRequest(
        page,
        "/user/evaluations?evaluation_administration_id=1&for_evaluation=1",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 1,
              comments: "",
              eval_start_date: "2023-01-01T00:00:00.000Z",
              eval_end_date: "2023-10-15T00:00:00.000Z",
              percent_involvement: "50",
              status: "Ongoing",
              for_evaluation: true,
              evaluator: {
                id: 20222,
                first_name: "Evaluator",
                last_name: "User",
              },
              evaluee: {
                id: 5,
                slug: "sample-user",
                first_name: "Evaluee",
                last_name: "User",
                picture: null,
              },
              project: {
                id: 42,
                name: "Sample Project",
              },
              project_role: {
                id: 3,
                name: "Project Manager",
                short_name: "PM",
              },
            },
          ]),
        }
      )

      await mockRequest(
        page,
        "/user/evaluation-template-contents?evaluation_id=1",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 14,
              name: "PM Skillset",
              description:
                "Manage overall team in terms of cost, schedule and quality, how organized PM is",
              eval_start_date: "2023-01-01T00:00:00.000Z",
              eval_end_date: "2023-10-15T00:00:00.000Z",
              evaluationRating: {
                id: 84,
                answer_option_id: 5,
                ratingSequenceNumber: 2,
              },
              answerId: 1,
              answerOptions: [
                {
                  id: 1,
                  sequence_no: 1,
                },
                {
                  id: 2,
                  sequence_no: 2,
                },
                {
                  id: 3,
                  sequence_no: 3,
                },
                {
                  id: 4,
                  sequence_no: 4,
                },
                {
                  id: 5,
                  sequence_no: 5,
                },
                {
                  id: 6,
                  sequence_no: 6,
                },
              ],
            },
          ]),
        }
      )

      await mockRequest(page, "/user/evaluations/1/submit-evaluation", {
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Comment is required.",
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Submit" }).click()

      await expect(page.getByText("Comment is required")).toBeVisible()
    })
  })
})
