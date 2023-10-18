import { type Page } from "@playwright/test"
import { mockRequest } from "./mockRequest"

export const loginUser = async (user: "employee" | "admin", page: Page) => {
  if (user === "employee") {
    await mockRequest(page, "/auth/refresh", {
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access_token: "some access token",
        user: {
          id: 1,
          email: "employee@nerubia.com",
          first_name: "Employee",
          last_name: "User",
          roles: [],
        },
      }),
    })
  }
  if (user === "admin") {
    await mockRequest(page, "/auth/refresh", {
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access_token: "some access token",
        user: {
          id: 1,
          email: "admin@nerubia.com",
          first_name: "Admin",
          last_name: "User",
          roles: ["kh360"],
        },
      }),
    })
  }
}
