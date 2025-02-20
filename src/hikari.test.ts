import { METHODS_LOWERCASE } from "./define.ts"
import { Hikari } from "./hikari.ts"
import test from "node:test"
import { strictEqual } from "node:assert/strict"

test("new Hikari()", () => {
  new Hikari()
})

test("HTTP methods", async (t) => {
  for(const method of METHODS_LOWERCASE) {
    await t.test(method, async () => {
      const app = new Hikari()[method]("/", () => new Response("Res"))
      const res = await app.fetch(new Request("https://example.com/", { method: method.toUpperCase() }))
      strictEqual(await res.text(), "Res")
    })
  }
})
