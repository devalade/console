import bindOrganization from '#decorators/bind_organization'
import Channel from '#models/channel'
import Organization from '#models/organization'
import OrganizationMember from '#models/organization_member'
import { createChannelValidator } from '#validators/create_channel_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class ChannelsController {
  @bindOrganization
  async store(
    { request, response }: HttpContext,
    organization: Organization,
    organizationMember: OrganizationMember
  ) {
    if (organizationMember.role !== 'owner') {
      return response.forbidden()
    }

    const payload = await request.validateUsing(createChannelValidator)
    const channelWithMaxOrder: Channel | null = await organization
      .related('channels')
      .query()
      .orderBy('order', 'desc')
      .first()
    const maxOrder = channelWithMaxOrder ? channelWithMaxOrder.order : 0
    const channel = await organization
      .related('channels')
      .create({ name: payload.name, order: maxOrder + 1 })
    return response
      .redirect()
      .toPath(`/organizations/${organization.slug}/chat?channel=${channel.slug}`)
  }

  @bindOrganization
  async update(
    { request, response }: HttpContext,
    organization: Organization,
    organizationMember: OrganizationMember
  ) {
    if (organizationMember.role !== 'owner') {
      return response.forbidden()
    }

    const payload = await request.validateUsing(createChannelValidator)
    const channel = await organization
      .related('channels')
      .query()
      .where('slug', request.param('channelSlug'))
      .firstOrFail()
    channel.name = payload.name
    await channel.save()
    return response.redirect().back()
  }

  @bindOrganization
  async destroy(
    { response, params }: HttpContext,
    organization: Organization,
    organizationMember: OrganizationMember
  ) {
    if (organizationMember.role !== 'owner') {
      return response.forbidden()
    }

    const channel = await organization
      .related('channels')
      .query()
      .where('slug', params.channelSlug)
      .firstOrFail()

    await channel.delete()
    return response.redirect().back()
  }
}
