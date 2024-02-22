import bindOrganization from '#decorators/bind_organization'
import Organization from '#models/organization'
import OrganizationMember from '#models/organization_member'
import ChatService from '#services/chat_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

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
}
