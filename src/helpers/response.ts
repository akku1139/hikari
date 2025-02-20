import type { ResponseHelper } from "../types.ts"

export const createResponseHelper = <T>(contentType: string, builder: (body: T) => string): ResponseHelper<T> =>
  (body, status=200, headers={}) => new Response(builder(body), {
    status,
    headers: {
      "Content-Type": contentType,
      ...headers
    }
  })

export const text: ResponseHelper<string> = createResponseHelper("text/plain; charset=utf-8", b=>b)
export const html: ResponseHelper<string> = createResponseHelper("text/html; charset=utf-8", b=>b)
export const json: ResponseHelper<object> = createResponseHelper("application/json", JSON.stringify)
