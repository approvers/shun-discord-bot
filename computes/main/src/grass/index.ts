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
  await message.channel.send(grass.image)
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

export const parseCommand = async (
  commands: string[],
  message: Discord.Message,
): Promise<void> => {
  if (commands[0] !== "!grass") return
  switch (commands[1]) {
    case "setup":
      await setup(commands, message)
      return
    default:
      await message.channel.send(usage.grass._root)
      break
  }
}
