import Organization from '#models/organization'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class PlayWithChat extends BaseCommand {
  static commandName = 'play:with-chat'
  static description = ''

  static options: CommandOptions = { startApp: true }

  async run() {
    const org = await Organization.query().first()
    const channel = await org!.related('channels').query().first()
    const user = await org!.related('members').query().first()

    const message = await channel!.related('messages').create({
      body: 'Hello!',
      bot: 'Alberta',
      askedUserForAnswerId: user!.id,
      userId: null,
    })
    console.log('Message created:', message)
  }
}
