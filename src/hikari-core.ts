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

  notFoundHandler: NotFoundHandler<E>
  errorHandler: ErrorHandler<E>

  #getPath: GetPath

  constructor(options?: HikariOptions<E>) {
    this.router = new HikariRouter()
    this.notFoundHandler = options?.notFound ?? (() => new Response("404 Not Found", { status: 404 }))
    this.errorHandler = options?.onError ?? ((_, error) => {
      console.error(error)
      return new Response("Internal Server Error", { status: 500 })}
    )

    const strict = options?.strict ?? true
    this.#getPath = strict ? getPath : getPathNoStrict
  }

  on(method: typeof METHODS[number] | (string & {}), path: string, ...handlers: Array<Handler<E>>): this {
    // TODO: use getPath
    for (const handler of handlers) {
      this.router.add(method.toUpperCase(), path, handler)
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
      request,
      state: Object.create(null),
    }

    if(handlers.length === 0) {
      return this.notFoundHandler(context)
    }

    const composed = handlers.length === 1 ?  async (context: RequestContext<E>) => {
      const hContext: HandlerContext<E> = {
        ...context,
        next: async () => { /* Do Nothing */  },
        param: (param: string) => handlers[0]![1][param]
      }
      return await handlers[0]![0](hContext)
    } : compose(handlers)

    return (async () => {
      try {
        const response = await composed(context)

        if(!response) {
          return this.errorHandler(context, new Error(
            "Did you forget to return a Response object or `await next()`?"
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
