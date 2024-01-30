import Project from '#models/project'
import type { HttpContext } from '@adonisjs/core/http'

export default function bindProjectAndApplication(
  _target: any,
  _key: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = async function (this: any, ctx: HttpContext) {
    const { params, response, bouncer } = ctx
    try {
      const project = await Project.query().where('slug', params.projectSlug).firstOrFail()
      await bouncer.authorize('accessToProject', project)
      const application = await project
        .related('applications')
        .query()
        .where('slug', params.applicationSlug)
        .firstOrFail()
      return await originalMethod.call(this, ctx, project, application)
    } catch {
      return response.notFound()
    }
  }
}
