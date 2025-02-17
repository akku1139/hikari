import { HikariCore } from "./hikari-core"
import type { Handler } from "./types"

export class Hikari extends HikariCore {
  constructor() {
    super()
  }

  get(path: string, ...handlers: Array<Handler>) {
    return this.on("GET", path, handlers)
  }
  post(path: string, ...handlers: Array<Handler>) {
    return this.on("POST", path, handlers)
  }
  put(path: string, ...handlers: Array<Handler>) {
    return this.on("PUT", path, handlers)
  }
  delete(path: string, ...handlers: Array<Handler>) {
    return this.on("DELETE", path, handlers)
  }
  // options(path: string, ...handlers: Array<Handler>) {
  //   return this.on("OPTIONS", path, handlers)
  // }
  patch(path: string, ...handlers: Array<Handler>) {
    return this.on("PATCH", path, handlers)
  }
}
