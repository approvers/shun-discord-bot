import { Message } from "discord.js"

type CommandFunc = (args: string[], message: Message) => Promise<void>
type CommandData = {
  name: string
  command: CommandFunc | Command
}

export class Command {
  private static globalCommands: CommandData[] = []

  static add(name: string, command: CommandFunc | Command): void {
    this.globalCommands.push({ name, command })
  }

  static async run(message: Message): Promise<void> {
    const args = message.content.trim().replace(/\s+/g, " ").split(" ")
    await Command.runCommands(args, message, this.globalCommands)
  }

  commands: CommandData[] = []

  add(name: string, command: CommandFunc | Command): void {
    this.commands.push({ name, command })
  }

  private async run(args: string[], message: Message): Promise<void> {
    await Command.runCommands(args, message, this.commands)
  }

  private static async runCommands(
    args: string[],
    message: Message,
    commands: CommandData[],
  ): Promise<void> {
    const runPromise = commands.map(({ name, command }) => {
      if (args[0] !== name) return
      if (command instanceof Command) {
        return command.run(args.slice(1), message)
      }
      return command(args.slice(1), message)
    })
    await Promise.all(runPromise)
  }
}
