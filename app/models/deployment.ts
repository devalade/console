import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Application from './application.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Deployment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare origin: 'cli' | 'github'

  @column()
  declare status: DeploymentStatus

  @column()
  declare archiveName: string

  /**
   * Relationships.
   */
  @belongsTo(() => Application)
  declare application: BelongsTo<typeof Application>

  @column()
  declare applicationId: number

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

export enum DeploymentStatus {
  Building = 'building',
  BuildFailed = 'build-failed',
  Deploying = 'deploying',
  DeploymentFailed = 'deployment-failed',
  Stopped = 'stopped',
  Success = 'success',
}
