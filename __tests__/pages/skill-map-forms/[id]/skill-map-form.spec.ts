import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("User - Skill Map Form", () => {
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
    test("should not allow to view the skill map form", async ({ page }) => {
      await page.goto("/skill-map-forms/1")

      await expect(page).toHaveURL("/auth/login?callback=/skill-map-forms/1")
    })
  })

  test.describe("as Employee", () => {
    test("should render correctly", async ({ page, isMobile }) => {
      await loginUser("employee", page)

      await page.goto("/skill-map-forms/1?skill_category_id=all")

      await mockRequest(page, "/user/skill-map-ratings?skill_map_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user_skill_map_ratings: [
            {
              id: 50,
              skill_category_id: 2,
              name: ".NET",
              sequence_no: 50,
              description: null,
              status: true,
              created_at: "2024-01-09T01:41:55.000Z",
              updated_at: "2024-03-14T06:59:49.000Z",
              skill_categories: {
                id: 2,
                name: "Development Frameworks",
                sequence_no: 3,
                description: null,
                status: true,
                created_at: "2024-01-09T01:41:55.000Z",
                updated_at: "2024-03-13T06:19:26.000Z",
              },
              previous_rating: null,
              rating: {
                id: 7,
                answer_id: 2,
                sequence_no: 1,
                name: "Beginner",
                display_name: "Beginner",
                answer_type: "lowest",
                rate: "0",
                description: null,
                is_active: null,
                created_at: null,
                updated_at: null,
              },
            },
            {
              id: 2,
              skill_category_id: 1,
              name: "Action Script",
              sequence_no: 2,
              description: null,
              status: true,
              created_at: "2024-01-09T01:41:55.000Z",
              updated_at: "2024-03-14T06:59:49.000Z",
              skill_categories: {
                id: 1,
                name: "Programming Languages",
                sequence_no: 1,
                description: "",
                status: true,
                created_at: "2024-01-09T01:41:55.000Z",
                updated_at: "2024-03-13T06:19:26.000Z",
              },
              previous_rating: null,
              rating: {
                id: 7,
                answer_id: 2,
                sequence_no: 1,
                name: "Beginner",
                display_name: "Beginner",
                answer_type: "lowest",
                rate: "0",
                description: null,
                is_active: null,
                created_at: null,
                updated_at: null,
              },
            },
          ],
          skill_map_administration: {
            id: 1,
            name: "Skill Map 1",
            skill_map_schedule_start_date: "2024-06-01T00:00:00.000Z",
            skill_map_schedule_end_date: "2024-06-30T00:00:00.000Z",
            skill_map_period_start_date: "2023-01-01T00:00:00.000Z",
            skill_map_period_end_date: "2023-04-30T00:00:00.000Z",
            remarks: "a",
            email_subject: "a",
            email_content: "a",
            status: "Ongoing",
            created_by_id: null,
            updated_by_id: null,
            created_at: "2024-06-10T00:16:18.000Z",
            updated_at: "2024-06-11T07:03:29.000Z",
          },
          skill_map_result_status: "Submitted",
        }),
      })

      await mockRequest(page, "/user/skill-categories/all", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Programming Languages",
            sequence_no: 1,
            description: "",
            status: true,
            created_at: "2024-01-09T01:41:55.000Z",
            updated_at: "2024-03-13T06:19:26.000Z",
          },
          {
            id: 12,
            name: "ruwoiffds",
            sequence_no: 2,
            description: "test",
            status: true,
            created_at: "2024-03-13T06:18:07.000Z",
            updated_at: "2024-03-14T07:00:17.000Z",
          },
          {
            id: 2,
            name: "Development Frameworks",
            sequence_no: 3,
            description: null,
            status: true,
            created_at: "2024-01-09T01:41:55.000Z",
            updated_at: "2024-03-13T06:19:26.000Z",
          },
          {
            id: 3,
            name: "Database",
            sequence_no: 4,
            description: null,
            status: true,
            created_at: "2024-01-09T01:41:55.000Z",
            updated_at: "2024-03-13T06:19:26.000Z",
          },
          {
            id: 4,
            name: "Markup and Stylings",
            sequence_no: 5,
            description: null,
            status: true,
            created_at: "2024-01-09T01:41:55.000Z",
            updated_at: "2024-03-13T06:19:26.000Z",
          },
          {
            id: 5,
            name: "API Integration",
            sequence_no: 6,
            description: null,
            status: true,
            created_at: "2024-01-09T01:41:55.000Z",
            updated_at: "2024-03-13T06:19:26.000Z",
          },
          {
            id: 8,
            name: "Other Technologies",
            sequence_no: 7,
            description: null,
            status: true,
            created_at: "2024-01-09T01:41:55.000Z",
            updated_at: "2024-03-13T06:19:26.000Z",
          },
          {
            id: 6,
            name: "Testing Frameworks",
            sequence_no: 8,
            description: null,
            status: true,
            created_at: "2024-01-09T01:41:55.000Z",
            updated_at: "2024-03-13T06:19:26.000Z",
          },
          {
            id: 7,
            name: "DevOps and Workflows",
            sequence_no: 9,
            description: null,
            status: true,
            created_at: "2024-01-09T01:41:55.000Z",
            updated_at: "2024-03-13T06:19:26.000Z",
          },
        ]),
      })

      await mockRequest(page, "/user/answer-options/active?answer_name=Skill+Map+Scale", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 7,
            answer_id: 2,
            sequence_no: 1,
            name: "Beginner",
            display_name: "Beginner",
            answer_type: "lowest",
            rate: "0",
            description: null,
            is_active: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 8,
            answer_id: 2,
            sequence_no: 2,
            name: "Intermediate",
            display_name: "Intermediate",
            answer_type: null,
            rate: "0",
            description: null,
            is_active: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 9,
            answer_id: 2,
            sequence_no: 3,
            name: "Expert",
            display_name: "Expert",
            answer_type: "highest",
            rate: "0",
            description: null,
            is_active: null,
            created_at: null,
            updated_at: null,
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByRole("heading", { name: "Skill Map 1" })).toBeVisible()

      await expect(page.getByText("Submitted")).toBeVisible()

      if (isMobile) {
        await expect(page.getByText("Map:Jan 1, 2023 to Apr 30, 2023")).toBeVisible()
        await expect(page.getByText("Map:Jun 1, 2024 to Jun 30, 2024")).toBeVisible()
      } else {
        await expect(
          page.getByText("Skill Map Period:January 1, 2023 to April 30, 2023")
        ).toBeVisible()
        await expect(
          page.getByText("Skill Map Schedule:June 1, 2024 to June 30, 2024")
        ).toBeVisible()
      }

      await expect(page.getByRole("button", { name: "All" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Programming Languages" })).toBeVisible()

      await expect(page.getByRole("cell", { name: "Skill" }).first()).toBeVisible()
      await expect(page.getByRole("cell", { name: "Category" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Previous Rating" })).toBeVisible()
      await expect(
        page.getByRole("cell", { name: "Rating Beginner Intermediate Expert" }).first()
      ).toBeVisible()

      await expect(page.getByRole("cell", { name: ".NET" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Development Frameworks" })).toBeVisible()

      await expect(page.getByText("Action Script")).toBeVisible()
      await expect(page.getByRole("cell", { name: "Programming Languages" })).toBeVisible()

      await expect(page.getByRole("heading", { name: "Other Skills" })).toBeVisible()

      await expect(page.getByRole("button", { name: "Back to List" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Save & Submit" })).toBeVisible()
      await expect(page.getByRole("heading", { name: "Comments" })).toBeVisible()
    })

    test("should allow to add other skill", async ({ page, isMobile }) => {
      await loginUser("employee", page)

      await page.goto("/skill-map-forms/1?skill_category_id=all")

      await mockRequest(page, "/user/skill-map-ratings?skill_map_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user_skill_map_ratings: [],
          skill_map_administration: {
            id: 1,
            name: "Skill Map 1",
            skill_map_schedule_start_date: "2024-06-01T00:00:00.000Z",
            skill_map_schedule_end_date: "2024-06-30T00:00:00.000Z",
            skill_map_period_start_date: "2023-01-01T00:00:00.000Z",
            skill_map_period_end_date: "2023-04-30T00:00:00.000Z",
            remarks: "a",
            email_subject: "a",
            email_content: "a",
            status: "Ongoing",
            created_by_id: null,
            updated_by_id: null,
            created_at: "2024-06-10T00:16:18.000Z",
            updated_at: "2024-06-11T07:03:29.000Z",
          },
          skill_map_result_status: "Ongoing",
        }),
      })

      await mockRequest(page, "/user/skill-categories/all", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Programming Languages",
            sequence_no: 1,
            description: "",
            status: true,
            created_at: "2024-01-09T01:41:55.000Z",
            updated_at: "2024-03-13T06:19:26.000Z",
          },
        ]),
      })

      await mockRequest(page, "/user/answer-options/active?answer_name=Skill+Map+Scale", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 7,
            answer_id: 2,
            sequence_no: 1,
            name: "Beginner",
            display_name: "Beginner",
            answer_type: "lowest",
            rate: "0",
            description: null,
            is_active: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 8,
            answer_id: 2,
            sequence_no: 2,
            name: "Intermediate",
            display_name: "Intermediate",
            answer_type: null,
            rate: "0",
            description: null,
            is_active: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 9,
            answer_id: 2,
            sequence_no: 3,
            name: "Expert",
            display_name: "Expert",
            answer_type: "highest",
            rate: "0",
            description: null,
            is_active: null,
            created_at: null,
            updated_at: null,
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Add Other Skills" }).click()
      await expect(page.getByRole("heading", { name: "Add Other Skill" })).toBeVisible()
      await page.getByPlaceholder("Name").fill("Other skill 1")
      await expect(page.getByPlaceholder("Name")).toHaveValue("Other skill 1")
      await page.getByRole("button", { name: "Save", exact: true }).click()

      await page.getByRole("button", { name: "Add Other Skills" }).click()
      await expect(page.getByRole("heading", { name: "Add Other Skill" })).toBeVisible()
      await page.getByPlaceholder("Name").fill("Other skill 2")
      await expect(page.getByPlaceholder("Name")).toHaveValue("Other skill 2")
      await page.getByRole("button", { name: "Save", exact: true }).click()

      await expect(page.getByRole("cell", { name: "Other skill 1" })).toBeVisible()
      await expect(page.getByRole("cell", { name: "Other skill 2" })).toBeVisible()
    })

    test("should allow to delete other skill", async ({ page, isMobile }) => {
      await loginUser("employee", page)

      await page.goto("/skill-map-forms/1?skill_category_id=all")

      await mockRequest(page, "/user/skill-map-ratings?skill_map_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user_skill_map_ratings: [],
          skill_map_administration: {
            id: 1,
            name: "Skill Map 1",
            skill_map_schedule_start_date: "2024-06-01T00:00:00.000Z",
            skill_map_schedule_end_date: "2024-06-30T00:00:00.000Z",
            skill_map_period_start_date: "2023-01-01T00:00:00.000Z",
            skill_map_period_end_date: "2023-04-30T00:00:00.000Z",
            remarks: "a",
            email_subject: "a",
            email_content: "a",
            status: "Ongoing",
            created_by_id: null,
            updated_by_id: null,
            created_at: "2024-06-10T00:16:18.000Z",
            updated_at: "2024-06-11T07:03:29.000Z",
          },
          skill_map_result_status: "Ongoing",
        }),
      })

      await mockRequest(page, "/user/skill-categories/all", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Programming Languages",
            sequence_no: 1,
            description: "",
            status: true,
            created_at: "2024-01-09T01:41:55.000Z",
            updated_at: "2024-03-13T06:19:26.000Z",
          },
        ]),
      })

      await mockRequest(page, "/user/answer-options/active?answer_name=Skill+Map+Scale", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 7,
            answer_id: 2,
            sequence_no: 1,
            name: "Beginner",
            display_name: "Beginner",
            answer_type: "lowest",
            rate: "0",
            description: null,
            is_active: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 8,
            answer_id: 2,
            sequence_no: 2,
            name: "Intermediate",
            display_name: "Intermediate",
            answer_type: null,
            rate: "0",
            description: null,
            is_active: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 9,
            answer_id: 2,
            sequence_no: 3,
            name: "Expert",
            display_name: "Expert",
            answer_type: "highest",
            rate: "0",
            description: null,
            is_active: null,
            created_at: null,
            updated_at: null,
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await page.getByRole("button", { name: "Add Other Skills" }).click()
      await expect(page.getByRole("heading", { name: "Add Other Skill" })).toBeVisible()
      await page.getByPlaceholder("Name").fill("Other skill 1")
      await expect(page.getByPlaceholder("Name")).toHaveValue("Other skill 1")
      await page.getByRole("button", { name: "Save", exact: true }).click()

      await page.getByRole("button", { name: "Add Other Skills" }).click()
      await expect(page.getByRole("heading", { name: "Add Other Skill" })).toBeVisible()
      await page.getByPlaceholder("Name").fill("Other skill 2")
      await expect(page.getByPlaceholder("Name")).toHaveValue("Other skill 2")
      await page.getByRole("button", { name: "Save", exact: true }).click()

      await page.locator("td:nth-child(3) > div").first().click()
      await expect(page.getByRole("heading", { name: "Delete Other Skill" })).toBeVisible()
      await expect(page.getByText("Are you sure you want to delete Other skill 1?")).toBeVisible()
      await page.getByTestId("DialogYesButton").click()

      await expect(page.getByRole("cell", { name: "Other skill 1" })).not.toBeVisible()
      await expect(page.getByRole("cell", { name: "Other skill 2" })).toBeVisible()
    })

    test("show no comments if Submitted without comment", async ({ page, isMobile }) => {
      await loginUser("employee", page)

      await page.goto("/skill-map-forms/1?skill_category_id=all")

      await mockRequest(page, "/user/skill-map-ratings?skill_map_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user_skill_map_ratings: [],
          skill_map_administration: {
            id: 1,
            name: "Skill Map 1",
            skill_map_schedule_start_date: "2024-06-01T00:00:00.000Z",
            skill_map_schedule_end_date: "2024-06-30T00:00:00.000Z",
            skill_map_period_start_date: "2023-01-01T00:00:00.000Z",
            skill_map_period_end_date: "2023-04-30T00:00:00.000Z",
            remarks: "a",
            email_subject: "a",
            email_content: "a",
            status: "Ongoing",
            created_by_id: null,
            updated_by_id: null,
            created_at: "2024-06-10T00:16:18.000Z",
            updated_at: "2024-06-11T07:03:29.000Z",
          },
          skill_map_result_status: "Submitted",
        }),
      })

      await mockRequest(page, "/user/skill-categories/all", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Programming Languages",
            sequence_no: 1,
            description: "",
            status: true,
            created_at: "2024-01-09T01:41:55.000Z",
            updated_at: "2024-03-13T06:19:26.000Z",
          },
        ]),
      })

      await mockRequest(page, "/user/answer-options/active?answer_name=Skill+Map+Scale", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 7,
            answer_id: 2,
            sequence_no: 1,
            name: "Beginner",
            display_name: "Beginner",
            answer_type: "lowest",
            rate: "0",
            description: null,
            is_active: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 8,
            answer_id: 2,
            sequence_no: 2,
            name: "Intermediate",
            display_name: "Intermediate",
            answer_type: null,
            rate: "0",
            description: null,
            is_active: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 9,
            answer_id: 2,
            sequence_no: 3,
            name: "Expert",
            display_name: "Expert",
            answer_type: "highest",
            rate: "0",
            description: null,
            is_active: null,
            created_at: null,
            updated_at: null,
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByText("No comments")).toBeVisible()
    })

    test("comment text area should be enabled if Ongoing", async ({ page, isMobile }) => {
      await loginUser("employee", page)

      await page.goto("/skill-map-forms/1?skill_category_id=all")

      await mockRequest(page, "/user/skill-map-ratings?skill_map_administration_id=1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user_skill_map_ratings: [],
          skill_map_administration: {
            id: 1,
            name: "Skill Map 1",
            skill_map_schedule_start_date: "2024-06-01T00:00:00.000Z",
            skill_map_schedule_end_date: "2024-06-30T00:00:00.000Z",
            skill_map_period_start_date: "2023-01-01T00:00:00.000Z",
            skill_map_period_end_date: "2023-04-30T00:00:00.000Z",
            remarks: "a",
            email_subject: "a",
            email_content: "a",
            status: "Ongoing",
            created_by_id: null,
            updated_by_id: null,
            created_at: "2024-06-10T00:16:18.000Z",
            updated_at: "2024-06-11T07:03:29.000Z",
          },
          skill_map_result_status: "Ongoing",
        }),
      })

      await mockRequest(page, "/user/skill-categories/all", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Programming Languages",
            sequence_no: 1,
            description: "",
            status: true,
            created_at: "2024-01-09T01:41:55.000Z",
            updated_at: "2024-03-13T06:19:26.000Z",
          },
        ]),
      })

      await mockRequest(page, "/user/answer-options/active?answer_name=Skill+Map+Scale", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 7,
            answer_id: 2,
            sequence_no: 1,
            name: "Beginner",
            display_name: "Beginner",
            answer_type: "lowest",
            rate: "0",
            description: null,
            is_active: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 8,
            answer_id: 2,
            sequence_no: 2,
            name: "Intermediate",
            display_name: "Intermediate",
            answer_type: null,
            rate: "0",
            description: null,
            is_active: null,
            created_at: null,
            updated_at: null,
          },
          {
            id: 9,
            answer_id: 2,
            sequence_no: 3,
            name: "Expert",
            display_name: "Expert",
            answer_type: "highest",
            rate: "0",
            description: null,
            is_active: null,
            created_at: null,
            updated_at: null,
          },
        ]),
      })

      if (isMobile) {
        await page.getByTestId("SidebarCloseButton").click()
      }

      await expect(page.getByPlaceholder("Comments")).toBeEnabled()
    })
  })
})
