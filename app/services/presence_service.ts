import Organization from '#models/organization'
import User from '#models/user'
import emitter from '@adonisjs/core/services/emitter'

export default class PresenceService {
  private static presenceStore: Record<Organization['id'], Array<User['id']>> = {}

  static async addUserToOrganizationPresence(organization: Organization, user: User) {
    if (!this.presenceStore[organization.id]) {
      this.presenceStore[organization.id] = []
    }
    this.presenceStore[organization.id].push(user.id)
    emitter.emit(
      `organizations:${organization.slug}:presence-update`,
      this.presenceStore[organization.id]
    )
  }

  static async removeUserFromOrganizationPresence(organization: Organization, user: User) {
    if (this.presenceStore[organization.id]) {
      this.presenceStore[organization.id] = this.presenceStore[organization.id].filter(
        (userId) => userId !== user.id
      )
    }

    emitter.emit(
      `organizations:${organization.slug}:presence-update`,
      this.presenceStore[organization.id]
    )
  }

  static async getOrganizationPresence(organization: Organization) {
    return this.presenceStore[organization.id] || []
  }
}
