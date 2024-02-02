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
  declare host: string

  @column()
  declare username: string

  @column()
  declare password: string

  @column()
  declare dbms: 'postgres' | 'mysql' | 'redis'

  /**
   * Custom getters.
   */
  @computed()
  public get uri(): string {
    switch (this.dbms) {
      case 'mysql':
        return `mysql://${this.username}:${this.password}@${this.host}/${this.name}`
      case 'postgres':
        return `postgres://${this.username}:${this.password}@${this.host}/${this.name}`
      case 'redis':
        return `redis://default:${this.password}@${this.host}`
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
    emitter.emit('databases:created', database)
  }

  @beforeDelete()
  static async emitDeletedEvent(database: Database) {
    emitter.emit('databases:deleted', database)
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
