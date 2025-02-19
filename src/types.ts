// export type MaybePromise<T> = T | PromiseLike<T> | Promise<T>

export type Env = {
  Bindings?: object
  States?: object
}

export type Next = () => Promise<Response | void>

export type RequestContext<E extends Env> = {
  request: Request
  state: E["States"]
}

export type HandlerContext<E extends Env> = RequestContext<E> & {
  next: Next
  param: (param: string) => string | undefined
}

export type Handler<E extends Env> = (argument: HandlerContext<E>) => Response | void | Promise<Response | void>
export type NotFoundHandler<E extends Env> = (argument: RequestContext<E>) => Response
export type ErrorHandler<E extends Env> = (argument: RequestContext<E>, error: unknown) => Response

export type GetPath = (request: Request) => string
