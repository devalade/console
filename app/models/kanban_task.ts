import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import KanbanColumn from './kanban_column.js'

export default class KanbanTask extends BaseModel {
  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare order: number

  /**
   * Relationships.
   */
  @column()
  declare columnId: string

  @belongsTo(() => KanbanColumn, { foreignKey: 'columnId' })
  declare column: BelongsTo<typeof KanbanColumn>

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
