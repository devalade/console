import { DateTime } from 'luxon'
import {
  BaseModel,
  afterCreate,
  beforeCreate,
  beforeDelete,
  belongsTo,
  column,
  computed,
} from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import slugify from 'slug'
import { generate as generateRandomWord } from 'random-words'
import Project from './project.js'
import emitter from '@adonisjs/core/services/emitter'
import env from '#start/env'

export default class Database extends BaseModel {
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
  declare username: string

  @column()
  declare password: string

  @column()
  declare dbms: 'postgres' | 'mysql' | 'redis'

  @column()
  declare hostname: string

  @column()
  declare diskSize: number | null

  @computed()
  public get uri(): string {
    switch (this.dbms) {
      case 'mysql':
        return `mysql://${this.username}:${this.password}@${this.hostname}/${this.name}`
      case 'postgres':
        return `postgres://${this.username}:${this.password}@${this.hostname}/${this.name}`
      case 'redis':
        return `redis://default:${this.password}@${this.hostname}`
    }
  }

  /**
   * Hooks.
   */
  @beforeCreate()
  static async assignSlugAndHostname(database: Database) {
    let slug = slugify(database.name, { lower: true, replacement: '-' })
    while (await Database.findBy('slug', slug)) {
      slug += '-' + generateRandomWord({ exactly: 1 })
    }
    database.slug = slug

    switch (env.get('DRIVER')) {
      case 'docker':
        database.hostname = `${env.get('DOCKER_DATABASE_NAME_PREFIX', 'citadel-database')}-${database.slug}.${env.get(
          'TRAEFIK_WILDCARD_DOMAIN',
          'softwarecitadel.app'
        )}`
        break
      case 'fly':
        database.hostname = `${env.get('FLY_DATABASE_NAME_PREFIX', 'citadel-database')}-${database.slug}.fly.dev`
        break
      default:
        database.hostname = ''
    }
  }

  @afterCreate()
  static async emitCreatedEvent(database: Database) {
    await database.load('project', (query) => {
      query.preload('organization')
    })
    emitter.emit('databases:created', [database.project.organization, database.project, database])
  }

  @beforeDelete()
  static async emitDeletedEvent(database: Database) {
    await database.load('project', (query) => {
      query.preload('organization')
    })
    emitter.emit('databases:deleted', [database.project.organization, database.project, database])
  }

  /**
   * Relationships.
   */
  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @column()
  declare projectId: number

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
