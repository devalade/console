import { DateTime } from 'luxon'
import { BaseModel, afterSave, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Channel from './channel.js'
import Conversation from './conversation.js'
import emitter from '@adonisjs/core/services/emitter'

export default class Message extends BaseModel {
  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare body: string

  @column()
  declare bot: string | null

  /**
   * Relationships.
   */
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: number | null

  @belongsTo(() => Channel)
  declare channel: BelongsTo<typeof Channel>

  @column()
  declare channelId: number | null

  @belongsTo(() => Conversation)
  declare conversation: BelongsTo<typeof Conversation>

  @column()
  declare conversationId: number | null

  /**
   * Bot-related columns.
   */
  @column()
  declare askedUserForAnswerId: number | null

  @belongsTo(() => User, { foreignKey: 'askedUserForAnswerId' })
  declare askedUserForAnswer: BelongsTo<typeof User>

  @column()
  declare replied: boolean

  /**
   * Hooks.
   */
  @afterSave()
  static async emitUpdateEvent(message: Message) {
    if (message.conversationId) {
      await message.load('conversation', (query) => query.preload('organization'))
    }
    if (message.channelId) {
      await message.load('channel', (query) => query.preload('organization'))
    }
    await message.load('user')
    emitter.emit(
      `organizations:${(message.conversation || message.channel).organization.slug}:message-update`,
      message
    )
  }

  @beforeDelete()
  static async emitDeleteEvent(message: Message) {
    if (message.conversationId) {
      await message.load('conversation', (query) => query.preload('organization'))
    }
    if (message.channelId) {
      await message.load('channel', (query) => query.preload('organization'))
    }
    await message.load('user')
    emitter.emit(
      `organizations:${(message.conversation || message.channel).organization.slug}:message-delete`,
      message
    )
  }

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
