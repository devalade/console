import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Application from './application.js'
import slugify from 'slug'
import { generate as generateRandomWord } from 'random-words'

export default class Project extends BaseModel {
  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  /**
   * Relationships.
   */
  @hasMany(() => Application)
  declare applications: HasMany<typeof Application>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: number

  /**
   * Hooks.
   */
  @beforeCreate()
  static async assignSlug(project: Project) {
    let slug = slugify(project.name, { lower: true })
    while (await Project.findBy('slug', slug)) {
      slug += '-' + generateRandomWord({ exactly: 1 })
    }
    project.slug = slug
  }

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
