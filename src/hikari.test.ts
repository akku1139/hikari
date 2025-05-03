import { METHODS_LOWERCASE } from "./define.ts"
import { Hikari } from "./hikari.ts"
import test from "node:test"
import { strictEqual } from "node:assert/strict"

const logger = {
  log: (..._: Array<unknown>) => void 0
}

test("new Hikari()", () => {
  new Hikari()
})

test("HTTP methods", async t => {
  for(const method of METHODS_LOWERCASE) {
    await t.test(method, async () => {
      const app = new Hikari()[method]("/", () => new Response("Res"))
      const res = await app.fetch(new Request("https://example.com/", { method: method.toUpperCase() }))
      strictEqual(await res.text(), "Res")
    })
  }
})

test("Middleware", async t => {
  await t.test("Basic", async () => {
    const app = new Hikari()
      app.get("/", async c => { logger.log("middleware1 start"); await c.next(); logger.log("middleware1 end"); })
      app.get("/", async c => { logger.log("middleware2 start"); await c.next(); logger.log("middleware2 end"); })
      app.get("/", async c => { logger.log("middleware3 start"); await c.next(); logger.log("middleware3 end"); })
      app.get("/", async c => { logger.log("middleware4 start"); await c.next(); logger.log("middleware4 end"); })
      app.get("/", () => { logger.log("handler"); return new Response("Res"); })
    const res = await app.fetch(new Request("https://example.com/"))
    strictEqual(await res.text(), "Res")
  })
  await t.test("Early return", async () => {
    const app = new Hikari()
      app.get("/", async c => { logger.log("middleware1 start"); await c.next(); logger.log("middleware1 end"); })
      app.get("/", async () => { logger.log("middleware2 early return"); return new Response("Early res"); })
      app.get("/", () => { logger.log("handler"); return new Response("Res"); })
    const res = await app.fetch(new Request("https://example.com/"))
    strictEqual(await res.text(), "Early res")
  })
})

test("Set headers from middleware", async () => {
  const app = new Hikari()
    .get("/", c => { c.headers.set("header1", "1"); c.next(); })
    .get("/", c => { c.headers.set("header2", "2"); c.next(); })
    .get("/", () => new Response("Res", { headers: { header2: "new 2", header3: "3" } }))
  const res = await app.fetch(new Request("https://example.com/"))

  strictEqual(res.headers.get("header1"), "1")
  strictEqual(res.headers.get("header2"), "new 2")
  strictEqual(res.headers.get("header3"), "3")
})
