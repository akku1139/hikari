import { METHODS } from "./define"

export class HikariCore {
  on(methods: Array<typeof METHODS>) {

  }

  fetch(request: Request): Response | Promise<Response> {
    return new Response("Response")
  }
}
