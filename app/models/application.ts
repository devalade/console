import { DateTime } from 'luxon'
import {
  BaseModel,
  afterCreate,
  beforeCreate,
  beforeDelete,
  belongsTo,
  column,
  hasMany,
} from '@adonisjs/lucid/orm'
import Project from './project.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import slugify from 'slug'
import { generate as generateRandomWord } from 'random-words'
import Deployment from './deployment.js'
import Certificate from './certificate.js'
import { cuid } from '@adonisjs/core/helpers'
import emitter from '@adonisjs/core/services/emitter'
import env from '#start/env'

export default class Application extends BaseModel {
  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare environmentVariables: Record<string, string>

  @column()
  declare sharedIpv4: string | null

  @column()
  declare ipv6: string | null

  @column()
  declare cpu: string | null

  @column()
  declare ram: string | null

  @column()
  declare hostname: string

  /**
   * GitHub-related columns.
   */
  @column()
  declare githubRepository: string | null

  @column()
  declare githubBranch: string | null

  @column()
  declare githubInstallationId: number | null

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
  static async assignSlugAndHostname(application: Application) {
    /**
     * Generate a unique slug for the application.
     */
    let slug = slugify(application.name, { lower: true, replacement: '-' })
    while (await Application.findBy('slug', slug)) {
      slug += '-' + generateRandomWord({ exactly: 1 })
    }
    application.slug = slug

    /**
     * Generate a hostname for the application.
     */
    switch (env.get('DRIVER')) {
      case 'docker':
        application.hostname = `${env.get('DOCKER_APPLICATION_NAME_PREFIX', 'citadel-app')}-${application.slug}.${env.get(
          'TRAEFIK_WILDCARD_DOMAIN',
          'softwarecitadel.app'
        )}`
        break
      case 'fly':
        application.hostname = `${env.get('FLY_APPLICATION_NAME_PREFIX', 'citadel-app')}-${application.slug}.fly.dev`
        break
      default:
        application.hostname = ''
    }
  }

  @beforeCreate()
  static async assignId(application: Application) {
    application.id = cuid()
  }

  @afterCreate()
  static async emitCreatedEvent(application: Application) {
    await application.load('project', (query) => {
      query.preload('organization')
    })
    emitter.emit('applications:created', [
      application.project.organization,
      application.project,
      application,
    ])
  }

  @beforeDelete()
  static async emitDeletedEvent(application: Application) {
    await application.load('project', (query) => {
      query.preload('organization')
    })
    emitter.emit('applications:deleted', [
      application.project.organization,
      application.project,
      application,
    ])
  }

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
