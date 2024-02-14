import bindOrganization from '#decorators/bind_organization'
import Conversation from '#models/conversation'
import Message from '#models/message'
import Organization from '#models/organization'
import type { HttpContext } from '@adonisjs/core/http'

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

      await channel.related('messages').create({ body, userId: auth.user!.id })
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

      await conversation.related('messages').create({ body, userId: auth.user!.id })
    }

    const suffix = request.qs().channelSlug
      ? `channel=${request.qs().channelSlug}`
      : `conversationId=${request.qs().conversationId}`
    return response.redirect().toPath(`/organizations/${organization.slug}/chat?${suffix}`)
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
