/**
 * Koa's compose system
 * Special thanks to @EdamAme-x
 */

import type { Handler, Context, Next } from "./types"

export const compose = (handlers: Array<Handler>) => {
  return (context: Context, next?: Next) => {
    // last called middleware #
    let index = -1

    const dispatch = async (current: number): Promise<Response | void> => {
      if(current <= index) {
        Promise.reject(new Error("next() called multiple times"))
      }
      index = current

      let handler: Handler | undefined = handlers[current]
      if(current === handlers.length) {
        handler = next
      }
      if(!handler) {
        return
      }

      try {
        context.next = () => dispatch(current + 1)
        return await handler(context)
      } catch (err) {
        return Promise.reject(err)
      }
    }

    return dispatch(0)
  }
}
