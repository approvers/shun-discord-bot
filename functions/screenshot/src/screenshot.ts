import puppeteer from "puppeteer"
import { Request, Response } from "express"

async function screenshot(url: string): Promise<Buffer> {
  const browser = await puppeteer.launch({ args: ["--lang=ja"] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })
  await page.emulateTimezone("Asia/Tokyo")
  await page.setExtraHTTPHeaders({ "Accept-language": "ja-JP" })
  await page.goto(url)

  const image = await page.screenshot({
    encoding: "binary",
    fullPage: true,
    quality: 100,
    type: "jpeg",
  })
  await browser.close()
  return image
}

module.exports = async function takeScreenshot(
  req: Request,
  res: Response,
): Promise<void> {
  const url = req.query.url
  if (typeof url !== "string") {
    res.status(400).send()
    return
  }
  let image: Buffer
  try {
    image = await screenshot(url)
  } catch {
    res.status(404).send()
    return
  }
  res.contentType("image/jpeg")
  res.status(200).send(image)
}
