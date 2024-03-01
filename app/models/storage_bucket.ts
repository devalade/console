import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import slugify from 'slug'
import { generate as generateRandomWord } from 'random-words'
import Project from './project.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class StorageBucket extends BaseModel {
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
  declare host: string

  @column()
  declare keyId: string

  @column()
  declare secretKey: string

  /**
   * Relationships.
   */
  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @column()
  declare projectId: string

  /**
   * Hooks.
   */
  @beforeCreate()
  static async assignSlug(storageBucket: StorageBucket) {
    let slug = slugify(storageBucket.name, { lower: true, replacement: '-' })
    while (await StorageBucket.findBy('slug', slug)) {
      slug += '-' + generateRandomWord({ exactly: 1 })
    }
    storageBucket.slug = slug
  }

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
