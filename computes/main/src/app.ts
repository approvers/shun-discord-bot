import * as grass from "./grass"
import * as Discord from "discord.js"

const client = new Discord.Client()
const token = process.env.DISCORD_TOKEN
if (!token) throw new Error("env is not defined")

client.login(token).catch(console.error)

client.on("ready", () => console.log("Ready..."))

client.on("message", async (message) => {
  if (message.author.bot) return
  await grass.sayGrass(message)
  const commands = message.content.trim().replace(/\s+/g, " ").split(" ")
  await grass.parseCommand(commands, message)
})
