import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import KanbanColumn from './kanban_column.js'
import Project from './project.js'
import slugify from 'slug'
import { generate as generateRandomWord } from 'random-words'

export default class KanbanBoard extends BaseModel {
  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare slug: string

  @column()
  declare name: string

  /**
   * Relationships.
   */
  @column()
  declare projectId: string

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @hasMany(() => KanbanColumn, { foreignKey: 'boardId' })
  declare columns: HasMany<typeof KanbanColumn>

  /**
   * Hooks.
   */
  @beforeCreate()
  static async assignSlug(kanbanBoard: KanbanBoard) {
    let slug = slugify(kanbanBoard.name, { lower: true, replacement: '-' })
    while (await KanbanBoard.findBy('slug', slug)) {
      slug += '-' + generateRandomWord({ exactly: 1 })
    }
    kanbanBoard.slug = slug
  }

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
