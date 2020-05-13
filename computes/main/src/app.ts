import * as Discord from "discord.js"
import Message from "./message"
import { Command } from "./command"
import "./grass"
import "./screenshot"

const client = new Discord.Client()
const token = process.env.DISCORD_TOKEN
if (!token) throw new Error("env is not defined")

client.login(token).catch(console.error)

client.on("ready", () => console.log("Ready..."))

client.on("message", async (message) => {
  await Message.run(message)
  await Command.run(message)
})
