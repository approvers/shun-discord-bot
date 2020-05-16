import { Command } from "../command"

Command.add("!bi", async (args, message) => {
  if (message.author.bot) return
  if (!args.length) return
  const text = args.join(" ")
  if (text.length >= 1994) return
  await message.channel.send(`***${text}***`)
})

Command.add("!bid", async (args, message) => {
  if (message.author.bot) return
  if (!args.length) return
  const text = args.join(" ")
  if (text.length >= 1992) return
  await message.channel.send(`***†${text}†***`)
})
