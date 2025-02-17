// export type MaybePromise<T> = T | PromiseLike<T> | Promise<T>

export type Env = Partial<{
  Bindings: object
  States: object
}>

export type Next = () => Promise<Response | void>

export type Context<E extends Env = {}> = {
  request: Request
  state: E["States"]
  next: Next
}

export type Handler = (argument: Context) => Response | void | Promise<Response | void>
export type NotFoundHandler = (argument: Context) => Response
export type ErrorHandler = (argument: Context, error: unknown) => Response
