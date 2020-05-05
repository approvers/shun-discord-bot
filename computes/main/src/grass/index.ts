import cron from "node-cron"
import * as database from "./database"
import usage from "../usage"
import Message from "../message"
import { Command } from "../command"
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

const grassCommand = new Command()

Command.add("!grass", async (args, message) => {
  const [sub, name] = args
  if (sub !== undefined && sub !== "help") return
  switch (name) {
    case "setup":
      await message.channel.send(usage.grass.setup)
      return
    case "enable":
      await message.channel.send(usage.grass.enable)
      return
    case "disable":
      await message.channel.send(usage.grass.disable)
      return
    case "image":
      await message.channel.send(usage.grass.image)
      return
    case "dark":
      await message.channel.send(usage.grass.dark)
      return
    case "target":
      await message.channel.send(usage.grass.target)
      return
    default:
      await message.channel.send(usage.grass._root)
      return
  }
})

grassCommand.add("setup", async (args, message) => {
  const name = args[0]
  const id = message.author.id
  if (name == null) {
    await message.channel.send(usage.grass.setup)
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

grassCommand.add("enable", async (args, message) => {
  const id = message.author.id
  const result = await database.updateConfig(id, { enable: true })
  if (result) {
    await message.reply("草Botを有効にしました。")
    return
  }
  await message.reply("セットアップが行われていません。")
  await message.channel.send(usage.grass.setup)
})

grassCommand.add("disable", async (args, message) => {
  const id = message.author.id
  const result = await database.updateConfig(id, { enable: false })
  if (result) {
    await message.reply("草Botを無効にしました。")
    return
  }
  await message.reply("セットアップが行われていません。")
  await message.channel.send(usage.grass.setup)
})

grassCommand.add("image", async (args, message) => {
  const config = args[0]
  const id = message.author.id
  let result
  switch (config) {
    case "on":
      result = await database.updateConfig(id, { display: true })
      break
    case "off":
      result = await database.updateConfig(id, { display: false })
      break
    default:
      await message.channel.send(usage.grass.image)
      return
  }
  if (result) {
    const response = config === "on" ? "有効" : "無効"
    await message.reply(`画像表示を${response}にしました。`)
    return
  }
  await message.reply("セットアップが行われていません。")
  await message.channel.send(usage.grass.setup)
})

grassCommand.add("dark", async (args, message) => {
  const config = args[0]
  const id = message.author.id
  let result
  switch (config) {
    case "on":
      result = await database.updateConfig(id, { dark: true })
      break
    case "off":
      result = await database.updateConfig(id, { dark: false })
      break
    default:
      await message.channel.send(usage.grass.dark)
      return
  }
  if (result) {
    const response = config === "on" ? "有効" : "無効"
    await message.reply(`ダークモードを${response}にしました。`)
    await message.reply("画像のアップデートを開始します。")
    await database.updateGrass(id)
    await message.reply("画像のアップデートが完了しました。")
    return
  }
  await message.reply("セットアップが行われていません。")
  await message.channel.send(usage.grass.setup)
})

grassCommand.add("target", async (args, message) => {
  const config = args[0]
  const id = message.author.id
  let result
  switch (config) {
    case "today":
      result = await database.updateConfig(id, { target: "today" })
      break
    case "week":
      result = await database.updateConfig(id, { target: "week" })
      break
    case "year":
      result = await database.updateConfig(id, { target: "year" })
      break
    default:
      await message.channel.send(usage.grass.target)
      return
  }
  if (result) {
    await message.reply(`期間を${config}に設定しました。`)
    return
  }
  await message.reply("セットアップが行われていません。")
  await message.channel.send(usage.grass.setup)
})

Command.add("!grass", grassCommand)

cron.schedule("0 0 * * * *", database.updateAllGrass)
