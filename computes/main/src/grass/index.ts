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

export const parseCommand = async (
  commands: string[],
  message: Discord.Message,
): Promise<void> => {
  if (commands[0] !== "!grass") return
  if (commands[1] === undefined) {
    await message.channel.send(usage.grass._root)
    return
  }
}
