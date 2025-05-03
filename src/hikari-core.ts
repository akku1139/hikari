import { compose } from "./compose.ts"
import type { METHODS } from "./define.ts"
import { HikariRouter } from "./router/index.ts"
import type { Router } from "./router/router-core.ts"
import type { Handler, NotFoundHandler, ErrorHandler, Env, GetPath, RequestContext, HandlerContext } from "./types.ts"
import { getPath, getPathNoStrict } from "./utils/url.ts"

export type HikariOptions<E extends Env> = Partial<{
  notFound: NotFoundHandler<E>
  onError: ErrorHandler<E>
  strict: boolean
}>

export class HikariCore <
  E extends Env
> {
  router: Router<E>
  routes: Array<{
    path: string
    method: string
    handler: Handler<E>
  }>

  notFoundHandler: NotFoundHandler<E>
  errorHandler: ErrorHandler<E>

  #getPath: GetPath

  constructor(options?: HikariOptions<E>) {
    this.router = new HikariRouter()
    this.routes = []
    this.notFoundHandler = options?.notFound ?? (() => new Response("404 Not Found", { status: 404 }))
    this.errorHandler = options?.onError ?? ((_, error) => {
      console.error(error)
      return new Response("Internal Server Error", { status: 500 })}
    )

    const strict = options?.strict ?? true
    this.#getPath = strict ? getPath : getPathNoStrict
  }

  on(method: METHODS | (string & {}), path: string, handlers: Array<Handler<E>>): this {
    // TODO: use getPath
    for (const handler of handlers) {
      this.router.add(method.toUpperCase(), path, handler)
      this.routes.push({ method, path, handler })
    }
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
      this.#getPath(request)
    )

    const context: RequestContext<E> = {
      headers: new Headers(),
      request,
      states: Object.create(null),
      responses: [],
    }

    if(handlers.length === 0) {
      return this.notFoundHandler(context)
    }

    const composed = handlers.length === 1 ? async (requestContext: RequestContext<E>) => {
      const context: HandlerContext<E> = {
        ...requestContext,
        next: async () => { /* Do Nothing */  },
        param: (param: string) => handlers[0]![1][param]
      }
      const response = await handlers[0]![0](context)
      if(response) {
        context.responses.push(response)
      }
    } : compose(handlers)

    return (async () => {
      try {
        await composed(context)

        if(context.responses.length === 0) {
          return this.errorHandler(context, new Error(
            "Did you forget to return a Response object or `await next()`?"
          ))
        }

        const mergedRes = new Response(
          await context.responses[0]!.arrayBuffer(),
          {
            status: context.responses[0]!.status,
            statusText: context.responses[0]!.statusText,
            // If the header names are duplicated, they will be combined.
            // headers: new Headers([...context.headers.entries(), ...context.responses[0]!.headers.entries()]),
            headers: new Headers({
              ...Object.fromEntries(context.headers.entries()),
              ...Object.fromEntries(context.responses[0]!.headers.entries()),
            }),
          }
        )

        return mergedRes
      } catch (error) {
        // Error
        return this.errorHandler(context, error)
      }
    })()
  }
}
