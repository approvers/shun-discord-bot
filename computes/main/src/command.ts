import { Message } from "discord.js"

type CommandFunction = (args: string[], message: Message) => Promise<void>

export default class {
  private static commandFunctions: CommandFunction[] = []
  static add(func: CommandFunction): void {
    this.commandFunctions.push(func)
  }
  static run(message: Message): Promise<void[]> {
    const commands = message.content.trim().replace(/\s+/g, " ").split(" ")
    const functionPromise = this.commandFunctions.map((func) =>
      func(commands, message),
    )
    return Promise.all(functionPromise)
  }
}
