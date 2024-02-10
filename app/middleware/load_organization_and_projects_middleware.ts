import Organization from '#models/organization'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class LoadOrganizationAndProjectsMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const organization = await Organization.query()
      .where('slug', ctx.params.organizationSlug)
      .firstOrFail()
    await organization.load('projects')

    // @ts-ignore
    ctx.organization = organization

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
