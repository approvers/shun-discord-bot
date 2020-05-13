import axios from "axios"

export const fetchScreenshot = async (url: string): Promise<Buffer | null> => {
  const screenshotUrl = process.env.TAKE_SCREENSHOT_URL
  if (!screenshotUrl) throw new Error("TAKE_SCREENSHOT_URL is undefined")
  try {
    const { data } = await axios.get<Buffer>(screenshotUrl, {
      responseType: "arraybuffer",
      params: { url },
    })
    return data
  } catch {
    return null
  }
}
