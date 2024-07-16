import { test, expect } from "@playwright/test"
import { setupPlaywright } from "@test-utils/setup-playwright"
import { mockRequest } from "@test-utils/mock-request"
import { loginUser } from "@test-utils/login-user"

setupPlaywright()

test.describe("My Skill Map", () => {
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
    test("should not allow to view the my skill map", async ({ page }) => {
      await page.goto("/my-skill-map")

      await expect(page).toHaveURL("/auth/login?callback=/my-skill-map")
    })
  })

  test.describe("as Employee", () => {
    test("should render correctly", async ({ page }) => {
      await loginUser("employee", page)

      await page.goto("my-skill-map")

      await mockRequest(page, "/user/my-skill-map/1", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          my_skill_map: [
            {
              id: 646,
              name: "Skill Map 1",
              skill_map_period_end_date: "2021-07-24T00:00:00.000Z",
              skill_map_results: [
                {
                  comments: "Sample Comments",
                  skill_map_ratings: [
                    {
                      skill_id: 22,
                      other_skill_name: null,
                      skills: {
                        name: "AngularJS",
                      },
                      answer_options: {
                        id: 9,
                        name: "Expert",
                      },
                      created_at: "2024-07-10T03:36:49.000Z",
                    },
                    {
                      skill_id: 144,
                      other_skill_name: null,
                      skills: {
                        name: "Apache",
                      },
                      answer_options: {
                        id: 9,
                        name: "Expert",
                      },
                      created_at: "2024-07-10T03:36:49.000Z",
                    },
                    {
                      skill_id: null,
                      other_skill_name: "Next JS",
                      skills: null,
                      answer_options: {
                        id: 7,
                        name: "Beginner",
                      },
                      created_at: "2024-07-10T03:36:49.000Z",
                    },
                  ],
                },
              ],
            },
            {
              id: 647,
              name: "Skill Map 2",
              skill_map_period_end_date: "2022-07-22T00:00:00.000Z",
              skill_map_results: [
                {
                  comments: "Hello world",
                  skill_map_ratings: [
                    {
                      skill_id: 50,
                      other_skill_name: null,
                      skills: {
                        name: ".NET",
                      },
                      answer_options: {
                        id: 8,
                        name: "Intermediate",
                      },
                      created_at: "2024-07-10T03:36:29.000Z",
                    },
                    {
                      skill_id: 2,
                      other_skill_name: null,
                      skills: {
                        name: "Action Script",
                      },
                      answer_options: {
                        id: 8,
                        name: "Intermediate",
                      },
                      created_at: "2024-07-10T03:36:29.000Z",
                    },
                    {
                      skill_id: 22,
                      other_skill_name: null,
                      skills: {
                        name: "AngularJS",
                      },
                      answer_options: {
                        id: 9,
                        name: "Expert",
                      },
                      created_at: "2024-07-10T03:36:49.000Z",
                    },
                    {
                      skill_id: 144,
                      other_skill_name: null,
                      skills: {
                        name: "Apache",
                      },
                      answer_options: {
                        id: 9,
                        name: "Expert",
                      },
                      created_at: "2024-07-10T03:36:49.000Z",
                    },
                    {
                      skill_id: null,
                      other_skill_name: "Next JS",
                      skills: null,
                      answer_options: {
                        id: 7,
                        name: "Beginner",
                      },
                      created_at: "2024-07-10T03:36:49.000Z",
                    },
                  ],
                },
              ],
            },
            {
              id: 648,
              name: "s3",
              skill_map_period_end_date: "2023-07-21T00:00:00.000Z",
              skill_map_results: [
                {
                  comments: "KH360 :3",
                  skill_map_ratings: [
                    {
                      skill_id: 50,
                      other_skill_name: null,
                      skills: {
                        name: ".NET",
                      },
                      answer_options: {
                        id: 8,
                        name: "Intermediate",
                      },
                      created_at: "2024-07-10T03:37:24.000Z",
                    },
                    {
                      skill_id: 2,
                      other_skill_name: null,
                      skills: {
                        name: "Action Script",
                      },
                      answer_options: {
                        id: 8,
                        name: "Intermediate",
                      },
                      created_at: "2024-07-10T03:37:24.000Z",
                    },
                    {
                      skill_id: 22,
                      other_skill_name: null,
                      skills: {
                        name: "AngularJS",
                      },
                      answer_options: {
                        id: 9,
                        name: "Expert",
                      },
                      created_at: "2024-07-10T03:37:24.000Z",
                    },
                    {
                      skill_id: 144,
                      other_skill_name: null,
                      skills: {
                        name: "Apache",
                      },
                      answer_options: {
                        id: 9,
                        name: "Expert",
                      },
                      created_at: "2024-07-10T03:37:24.000Z",
                    },
                    {
                      skill_id: null,
                      other_skill_name: "Github actions",
                      skills: null,
                      answer_options: {
                        id: 8,
                        name: "Intermediate",
                      },
                      created_at: "2024-07-10T03:37:24.000Z",
                    },
                  ],
                },
              ],
            },
            {
              id: 649,
              name: "s4",
              skill_map_period_end_date: "2024-01-11T00:00:00.000Z",
              skill_map_results: [
                {
                  comments: "",
                  skill_map_ratings: [
                    {
                      skill_id: 50,
                      other_skill_name: null,
                      skills: {
                        name: ".NET",
                      },
                      answer_options: {
                        id: 8,
                        name: "Intermediate",
                      },
                      created_at: "2024-07-10T03:37:42.000Z",
                    },
                    {
                      skill_id: 2,
                      other_skill_name: null,
                      skills: {
                        name: "Action Script",
                      },
                      answer_options: {
                        id: 8,
                        name: "Intermediate",
                      },
                      created_at: "2024-07-10T03:37:42.000Z",
                    },
                    {
                      skill_id: 22,
                      other_skill_name: null,
                      skills: {
                        name: "AngularJS",
                      },
                      answer_options: {
                        id: 9,
                        name: "Expert",
                      },
                      created_at: "2024-07-10T03:37:42.000Z",
                    },
                    {
                      skill_id: 144,
                      other_skill_name: null,
                      skills: {
                        name: "Apache",
                      },
                      answer_options: {
                        id: 9,
                        name: "Expert",
                      },
                      created_at: "2024-07-10T03:37:42.000Z",
                    },
                  ],
                },
              ],
            },
          ],
        }),
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

      await mockRequest(page, "/user/email-templates?template_type=No+Result+for+My+Skill+Map", {
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          content: "",
          id: 65,
          is_default: true,
          name: "No Result for My Skill Map",
          subject: "",
          template_type: "No Result for My Skill Map",
        }),
      })

      await page.waitForLoadState("networkidle")

      await expect(page.getByRole("heading", { name: "My Skill Map" })).toBeVisible()
      await expect(page.getByText("Skill Map Admin")).toBeVisible()
      await expect(page.locator("div").filter({ hasText: /^All$/ }).nth(2)).toBeVisible()
      await expect(page.getByText("- KH360 :3 (Jul 2023)")).toBeVisible()
      await expect(page.getByText("- Hello world (Jul 2022)")).toBeVisible()
      await expect(page.getByText("- Sample Comments (Jul 2021)")).toBeVisible()
      await expect(page.locator("canvas")).toBeVisible()
      await expect(
        page.getByText("AngularJSApacheNext JS.NETAction ScriptGithub actions")
      ).toBeVisible()
    })
  })
})
