import bindOrganization from '#decorators/bind_organization'
import Conversation from '#models/conversation'
import Message from '#models/message'
import Organization from '#models/organization'
import OrganizationMember from '#models/organization_member'
import ChatService from '#services/chat_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'

@inject()
export default class ChatController {
  constructor(protected chatService: ChatService) {}

  @bindOrganization
  async index(
    ctx: HttpContext,
    organization: Organization,
    organizationMember: OrganizationMember
  ) {
    await organization.load('users')
    await organization.load('channels', (query) => {
      query.orderBy('order', 'asc')
    })

    const currentChannel = await this.chatService.loadCurrentChannel(ctx, organization)
    const conversations = await this.chatService.loadConversation(
      ctx,
      organization,
      organizationMember
    )
    const currentConversation = await this.chatService.loadCurrentConversationWithMessages(ctx)

    return ctx.inertia.render('chat/index', {
      channels: organization.channels,
      currentChannel,
      conversations,
      currentConversation,
      members: organization.users,
      messages: currentChannel?.messages || currentConversation?.messages || [],
      isOwner: organizationMember.role === 'owner',
    })
  }

  @bindOrganization
  async streamUpdates({ auth, response }: HttpContext, organization: Organization) {
    response.prepareServerSentEventsHeaders()

    emitter.on(`organizations:${organization.slug}:message-update`, (message: Message) => {
      response.sendServerSentEvent({ message })
    })

    emitter.on(`organizations:${organization.slug}:message-delete`, (message: Message) => {
      response.sendServerSentEvent({ messageDeleted: message })
    })

    emitter.on(
      `organizations:${organization.slug}:conversation-create`,
      (conversation: Conversation) => {
        response.response.write(
          `data: ${JSON.stringify({
            conversation: {
              id: conversation.id,
              user:
                auth.user!.id === conversation.firstUserId
                  ? conversation.secondUser
                  : conversation.firstUser,
            },
          })}\n\n`
        )
        response.response.flushHeaders()
      }
    )

    emitter.on(`organizations:${organization.slug}:channel-update`, async (channel) => {
      const channels = await organization.related('channels').query().orderBy('order', 'asc')
      if (!channels.some((c) => c.id === channel.id)) {
        channels.push(channel)
        channels.sort((a, b) => a.order - b.order)
      }
      response.sendServerSentEvent({ channels })
    })

    emitter.on(`organizations:${organization.slug}:channel-delete`, (channel) => {
      response.sendServerSentEvent({ channelDeleted: channel })
    })

    response.response.on('close', () => {
      response.response.end()
    })

    return response.noContent()
  }
}
