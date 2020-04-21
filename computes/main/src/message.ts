import { Message } from "discord.js"

type MessageFunction = (message: Message) => Promise<void>

export default class {
  private static messageFunctions: MessageFunction[] = []
  static add(func: MessageFunction): void {
    this.messageFunctions.push(func)
  }
  static run(message: Message): Promise<void[]> {
    const functionPromise = this.messageFunctions.map((func) => func(message))
    return Promise.all(functionPromise)
  }
}
