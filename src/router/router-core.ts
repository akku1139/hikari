import type { Env, Handler } from "../types.ts"

export type Params = Record<string, string>

export interface Router <E extends Env> {
  add(method: string, path: string, handler: Handler<E>): void
  match(method: string, path: string): Array<[Handler<E>, Params]>
}
