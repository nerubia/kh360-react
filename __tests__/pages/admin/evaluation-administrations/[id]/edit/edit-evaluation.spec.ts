import { test, expect } from "@playwright/test"
import { setupPlaywright } from "../../../../../utils/setup-playwright"
import { mockRequest } from "../../../../../utils/mock-request"
import { loginUser } from "../../../../../utils/login-user"

setupPlaywright()

test.describe("Admin - Edit Evaluation Administration", () => {
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
    test("should not allow to view the admin edit evaluation administration", async ({ page }) => {
      await page.goto("/admin/evaluation-administrations/1/edit")

      await expect(page).toHaveURL("/auth/login?callback=/admin/evaluation-administrations/1/edit")
    })
  })

  test.describe("as Employee", () => {
    test("should not allow to view the admin edit evaluation administration", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("/admin/evaluation-administrations/1/edit")

      await expect(page).toHaveURL("/dashboard")
    })
  })

  test.describe("as Admin", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/edit")

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
          email_subject: "Email subject",
          email_content: "Email content",
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByPlaceholder("Evaluation name")).toHaveValue("Evaluation 1")

      await expect(page.getByLabel("Period (from)")).toHaveValue("2023-01-01")
      await expect(page.getByLabel("Period (to)")).toHaveValue("2023-12-31")
      await expect(page.getByLabel("Schedule (from)")).toHaveValue("2024-01-01")
      await expect(page.getByLabel("Schedule (to)")).toHaveValue("2024-01-03")

      await expect(page.getByLabel("Evaluation description/notes")).toHaveValue("Remarks 1")

      await expect(page.getByPlaceholder("Subject")).toHaveValue("Email subject")
      await expect(page.getByRole("textbox", { name: "Some description" })).toHaveValue(
        "Email content"
      )

      await expect(page.getByRole("button", { name: "Cancel & Exit" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Save & Proceed" })).toBeVisible()
    })

    test("should show validation errors", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/edit")

      await mockRequest(page, "/admin/email-templates/default", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: null,
          template_type: "Create Evaluation",
          is_default: true,
          subject: "Subject 1",
          content: "Content 1",
          created_by_id: null,
          updated_by_id: null,
          created_at: null,
          updated_at: null,
        }),
      })

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
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByPlaceholder("Evaluation name").fill("")
      await page.getByLabel("Period (from)").fill("")
      await page.getByLabel("Period (to)").fill("")
      await page.getByLabel("Schedule (from)").fill("")
      await page.getByLabel("Schedule (to)").fill("")
      await page.getByLabel("Evaluation description/notes").fill("")

      await page.getByRole("button", { name: "Save & Proceed" }).click()

      await expect(page.getByText("Name is required")).toBeVisible()
      await expect(page.getByText("Start period must be before end period")).toBeVisible()
      await expect(page.getByText("End period must not be later than start schedule")).toBeVisible()
      await expect(page.getByText("End period must not be later than start schedule")).toBeVisible()
      await expect(page.getByText("Start schedule must be before end schedule")).toBeVisible()
      await expect(page.getByText("End schedule is required")).toBeVisible()
      await expect(page.getByText("Description is required")).toBeVisible()
    })

    test("should edit evaluation succesfully", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/edit")

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
          email_subject: "Email subject",
          email_content: "Email content",
        }),
      })

      await mockRequest(page, "/admin/email-templates/default", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: null,
          template_type: "Create Evaluation",
          is_default: true,
          subject: "Subject 1",
          content: "Content 1",
          created_by_id: null,
          updated_by_id: null,
          created_at: null,
          updated_at: null,
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByPlaceholder("Evaluation name").fill("Evaluation Edited")
      await page.getByLabel("Period (from)").fill("2023-01-02")
      await page.getByLabel("Period (to)").fill("2023-01-03")
      await page.getByLabel("Schedule (from)").fill("2023-01-04")
      await page.getByLabel("Schedule (to)").fill("2023-01-05")
      await page.getByLabel("Evaluation description/notes").fill("Description Edited")

      await page.getByRole("button", { name: "Save & Proceed" }).click()

      await mockRequest(page, "/admin/users", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              email: "sample1@gmail.com",
              first_name: "Adam",
              last_name: "Baker",
              is_active: true,
              user_details: {
                start_date: "2023-04-12T00:00:00.000Z",
                user_id: 1,
                user_position: "Project Manager",
                user_type: "Regular",
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

      await mockRequest(page, "/admin/users/all", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              email: "sample1@gmail.com",
              first_name: "Adam",
              last_name: "Baker",
              is_active: true,
              user_details: {
                start_date: "2023-04-12T00:00:00.000Z",
                user_id: 1,
                user_position: "Project Manager",
                user_type: "Regular",
              },
            },
          ],
        }),
      })

      await mockRequest(page, "/admin/evaluation-results/all?evaluation_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      })

      await page.waitForLoadState("networkidle")

      await expect(page).toHaveURL("/admin/evaluation-administrations/1/select")
    })

    test("should render cancel & exit modal correctly", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/edit")

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
        }),
      })

      await mockRequest(page, "/admin/email-templates/default", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: null,
          template_type: "Create Evaluation",
          is_default: true,
          subject: "Subject 1",
          content: "Content 1",
          created_by_id: null,
          updated_by_id: null,
          created_at: null,
          updated_at: null,
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Cancel & Exit" }).click()

      await expect(page.getByRole("heading", { name: "Cancel & Exit" })).toBeVisible()
      await expect(
        page.getByText(
          "Are you sure you want to cancel and exit? If you cancel, your data won't be save"
        )
      ).toBeVisible()
      await expect(page.getByRole("button", { name: "No" })).toBeVisible()
      await expect(page.getByRole("link", { name: "Yes" })).toBeVisible()
    })

    test("should allow to cancel & exit", async ({ page, isMobile }) => {
      await loginUser("admin", page)

      await page.goto("/admin/evaluation-administrations/1/edit")

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
        }),
      })

      await mockRequest(page, "/admin/email-templates/default", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: null,
          template_type: "Create Evaluation",
          is_default: true,
          subject: "Subject 1",
          content: "Content 1",
          created_by_id: null,
          updated_by_id: null,
          created_at: null,
          updated_at: null,
        }),
      })

      await mockRequest(page, "/admin/evaluation-administrations", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
        }),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Cancel & Exit" }).click()
      await page.getByRole("link", { name: "Yes" }).click()

      await mockRequest(page, "/admin/evaluation-administrations", {
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
              status: "completed",
              created_by_id: null,
              updated_by_id: null,
              created_at: "2023-10-17T03:41:43.000Z",
              updated_at: null,
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
              status: "ongoing",
              created_by_id: null,
              updated_by_id: null,
              created_at: "2023-10-17T03:41:43.000Z",
              updated_at: null,
            },
            {
              id: 3,
              name: "Evaluation 3",
              eval_schedule_start_date: "2023-04-12T00:00:00.000Z",
              eval_schedule_end_date: "2024-07-02T00:00:00.000Z",
              eval_period_start_date: "2023-05-10T00:00:00.000Z",
              eval_period_end_date: "2023-10-23T00:00:00.000Z",
              remarks: null,
              email_subject: "",
              email_content: null,
              status: "draft",
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

      await expect(page).toHaveURL("/admin/evaluation-administrations")
    })
  })
})
