import { DateTime } from 'luxon'
import { BaseModel, afterCreate, afterSave, belongsTo, column } from '@adonisjs/lucid/orm'
import Application from './application.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import emitter from '@adonisjs/core/services/emitter'

export default class Deployment extends BaseModel {
  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare origin: 'cli' | 'github'

  @column()
  declare status: DeploymentStatus

  /**
   * GitHub-related fields.
   */
  @column()
  declare githubCheckId: number | null

  @column()
  declare commitSha: string | null

  @column()
  declare commitMessage: string | null

  /**
   * Fly.io-related fields.
   */
  @column()
  declare currentFlyMachineId: string | null

  @column()
  declare currentFlyMachineBuilderId: string | null

  @column()
  declare previousFlyMachineId: string | null

  /**
   * Relationships.
   */
  @belongsTo(() => Application)
  declare application: BelongsTo<typeof Application>

  @column()
  declare applicationId: number

  /**
   * Hooks.
   */
  @afterCreate()
  static async emitCreatedEvent(deployment: Deployment) {
    await deployment.load('application')
    emitter.emit('deployments:created', [deployment.application, deployment])
  }

  @afterSave()
  static async emitUpdatedEvent(deployment: Deployment) {
    await deployment.load('application')
    emitter.emit(`deployments:updated:${deployment.application.slug}`, deployment)
  }

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
