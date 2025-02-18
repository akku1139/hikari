import test from "node:test"
import { strictEqual } from "node:assert/strict"
import { getPath, getPathNoStrict } from "./url.ts"

const pathList: Array<[string, string, string]> = [
  // ["input": "getPath", "getPathNoStrict"],
  ["/", "/", "/"],
  ["/abc", "/abc", "/abc"],
  ["/abc/", "/abc/", "abc"]
]

test("getPath", async (t) => {
  for(const p of pathList) {
    await t.test(`path: ${p[0]}`, () => {
      const req = new Request("https://example.com" + p[0])
      strictEqual(getPath(req), p[1])
      strictEqual(getPathNoStrict(req), p[2])
    })
  }
})
