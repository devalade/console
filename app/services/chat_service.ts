import Channel from '#models/channel'
import Conversation from '#models/conversation'
import Organization from '#models/organization'
import OrganizationMember from '#models/organization_member'
import { HttpContext } from '@adonisjs/core/http'

export default class ChatService {
  async loadConversation(
    {}: HttpContext,
    organization: Organization,
    organizationMember: OrganizationMember
  ) {
    await organization.load('conversations', (query) => {
      query
        .where('firstUserId', organizationMember.userId)
        .orWhere('secondUserId', organizationMember.userId)

      query.preload('firstUser')
      query.preload('secondUser')
    })

    const conversations = organization.conversations.map((conversation) => ({
      id: conversation.id,
      user:
        conversation.firstUserId === organizationMember.userId
          ? conversation.secondUser
          : conversation.firstUser,
    }))

    return conversations
  }

  async loadCurrentConversationWithMessages({
    request,
  }: HttpContext): Promise<Conversation | null> {
    if (!request.qs().conversationId) {
      return null
    }

    const currentConversation = await Conversation.findBy('id', request.qs().conversationId)

    if (currentConversation) {
      await currentConversation.load('messages', (query) => {
        query.preload('user')
        query.orderBy('created_at', 'asc')
      })
    }

    return currentConversation
  }

  async loadCurrentChannel(
    { request, response }: HttpContext,
    organization: Organization
  ): Promise<Channel | null> {
    if (organization.channels.length === 0 && !request.qs().channel) {
      return null
    }

    if (organization.channels.length > 0 && !request.qs().channel) {
      response
        .redirect()
        .toPath(`/organizations/${organization.slug}/chat?channel=${organization.channels[0].slug}`)
    }

    const currentChannel = request.qs().channel
      ? organization.channels.find((channel) => channel.slug === request.qs().channel)
      : organization.channels[0]

    if (currentChannel !== null) {
      await currentChannel!.load('messages', (query) => {
        query.preload('user')
        query.preload('askedUserForAnswer')
        query.orderBy('created_at', 'asc')
      })

      for (const message of currentChannel!.messages) {
        await message.user?.assignAvatarUrl()
      }
    }

    return currentChannel || null
  }
}
