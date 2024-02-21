import Channel from '#models/channel'
import Message from '#models/message'
import Organization from '#models/organization'
import User from '#models/user'
import logger from '@adonisjs/core/services/logger'
import OpenAI from 'openai'
import { IBot } from '../ibot.js'
import prepareAlbertaAiFunctions from './alberta_ai_functions.js'

export default class AlbertaBot implements IBot {
  static prefix = '@alberta'
  #openai = new OpenAI()

  async handleMessage(organization: Organization, channel: Channel, user: User, message: Message) {
    const { functions } = prepareAlbertaAiFunctions(organization)
    const runner = this.#openai.beta.chat.completions
      .runTools({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Your name is Alberta, and your a (very) senior 10X data engineer, and you are here to help with any data-related questions.
            You are employed by ${organization.name} (slug: ${organization.slug})
            You are in the ${channel.name} channel.
            You are chatting with ${user.fullName}, who asks you send to you the following message:`,
          },
          { role: 'user', content: message.body },
        ],
        tools: Object.values(functions).map((f) => ({
          type: 'function',
          function: {
            function: f.function,
            description: f.description,
            parse: JSON.parse,
            parameters: f.parameters,
          },
        })) as any,
      })
      .on('message', (message) => {
        logger.info(message)
      })
    const finalContent = await runner.finalContent()

    await channel.related('messages').create({
      body: finalContent!,
      userId: null,
      bot: 'Alberta',
    })
  }
}
