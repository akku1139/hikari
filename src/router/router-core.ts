import type { Env, Handler } from "../types.ts"

export interface Router <E extends Env> {
  add(method: string, path: string, handler: Array<Handler<E>>): void
  match(method: string, path: string): Array<Handler<E>>
}
