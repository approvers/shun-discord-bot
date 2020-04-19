import { Request, Response } from "express"
import * as scraping from "./scraping"
import * as storage from "./storage"

module.exports = async (req: Request, res: Response) => {
  const name = req.body.name
  const isDark = req.body.dark
  if (name == null || isDark == null) return res.status(400).send()

  const grass = await scraping.getData(name, isDark)
  if (grass == null) return res.status(404).send()

  const image = await storage.addImage(name, grass.image)

  return res.status(200).json({
    today: grass.today,
    week: grass.week,
    year: grass.year,
    image,
  })
}
