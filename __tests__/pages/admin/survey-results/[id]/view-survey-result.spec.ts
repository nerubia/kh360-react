import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("Admin - View survey result", () => {
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
    test("should not allow to view the survey result", async ({ page }) => {
      await page.goto("/admin/survey-results/1")

      await expect(page).toHaveURL("/auth/login?callback=/admin/survey-results/1")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the survey result", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/survey-results/1")

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

      await page.goto("/admin/survey-results/1")

      await mockRequest(page, "/admin/survey-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Test 1",
          survey_start_date: "2024-07-09T00:00:00.000Z",
          survey_end_date: "2024-07-10T00:00:00.000Z",
          survey_template_id: 2,
          remarks: "Test",
          email_subject: "test",
          email_content: "test",
          status: "Closed",
          created_by_id: null,
          updated_by_id: null,
          created_at: "2024-07-09T08:35:43.000Z",
          updated_at: "2024-07-10T01:32:00.000Z",
          deleted_at: null,
        }),
      })

      await mockRequest(page, "/admin/survey-results/by-respondent?survey_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          surveyResults: [
            {
              id: 1,
              user_id: 1,
              external_respondent_id: null,
              status: "No Result",
              users: {
                id: 1,
                first_name: "John",
                last_name: "Doe",
                email: "john@gmail.com",
              },
              survey_administration_id: 1,
              survey_answers: [],
            },
          ],
          companionResults: [],
        }),
      })

      await mockRequest(page, "/admin/survey-results/by-answer?survey_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            user_id: 1,
            survey_administration_id: 1,
            survey_template_answer_id: 1,
            survey_template_question_id: 1,
            external_user_id: 1,
            survey_template_answers: {
              id: 1,
              survey_template_id: 2,
              survey_template_question_id: 1,
              survey_template_category_id: 1,
              sequence_no: 1,
              answer_text: "Katsu-ju",
              answer_description: "Pork cutlet and egg",
              amount: 510,
              answer_image: "1-katsu-ju.png",
              is_active: true,
              created_by_id: 5,
              updated_by_id: 5,
              created_at: "2024-03-28T05:00:52.000Z",
              updated_at: "2024-03-28T05:00:52.000Z",
              deleted_at: null,
              survey_template_categories: {
                id: 1,
                survey_template_id: 2,
                name: "Donburi (Rice Bowls)",
                sequence_no: 1,
                category_type: "answer",
                description: null,
                status: true,
                created_at: "2024-03-27T07:10:37.000Z",
                updated_at: "2024-03-27T07:10:37.000Z",
              },
            },
            totalCount: 1,
            subTotal: 510,
            users: [],
            companion_users: [
              {
                id: 1,
                email: "",
                first_name: "B",
                middle_name: "B",
                last_name: "B",
                role: null,
                company: null,
                access_token: "f49a1ce7-400f-43a7-a139-71631e05393a",
                deleted_at: null,
                related_user: {
                  id: 1,
                  email: "john@gmail.com",
                  first_name: "John",
                  last_name: "Doe",
                  slug: "john-doe",
                  picture: null,
                },
              },
            ],
          },
        ]),
      })

      await mockRequest(page, "/admin/survey-template-questions/all?survey_template_id=2", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            sequence_no: 1,
            question_text:
              "Please select what you would like to order from Nonki for dinner. You can select multiple items from the menu up to a total of Php1,000.",
            question_type: "MCQ-limit-sum",
            is_active: true,
            is_required: true,
            survey_template_question_rules: [
              {
                id: 1,
                survey_template_id: 2,
                survey_template_question_id: 1,
                rule_key: "max_limit",
                rule_value: "1000",
                remarks: "This is the budget for the dinner.",
                is_active: true,
                created_by_id: 5,
                updated_by_id: 5,
                created_at: "2024-03-25T10:36:13.000Z",
                updated_at: "2024-03-25T10:36:13.000Z",
                deleted_at: null,
              },
            ],
          },
        ]),
      })

      await page.waitForLoadState("networkidle")

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("heading", { name: "Survey Results" })).toBeVisible()

      await expect(page.getByText("Test 1")).toBeVisible()
      if (isMobile) {
        await expect(page.getByText("Schedule:Jul 9, 2024 to Jul 10, 2024")).toBeVisible()
      } else {
        await expect(page.getByText("Survey Schedule:July 9, 2024 to July 10, 2024")).toBeVisible()
      }
      await expect(page.getByText("Test", { exact: true })).toBeVisible()

      await expect(page.getByRole("button", { name: "By Respondent" })).toBeVisible()
      await expect(page.getByRole("button", { name: "By Answer" })).toBeVisible()

      await expect(page.getByRole("columnheader", { name: "ID" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Name" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Status" })).toBeVisible()
      await expect(page.getByText("Question 1")).toBeVisible()

      await expect(page.getByRole("cell", { name: "1" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Doe, John" })).toBeVisible()
      await expect(page.getByText("No Result")).toBeVisible()
      await expect(page.getByText("No answer")).toBeVisible()

      await expect(page.getByTestId("BackButton")).toBeVisible()
    })

    test("should render correctly by answer", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/survey-results/1")

      await mockRequest(page, "/admin/survey-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Test 1",
          survey_start_date: "2024-07-09T00:00:00.000Z",
          survey_end_date: "2024-07-10T00:00:00.000Z",
          survey_template_id: 2,
          remarks: "Test",
          email_subject: "test",
          email_content: "test",
          status: "Closed",
          created_by_id: null,
          updated_by_id: null,
          created_at: "2024-07-09T08:35:43.000Z",
          updated_at: "2024-07-10T01:32:00.000Z",
          deleted_at: null,
        }),
      })

      await mockRequest(page, "/admin/survey-results/by-respondent?survey_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          surveyResults: [
            {
              id: 1,
              user_id: 1,
              external_respondent_id: null,
              status: "No Result",
              users: {
                id: 1,
                first_name: "John",
                last_name: "Doe",
                email: "john@gmail.com",
              },
              survey_administration_id: 1,
              survey_answers: [],
            },
          ],
          companionResults: [],
        }),
      })

      await mockRequest(page, "/admin/survey-results/by-answer?survey_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            user_id: 1,
            survey_administration_id: 1,
            survey_template_answer_id: 1,
            survey_template_question_id: 1,
            external_user_id: 1,
            survey_template_answers: {
              id: 1,
              survey_template_id: 2,
              survey_template_question_id: 1,
              survey_template_category_id: 1,
              sequence_no: 1,
              answer_text: "Katsu-ju",
              answer_description: "Pork cutlet and egg",
              amount: 510,
              answer_image: "1-katsu-ju.png",
              is_active: true,
              created_by_id: 5,
              updated_by_id: 5,
              created_at: "2024-03-28T05:00:52.000Z",
              updated_at: "2024-03-28T05:00:52.000Z",
              deleted_at: null,
              survey_template_categories: {
                id: 1,
                survey_template_id: 2,
                name: "Donburi (Rice Bowls)",
                sequence_no: 1,
                category_type: "answer",
                description: null,
                status: true,
                created_at: "2024-03-27T07:10:37.000Z",
                updated_at: "2024-03-27T07:10:37.000Z",
              },
            },
            totalCount: 1,
            subTotal: 510,
            users: [],
            companion_users: [
              {
                id: 1,
                email: "",
                first_name: "B",
                middle_name: "B",
                last_name: "B",
                role: null,
                company: null,
                access_token: "f49a1ce7-400f-43a7-a139-71631e05393a",
                deleted_at: null,
                related_user: {
                  id: 1,
                  email: "john@gmail.com",
                  first_name: "John",
                  last_name: "Doe",
                  slug: "john-doe",
                  picture: null,
                },
              },
            ],
          },
        ]),
      })

      await mockRequest(page, "/admin/survey-template-questions/all?survey_template_id=2", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            sequence_no: 1,
            question_text:
              "Please select what you would like to order from Nonki for dinner. You can select multiple items from the menu up to a total of Php1,000.",
            question_type: "MCQ-limit-sum",
            is_active: true,
            is_required: true,
            survey_template_question_rules: [
              {
                id: 1,
                survey_template_id: 2,
                survey_template_question_id: 1,
                rule_key: "max_limit",
                rule_value: "1000",
                remarks: "This is the budget for the dinner.",
                is_active: true,
                created_by_id: 5,
                updated_by_id: 5,
                created_at: "2024-03-25T10:36:13.000Z",
                updated_at: "2024-03-25T10:36:13.000Z",
                deleted_at: null,
              },
            ],
          },
        ]),
      })

      await page.waitForLoadState("networkidle")

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("heading", { name: "Survey Results" })).toBeVisible()

      await page.getByRole("button", { name: "By Answer" }).click()

      await expect(page.getByRole("columnheader", { name: "Category" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Item" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Quantity" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Price" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Subtotal" })).toBeVisible()
      await expect(page.getByText("Details")).toBeVisible()

      await expect(page.getByRole("cell", { name: "Donburi (Rice Bowls)" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Katsu-ju" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "1", exact: true })).toBeVisible()
      await expect(page.getByRole("cell", { name: "510" }).first()).toBeVisible()
      await expect(page.getByRole("cell", { name: "510" }).nth(1)).toBeVisible()
      await expect(page.getByText("Overall Total: ₱510")).toBeVisible()

      await expect(page.getByTestId("BackButton")).toBeVisible()
    })
  })
})
