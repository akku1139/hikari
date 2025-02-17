import type { METHODS } from "./define"
import { HikariCore, type HikariOptions } from "./hikari-core"
import type { Handler } from "./types"

export class Hikari extends HikariCore {
  constructor(options?: HikariOptions) {
    super(options)
  }

  #methodRoute(method: typeof METHODS[number]) {
    return (path: string, ...handlers: Array<Handler>) => this.on(method, path, handlers)
  }
  get = this.#methodRoute("GET")
  post = this.#methodRoute("POST")
  put = this.#methodRoute("PUT")
  delete = this.#methodRoute("DELETE")
  // options = this.#methodRoute("OPTIONS")
  patch = this.#methodRoute("PATCH")
  use(path: string, ...handlers: Array<Handler>) {
    return this
      .on("GET", path, handlers)
      .on("POST", path, handlers)
      .on("PUT", path, handlers)
      .on("DELETE", path, handlers)
      .on("OPTIONS", path, handlers)
      .on("PATCH", path, handlers)
  }
  all = this.use
}
