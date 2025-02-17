import { compose } from "./compose"
import type { METHODS } from "./define"
import { SimpleRouter } from "./router"
import type { Router } from "./router/router-core"
import type { Handler, Context, NotFoundHandler, ErrorHandler } from "./types"

export type HikariOptions = {
  notFound: NotFoundHandler
  onError: ErrorHandler
}

export class HikariCore {
  router: Router

  notFoundHandler: NotFoundHandler
  errorHandler: ErrorHandler

  constructor(options: HikariOptions) {
    this.router = new SimpleRouter()
    this.notFoundHandler = options.notFound ?? (() => new Response("404 Not Found", { status: 404 }))
    this.errorHandler = options.onError ?? ((_, error) => {
      console.error(error)
      return new Response("Internal Server Error", { status: 500 })}
    )
  }

  on(method: typeof METHODS[number], path: string, handlers: Array<Handler>) {
    this.router.add(method.toUpperCase(), path, handlers)
    return this
  }

  fetch(request: Request): Response | Promise<Response> {
    if(request.method === "HEAD") {
      return (async () =>
        new Response(null, await this.fetch({
          ...request,
          method: "GET"
        }))
      )()
    }

    const handlers = this.router.match(
      request.method,
      new URL(request.url).pathname
    )

    const context: Context = {
      request,
      next: () => new Promise(resolve => resolve()), // fake: dispatch(current + 1)
    }

    if(handlers.length === 0) {
      return this.notFoundHandler(context)
    }

    const composed = compose(handlers)

    return (async () => {
      try {
        const response = await composed(context)

        if(!response) {
          return this.errorHandler(context, new Error(
            "No Response was returned from handlers. Did you forget to return a Response object or `await next()`?"
          ))
        }

        return response
      } catch (error) {
        // Error
        return this.errorHandler(context, error)
      }
    })()
  }
}
