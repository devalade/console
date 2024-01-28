import bindProject from '#decorators/bind_project'
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

  @bindProject
  async edit({ inertia }: HttpContext, project: Project) {
    return inertia.render('projects/edit', { project })
  }

  @bindProject
  async update({ request, response }: HttpContext, project: Project) {
    const payload = await request.validateUsing(projectValidator)

    await project.merge(payload).save()

    return response.redirect().back()
  }

  @bindProject
  async destroy({ response }: HttpContext, project: Project) {
    await project.delete()

    return response.redirect().toPath('/projects')
  }
}
