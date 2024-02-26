import bindProject from '#decorators/bind_project'
import Project from '#models/project'
import type { HttpContext } from '@adonisjs/core/http'

export default class MailApiKeysController {
  @bindProject
  async index({ inertia }: HttpContext, project: Project) {
    const mailDomains = await project.organization.related('mailDomains').query()
    const mailApiKeys = await project.organization.related('mailApiKeys').query()
    return inertia.render('mail_api_keys/index', { project, mailDomains, mailApiKeys })
  }

  @bindProject
  async store({ request, response }: HttpContext, project: Project) {
    const payload = request.only(['name', 'domain'])
    const mailDomain = await project.organization
      .related('mailDomains')
      .query()
      .where('domain', payload.domain)
      .first()
    await project.organization
      .related('mailApiKeys')
      .create({ name: payload.name, mailDomainId: mailDomain?.id || null })
    return response.redirect().back()
  }

  @bindProject
  async destroy({ response, params }: HttpContext, project: Project) {
    const mailApiKey = await project.organization
      .related('mailApiKeys')
      .query()
      .where('id', params.id)
      .firstOrFail()
    await mailApiKey.delete()
    return response.redirect().back()
  }
}
