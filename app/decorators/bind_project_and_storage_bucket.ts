import Project from '#models/project'
import StorageBucket from '#models/storage_bucket'
import type { HttpContext } from '@adonisjs/core/http'

export default function bindProjectAndStorageBucket(
  _target: any,
  _key: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = async function (this: any, ctx: HttpContext) {
    const { params, response, bouncer } = ctx
    let project: Project
    let storageBucket: StorageBucket
    try {
      project = await Project.query().where('slug', params.projectSlug).firstOrFail()
      await bouncer.authorize('accessToProject', project)
      await project.load('organization')
      storageBucket = await project
        .related('storageBuckets')
        .query()
        .where('slug', params.storageBucketSlug)
        .firstOrFail()
    } catch {
      return response.notFound()
    }
    return await originalMethod.call(this, ctx, project, storageBucket)
  }
}
