import Application from '#models/application'
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
    let project: Project
    let application: Application
    try {
      project = await Project.query().where('slug', params.projectSlug).firstOrFail()
      await bouncer.authorize('accessToProject', project)
      await project.load('organization')
      application = await project
        .related('applications')
        .query()
        .where('slug', params.applicationSlug)
        .firstOrFail()
    } catch {
      return response.notFound()
    }
    return await originalMethod.call(this, ctx, project, application)
  }
}
