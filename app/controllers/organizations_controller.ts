import bindOrganization from '#decorators/bind_organization'
import InviteMemberNotification from '#mails/invite_member_notification'
import Organization from '#models/organization'
import OrganizationMember from '#models/organization_member'
import { createOrganizationValidator } from '#validators/create_organization_validator'
import { updateOrganizationValidator } from '#validators/update_organization_validator'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class OrganizationsController {
  public async index({ inertia }: HttpContext) {
    return inertia.render('organizations/index')
  }

  public async store({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(createOrganizationValidator)
    const organization = await Organization.create(payload)
    await organization.related('members').create({
      userId: auth.user!.id,
      role: 'owner',
    })
    return response.redirect().toPath(`/organizations/${organization.slug}/projects`)
  }

  @bindOrganization
  public async edit(
    { inertia }: HttpContext,
    organization: Organization,
    organizationMember: OrganizationMember
  ) {
    await organization.load('members', (query) => {
      query.preload('user')
    })
    const isOwner = organizationMember.role === 'owner'
    return inertia.render('organizations/edit', {
      organization,
      isOwner,
    })
  }

  @bindOrganization
  public async update(
    { request, response }: HttpContext,
    organization: Organization,
    organizationMember: OrganizationMember
  ) {
    const isOwner = organizationMember.role === 'owner'
    if (!isOwner) {
      return response.unauthorized()
    }
    const payload = await request.validateUsing(updateOrganizationValidator)
    organization.merge(payload)
    await organization.save()
    return response.redirect().back()
  }

  @bindOrganization
  public async destroy({ response }: HttpContext, organization: Organization) {
    await organization.delete()
    return response.redirect().toPath('/organizations')
  }

  @bindOrganization
  public async quit(
    { response }: HttpContext,
    _organization: Organization,
    organizationMember: OrganizationMember
  ) {
    await organizationMember.delete()
    return response.redirect().toPath('/organizations')
  }

  @bindOrganization
  public async invite(
    { request, response }: HttpContext,
    organization: Organization,
    organizationMember: OrganizationMember
  ) {
    if (organizationMember.role === 'owner') {
      return response.unauthorized()
    }
    const email = request.input('email')
    await mail.send(new InviteMemberNotification(organization, email))

    return response.redirect().back()
  }

  public async join({ auth, request, response }: HttpContext) {
    if (!request.hasValidSignature()) {
      return response.redirect().toPath('/auth/sign_up')
    }
    const organization = await Organization.findByOrFail('slug', request.param('organizationSlug'))
    await organization.related('members').create({
      userId: auth.user!.id,
      role: 'member',
    })
    return response.redirect().toPath(`/organizations/${organization.slug}/projects`)
  }
}
