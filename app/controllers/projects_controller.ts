import Project from '#models/project'
import { projectValidator } from '#validators/project_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProjectsController {
  async index({ auth, inertia }: HttpContext) {
    const projects = await auth.user!.related('projects').query()
    return inertia.render('projects/index', { projects })
  }

  async store({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(projectValidator)
    const project = await auth.user!.related('projects').create(payload)
    return response.redirect().toPath(`/projects/${project.slug}/applications`)
  }

  async edit({ bouncer, params, inertia, response }: HttpContext) {
    try {
      const project = await Project.query().where('slug', params.slug).firstOrFail()

      await bouncer.authorize('accessToProject', project)

      return inertia.render('projects/edit', { project })
    } catch {
      return response.notFound()
    }
  }

  async update({ bouncer, params, request, response }: HttpContext) {
    const payload = await request.validateUsing(projectValidator)

    try {
      const project = await Project.query().where('slug', params.slug).firstOrFail()

      await bouncer.authorize('accessToProject', project)

      await project.merge(payload).save()

      return response.redirect().back()
    } catch {
      return response.notFound()
    }
  }

  async destroy({ bouncer, params, response }: HttpContext) {
    try {
      const project = await Project.query().where('slug', params.slug).firstOrFail()

      await bouncer.authorize('accessToProject', project)

      await project.delete()

      return response.redirect().toPath('/projects')
    } catch {
      return response.notFound()
    }
  }
}
