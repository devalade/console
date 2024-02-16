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

    const { host, keyId, secretKey } = await this.driver.storageBuckets!.createStorageBucket(
      project.organization as Organization,
      project,
      payload.name
    )

    const storageBucket = await project.related('storageBuckets').create({
      name: payload.name,
      host,
      keyId,
      secretKey,
    })

    return response
      .redirect()
      .toPath(
        `/organizations/${project.organization.slug}/projects/${project.slug}/storage_buckets/${storageBucket.slug}`
      )
  }

  @bindProjectAndStorageBucket
  public async show({ inertia }: HttpContext, project: Project, storageBucket: StorageBucket) {
    const bucketSize = await this.driver.storageBuckets!.getStorageBucketSize(
      project.organization as Organization,
      project,
      storageBucket
    )
    return inertia.render('storage_buckets/show', { project, storageBucket, bucketSize })
  }

  @bindProjectAndStorageBucket
  public async edit({ inertia }: HttpContext, project: Project, storageBucket: StorageBucket) {
    return inertia.render('storage_buckets/edit', { project, storageBucket })
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
      .toPath(
        `/organizations/${project.organization.slug}/projects/${project.slug}/storage_buckets`
      )
  }
}
