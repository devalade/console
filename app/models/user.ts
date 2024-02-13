import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, afterCreate, column, hasManyThrough } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Organization from './organization.js'
import OrganizationMember from './organization_member.js'
import type { HasManyThrough } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static authTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string

  @column()
  declare email: string

  @column()
  declare password: string | null

  /**
   * Github-related fields.
   */
  @column()
  declare githubId: string | null

  @column({ prepare: (value: any) => (value ? JSON.stringify(value) : []) })
  declare githubInstallationIds: number[]

  /**
   * Relationships.
   */
  @column()
  declare defaultOrganizationId: number

  @hasManyThrough([() => Organization, () => OrganizationMember], {
    throughForeignKey: 'id',
    throughLocalKey: 'organizationId',
  })
  declare organizations: HasManyThrough<typeof Organization>

  /**
   * Hooks.
   */
  @afterCreate()
  static async createDefaultOrganization(user: User) {
    const organization = new Organization()
    organization.name = user.fullName
    await organization.save()

    await organization.related('channels').create({ name: 'general', order: 0 })

    const member = new OrganizationMember()
    member.organizationId = organization.id
    member.userId = user.id
    member.role = 'owner'
    await member.save()

    user.defaultOrganizationId = organization.id
    await user.save()
  }

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
