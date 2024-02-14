import { BaseModel, beforeCreate, column, hasMany, hasManyThrough } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import slugify from 'slug'
import { generate as generateRandomWord } from 'random-words'
import type { HasMany, HasManyThrough } from '@adonisjs/lucid/types/relations'
import Project from './project.js'
import OrganizationMember from './organization_member.js'
import User from './user.js'
import Channel from './channel.js'

export default class Organization extends BaseModel {
  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  /**
   * Relationships.
   */
  @hasMany(() => Project)
  declare projects: HasMany<typeof Project>

  @hasMany(() => OrganizationMember)
  declare members: HasMany<typeof OrganizationMember>

  @hasMany(() => Channel)
  declare channels: HasMany<typeof Channel>

  @hasManyThrough([() => User, () => OrganizationMember], {
    foreignKey: 'organizationId',
    throughForeignKey: 'id',
    throughLocalKey: 'userId',
    localKey: 'id',
  })
  declare users: HasManyThrough<typeof User>

  /**
   * Hooks.
   */
  @beforeCreate()
  static async assignSlug(organization: Organization) {
    let slug = slugify(organization.name, { lower: true, replacement: '-' })
    while (await Organization.findBy('slug', slug)) {
      slug += '-' + generateRandomWord({ exactly: 1 })
    }
    organization.slug = slug
  }

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
