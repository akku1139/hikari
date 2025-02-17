// export type MaybePromise<T> = T | PromiseLike<T> | Promise<T>

export type Next = () => Promise<Response | void>

export type Context = {
  request: Request,
  next: Next,
}

export type Handler = (argument: Context) => Response | void | Promise<Response | void>
export type ResponseHandler = (argument: Context) => Response
