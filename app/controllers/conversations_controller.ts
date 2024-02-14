import bindOrganization from '#decorators/bind_organization'
import Conversation from '#models/conversation'
import Organization from '#models/organization'
import type { HttpContext } from '@adonisjs/core/http'

export default class ConversationsController {
  @bindOrganization
  async store({ auth, request, response }: HttpContext, organization: Organization) {
    const memberId = request.input('memberId')
    const conversation = await Conversation.firstOrCreate(
      { firstUserId: auth.user!.id, secondUserId: memberId },
      { firstUserId: auth.user!.id, secondUserId: memberId }
    )
    return response
      .redirect()
      .toPath(`/organizations/${organization.slug}/chat?conversationId=${conversation.id}`)
  }
}
