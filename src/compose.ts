/**
 * Koa's compose system
 * Special thanks to @EdamAme-x
 */

import type { Params } from "./router/router-core.ts"
import type { Handler, Next, Env, RequestContext, HandlerContext } from "./types.ts"

export const compose = <E extends Env> (handlers: Array<[Handler<E>, Params]>) => {
  return (requestContext: RequestContext<E>, next?: Next): Promise<void> => {
    // last called middleware number
    let index = -1

    let response: Response | undefined | void
    // let isError: boolean = false

    let handler: Handler<E> | undefined

    const dispatch = async (current: number): Promise<void> => {
      if(current <= index) {
        Promise.reject(new Error("next() called multiple times"))
      }
      index = current

      handler = handlers[current]?.[0]

      if(current === handlers.length) {
        handler = next
      }
      if(!handler) {
        return
      }

      try {
        const context: HandlerContext<E> = {
          ...requestContext,
          next: () => dispatch(current + 1),
          param: (param: string) => handlers[current]?.[1][param]
        }
        response = await handler(context)
        if(response) {
          context.responses.push(response)
        }
        return
      } catch (err) {
        return Promise.reject(err)
      }
    }

    return dispatch(0)
  }
}
