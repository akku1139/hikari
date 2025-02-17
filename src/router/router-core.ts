import type { Handler } from "../types"

export interface Router {
  add(method: string, path: string, handler: Array<Handler>): boolean
  match(method: string, path: string): Array<Handler>
}
