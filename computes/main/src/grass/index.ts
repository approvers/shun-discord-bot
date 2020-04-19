import * as database from "./database"
import * as Discord from "discord.js"
import usage from "../usage"

export const sayGrass = async (message: Discord.Message): Promise<void> => {
  if (message.author.bot) return
  if (!message.member?.id) return
  if (Math.ceil(Math.random() * 100) % 5) return
  if (!message.content.match(/(草|くさ|kusa)/iu)) return
  const grass = await database.getGrass(message.member.id)
  if (!grass?.enable) return
  const count = grass[grass.target]
  const grassPromises = "w"
    .repeat(count)
    .match(/.{1,2000}/g)
    ?.map((grassStr) => message.channel.send(grassStr))
  if (grassPromises) await Promise.all(grassPromises)
  if (grass.display) {
    await message.channel.send(grass.image)
  }
}

const setup = async (
  commands: string[],
  message: Discord.Message,
): Promise<void> => {
  const name = commands[2]
  const id = message.member?.id as string
  if (name === undefined) {
    await message.channel.send(usage.grass.setup)
    return
  }
  await message.reply("セットアップを開始します。(これには時間がかかります。)")
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
    dark: true,
    target: "year",
  })
  await message.reply("セットアップが完了しました。")
}

const enable = async (
  commands: string[],
  message: Discord.Message,
): Promise<void> => {
  const id = message.author.id
  try {
    await database.updateConfig(id, { enable: true })
    await message.reply("草Botを有効にしました。")
  } catch {
    await message.reply("セットアップが行われていません。")
    await message.channel.send(usage.grass.setup)
  }
}

const disable = async (
  commands: string[],
  message: Discord.Message,
): Promise<void> => {
  const id = message.author.id
  try {
    await database.updateConfig(id, { enable: false })
    await message.reply("草Botを無効にしました。")
  } catch {
    await message.reply("セットアップが行われていません。")
    await message.channel.send(usage.grass.setup)
  }
}

const image = async (
  commands: string[],
  message: Discord.Message,
): Promise<void> => {
  const config = commands[2]
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
}

const dark = async (
  commands: string[],
  message: Discord.Message,
): Promise<void> => {
  const config = commands[2]
  const id = message.member?.id as string
  const user = await database.getGrass(id)
  if (!user) {
    await message.reply("セットアップが行われていません。")
    await message.channel.send(usage.grass.setup)
    return
  }
  switch (config) {
    case "on":
      await database.updateConfig(id, { dark: true })
      break
    case "off":
      await database.updateConfig(id, { dark: false })
      break
    default:
      await message.channel.send(usage.grass.image)
      return
  }
  await message.reply(
    `ダークモードを${config === "on" ? "有効" : "無効"}にしました。`,
  )
}

export const parseCommand = async (
  commands: string[],
  message: Discord.Message,
): Promise<void> => {
  if (commands[0] !== "!grass") return
  switch (commands[1]) {
    case "setup":
      await setup(commands, message)
      break
    case "enable":
      await enable(commands, message)
      break
    case "disable":
      await disable(commands, message)
      break
    case "image":
      await image(commands, message)
      break
    case "dark":
      await dark(commands, message)
      break
    case "help":
    default:
      await message.channel.send(usage.grass._root)
      break
  }
}
