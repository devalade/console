import { EventsList } from '@adonisjs/core/types'
import BotsMessageDispatcher from '../bots/bots_message_dispatcher.js'
import { inject } from '@adonisjs/core'

@inject()
export default class MessagesListener {
  constructor(protected botsMessageDispatcher: BotsMessageDispatcher) {}

  async onCreated(payload: EventsList['messages:created']) {
    await this.botsMessageDispatcher.dispatch(...payload)
  }
}
