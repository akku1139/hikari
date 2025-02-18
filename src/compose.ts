/**
 * Koa's compose system
 * Special thanks to @EdamAme-x
 */

import type { Handler, Context, Next, Env } from "./types"

export const compose = <E extends Env> (handlers: Array<Handler<E>>) => {
  return (context: Context<E>, next?: Next): Promise<void | Response> => {
    // last called middleware #
    let index = -1

    const dispatch = async (current: number): Promise<Response | void> => {
      if(current <= index) {
        Promise.reject(new Error("next() called multiple times"))
      }
      index = current

      let handler: Handler<E> | undefined = handlers[current]
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
