import bindOrganization from '#decorators/bind_organization'
import Conversation from '#models/conversation'
import Message from '#models/message'
import Organization from '#models/organization'
import type { HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'

export default class MessagesController {
  @bindOrganization
  public async store({ auth, request, response }: HttpContext, organization: Organization) {
    const body = request.input('body')

    /**
     * If the request has a channelSlug query param,
     * then store the message in the channel.
     */
    if (request.qs().channelSlug) {
      const channel = await organization
        .related('channels')
        .query()
        .where('slug', request.qs().channelSlug)
        .firstOrFail()

      const message = await channel
        .related('messages')
        .create({ body, userId: auth.user!.id, askedUserForAnswerId: null })
      emitter.emit('messages:created', [organization, channel, auth.user!, message])
    }

    /**
     * If the request has a conversationId query param,
     * then store the message in the conversation.
     */
    if (request.qs().conversationId) {
      const conversation = await Conversation.query()
        .where('id', request.qs().conversationId)
        .firstOrFail()
      if (
        conversation.firstUserId !== auth.user!.id &&
        conversation.secondUserId !== auth.user!.id
      ) {
        return response.unauthorized()
      }

      await conversation
        .related('messages')
        .create({ body, userId: auth.user!.id, askedUserForAnswerId: null })
    }

    const suffix = request.qs().channelSlug
      ? `channel=${request.qs().channelSlug}`
      : `conversationId=${request.qs().conversationId}`
    return response.redirect().toPath(`/organizations/${organization.slug}/chat?${suffix}`)
  }

  @bindOrganization
  public async update(
    { auth, request, response, params }: HttpContext,
    _organization: Organization
  ) {
    const body = request.input('body')

    const message = await Message.query()
      .where('userId', auth.user!.id)
      .where('id', params.messageId)
      .firstOrFail()
    message.body = body
    await message.save()

    return response.redirect().back()
  }

  @bindOrganization
  public async destroy({ auth, response, params }: HttpContext) {
    const message = await Message.query()
      .where('userId', auth.user!.id)
      .where('id', params.messageId)
      .firstOrFail()
    await message.delete()
    return response.redirect().back()
  }
}
