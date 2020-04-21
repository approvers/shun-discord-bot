import { safeLoad } from "js-yaml"
import { readFileSync } from "fs"

interface Document {
  readonly _root: string
}

interface Grass extends Document {
  readonly setup: string
  readonly enable: string
  readonly disable: string
  readonly image: string
  readonly dark: string
  readonly target: string
}

interface Usage {
  readonly grass: Grass
}

export default safeLoad(readFileSync("usage.yml", "utf-8")) as Usage
