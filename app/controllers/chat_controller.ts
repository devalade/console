import bindOrganization from '#decorators/bind_organization'
import Organization from '#models/organization'
import type { HttpContext } from '@adonisjs/core/http'

export default class ChatController {
  @bindOrganization
  async index({ inertia, request }: HttpContext, organization: Organization) {
    await organization.load('users')
    await organization.load('channels')

    return inertia.render('chat/index', {
      members: organization.users,
      channels: organization.channels.sort((a, b) => a.order - b.order),
      currentChannel:
        organization.channels.find((channel) => channel.slug === request.qs().channel) ||
        (organization.channels.length ? organization.channels[0] : null),
    })
  }
}
