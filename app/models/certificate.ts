import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Application from './application.js'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DnsEntries } from '#types/dns'

export default class Certificate extends BaseModel {
  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare domain: string

  @column()
  declare status: 'unconfigured' | 'pending' | 'configured'

  @column({
    prepare: (value: DnsEntries) => JSON.stringify(value),
  })
  declare dnsEntries: DnsEntries

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

export type CertificateStatus = 'unconfigured' | 'pending' | 'configured'
