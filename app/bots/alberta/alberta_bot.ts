import Channel from '#models/channel'
import Message from '#models/message'
import Organization from '#models/organization'
import User from '#models/user'
import OpenAI from 'openai'
import { IBot } from '../ibot.js'
import prepareAlbertaAiFunctions from './alberta_ai_functions.js'
import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'

export default class AlbertaBot implements IBot {
  static prefix = '@Alberta'
  #openai = new OpenAI()

  async handleMessage(organization: Organization, channel: Channel, user: User, message: Message) {
    const { functions } = prepareAlbertaAiFunctions(organization, channel, user)
    const runner = this.#openai.beta.chat.completions
      .runTools({
        model: 'gpt-4-1106-preview',
        messages: [
          {
            role: 'system',
            content: `Your name is Alberta, and your a (very) senior 10X data engineer, and you are here to help with any data-related questions.
            You are employed by ${organization.name} (slug: ${organization.slug})
            You are in the ${channel.name} channel.

            Always use the 'askQuestion' function to ask the user a question, and wait for the answer.

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

  async handleAnswer(organization: Organization, _channel: Channel, _user: User, message: Message) {
    emitter.emit(`organizations:${organization.slug}:alberta:answer`, message)
  }
}
