import Project from '#models/project'
import { applicationValidator } from '#validators/application_validator'
import type { HttpContext } from '@adonisjs/core/http'
import bindProject from '#decorators/bind_project'

export default class ApplicationsController {
  @bindProject
  async index({ request, inertia }: HttpContext, project: Project) {
    const applications = await project.related('applications').query()
    if (request.wantsJSON()) {
      return applications
    }
    return inertia.render('applications/index', { project, applications })
  }

  @bindProject
  async store({ request, response }: HttpContext, project: Project) {
    const payload = await request.validateUsing(applicationValidator)

    const application = await project.related('applications').create(payload)

    if (request.wantsJSON()) {
      return application
    }

    return response.redirect().toPath(`/projects/${project.slug}/applications/${application.slug}`)
  }

  @bindProject
  async show({ params, inertia }: HttpContext, project: Project) {
    const application = await project
      .related('applications')
      .query()
      .where('slug', params.applicationSlug)
      .firstOrFail()

    return inertia.render('applications/show', { project, application })
  }

  @bindProject
  async edit({ params, response, inertia }: HttpContext, project: Project) {
    const application = await project
      .related('applications')
      .query()
      .where('slug', params.applicationSlug)
      .first()
    if (!application) {
      return response.notFound()
    }

    return inertia.render('applications/edit', { project, application })
  }

  @bindProject
  async update({ params, request, response }: HttpContext, project: Project) {
    const payload = await request.validateUsing(applicationValidator)

    const application = await project
      .related('applications')
      .query()
      .where('slug', params.applicationSlug)
      .first()
    if (!application) {
      return response.notFound()
    }

    await application.merge(payload).save()

    return response.redirect().back()
  }

  @bindProject
  async destroy({ params, response }: HttpContext, project: Project) {
    const application = await project
      .related('applications')
      .query()
      .where('slug', params.applicationSlug)
      .firstOrFail()

    await application.delete()

    return response.redirect().toPath(`/projects/${project.slug}/applications`)
  }
}
