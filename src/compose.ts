/**
 * Koa's compose system
 * Special thanks to @EdamAme-x
 */

import type { Params } from "./router/router-core.js"
import type { Handler, Next, Env, RequestContext, HandlerContext } from "./types.ts"

export const compose = <E extends Env> (handlers: Array<[Handler<E>, Params]>) => {
  return (context: RequestContext<E>, next?: Next): Promise<void | Response> => {
    // last called middleware
    let index = -1

    const dispatch = async (current: number): Promise<Response | void> => {
      if(current <= index) {
        Promise.reject(new Error("next() called multiple times"))
      }
      index = current

      let handler: Handler<E> | undefined = handlers[current]?.[0]
      
      if(current === handlers.length) {
        handler = next
      }
      if(!handler) {
        return
      }

      try {
        const hContext: HandlerContext<E> = {
          ...context,
          next: () => dispatch(current + 1),
          param: (param: string) => handlers[current]?.[1][param]
        }
        return await handler(hContext)
      } catch (err) {
        return Promise.reject(err)
      }
    }

    return dispatch(0)
  }
}
