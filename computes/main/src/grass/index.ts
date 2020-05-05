import cron from "node-cron"
import * as database from "./database"
import usage from "../usage"
import Message from "../message"
import Command from "../command"
import { MessageAttachment } from "discord.js"

Message.add(async (message) => {
  if (message.author.bot) return
  const id = message.author.id
  if (!message.content.match(/(草|くさ|kusa)/iu)) return
  const grass = await database.getGrass(id)
  if (!grass?.enable) return
  const count = grass[grass.target]
  const sendPromise = "w"
    .repeat(count)
    .match(/.{1,2000}/g)
    ?.map((grassStr) => message.channel.send(grassStr))
  if (sendPromise) await Promise.all(sendPromise)
  if (grass.display) {
    const image = new MessageAttachment(grass.image)
    await message.channel.send("", image)
  }
})

const mainCommand = "!grass"

Command.add(async (args, message) => {
  const [main, sub] = args
  if (main !== mainCommand || (sub !== undefined && sub !== "help")) return
  await message.channel.send(usage.grass._root)
})

Command.add(async (args, message) => {
  const [main, sub, name] = args
  const id = message.author.id
  if (main !== mainCommand && sub !== "setup") return
  if (sub !== "setup") return
  if (name == null) {
    await message.channel.send(usage.grass.setup)
    return
  }
  await message.reply("セットアップを開始します(これには時間がかかります)。")
  const grass = await database.fetchGrass(name, false)
  if (grass == null) {
    await message.reply("指定したユーザーは存在しません。")
    return
  }
  await database.setGrass(id, {
    ...grass,
    name,
    enable: true,
    display: true,
    dark: false,
    target: "year",
  })
  await message.reply("セットアップが完了しました。")
})

Command.add(async (args, message) => {
  const [main, sub] = args
  if (main !== mainCommand || sub !== "enable") {
    return
  }
  const id = message.author.id
  try {
    await database.updateConfig(id, { enable: true })
    await message.reply("草Botを有効にしました。")
  } catch {
    await message.reply("セットアップが行われていません。")
    await message.channel.send(usage.grass.setup)
  }
})

Command.add(async (args, message) => {
  const [main, sub] = args
  if (main !== mainCommand || sub !== "disable") return
  const id = message.author.id
  try {
    await database.updateConfig(id, { enable: false })
    await message.reply("草Botを無効にしました。")
  } catch {
    await message.reply("セットアップが行われていません。")
    await message.channel.send(usage.grass.setup)
  }
})

Command.add(async (args, message) => {
  const [main, sub, config] = args
  if (main !== mainCommand || sub !== "image") return
  const id = message.author.id
  try {
    switch (config) {
      case "on":
        await database.updateConfig(id, { display: true })
        break
      case "off":
        await database.updateConfig(id, { display: false })
        break
      default:
        await message.channel.send(usage.grass.image)
        return
    }
    await message.reply(
      `画像表示を${config === "on" ? "有効" : "無効"}にしました。`,
    )
  } catch {
    await message.reply("セットアップが行われていません。")
    await message.channel.send(usage.grass.setup)
  }
})

Command.add(async (args, message) => {
  const [main, sub, config] = args
  if (main !== mainCommand || sub !== "dark") return
  const id = message.author.id
  try {
    switch (config) {
      case "on":
        await database.updateConfig(id, { dark: true })
        break
      case "off":
        await database.updateConfig(id, { dark: false })
        break
      default:
        await message.channel.send(usage.grass.dark)
        return
    }
    await message.reply(
      `ダークモードを${config === "on" ? "有効" : "無効"}にしました。`,
    )
    await database.updateGrass(id)
    await message.reply("画像のアップデートが完了しました。")
  } catch {
    await message.reply("セットアップが行われていません。")
    await message.channel.send(usage.grass.setup)
  }
})

Command.add(async (args, message) => {
  const [main, sub, config] = args
  if (main !== mainCommand || sub !== "target") return
  const id = message.author.id
  try {
    switch (config) {
      case "today":
        await database.updateConfig(id, { target: "today" })
        break
      case "week":
        await database.updateConfig(id, { target: "week" })
        break
      case "year":
        await database.updateConfig(id, { target: "year" })
        break
      default:
        await message.channel.send(usage.grass.target)
        return
    }
    await message.reply(`期間を${config}に設定しました。`)
  } catch {
    await message.reply("セットアップが行われていません。")
    await message.channel.send(usage.grass.setup)
  }
})

cron.schedule("0 0 * * * *", database.updateAllGrass)
