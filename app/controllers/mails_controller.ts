import bindProject from '#decorators/bind_project'
import Project from '#models/project'
import type { HttpContext } from '@adonisjs/core/http'

export default class MailsController {
  @bindProject
  async overview({ inertia }: HttpContext, project: Project) {
    return inertia.render('mails/overview', { project })
  }
}
