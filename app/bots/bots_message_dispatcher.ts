import Channel from '#models/channel'
import Message from '#models/message'
import Organization from '#models/organization'
import User from '#models/user'
import AlbertaBot from './alberta/alberta_bot.js'

export default class BotsMessageDispatcher {
  private static bots = [AlbertaBot]

  async dispatch(organization: Organization, channel: Channel, user: User, message: Message) {
    for (const Bot of BotsMessageDispatcher.bots) {
      const bot = new Bot()

      /**
       * Handle the message if it starts with the bot prefix,
       * as a new incoming request to the bot.
       */
      if (message.body.startsWith(Bot.prefix)) {
        await bot.handleMessage(organization, channel, user, message)
      }

      /**
       * Handle the message if it starts as an answer to the bot,
       * as an answer to a previous bot request.
       */
      if (message.body.startsWith(`Answer for ${Bot.prefix}`)) {
        await bot.handleAnswer(organization, channel, user, message)
      }
    }
  }
}
