import type { METHODS } from "./define.ts"
import { HikariCore, type HikariOptions } from "./hikari-core.ts"
import type { Env, Handler } from "./types.ts"

type MethodRoute<E extends Env> = (path: string, ...handlers: Array<Handler<E>>) => Hikari<E>

export class Hikari <
  E extends Env
> extends HikariCore <E> {

  constructor(options?: HikariOptions<E>) {
    super(options)
  }

  #methodRoute(method: typeof METHODS[number]) {
    return (path: string, ...handlers: Array<Handler<E>>): this => this.on(method, path, handlers)
  }
  get: MethodRoute<E> = this.#methodRoute("GET")
  post: MethodRoute<E> = this.#methodRoute("POST")
  put: MethodRoute<E> = this.#methodRoute("PUT")
  delete: MethodRoute<E> = this.#methodRoute("DELETE")
  options: MethodRoute<E> = this.#methodRoute("OPTIONS")
  patch: MethodRoute<E> = this.#methodRoute("PATCH")
  use(path: string, ...handlers: Array<Handler<E>>): this {
    return this.on("ALL", path, handlers)
  }
  all: MethodRoute<E> = this.use

  request(target: RequestInfo | URL, init?: RequestInit): Response | Promise<Response> {
    if(target instanceof Request) {
      return this.fetch(init ? new Request(target, init) : target)
    }
    if(target instanceof URL) {
      return this.fetch(new Request(target, init))
    }
    return this.fetch(new Request(
      /^https?:\/\//.test(target) ? target : new URL(target, "http://localhost"),
      init
    ))
  }
}
