import bindProject from '#decorators/bind_project'
import Project from '#models/project'
import { createAnalyticsWebsiteValidator } from '#validators/analytics_website'
import type { HttpContext } from '@adonisjs/core/http'

export default class AnalyticsWebsitesController {
  @bindProject
  async index({ inertia }: HttpContext, project: Project) {
    const analyticsWebsites = await project.related('analyticsWebsites').query()
    return inertia.render('analytics_websites/index', { project, analyticsWebsites })
  }

  @bindProject
  async store({ request, response, params }: HttpContext, project: Project) {
    const payload = await request.validateUsing(createAnalyticsWebsiteValidator)
    const analyticsWebsite = await project.related('analyticsWebsites').create(payload)
    return response
      .redirect()
      .toPath(
        `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/analytics_websites/${analyticsWebsite.id}`
      )
  }

  @bindProject
  async show({ inertia, params }: HttpContext, project: Project) {
    const analyticsWebsite = await project
      .related('analyticsWebsites')
      .query()
      .where('id', params.analyticsWebsiteId)
      .first()
    return inertia.render('analytics_websites/show', { project, analyticsWebsite })
  }

  @bindProject
  async edit({ inertia, params }: HttpContext, project: Project) {
    const analyticsWebsite = await project
      .related('analyticsWebsites')
      .query()
      .where('id', params.analyticsWebsiteId)
      .firstOrFail()
    return inertia.render('analytics_websites/edit', { project, analyticsWebsite })
  }

  @bindProject
  async update({ params, request }: HttpContext, project: Project) {
    const analyticsWebsite = await project
      .related('analyticsWebsites')
      .query()
      .where('id', params.analyticsWebsiteId)
      .firstOrFail()
    const payload = await request.validateUsing(createAnalyticsWebsiteValidator)
    analyticsWebsite.merge(payload)
    await analyticsWebsite.save()
  }

  @bindProject
  async destroy({ params }: HttpContext, project: Project) {
    const analyticsWebsite = await project
      .related('analyticsWebsites')
      .query()
      .where('id', params.analyticsWebsiteId)
      .firstOrFail()
    await analyticsWebsite.delete()
  }
}
