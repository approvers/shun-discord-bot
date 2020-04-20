import { Request, Response } from "express"
import * as scraping from "./scraping"

module.exports = async (req: Request, res: Response) => {
  const name = req.body.name
  const isDark = req.body.dark
  if (name == null || isDark == null) return res.status(400).send()

  const grass = await scraping.getData(name, isDark)
  if (grass == null) return res.status(404).send()

  const image = grass.image.toString("base64")

  return res.status(200).json({
    ...grass,
    image,
  })
}
