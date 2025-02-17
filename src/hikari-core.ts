import { compose } from "./compose"
import type { METHODS } from "./define"
import { SimpleRouter } from "./router"
import type { Router } from "./router/router-core"
import type { Handler, Context, ResponseHandler } from "./types"

export class HikariCore {
  router: Router

  notFoundHandler: ResponseHandler
  errorHandler: ResponseHandler

  constructor() {
    this.router = new SimpleRouter()
    this.notFoundHandler = () => new Response("404 Not Found", { status: 404 })
    this.errorHandler = () => new Response("Internal Server Error", { status: 500 })
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
          return this.errorHandler(context)
        }

        return response
      } catch (err) {
        // Error
        return this.errorHandler(context)
      }
    })()
  }
}
