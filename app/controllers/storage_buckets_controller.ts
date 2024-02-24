import bindProject from '#decorators/bind_project'
import bindProjectAndStorageBucket from '#decorators/bind_project_and_storage_bucket'
import Driver from '#drivers/driver'
import IDriver from '#drivers/idriver'
import Organization from '#models/organization'
import Project from '#models/project'
import StorageBucket from '#models/storage_bucket'
import { createStorageBucketValidator } from '#validators/create_storage_bucket_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class StorageBucketsController {
  private readonly driver: IDriver = Driver.getDriver()

  @bindProject
  public async index({ inertia }: HttpContext, project: Project) {
    await project.load('storageBuckets')

    return inertia.render('storage_buckets/index', { project })
  }

  @bindProject
  public async store({ request, response }: HttpContext, project: Project) {
    const payload = await request.validateUsing(createStorageBucketValidator)

    /**
     * We create a storage bucket with pending host, keyId and secretKey.
     * This task is performed before the actual creation of the storage bucket,
     * in order to give the actual name (slug) to the storage bucket.
     */
    const storageBucket = await project.related('storageBuckets').create({
      name: payload.name,
      host: 'pending',
      keyId: 'pending',
      secretKey: 'pending',
    })

    /**
     * We retrieve the actual host, keyId and secretKey from the driver.
     */
    const { host, keyId, secretKey } = await this.driver.storageBuckets!.createStorageBucket(
      project.organization as Organization,
      project,
      storageBucket.slug
    )

    /**
     * We update the storage bucket with the actual host, keyId and secretKey.
     */
    storageBucket.merge({ host, keyId, secretKey })
    await storageBucket.save()

    return response
      .redirect()
      .toPath(
        `/organizations/${project.organization.slug}/projects/${project.slug}/storage_buckets/${storageBucket.slug}`
      )
  }

  @bindProjectAndStorageBucket
  public async show({ inertia }: HttpContext, project: Project, storageBucket: StorageBucket) {
    const { bucketSize, files } = await this.driver.storageBuckets!.listFilesAndComputeSize(
      project.organization as Organization,
      project,
      storageBucket
    )
    return inertia.render('storage_buckets/show', { project, storageBucket, bucketSize, files })
  }

  @bindProjectAndStorageBucket
  public async edit({ inertia }: HttpContext, project: Project, storageBucket: StorageBucket) {
    return inertia.render('storage_buckets/edit', { project, storageBucket })
  }

  @bindProjectAndStorageBucket
  public async update(
    { request, response }: HttpContext,
    _project: Project,
    storageBucket: StorageBucket
  ) {
    const name = request.input('name')
    storageBucket.name = name
    await storageBucket.save()

    return response.redirect().back()
  }

  @bindProjectAndStorageBucket
  public async destroy({ response }: HttpContext, project: Project, storageBucket: StorageBucket) {
    await this.driver.storageBuckets!.deleteStorageBucket(
      project.organization as Organization,
      project,
      storageBucket
    )

    await storageBucket.delete()

    return response
      .redirect()
      .toPath(`/organizations/${project.organization.slug}/projects/${project.slug}`)
  }

  @bindProjectAndStorageBucket
  public async uploadFile(
    { request, response }: HttpContext,
    project: Project,
    storageBucket: StorageBucket
  ) {
    const file = request.file('file')

    if (!file) {
      return response.badRequest()
    }

    await this.driver.storageBuckets!.uploadFile(
      project.organization as Organization,
      project,
      storageBucket,
      file!.clientName,
      file!.tmpPath!,
      file!.headers['content-type'] || 'application/octet-stream'
    )

    return response.redirect().back()
  }

  @bindProjectAndStorageBucket
  public async downloadFile(
    { response, params }: HttpContext,
    project: Project,
    storageBucket: StorageBucket
  ) {
    const { file } = await this.driver.storageBuckets!.downloadFile(
      project.organization as Organization,
      project,
      storageBucket,
      params.filename
    )

    /**
     * Create readable stream from file and send it as response
     */
    response.header('Content-Type', 'application/octet-stream')
    response.header('Content-Disposition', `attachment; filename="${params.filename}"`)
    response.send(file)
  }

  @bindProjectAndStorageBucket
  public async deleteFile(
    { response, params }: HttpContext,
    project: Project,
    storageBucket: StorageBucket
  ) {
    await this.driver.storageBuckets!.deleteFile(
      project.organization as Organization,
      project,
      storageBucket,
      params.filename
    )

    return response.redirect().back()
  }
}
