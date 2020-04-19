import { safeLoad } from "js-yaml"
import { readFileSync } from "fs"

interface Document {
  _root: string
}

interface Grass extends Document {
  setup: string
  enable: string
  disable: string
  image: string
  dark: string
}

interface Usage {
  grass: Grass
}

export default safeLoad(readFileSync("usage.yml", "utf-8")) as Usage
