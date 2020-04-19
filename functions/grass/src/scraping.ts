import puppeteer from "puppeteer"

interface Grass {
  today: number
  week: number
  year: number
  image: Buffer
}

export async function getData(
  name: string,
  isDark = false,
): Promise<Grass | null> {
  const url = `https://github.com/${name}`
  const browser = await puppeteer.launch({
    args: ["--lang=ja", "--disable-web-security"],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 4 })
  await page.setBypassCSP(true)
  await page.emulateTimezone("Asia/Tokyo")
  await page.setExtraHTTPHeaders({ "Accept-Language": "ja-JP" })
  await page.goto(url)

  if (isDark) {
    const styleSource = process.env.DARK_THEME_SOURCE
    if (!styleSource) throw new Error("env is not defined")
    await page.evaluate((styleSource) => {
      return fetch(styleSource)
        .then((res) => res.text())
        .then((css) => {
          const style = document.createElement("style")
          style.textContent = css
          document.head.appendChild(style)
        })
    }, styleSource)
  }

  const count = await page.evaluate(() => {
    const grasses = [...document.getElementsByClassName("day")].map((grass) =>
      parseInt(grass.getAttribute("data-count") ?? "0"),
    )
    if (!grasses.length) return null
    const today = grasses.slice(-1)[0]
    const week = grasses.slice(-7).reduce((prev, curr) => prev + curr)
    const year = grasses.reduce((prev, curr) => prev + curr)
    return { today, week, year }
  })

  const rect = await page.evaluate(() => {
    const learnMore = document.querySelector(
      ".contrib-footer > div:first-child",
    )
    learnMore?.parentElement?.removeChild(learnMore)
    const rect = document
      ?.querySelector(".graph-before-activity-overview")
      ?.getBoundingClientRect()
    if (!rect) return null
    return {
      x: rect.left + 1,
      y: rect.top + 1,
      width: rect.width - 2,
      height: rect.height - 2,
    }
  })

  if (!count || !rect) return null

  const image = await page.screenshot({ clip: rect })
  await browser.close()
  return { ...count, image }
}
