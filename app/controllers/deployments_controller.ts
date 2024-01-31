import bindProjectAndApplication from '#decorators/bind_project_and_application'
import type { HttpContext } from '@adonisjs/core/http'
import Application from '#models/application'
import Project from '#models/project'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import env from '#start/env'
import { readFile } from 'fs/promises'
import emitter from '@adonisjs/core/services/emitter'

export default class DeploymentsController {
  @bindProjectAndApplication
  async index({ inertia }: HttpContext, project: Project, application: Application) {
    const deployments = await application
      .related('deployments')
      .query()
      .orderBy('created_at', 'desc')
    return inertia.render('applications/deployments', { project, application, deployments })
  }

  @bindProjectAndApplication
  async store({ request, response }: HttpContext, _project: Project, application: Application) {
    const tarball = request.file('tarball', {
      size: '20mb',
      extnames: ['tar.gz'],
    })

    if (tarball === null) {
      return response.badRequest('No file uploaded.')
    }

    const s3Client = new S3Client({
      endpoint: env.get('S3_ENDPOINT'),
      region: env.get('S3_REGION'),
      credentials: {
        accessKeyId: env.get('S3_ACCESS_KEY'),
        secretAccessKey: env.get('S3_SECRET_KEY'),
      },
    })

    const fileToUploadToS3 = await readFile(tarball.tmpPath!)

    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.get('S3_BUCKET'),
        Key: `${application.slug}.tar.gz`,
        Body: fileToUploadToS3,
      })
    )

    const deployment = await application.related('deployments').create({
      origin: 'cli',
    })

    emitter.emit('deployments:created', [application, deployment])

    return {
      message: 'Igniting deployment...',
      healthcheck: !!application.environmentVariables.PORT,
    }
  }
}
