import { DateTime } from 'luxon'
import {
  BaseModel,
  afterSave,
  beforeCreate,
  beforeDelete,
  belongsTo,
  column,
  hasMany,
} from '@adonisjs/lucid/orm'
import slugify from 'slug'
import { generate as generateRandomWord } from 'random-words'
import Organization from './organization.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Message from './message.js'
import emitter from '@adonisjs/core/services/emitter'

export default class Channel extends BaseModel {
  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare order: number

  /**
   * Hooks.
   */
  @beforeCreate()
  static async assignSlug(channel: Channel) {
    let slug = slugify(channel.name, { lower: true, replacement: '-' })
    while (await Channel.findBy('slug', slug)) {
      slug += '-' + generateRandomWord({ exactly: 1 })
    }
    channel.slug = slug
  }

  @afterSave()
  static async emitChannelUpdateEvent(channel: Channel) {
    await channel.load('organization')
    const organization = channel.organization
    if (organization) {
      emitter.emit(`organizations:${organization.slug}:channel-update`, channel)
    }
  }

  @beforeDelete()
  static async emitChannelDeleteEvent(channel: Channel) {
    await channel.load('organization')
    const organization = channel.organization
    if (organization) {
      emitter.emit(`organizations:${organization.slug}:channel-delete`, channel)
    }
  }

  /**
   * Relationships.
   */
  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @column()
  declare organizationId: number

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
