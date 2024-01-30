import bindProjectAndApplication from '#decorators/bind_project_and_application'
import Project from '#models/project'
import Application from '#models/application'
import { HttpContext } from '@adonisjs/core/http'
import EnvironmentVariablesService from '#services/environment_variables_service'

export default class EnvironmentVariablesController {
  private readonly environmentVariablesService = new EnvironmentVariablesService()

  @bindProjectAndApplication
  public async edit(
    { bouncer, request, inertia }: HttpContext,
    project: Project,
    application: Application
  ) {
    await bouncer.authorize('accessToProject', project)

    if (request.wantsJSON()) {
      return { environmentVariables: application.environmentVariables }
    }

    return inertia.render('applications/environment_variables', {
      project,
      application,
    })
  }

  @bindProjectAndApplication
  public async update(
    { bouncer, response, request }: HttpContext,
    project: Project,
    application: Application
  ) {
    await bouncer.authorize('accessToProject', project)

    const oldEnvironmentVariables = { ...application.environmentVariables }

    if (request.wantsJSON()) {
      application.environmentVariables = {
        ...oldEnvironmentVariables,
        ...request.body(),
      }
    } else {
      application.environmentVariables =
        this.environmentVariablesService.parseEnvironmentVariablesFromRequest(request)
    }

    await application.save()

    const deploymentWithSuccessStatus = await application
      .related('deployments')
      .query()
      .where('status', 'success')
      .orderBy('created_at', 'desc')
      .first()

    const applicationHasBeenSuccessfullyDeployed: boolean = deploymentWithSuccessStatus !== null

    const showRedeployChoice: boolean =
      applicationHasBeenSuccessfullyDeployed &&
      this.environmentVariablesService.haveEnvironmentVariablesChanged(
        oldEnvironmentVariables,
        application.environmentVariables
      )

    if (request.wantsJSON()) {
      return response.json({ success: true, showRedeployChoice })
    }

    return response
      .redirect()
      .withQs({ showRedeployChoice: showRedeployChoice || undefined })
      .back()
  }
}
