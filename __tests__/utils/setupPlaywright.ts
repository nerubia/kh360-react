import test, { type Response, type Request } from "@playwright/test"

export const setupPlaywright = () => {
  test.beforeEach(async ({ page, baseURL }) => {
    page.on("request", (request: Request) => {
      const url = request.url()
      if (url.includes(baseURL as string)) {
        // TODO
      }
    })

    page.on("response", (response: Response) => {
      const url = response.url()
      if (!url.includes(baseURL as string)) {
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
