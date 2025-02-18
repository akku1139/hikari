import test from "node:test"
import { strictEqual } from "node:assert/strict"
import { getPath, getPathNoStrict } from "./url.ts"

const pathList: Array<[string, string, string]> = [
  // ["input": "getPath", "getPathNoStrict"],
  ["/", "/", "/"],
  ["/abc", "/abc", "/abc"],
  ["/abc/", "/abc/", "/abc"]
]

test("getPath", async (t) => {
  for(const p of pathList) {
    await t.test(`path: ${p[0]}`, async (t) => {
      const req = new Request("https://example.com" + p[0])
      await t.test("getPath", () => strictEqual(getPath(req), p[1]) )
      await t.test("getPathNoStrict", () => strictEqual(getPathNoStrict(req), p[2]) )
    })
  }
})
