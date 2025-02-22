import * as process from "node:process"
import * as fs from "node:fs"
import * as path from "node:path"

import pkg from "../package.json" with { type: "json" }

const jsrjson = {
  name: "@hikarijs/hikari",
  version: pkg.version,
  license: pkg.license,
  exports: Object.fromEntries(Object.entries(pkg.exports).map(v => [
    v[0], v[1].import.replace(/^\.\/dist\//, "./src/").replace(/\.js$/, ".ts")
  ])),
  publish: {
    include: [
      "jsr.jsonc",
      "LICENSE",
      "README.md",
      "src/**/*.ts"
    ],
    exclude: [
      "src/**/*.test.ts"
    ]
  }
} as const

console.log("Generated jsr.json", JSON.stringify(jsrjson, null, 2))

fs.writeFileSync(
  path.join(process.cwd(), "jsr.json"),
  JSON.stringify(jsrjson)
)
