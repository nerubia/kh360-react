import test, { type Response, type Request } from "@playwright/test"

const BASE_URL = "http://54.251.226.106:5000"

export const setupPlaywright = () => {
  test.beforeEach(async ({ page }) => {
    page.on("request", (request: Request) => {
      const url = request.url()
      if (url.includes(BASE_URL)) {
        // TODO
      }
    })

    page.on("response", (response: Response) => {
      const url = response.url()
      if (url.includes(BASE_URL)) {
        const headers = response.headers()
        if (headers["mock-request"] === undefined) {
          throw new Error(
            `Unhandled request. Please use a mockRequest. API: ${url}`
          )
        }
      }
    })

    page.on("close", () => {
      // TODO
    })
  })
}
