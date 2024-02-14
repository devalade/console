import Organization from '#models/organization'
import OrganizationMember from '#models/organization_member'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default function bindOrganization(
  _target: any,
  _key: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = async function (this: any, ctx: HttpContext) {
    const { params, response } = ctx
    try {
      const organization = await Organization.query()
        .where('slug', params.organizationSlug)
        .firstOrFail()
      const organizationMember = await OrganizationMember.query()
        .where('user_id', ctx.auth.user!.id)
        .andWhere('organization_id', organization.id)
        .firstOrFail()
      return await originalMethod.call(this, ctx, organization, organizationMember)
    } catch (error) {
      logger.error(error, 'Failed to bind organization')
      return response.notFound()
    }
  }
}
