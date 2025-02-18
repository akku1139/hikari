import test from "node:test"
import { strictEqual } from "node:assert/strict"
import { getPath, getPathNoStrict } from "./url"

const pathList: Array<[string, string, string]> = [
  // ["input": "getPath", "getPathNoStrict"],
  ["/", "/", "/"],
  ["/abc", "/abc", "/abc"],
  ["/abc/", "/abc/", "abc"]
]

test("getPath", () => {
  for(const p of pathList) {
    const req = new Request(p[0])
    strictEqual(getPath(req), p[1])
    strictEqual(getPathNoStrict(req), p[2])
  }
})
