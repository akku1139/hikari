import type { GetPath } from "../types"

export const getPath: GetPath = (request) => {
  const url = new URL(request.url)

  // Percent Encoding

  return url.pathname
}

// From Hono: https://github.com/honojs/hono/blob/6ae021371a38216a02f6fbddc06eebff506dfd04/src/utils/url.ts#L132-L137
export const getPathNoStrict: GetPath = (request) => {
  const result = getPath(request)

  // if strict routing is false => `/hello/hey/` and `/hello/hey` are treated the same
  return result.length > 1 && result.at(-1) === '/' ? result.slice(0, -1) : result
}
