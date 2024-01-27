import Project from '#models/project'
import { applicationValidator } from '#validators/application_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class ApplicationsController {
  async index({ bouncer, inertia, params, response }: HttpContext) {
    try {
      const project = await Project.query().where('id', params.projectId).firstOrFail()

      await bouncer.authorize('accessToProject', project)

      const applications = await project.related('applications').query()

      return inertia.render('applications/index', { project, applications })
    } catch {
      return response.notFound()
    }
  }

  async store({ bouncer, params, request, response }: HttpContext) {
    const payload = await request.validateUsing(applicationValidator)

    try {
      const project = await Project.query().where('id', params.projectId).firstOrFail()

      await bouncer.authorize('accessToProject', project)

      const application = await project.related('applications').create(payload)

      return response.redirect().toPath(`/projects/${project.id}/applications/${application.id}`)
    } catch {
      return response.notFound()
    }
  }

  async show({ bouncer, params, response, inertia }: HttpContext) {
    try {
      const project = await Project.query().where('id', params.projectId).firstOrFail()

      await bouncer.authorize('accessToProject', project)

      const application = await project
        .related('applications')
        .query()
        .where('id', params.applicationId)
        .firstOrFail()

      return inertia.render('applications/show', { project, application })
    } catch {
      return response.notFound()
    }
  }

  async edit({ bouncer, params, response, inertia }: HttpContext) {
    try {
      const project = await Project.query().where('id', params.projectId).firstOrFail()

      await bouncer.authorize('accessToProject', project)

      const application = await project
        .related('applications')
        .query()
        .where('id', params.applicationId)
        .firstOrFail()

      return inertia.render('applications/edit', { project, application })
    } catch {
      return response.notFound()
    }
  }

  async update({ bouncer, params, request, response }: HttpContext) {
    const payload = await request.validateUsing(applicationValidator)

    try {
      const project = await Project.query().where('id', params.projectId).firstOrFail()

      await bouncer.authorize('accessToProject', project)

      const application = await project
        .related('applications')
        .query()
        .where('id', params.applicationId)
        .firstOrFail()

      await application.merge(payload).save()

      return response.redirect().back()
    } catch {
      return response.notFound()
    }
  }

  async destroy({ bouncer, params, response }: HttpContext) {
    try {
      const project = await Project.query().where('id', params.projectId).firstOrFail()

      await bouncer.authorize('accessToProject', project)

      const application = await project
        .related('applications')
        .query()
        .where('id', params.applicationId)
        .firstOrFail()

      await application.delete()

      return response.redirect().toPath(`/projects/${project.id}/applications`)
    } catch {
      return response.notFound()
    }
  }
}
