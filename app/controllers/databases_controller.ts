import Project from '#models/project'
import env from '#start/env'
import { createDatabaseValidator } from '#validators/create_database_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class DatabasesController {
  async index({ bouncer, inertia, params, response }: HttpContext) {
    try {
      const project = await Project.query().where('slug', params.projectSlug).firstOrFail()
      await bouncer.authorize('accessToProject', project)

      const databases = await project.related('databases').query()

      return inertia.render('databases/index', { project, databases })
    } catch {
      return response.notFound()
    }
  }

  async store({ bouncer, params, request, response }: HttpContext) {
    try {
      const project = await Project.query().where('slug', params.projectSlug).firstOrFail()
      await bouncer.authorize('accessToProject', project)

      const payload = await request.validateUsing(createDatabaseValidator)

      const wildcardDomain = env.get('TRAEFIK_WILDCARD_DOMAIN', 'softwarecitadel.app')

      await project.related('databases').create({
        name: payload.name,
        dbms: payload.dbms,
        username: payload.username,
        password: payload.password,
        host: `${project.slug}.${wildcardDomain}`,
      })

      return response.redirect().back()
    } catch {
      return response.notFound()
    }
  }

  async destroy({ bouncer, params, response }: HttpContext) {
    try {
      const project = await Project.query().where('slug', params.projectSlug).firstOrFail()
      await bouncer.authorize('accessToProject', project)

      const database = await project
        .related('databases')
        .query()
        .where('slug', params.databaseSlug)
        .firstOrFail()
      await database.delete()

      return response.redirect().back()
    } catch {
      return response.notFound()
    }
  }
}
