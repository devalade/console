import bindProject from '#decorators/bind_project'
import Project from '#models/project'
import type { HttpContext } from '@adonisjs/core/http'

export default class GitRepositoriesController {
  @bindProject
  async index({ inertia }: HttpContext, project: Project) {
    return inertia.render('git_repositories/index', { project })
  }

  @bindProject
  async create({}: HttpContext, project: Project) {}

  async store({ request }: HttpContext) {}

  async show({ params }: HttpContext) {}

  async edit({ params }: HttpContext) {}

  async update({}: HttpContext) {}

  async destroy({ params }: HttpContext) {}
}
