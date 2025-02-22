import * as process from "node:process"
import * as fs from "node:fs"
import * as path from "node:path"

import * as pkg from "../package.json"

if(process.env.npm_package_version === void 0) {
  throw new Error("process.env.npm_package_version is undefined.")
}

fs.writeFileSync(
  path.join(process.cwd(), "jsr.json"),
  JSON.stringify(
    {
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
    }
    )
)
