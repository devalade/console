import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Project from './project.js'
import slugify from 'slug'
import { generate as generateRandomWord } from 'random-words'

export default class DevMachine extends BaseModel {
  /**
   * Regular columns.
   */
  @column()
  declare slug: string

  @column()
  declare name: string

  @column()
  declare password: string

  /**
   * Relationships.
   */
  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @column()
  declare projectId: string

  @column()
  declare resourcesConfig: 'standard' | 'large'

  /**
   * Hooks.
   */
  @beforeCreate()
  static async assignSlug(devMachine: DevMachine) {
    let slug = slugify(devMachine.name, { lower: true, replacement: '-' })
    while (await DevMachine.findBy('slug', slug)) {
      slug += '-' + generateRandomWord({ exactly: 1 })
    }
    devMachine.slug = slug
  }

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
