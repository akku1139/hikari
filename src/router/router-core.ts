import type { Handler } from "../types"

export interface Router {
  add(method: string, path: string, handler: () => Response): boolean
  match(method: string, path: string): Array<Handler>
}
