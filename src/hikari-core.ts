import { METHODS } from "./define"
import { SimpleRouter } from "./router/index.js"
import type { Router } from "./router/router-core.js"
import type { Handler, ResponseHandler } from "./types.js"

export class HikariCore {
  router: Router

  notFoundHandler: ResponseHandler
  errorHandler: ResponseHandler

  constructor() {
    this.router = new SimpleRouter()
    this.notFoundHandler = () => new Response("404 Not Found", { status: 404 })
    this.errorHandler = () => new Response("Internal Server Error", { status: 500 })
  }

  on(method: typeof METHODS[number] | string, path: string, handlers: Array<Handler>) {
    this.router.add(method.toUpperCase(), path, handlers)
  }

  fetch(request: Request): Response | Promise<Response> {
    const handlers = this.router.match(
      request.method,
      new URL(request.url).pathname
    )

    if(handlers.length === 0) {
      return this.notFoundHandler()
    }

    for(const handler of handlers) {
      const handlerResult = handler()

      if(handlerResult instanceof Response) {
        return handlerResult
      }
    }

    return this.errorHandler()
  }
}
