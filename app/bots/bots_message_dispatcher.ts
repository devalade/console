import Channel from '#models/channel'
import Message from '#models/message'
import Organization from '#models/organization'
import User from '#models/user'
import AlbertaBot from './alberta/alberta_bot.js'

export default class BotsMessageDispatcher {
  private static bots = [AlbertaBot]

  async dispatch(organization: Organization, channel: Channel, user: User, message: Message) {
    for (const Bot of BotsMessageDispatcher.bots) {
      if (message.body.startsWith(Bot.prefix)) {
        const bot = new Bot()
        await bot.handleMessage(organization, channel, user, message)
      }
    }
  }
}
