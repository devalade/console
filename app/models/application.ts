import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Project from './project.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import slugify from 'slug'
import { generate as generateRandomWord } from 'random-words'
import Deployment from './deployment.js'
import Certificate from './certificate.js'

export default class Application extends BaseModel {
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
  declare environmentVariables: Record<string, string>

  /**
   * Relationships.
   */

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @column()
  declare projectId: number

  @hasMany(() => Deployment)
  declare deployments: HasMany<typeof Deployment>

  @hasMany(() => Certificate)
  declare certificates: HasMany<typeof Certificate>

  /**
   * Hooks.
   */
  @beforeCreate()
  static async assignSlug(application: Application) {
    let slug = slugify(application.name, { lower: true, replacement: '-' })
    while (await Application.findBy('slug', slug)) {
      slug += '-' + generateRandomWord({ exactly: 1 })
    }
    application.slug = slug
  }

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
