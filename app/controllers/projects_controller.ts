import bindOrganization from '#decorators/bind_organization'
import bindProject from '#decorators/bind_project'
import Organization from '#models/organization'
import Project from '#models/project'
import { projectValidator } from '#validators/project_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProjectsController {
  @bindOrganization
  async index({ request, inertia }: HttpContext, organization: Organization) {
    const projects = await organization.related('projects').query()
    if (request.wantsJSON()) {
      return projects
    }
    return inertia.render('projects/index', { projects })
  }

  @bindOrganization
  async store({ request, response }: HttpContext, organization: Organization) {
    const payload = await request.validateUsing(projectValidator)
    const project = await organization.related('projects').create(payload)
    if (request.wantsJSON()) {
      return project
    }
    return response
      .redirect()
      .toPath(`/organizations/${organization.slug}/projects/${project.slug}/applications`)
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
