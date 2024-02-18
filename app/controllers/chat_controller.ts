import bindOrganization from '#decorators/bind_organization'
import Conversation from '#models/conversation'
import Organization from '#models/organization'
import OrganizationMember from '#models/organization_member'
import type { HttpContext } from '@adonisjs/core/http'

export default class ChatController {
  @bindOrganization
  async index(
    { inertia, request }: HttpContext,
    organization: Organization,
    organizationMember: OrganizationMember
  ) {
    await organization.load('users')

    await organization.load('channels', (query) => {
      /**
       * Sort channels in ascending order of their order.
       */
      query.orderBy('order', 'asc')
    })

    /**
     * We try to retrieve the current channel from the organization.
     *
     * If the channel is not mentioned in the query string,
     * we make the first channel as the current channel.
     */
    const currentChannel =
      organization.channels.find((channel) => channel.slug === request.qs().channel) ||
      (organization.channels.length && !request.qs().conversationId
        ? organization.channels[0]
        : null)

    /**
     * If there is a current channel,
     * we load the messages.
     */
    if (currentChannel !== null) {
      await currentChannel.load('messages', (query) => {
        /**
         * Preload the user relationship for each message.
         */
        query.preload('user')

        /**
         * Sort messages in ascending order of their creation date.
         */
        query.orderBy('created_at', 'asc')
      })
    }

    /**
     * Let's load conversations for the current user,
     * so that we can display them in the sidebar.
     */
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

    /**
     * If there is a current conversation,
     * we load the messages.
     */
    let currentConversation: Conversation | null = null
    if (request.qs().conversationId) {
      currentConversation = await Conversation.findBy('id', request.qs().conversationId)
      if (currentConversation) {
        await currentConversation.load('messages', (query) => {
          /**
           * Preload the user relationship for each message.
           */
          query.preload('user')

          /**
           * Sort messages in ascending order of their creation date.
           */
          query.orderBy('created_at', 'asc')
        })
      }
    }

    return inertia.render('chat/index', {
      channels: organization.channels,
      currentChannel,

      conversations,
      currentConversation,

      members: organization.users,

      messages: currentChannel?.messages || currentConversation?.messages || [],

      isOwner: organizationMember.role === 'owner',
    })
  }
}
