import bindProject from '#decorators/bind_project'
import Project from '#models/project'
import env from '#start/env'
import { createDatabaseValidator } from '#validators/create_database_validator'
import type { HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'

export default class DatabasesController {
  @bindProject
  async index({ inertia }: HttpContext, project: Project) {
    const databases = await project.related('databases').query()

    return inertia.render('databases/index', { project, databases })
  }

  @bindProject
  async store({ request, response }: HttpContext, project: Project) {
    const payload = await request.validateUsing(createDatabaseValidator)

    const wildcardDomain = env.get('TRAEFIK_WILDCARD_DOMAIN', 'softwarecitadel.app')

    const database = await project.related('databases').create({
      name: payload.name,
      dbms: payload.dbms,
      username: payload.username,
      password: payload.password,
      host: `${project.slug}.${wildcardDomain}`,
    })

    emitter.emit('databases:created', database)

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

    emitter.emit('databases:deleted', database)

    return response.redirect().back()
  }
}
