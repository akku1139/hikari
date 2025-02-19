import type { Env, Handler } from "../types.ts"
import type { Params, Router } from "./router-core.ts"

type Route<T> = [RegExp, string, T] // [pattern, method, handler]

const emptyParams: Params = Object.create(null)

const isStaticPath = (path: string) => {
  for (const part of path.split("/")) {
    if (part === "*" || part.startsWith(":")) {
      return false
    }
  }
  return true
}

export class HikariRouter <E extends Env> implements Router <E> {
  #routes: Array<Route<Handler<E>>> = []
  #staticRoutes: Record<string, Record<string, Array<[Handler<E>, Params]>>> = Object.create(null)

  add(method: string, path: string, handler: Handler<E>): void {
    if (isStaticPath(path)) {
      this.#staticRoutes[path] ??= Object.create(null)
      this.#staticRoutes[path]![method] ??= []
      this.#staticRoutes[path]![method]?.push([handler, emptyParams])
      return
    }

    const endsWithWildcard = path.at(-1) === '*'
    if (endsWithWildcard) {
      path = path.slice(0, -2)
    }
    if (path.at(-1) === '?') {
      path = path.slice(0, -1)             
      this.add(method, path.replace(/\/[^/]+$/, ''), handler)
    }

    const parts = (path.match(/\/?(:\w+(?:{(?:(?:{[\d,]+})|[^}])+})?)|\/?[^\/\?]+/g) || []).map(
      (part) => {
        const match = part.match(/^\/:([^{]+)(?:{(.*)})?/)
        return match
          ? `/(?<${match[1]}>${match[2] || '[^/]+'})`
          : part === '/*'
          ? '/[^/]+'
          : part.replace(/[.\\+*[^\]$()]/g, '\\$&')
      }
    )

    try {
      this.#routes.push([new RegExp(`^${parts.join('')}${endsWithWildcard ? '' : '/?$'}`), method, handler])
    } catch {
      throw new Error("Unsupported Path")
    }
  }

  match(method: string, path: string): Array<[Handler<E>, Params]> {
    const staticRoute = this.#staticRoutes[path]
    const handlers: [Handler<E>, Params][] = (staticRoute && (staticRoute[method] ?? staticRoute["ALL"])) ?? []

    for (const route of this.#routes) {
      const [pattern, routeMethod, handler] = route

      if (routeMethod === method || routeMethod === 'ALL') {
        const match = pattern.exec(path)
        if (match) {
          handlers.push([handler, match.groups || emptyParams])
        }
      }
    }

    return handlers
  }
}
