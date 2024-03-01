import { BaseModel, beforeCreate, column, hasMany, hasManyThrough } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import slugify from 'slug'
import { generate as generateRandomWord } from 'random-words'
import type { HasMany, HasManyThrough } from '@adonisjs/lucid/types/relations'
import Project from './project.js'
import OrganizationMember from './organization_member.js'
import User from './user.js'
import Channel from './channel.js'
import Conversation from './conversation.js'
import MailDomain from './mail_domain.js'
import MailApiKey from './mail_api_key.js'
import { cuid } from '@adonisjs/core/helpers'

export default class Organization extends BaseModel {
  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: string

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

  @hasMany(() => Conversation)
  declare conversations: HasMany<typeof Conversation>

  @hasManyThrough([() => User, () => OrganizationMember], {
    foreignKey: 'organizationId',
    throughForeignKey: 'id',
    throughLocalKey: 'userId',
    localKey: 'id',
  })
  declare users: HasManyThrough<typeof User>

  @hasMany(() => MailDomain)
  declare mailDomains: HasMany<typeof MailDomain>

  @hasMany(() => MailApiKey)
  declare mailApiKeys: HasMany<typeof MailApiKey>

  /**
   * Hooks.
   */
  @beforeCreate()
  static async assignIdAndSlug(organization: Organization) {
    organization.id = cuid()

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
