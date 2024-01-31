import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

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

      await expect(page).toHaveURL(
        "/auth/login?callback=/evaluation-administrations/1/evaluations/1"
      )
    })
  })

  test.describe("as Employee", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("employee", page)

      await mockRequest(
        page,
        "/user/email-templates?template_type=Evaluation+Complete+Thank+You+Message",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({}),
        }
      )

      await page.goto("/evaluation-administrations/1/evaluations/1")

      await mockRequest(page, "/user/evaluations?evaluation_administration_id=1&for_evaluation=1", {
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
      })

      await mockRequest(page, "/user/evaluation-template-contents?evaluation_id=1", {
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
      })

      await mockRequest(page, "/user/rating-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 2,
            name: "Performance Evaluation NA Rating - Ninja",
            template_type: "Performance Evaluation NA Rating",
            is_default: false,
            subject: "🤷‍♂️ Whoa, N.A. Ninja! 🤷‍♀️",
            content:
              "Looks like we&apos;ve hit the Not Applicable zone! &#128640; No worries, we&apos;re all",
            created_by_id: null,
            updated_by_id: null,
            created_at: null,
            updated_at: null,
          },
        ]),
      })

      await mockRequest(
        page,
        "/user/email-templates?template_type=Evaluation+Complete+Thank+You+Message",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 2,
              name: "Evaluation Completed 🎉",
              template_type: "Performance Evaluation NA Rating",
              is_default: true,
              subject: "Evaluation Completed 🎉",
              content:
                "Thank you for completing the evaluation form! Your feedback is invaluable to us. 🌟",
              created_by_id: null,
              updated_by_id: null,
              created_at: null,
              updated_at: null,
            },
          ]),
        }
      )

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("heading", { name: "Evaluations" })).toBeVisible()
      if (!isMobile) {
        await expect(
          page.getByRole("button", {
            name: "User, Evaluee ONGOING Sample Project [PM]",
          })
        ).toBeVisible()
      }
      await expect(page.getByTestId("Avatar")).toBeVisible()
      if (isMobile) {
        await expect(page.getByTestId("BadgeStatus")).toBeVisible()
      }
      await expect(page.getByText("User, Evaluee").nth(0)).toBeVisible()
      await expect(page.getByText("User, Evaluee").nth(1)).toBeVisible()
      await expect(page.getByText("Sample Project [PM]").nth(1)).toBeVisible()
      await expect(page.getByText("Evaluation Period: Jan 1 - Oct 15, 2023")).toBeVisible()
      await expect(page.getByRole("heading", { name: "PM Skillset" })).toBeVisible()
      await expect(
        page.getByText(
          "Manage overall team in terms of cost, schedule and quality, how organized PM is"
        )
      ).toBeVisible()
      await expect(page.getByRole("heading", { name: "Comments" })).toBeVisible()

      await expect(page.getByPlaceholder("Comments")).toBeVisible()
      await expect(page.getByTestId("OptionButton1")).toBeVisible()
      await expect(page.getByTestId("OptionButton2")).toBeVisible()
      await expect(page.getByTestId("OptionButton3")).toBeVisible()
      await expect(page.getByTestId("OptionButton4")).toBeVisible()
      await expect(page.getByTestId("OptionButton5")).toBeVisible()
      await expect(page.getByTestId("OptionButton6")).toBeVisible()

      const saveButton = page.getByRole("button", { name: "Save", exact: true })
      await saveButton.waitFor({ state: "visible" })
      const isSaveButtonDisabled: boolean = await saveButton.isDisabled()
      if (!isSaveButtonDisabled) {
        await saveButton.click()
      }

      const saveSubmit = page.getByRole("button", { name: "Save & Submit", exact: true })
      await saveSubmit.waitFor({ state: "visible" })
      await saveSubmit.click()

      const requestToRemove = page.getByRole("button", { name: "Request to Remove", exact: true })
      await requestToRemove.waitFor({ state: "visible" })
    })

    test("should show validation errors", async ({ page, isMobile }) => {
      await loginUser("employee", page)

      await mockRequest(
        page,
        "/user/email-templates?template_type=Evaluation+Complete+Thank+You+Message",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({}),
        }
      )

      await page.goto("/evaluation-administrations/1/evaluations/1")

      await mockRequest(page, "/user/evaluations?evaluation_administration_id=1&for_evaluation=1", {
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
      })

      await mockRequest(page, "/user/evaluation-template-contents?evaluation_id=1", {
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
      })

      await mockRequest(page, "/user/rating-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 2,
            name: "Performance Evaluation NA Rating - Ninja",
            template_type: "Performance Evaluation NA Rating",
            is_default: false,
            subject: "🤷‍♂️ Whoa, N.A. Ninja! 🤷‍♀️",
            content:
              "Looks like we&apos;ve hit the Not Applicable zone! &#128640; No worries, we&apos;re all",
            created_by_id: null,
            updated_by_id: null,
            created_at: null,
            updated_at: null,
          },
        ]),
      })

      await mockRequest(
        page,
        "/user/email-templates?template_type=Evaluation+Complete+Thank+You+Message",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 2,
              name: "Evaluation Completed 🎉",
              template_type: "Performance Evaluation NA Rating",
              is_default: true,
              subject: "Evaluation Completed 🎉",
              content:
                "Thank you for completing the evaluation form! Your feedback is invaluable to us. 🌟",
              created_by_id: null,
              updated_by_id: null,
              created_at: null,
              updated_at: null,
            },
          ]),
        }
      )

      await mockRequest(page, "/user/evaluations/1/save-answers", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          comment: "",
          id: "1",
          status: "Ongoing",
        }),
      })

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
      if (!isMobile) {
        await page.getByRole("button", { name: "Submit" }).click()
        await page.getByRole("button", { name: "Yes" }).click()
        await expect(page.getByText("Comment is required")).toBeVisible()
      }
    })

    test("should allow to go back", async ({ page, isMobile }) => {
      await loginUser("employee", page)

      await mockRequest(
        page,
        "/user/email-templates?template_type=Evaluation+Complete+Thank+You+Message",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({}),
        }
      )

      await page.goto("/evaluation-administrations/1/evaluations/1")

      await mockRequest(page, "/user/evaluations?evaluation_administration_id=1&for_evaluation=1", {
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
      })

      await mockRequest(page, "/user/evaluation-template-contents?evaluation_id=1", {
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
      })

      await mockRequest(page, "/user/rating-templates", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 2,
            name: "Performance Evaluation NA Rating - Ninja",
            template_type: "Performance Evaluation NA Rating",
            is_default: false,
            subject: "🤷‍♂️ Whoa, N.A. Ninja! 🤷‍♀️",
            content:
              "Looks like we&apos;ve hit the Not Applicable zone! &#128640; No worries, we&apos;re all",
            created_by_id: null,
            updated_by_id: null,
            created_at: null,
            updated_at: null,
          },
        ]),
      })

      await mockRequest(
        page,
        "/user/email-templates?template_type=Evaluation+Complete+Thank+You+Message",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 2,
              name: "Evaluation Completed 🎉",
              template_type: "Performance Evaluation NA Rating",
              is_default: true,
              subject: "Evaluation Completed 🎉",
              content:
                "Thank you for completing the evaluation form! Your feedback is invaluable to us. 🌟",
              created_by_id: null,
              updated_by_id: null,
              created_at: null,
              updated_at: null,
            },
          ]),
        }
      )

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("link").nth(2).click()

      await mockRequest(page, "/user/evaluation-administrations", {
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

      await mockRequest(page, "/user/email-templates?template_type=No+Pending+Evaluation+Forms", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}),
      })

      await expect(page).toHaveURL("/evaluation-administrations")
    })
  })
})
