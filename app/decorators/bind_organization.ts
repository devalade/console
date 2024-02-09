import Organization from '#models/organization'
import OrganizationMember from '#models/organization_member'
import type { HttpContext } from '@adonisjs/core/http'

export default function bindOrganization(
  _target: any,
  _key: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = async function (this: any, ctx: HttpContext) {
    const { auth, params, response } = ctx
    try {
      let organization: Organization
      if (params.organizationSlug) {
        const organizationMember = await OrganizationMember.query()
          .where('userId', ctx.auth.user!.id)
          .andWhere('organizationSlug', params.organizationSlug)
          .firstOrFail()
        organization = await organizationMember.related('organization').query().firstOrFail()
      } else {
        organization = await Organization.query()
          .where('id', auth.user!.defaultOrganizationId)
          .firstOrFail()
      }
      return await originalMethod.call(this, ctx, organization)
    } catch (error) {
      console.error(error)
      return response.notFound()
    }
  }
}
