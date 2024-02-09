import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Application from './application.js'
import slugify from 'slug'
import { generate as generateRandomWord } from 'random-words'
import Database from './database.js'
import { cuid } from '@adonisjs/core/helpers'
import KanbanBoard from './kanban_board.js'
import Organization from './organization.js'

export default class Project extends BaseModel {
  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare slug: string

  /**
   * Relationships.
   */
  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @column()
  declare organizationId: number

  @hasMany(() => Application)
  declare applications: HasMany<typeof Application>

  @hasMany(() => Database)
  declare databases: HasMany<typeof Database>

  @hasMany(() => KanbanBoard)
  declare kanbanBoards: HasMany<typeof KanbanBoard>

  /**
   * Hooks.
   */
  @beforeCreate()
  static async assignSlug(project: Project) {
    let slug = slugify(project.name, { lower: true, replacement: '-' })
    while (await Project.findBy('slug', slug)) {
      slug += '-' + generateRandomWord({ exactly: 1 })
    }
    project.slug = slug
  }

  @beforeCreate()
  static async assignId(project: Project) {
    project.id = cuid()
  }

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
