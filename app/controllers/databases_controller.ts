import bindProject from '#decorators/bind_project'
import Project from '#models/project'
import { createDatabaseValidator } from '#validators/create_database_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class DatabasesController {
  @bindProject
  async index({ inertia }: HttpContext, project: Project) {
    const databases = await project.related('databases').query()

    return inertia.render('databases/index', { project, databases })
  }

  @bindProject
  async store({ request, response }: HttpContext, project: Project) {
    const payload = await request.validateUsing(createDatabaseValidator)

    await project.related('databases').create({
      name: payload.name,
      dbms: payload.dbms,
      username: payload.username,
      password: payload.password,
    })

    return response.redirect().back()
  }

  @bindProject
  async destroy({ params, response }: HttpContext, project: Project) {
    const database = await project
      .related('databases')
      .query()
      .where('slug', params.databaseSlug)
      .firstOrFail()
    await database.delete()

    return response.redirect().back()
  }
}
