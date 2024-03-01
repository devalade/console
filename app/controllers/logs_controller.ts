import bindProjectAndApplication from '#decorators/bind_project_and_application'
import Driver from '#drivers/driver'
import Application from '#models/application'
import Project from '#models/project'
import type { HttpContext } from '@adonisjs/core/http'

export default class LogsController {
  @bindProjectAndApplication
  show({ inertia }: HttpContext, project: Project, application: Application) {
    return inertia.render('applications/logs', { project, application })
  }

  @bindProjectAndApplication
  async stream(ctx: HttpContext, project: Project, application: Application) {
    ctx.response.prepareServerSentEventsHeaders()
    const scope = ctx.request.qs().scope === 'builder' ? 'builder' : 'application'

    const driver = Driver.getDriver()
    await driver.applications.streamLogs(
      project.organization,
      project,
      application,
      ctx.response,
      scope
    )

    ctx.response.response.on('close', () => {
      ctx.response.response.end()
    })

    return ctx.response.noContent()
  }
}
