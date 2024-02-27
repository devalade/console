import bindProject from '#decorators/bind_project'
import MailDomain from '#models/mail_domain'
import Project from '#models/project'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class MailApiKeysController {
  @bindProject
  async index({ inertia }: HttpContext, project: Project) {
    const mailDomains = await project.organization.related('mailDomains').query()
    const mailApiKeys = await project.organization.related('mailApiKeys').query().preload('mailDomain')
    return inertia.render('mail_api_keys/index', { project, mailDomains, mailApiKeys })
  }

  @bindProject
  async store({ request, response }: HttpContext, project: Project) {
    const payload = request.only(['name', 'domain'])
    let mailDomain: MailDomain | null = null
    if (payload.domain) {
      mailDomain = await project.organization
        .related('mailDomains')
        .query()
        .where('domain', payload.domain)
        .first()
    }
    const mailApiKey = await project.organization
      .related('mailApiKeys')
      .create({ name: payload.name, mailDomainId: mailDomain?.id || null })
    logger.info('Mail API key created')
    if (request.wantsJSON()) {
      return mailApiKey
    }
    return response.redirect().back()
  }

  @bindProject
  async update({ request,response, params }: HttpContext, project: Project) {
    const payload = request.only(['name', 'domain'])
    let mailDomain: MailDomain | null = null

    if (payload.domain) {
      mailDomain = await project.organization
        .related('mailDomains')
        .query()
        .where('domain', payload.domain)
        .first()
    }
    const mailApiKey = await project.organization
      .related('mailApiKeys')
      .query()
      .where('id', params.id)
      .firstOrFail()
    await mailApiKey.merge({ name: payload.name, mailDomainId: mailDomain?.id || null }).save()
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
