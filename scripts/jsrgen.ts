import * as process from "node:process"
import * as fs from "node:fs"
import * as path from "node:path"

if(process.env.npm_package_version === void 0) {
  throw new Error("process.env.npm_package_version is undefined.")
}

fs.writeFileSync(
  path.join(process.cwd(), "jsr.json"),
  JSON.stringify(
    {
      name: "@hikarijs/hikari",
      version: process.env.npm_package_version,
      license: "MIT",
      exports: {
        // TODO: generate from package.json
      },
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
