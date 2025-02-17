import type { Env, Handler } from "../types"
import type { Router } from "./router-core"

export class SimpleRouter <E extends Env> implements Router <E> {
  routes: Map<[string, string], Array<Handler<E>>>

  constructor() {
    this.routes = new Map()
  }

  add(method: string, path: string, handler: Array<Handler<E>>): boolean {
    const route = this.routes.get([method, path])

    if(route === void 0) {
      this.routes.set([method, path], handler)
      return true
    }

    this.routes.set([method, path], [...route, ...handler])
    return true
  }

  match(method: string, path: string): Array<Handler<E>> {
    const route = this.routes.get([method, path])
    return route ?? []
  }
}
