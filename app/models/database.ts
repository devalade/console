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

  /**
   * Custom getters.
   */
  get hostname(): string {
    switch (env.get('DRIVER')) {
      case 'docker':
        return `${env.get('DOCKER_DATABASE_NAME_PREFIX', 'citadel-database')}-${this.slug}.${env.get(
          'TRAEFIK_WILDCARD_DOMAIN',
          'softwarecitadel.app'
        )}`
      case 'fly':
        return `${env.get('FLY_DATABASE_NAME_PREFIX', 'citadel-database')}-${this.slug}.fly.dev`
      default:
        return ''
    }
  }

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
  static async assignSlug(database: Database) {
    let slug = slugify(database.name, { lower: true, replacement: '-' })
    while (await Database.findBy('slug', slug)) {
      slug += '-' + generateRandomWord({ exactly: 1 })
    }
    database.slug = slug
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
