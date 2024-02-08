import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import KanbanBoard from './kanban_board.js'
import KanbanTask from './kanban_task.js'

export default class KanbanColumn extends BaseModel {
  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare order: number

  /**
   * Relationships.
   */
  @column()
  declare boardId: string

  @belongsTo(() => KanbanBoard)
  declare board: BelongsTo<typeof KanbanBoard>

  @hasMany(() => KanbanTask, { foreignKey: 'columnId' })
  declare tasks: HasMany<typeof KanbanTask>

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
