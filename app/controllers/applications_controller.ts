import Project from '#models/project'
import { createApplicationValidator } from '#validators/create_application_validator'
import type { HttpContext } from '@adonisjs/core/http'
import bindProject from '#decorators/bind_project'
import bindProjectAndApplication from '#decorators/bind_project_and_application'
import Application from '#models/application'
import { updateApplicationValidator } from '#validators/update_application_validator'

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
    const payload = await request.validateUsing(createApplicationValidator)

    const application = await project.related('applications').create(payload)

    if (request.wantsJSON()) {
      return application
    }

    return response
      .redirect()
      .toPath(
        `/organizations/${project.organization.slug}/projects/${project.slug}/applications/${application.slug}`
      )
  }

  @bindProjectAndApplication
  async show({ inertia }: HttpContext, project: Project, application: Application) {
    return inertia.render('applications/show', { project, application })
  }

  @bindProjectAndApplication
  async edit({ inertia }: HttpContext, project: Project, application: Application) {
    return inertia.render('applications/edit', { project, application })
  }

  @bindProjectAndApplication
  async update({ request, response }: HttpContext, _project: Project, application: Application) {
    const { action, ...payload } = await request.validateUsing(updateApplicationValidator)

    if (action === 'DISCONNECT_GITHUB') {
      application.githubRepository = null

      await application.save()

      return response.redirect().back()
    } else {
      await application.merge(payload).save()
    }

    return response.redirect().back()
  }

  @bindProjectAndApplication
  async destroy({ response }: HttpContext, project: Project, application: Application) {
    await application.delete()

    return response
      .redirect()
      .toPath(`/organizations/${project.organization.slug}/projects/${project.slug}/applications`)
  }
}
