import { type Page } from "@playwright/test"

interface ResponseObject {
  body?: string | Buffer
  headers?: Record<string, string>
  contentType?: string
  status?: number
}

export const mockRequest = async (
  page: Page,
  url: string,
  response: ResponseObject
) => {
  await page.route(`*/**${url}`, async (route) => {
    await route.fulfill({
      ...response,
      headers: {
        ...response.headers,
        "mock-request": "true",
      },
    })
  })
}
