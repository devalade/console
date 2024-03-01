import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { cuid } from '@adonisjs/core/helpers'
import Organization from './organization.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DnsEntries } from '#types/dns'

export default class MailDomain extends BaseModel {
  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare expectedDnsRecords: DnsEntries

  @column()
  declare domain: string

  @column()
  declare isVerified: boolean

  /**
   * Hooks.
   */
  @beforeCreate()
  static async assignId(mailDomain: MailDomain) {
    mailDomain.id = cuid()
  }

  /**
   * Relationships.
   */
  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @column()
  declare organizationId: string

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
