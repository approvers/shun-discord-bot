import { safeLoad } from "js-yaml"
import { readFileSync } from "fs"

interface Document {
  readonly ROOT: string
}

interface Grass extends Document {
  readonly setup: string
  readonly image: string
  readonly dark: string
  readonly target: string
}

type Screenshot = Document

interface Usage {
  readonly grass: Grass
  readonly screenshot: Screenshot
}

export default safeLoad(readFileSync("usage.yml", "utf-8")) as Usage
