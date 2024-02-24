import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Organization from './organization.js'
import MailDomain from './mail_domain.js'
import { cuid } from '@adonisjs/core/helpers'

export default class MailApiKey extends BaseModel {
  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare value: string

  /**
   * Hooks.
   */
  @beforeCreate()
  static async assignIdAndValue(mailApiKey: MailApiKey) {
    mailApiKey.id = cuid()
    mailApiKey.value = `factory-${cuid()}`
  }

  /**
   * Relationships.
   */
  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @column()
  declare organizationId: string

  @belongsTo(() => MailDomain)
  declare mailDomain: BelongsTo<typeof MailDomain>

  @column()
  declare mailDomainId: string | null

  @hasMany(() => MailDomain)
  declare mailDomains: HasMany<typeof MailDomain>

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
