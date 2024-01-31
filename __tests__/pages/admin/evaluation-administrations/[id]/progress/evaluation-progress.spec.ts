import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("Admin - Evaluation Progress", () => {
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
    test("should not allow to view the admin evaluation progress", async ({ page }) => {
      await page.goto("/admin/evaluation-administrations/1/progress")

      await expect(page).toHaveURL(
        "/auth/login?callback=/admin/evaluation-administrations/1/progress"
      )
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the admin evaluation progress", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/evaluation-administrations/1/progress")

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

      await page.goto("/admin/evaluation-administrations/1/progress")

      await mockRequest(page, "/admin/evaluation-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Evaluation 1",
          eval_schedule_start_date: "2024-01-01T00:00:00.000Z",
          eval_schedule_end_date: "2024-01-03T00:00:00.000Z",
          eval_period_start_date: "2023-01-01T00:00:00.000Z",
          eval_period_end_date: "2023-12-31T00:00:00.000Z",
          remarks: "Remarks 1",
          email_subject: "Subject 1",
          email_content: "Content 1",
          status: "Pending",
        }),
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/evaluators", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            email: "johndoe@email.com",
            first_name: "John",
            id: 1,
            last_name: "Doe",
            picture: null,
            slug: "john-doe",
            totalEvaluations: 4,
            totalSubmitted: 2,
          },
          {
            email: "janedoe@email.com",
            first_name: "Jane",
            id: 2,
            last_name: "Doe",
            picture: null,
            slug: "Jane-doe",
            totalEvaluations: 2,
            totalSubmitted: 2,
          },
        ]),
      })

      await mockRequest(
        page,
        "/admin/evaluations?evaluation_administration_id=1&for_evaluation=true&evaluator_id=2",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 1,
              eval_start_date: "2023-10-16T00:00:00.000Z",
              eval_end_date: "2023-12-31T00:00:00.000Z",
              percent_involvement: "75",
              comments: "Sample comment",
              evaluee: {
                email: "sample@example.com",
                first_name: "First",
                id: 2,
                last_name: "Evaluee",
                picture: null,
                slug: "sample-evaluee-first",
              },
              project: {
                name: "iAssess",
              },
              project_role: {
                name: "Developer",
              },
              template: {
                id: 5,
                display_name: "Peer Evaluation",
                evaluator_role_id: 5,
                evaluee_role_id: 5,
                is_active: true,
                name: "DEV Evaluation by Dev Peers",
                rate: "20",
                template_class: "Internal",
                template_type: "Project Evaluation",
                updated_at: null,
                with_recommendation: false,
              },
              status: "Ongoing",
              for_evaluation: true,
              is_external: false,
              external_evaluator_id: null,
            },
            {
              id: 2,
              eval_start_date: "2023-01-01T00:00:00.000Z",
              eval_end_date: "2023-10-15T00:00:00.000Z",
              percent_involvement: "100",
              evaluee: {
                email: "sample2@example.com",
                first_name: "Second",
                id: 3,
                last_name: "Evaluee",
                picture: null,
                slug: "sample-evaluee-second",
              },
              project: {
                name: "ProductHQ",
              },
              project_role: {
                name: "Developer",
              },
              template: {
                id: 5,
                display_name: "Peer Evaluation",
                evaluator_role_id: 5,
                evaluee_role_id: 5,
                is_active: true,
                name: "DEV Evaluation by Dev Peers",
                rate: "20",
                template_class: "Internal",
                template_type: "Project Evaluation",
                updated_at: null,
                with_recommendation: false,
              },
              status: "Ongoing",
              for_evaluation: true,
              is_external: false,
              external_evaluator_id: null,
            },
            {
              id: 3,
              eval_start_date: "2023-01-01T00:00:00.000Z",
              eval_end_date: "2023-10-15T00:00:00.000Z",
              percent_involvement: "100",
              evaluee: {
                email: "sample3@example.com",
                first_name: "Third",
                id: 4,
                last_name: "Evaluee",
                picture: null,
                slug: "sample-evaluee-third",
              },
              project: {
                name: "ProductHQ",
              },
              project_role: {
                name: "Developer",
              },
              template: {
                id: 5,
                display_name: "Peer Evaluation",
                evaluator_role_id: 5,
                evaluee_role_id: 5,
                is_active: true,
                name: "DEV Evaluation by Dev Peers",
                rate: "20",
                template_class: "Internal",
                template_type: "Project Evaluation",
                updated_at: null,
                with_recommendation: false,
              },
              status: "Ongoing",
              for_evaluation: true,
              is_external: false,
              external_evaluator_id: null,
            },
          ]),
        }
      )

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("heading", { name: "Evaluation Progress" })).toBeVisible()
      await expect(page.getByText("Evaluation 1")).toBeVisible()
      await expect(page.getByText("Pending")).toBeVisible()
      if (!isMobile) {
        await expect(page.getByText("Evaluation Period: ")).toBeVisible()
        await expect(page.getByText("January 1, 2023 to December 31, 2023")).toBeVisible()
        await expect(page.getByText("Evaluation Schedule: ")).toBeVisible()
        await expect(page.getByText("January 1, 2024 to January 3, 2024")).toBeVisible()
      } else {
        await expect(page.getByText("Period: ")).toBeVisible()
        await expect(page.getByText("Jan 1, 2023 to Dec 31, 2023")).toBeVisible()
        await expect(page.getByText("Schedule: ")).toBeVisible()
        await expect(page.getByText("Jan 1, 2024 to Jan 3, 2024")).toBeVisible()
      }
      await expect(page.getByRole("button", { name: "Description:" })).toBeVisible()
      await expect(page.getByRole("heading", { name: "Evaluators" })).toBeVisible()

      await expect(page.getByRole("button", { name: "Doe, Jane" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Doe, John" })).toBeVisible()

      await page.getByRole("button", { name: "Doe, Jane" }).click()

      await expect(page.getByRole("cell", { name: "Evaluee", exact: true })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Template" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Project" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Role" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Status" })).toBeVisible()
    })

    test("should allow to go back", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/progress")

      await mockRequest(page, "/admin/evaluation-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Evaluation 1",
          eval_schedule_start_date: "2024-01-01T00:00:00.000Z",
          eval_schedule_end_date: "2024-01-03T00:00:00.000Z",
          eval_period_start_date: "2023-01-01T00:00:00.000Z",
          eval_period_end_date: "2023-12-31T00:00:00.000Z",
          remarks: "Remarks 1",
          email_subject: "Subject 1",
          email_content: "Content 1",
          status: "Pending",
        }),
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/evaluators", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            email: "johndoe@email.com",
            first_name: "John",
            id: 1,
            last_name: "Doe",
            picture: null,
            slug: "john-doe",
            totalEvaluations: 4,
            totalSubmitted: 2,
          },
          {
            email: "janedoe@email.com",
            first_name: "Jane",
            id: 1,
            last_name: "Doe",
            picture: null,
            slug: "Jane-doe",
            totalEvaluations: 2,
            totalSubmitted: 2,
          },
        ]),
      })

      await mockRequest(
        page,
        "/admin/evaluations?evaluation_administration_id=1&for_evaluation=true&evaluator_id=2",
        {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: 1,
              eval_start_date: "2023-10-16T00:00:00.000Z",
              eval_end_date: "2023-12-31T00:00:00.000Z",
              percent_involvement: "75",
              comments: "Sample comment",
              evaluee: {
                email: "sample@example.com",
                first_name: "First",
                id: 2,
                last_name: "Evaluee",
                picture: null,
                slug: "sample-evaluee-first",
              },
              project: {
                name: "iAssess",
              },
              project_role: {
                name: "Developer",
              },
              template: {
                id: 5,
                display_name: "Peer Evaluation",
                evaluator_role_id: 5,
                evaluee_role_id: 5,
                is_active: true,
                name: "DEV Evaluation by Dev Peers",
                rate: "20",
                template_class: "Internal",
                template_type: "Project Evaluation",
                updated_at: null,
                with_recommendation: false,
              },
              status: "Ongoing",
              for_evaluation: true,
              is_external: false,
              external_evaluator_id: null,
            },
            {
              id: 2,
              eval_start_date: "2023-01-01T00:00:00.000Z",
              eval_end_date: "2023-10-15T00:00:00.000Z",
              percent_involvement: "100",
              evaluee: {
                email: "sample2@example.com",
                first_name: "Second",
                id: 3,
                last_name: "Evaluee",
                picture: null,
                slug: "sample-evaluee-second",
              },
              project: {
                name: "ProductHQ",
              },
              project_role: {
                name: "Developer",
              },
              template: {
                id: 5,
                display_name: "Peer Evaluation",
                evaluator_role_id: 5,
                evaluee_role_id: 5,
                is_active: true,
                name: "DEV Evaluation by Dev Peers",
                rate: "20",
                template_class: "Internal",
                template_type: "Project Evaluation",
                updated_at: null,
                with_recommendation: false,
              },
              status: "Ongoing",
              for_evaluation: true,
              is_external: false,
              external_evaluator_id: null,
            },
            {
              id: 3,
              eval_start_date: "2023-01-01T00:00:00.000Z",
              eval_end_date: "2023-10-15T00:00:00.000Z",
              percent_involvement: "100",
              evaluee: {
                email: "sample3@example.com",
                first_name: "Third",
                id: 4,
                last_name: "Evaluee",
                picture: null,
                slug: "sample-evaluee-third",
              },
              project: {
                name: "ProductHQ",
              },
              project_role: {
                name: "Developer",
              },
              template: {
                id: 5,
                display_name: "Peer Evaluation",
                evaluator_role_id: 5,
                evaluee_role_id: 5,
                is_active: true,
                name: "DEV Evaluation by Dev Peers",
                rate: "20",
                template_class: "Internal",
                template_type: "Project Evaluation",
                updated_at: null,
                with_recommendation: false,
              },
              status: "Ongoing",
              for_evaluation: true,
              is_external: false,
              external_evaluator_id: null,
            },
          ]),
        }
      )

      await page.waitForLoadState("networkidle")

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await mockRequest(page, "/admin/evaluation-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Evaluation 1",
          eval_schedule_start_date: "2024-01-01T00:00:00.000Z",
          eval_schedule_end_date: "2024-01-03T00:00:00.000Z",
          eval_period_start_date: "2023-01-01T00:00:00.000Z",
          eval_period_end_date: "2023-12-31T00:00:00.000Z",
          remarks: "Remarks 1",
          email_subject: "Subject 1",
          email_content: "Content 1",
          status: "Pending",
        }),
      })

      await mockRequest(page, "/admin/evaluation-results?evaluation_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              status: "For Review",
              users: {
                first_name: "Sample",
                last_name: "User",
                picture: null,
              },
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

      await expect(page).toHaveURL("/admin/evaluation-administrations/1")
    })

    test("should show nudge button for Draft", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/progress")

      await mockRequest(page, "/admin/evaluation-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Evaluation 1",
          eval_schedule_start_date: "2024-01-01T00:00:00.000Z",
          eval_schedule_end_date: "2024-01-03T00:00:00.000Z",
          eval_period_start_date: "2023-01-01T00:00:00.000Z",
          eval_period_end_date: "2023-12-31T00:00:00.000Z",
          remarks: "Remarks 1",
          email_subject: "Subject 1",
          email_content: "Content 1",
          status: "Draft",
        }),
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/evaluators", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            email: "johndoe@email.com",
            first_name: "John",
            id: 1,
            last_name: "Doe",
            picture: null,
            slug: "john-doe",
            totalEvaluations: 4,
            totalSubmitted: 2,
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("button", { name: "Nudge" })).toBeVisible()
    })

    test("should show nudge button for Pending", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/progress")

      await mockRequest(page, "/admin/evaluation-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Evaluation 1",
          eval_schedule_start_date: "2024-01-01T00:00:00.000Z",
          eval_schedule_end_date: "2024-01-03T00:00:00.000Z",
          eval_period_start_date: "2023-01-01T00:00:00.000Z",
          eval_period_end_date: "2023-12-31T00:00:00.000Z",
          remarks: "Remarks 1",
          email_subject: "Subject 1",
          email_content: "Content 1",
          status: "Pending",
        }),
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/evaluators", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            email: "johndoe@email.com",
            first_name: "John",
            id: 1,
            last_name: "Doe",
            picture: null,
            slug: "john-doe",
            totalEvaluations: 4,
            totalSubmitted: 2,
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("button", { name: "Nudge" })).toBeVisible()
    })

    test("should show nudge button for Processing", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/progress")

      await mockRequest(page, "/admin/evaluation-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Evaluation 1",
          eval_schedule_start_date: "2024-01-01T00:00:00.000Z",
          eval_schedule_end_date: "2024-01-03T00:00:00.000Z",
          eval_period_start_date: "2023-01-01T00:00:00.000Z",
          eval_period_end_date: "2023-12-31T00:00:00.000Z",
          remarks: "Remarks 1",
          email_subject: "Subject 1",
          email_content: "Content 1",
          status: "Processing",
        }),
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/evaluators", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            email: "johndoe@email.com",
            first_name: "John",
            id: 1,
            last_name: "Doe",
            picture: null,
            slug: "john-doe",
            totalEvaluations: 4,
            totalSubmitted: 2,
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("button", { name: "Nudge" })).toBeVisible()
    })

    test("should show nudge button for Ongoing", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/progress")

      await mockRequest(page, "/admin/evaluation-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Evaluation 1",
          eval_schedule_start_date: "2024-01-01T00:00:00.000Z",
          eval_schedule_end_date: "2024-01-03T00:00:00.000Z",
          eval_period_start_date: "2023-01-01T00:00:00.000Z",
          eval_period_end_date: "2023-12-31T00:00:00.000Z",
          remarks: "Remarks 1",
          email_subject: "Subject 1",
          email_content: "Content 1",
          status: "Ongoing",
        }),
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/evaluators", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            email: "johndoe@email.com",
            first_name: "John",
            id: 1,
            last_name: "Doe",
            picture: null,
            slug: "john-doe",
            totalEvaluations: 4,
            totalSubmitted: 2,
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("button", { name: "Nudge" })).toBeVisible()
    })

    test("should not show nudge button for Closed", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/progress")

      await mockRequest(page, "/admin/evaluation-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Evaluation 1",
          eval_schedule_start_date: "2024-01-01T00:00:00.000Z",
          eval_schedule_end_date: "2024-01-03T00:00:00.000Z",
          eval_period_start_date: "2023-01-01T00:00:00.000Z",
          eval_period_end_date: "2023-12-31T00:00:00.000Z",
          remarks: "Remarks 1",
          email_subject: "Subject 1",
          email_content: "Content 1",
          status: "Closed",
        }),
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/evaluators", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            email: "johndoe@email.com",
            first_name: "John",
            id: 1,
            last_name: "Doe",
            picture: null,
            slug: "john-doe",
            totalEvaluations: 4,
            totalSubmitted: 2,
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("button", { name: "Nudge" })).not.toBeVisible()
    })

    test("should not show nudge button for Cancelled", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/progress")

      await mockRequest(page, "/admin/evaluation-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Evaluation 1",
          eval_schedule_start_date: "2024-01-01T00:00:00.000Z",
          eval_schedule_end_date: "2024-01-03T00:00:00.000Z",
          eval_period_start_date: "2023-01-01T00:00:00.000Z",
          eval_period_end_date: "2023-12-31T00:00:00.000Z",
          remarks: "Remarks 1",
          email_subject: "Subject 1",
          email_content: "Content 1",
          status: "Cancelled",
        }),
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/evaluators", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            email: "johndoe@email.com",
            first_name: "John",
            id: 1,
            last_name: "Doe",
            picture: null,
            slug: "john-doe",
            totalEvaluations: 4,
            totalSubmitted: 2,
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("button", { name: "Nudge" })).not.toBeVisible()
    })

    test("should not show nudge button for Published", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/progress")

      await mockRequest(page, "/admin/evaluation-administrations/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Evaluation 1",
          eval_schedule_start_date: "2024-01-01T00:00:00.000Z",
          eval_schedule_end_date: "2024-01-03T00:00:00.000Z",
          eval_period_start_date: "2023-01-01T00:00:00.000Z",
          eval_period_end_date: "2023-12-31T00:00:00.000Z",
          remarks: "Remarks 1",
          email_subject: "Subject 1",
          email_content: "Content 1",
          status: "Published",
        }),
      })

      await mockRequest(page, "/admin/evaluation-administrations/1/evaluators", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            email: "johndoe@email.com",
            first_name: "John",
            id: 1,
            last_name: "Doe",
            picture: null,
            slug: "john-doe",
            totalEvaluations: 4,
            totalSubmitted: 2,
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("button", { name: "Nudge" })).not.toBeVisible()
    })
  })
})
