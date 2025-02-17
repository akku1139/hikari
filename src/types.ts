// export type MaybePromise<T> = T | PromiseLike<T> | Promise<T>

export type HandlerArgument = {
  request: Request,
  next: () => Promise<void>
}

export type Handler = (argument: HandlerArgument) => Response | Promise<Response> | void
export type ResponseHandler = (argument: HandlerArgument) => Response
