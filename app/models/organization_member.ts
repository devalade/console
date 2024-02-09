import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Organization from './organization.js'

export default class OrganizationMember extends BaseModel {
  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare role: 'owner' | 'member'

  /**
   * Relationships.
   */
  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @column()
  declare organizationId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: number
}
