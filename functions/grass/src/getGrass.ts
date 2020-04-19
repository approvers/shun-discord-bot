import { Request, Response } from "express"
import * as scraping from "./scraping"
import * as storage from "./storage"

module.exports = async (req: Request, res: Response) => {
  const name = req.body.name
  const isDark = req.body.dark
  if (name == null || isDark == null)
    return res.status(400).json({ success: false })

  const grass = await scraping.getData(name, isDark)
  if (grass == null) return res.status(401).json({ success: false })

  const image = await storage.addImage(name, grass.image)

  return res.status(200).json({
    success: true,
    data: {
      today: grass.today,
      week: grass.week,
      year: grass.year,
      image,
    },
  })
}
