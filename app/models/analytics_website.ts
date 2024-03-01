import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { cuid } from '@adonisjs/core/helpers'
import Project from './project.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class AnalyticsWebsite extends BaseModel {
  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare domain: string

  /**
   * Relationships.
   */
  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @column()
  declare projectId: number

  /**
   * Hooks.
   */
  @beforeCreate()
  static async assignId(analyticsWebsite: AnalyticsWebsite) {
    analyticsWebsite.id = cuid()
  }

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
