import { fetchScreenshot } from "./fetch"
import usage from "../usage"
import { Command } from "../command"
import { MessageAttachment } from "discord.js"

Command.add("!screenshot", async (args, message) => {
  if (message.author.bot) return
  const [url] = args
  if (!url || url === "help") {
    await message.channel.send(usage.screenshot.ROOT)
    return
  }
  await message.channel.send("スクリーンショットの取得を開始します")
  const imageBuffer = await fetchScreenshot(url)
  if (imageBuffer == null) {
    await message.channel.send("スクリーンショットの取得に失敗しました")
    return
  }
  const image = new MessageAttachment(imageBuffer)
  await message.channel.send(image)
})
