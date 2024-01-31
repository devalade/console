import bindProjectAndApplication from '#decorators/bind_project_and_application'
import Application from '#models/application'
import Project from '#models/project'
import type { HttpContext } from '@adonisjs/core/http'

export default class LogsController {
  @bindProjectAndApplication
  show({ inertia }: HttpContext, project: Project, application: Application) {
    return inertia.render('applications/logs', { project, application })
  }
}
