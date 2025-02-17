import type { Handler } from "../types.js"
import type { Router } from "./router-core"

export class SimpleRouter implements Router {
  routes: Map<[string, string], Array<Handler>>

  constructor() {
    this.routes = new Map()
  }

  add(method: string, path: string, handler: Array<Handler>): boolean {
    const route = this.routes.get([method, path])

    if(route === void 0) {
      this.routes.set([method, path], handler)
      return true
    }

    this.routes.set([method, path], [...route, ...handler])
    return true
  }

  match(method: string, path: string): Array<Handler> {
    const route = this.routes.get([method, path])
    return route ?? []
  }
}
