import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Application from './application.js'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'

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

  @column()
  declare dnsEntries: Array<{ type: string; name: string; value: string }>

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
