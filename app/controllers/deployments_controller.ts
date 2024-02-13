import type { HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'
import { readFile } from 'fs/promises'
import bindProjectAndApplication from '#decorators/bind_project_and_application'
import Application from '#models/application'
import Deployment, { DeploymentStatus } from '#models/deployment'
import Project from '#models/project'
import Driver from '#drivers/driver'
import { inject } from '@adonisjs/core'
import CodeArchiveUploaderService from '#services/code_archive_uploader_service'

@inject()
export default class DeploymentsController {
  constructor(private codeArchiveUploaderService: CodeArchiveUploaderService) {}

  @bindProjectAndApplication
  async index({ inertia }: HttpContext, project: Project, application: Application) {
    const deployments = await application
      .related('deployments')
      .query()
      .orderBy('created_at', 'desc')
    return inertia.render('applications/deployments', { project, application, deployments })
  }

  @bindProjectAndApplication
  async store({ request, response }: HttpContext, project: Project, application: Application) {
    const tarball = request.file('tarball', {
      size: '20mb',
      extnames: ['tar.gz'],
    })

    if (tarball === null) {
      return response.badRequest('No file uploaded.')
    }

    const fileToUploadToS3 = await readFile(tarball.tmpPath!)
    await this.codeArchiveUploaderService.upload(application, fileToUploadToS3)

    const deployment = await application
      .related('deployments')
      .create({ origin: 'cli', status: DeploymentStatus.Building })

    const driver = Driver.getDriver()
    const shouldMonitorHealthcheck = driver.deployments.shouldMonitorHealthcheck(
      project.organization,
      project,
      application,
      deployment
    )

    return {
      message: 'Igniting deployment...',
      healthcheck: shouldMonitorHealthcheck,
    }
  }

  @bindProjectAndApplication
  async streamUpdates({ response }: HttpContext, _project: Project, application: Application) {
    response.useServerSentEvents()

    emitter.on(`deployments:updated:${application.slug}`, (deployment: Deployment) => {
      response.response.write(`data: ${JSON.stringify({ deployment })}\n\n`)
      response.response.flushHeaders()
    })

    response.response.on('close', () => {
      response.response.end()
    })

    return response.noContent()
  }
}
