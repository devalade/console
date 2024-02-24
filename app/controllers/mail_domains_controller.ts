import bindOrganization from '#decorators/bind_organization'
import bindProject from '#decorators/bind_project'
import Driver from '#drivers/driver'
import Organization from '#models/organization'
import Project from '#models/project'
import { storeDomainValidator } from '#validators/store_domain'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class MailDomainsController {
  private readonly driver = Driver.getDriver()

  @bindProject
  async index({ inertia }: HttpContext, project: Project) {
    const domains = await project.organization.related('mailDomains').query()
    return inertia.render('mail_domains/index', { domains, project })
  }

  @bindProject
  async store({ request, response }: HttpContext, project: Project) {
    const { domain } = await request.validateUsing(storeDomainValidator)

    try {
      const dnsRecords = await this.driver.mails!.addDomain(domain)
      const createdDomain = await project.organization.related('mailDomains').create({
        domain,
        expectedDnsRecords: dnsRecords,
      })
      await createdDomain!.save()

      return response
        .redirect()
        .toPath(
          `/organizations/${project.organization.slug}/projects/${project.slug}/mail_domains/${createdDomain.id}`
        )
    } catch (error) {
      logger.error('Failed to add domain', error)
      return response.badRequest('Failed to add domain')
    }
  }

  @bindProject
  async show({ params, inertia, response }: HttpContext, project: Project) {
    const domain = await project.organization
      .related('mailDomains')
      .query()
      .where('id', params.id)
      .firstOrFail()

    if (!domain) {
      return response.notFound()
    }

    return inertia.render('mail_domains/show', { domain, project })
  }

  @bindOrganization
  async check({ params, response }: HttpContext, organization: Organization) {
    const domain = await organization
      .related('mailDomains')
      .query()
      .where('id', params.id)
      .firstOrFail()

    const isVerified = await this.driver.mails!.checkDomain(domain.domain)

    domain.isVerified = isVerified

    await domain.save()

    return response.json({ isVerified })
  }

  @bindOrganization
  async destroy({ response, params }: HttpContext, organization: Organization) {
    const domain = await organization
      ?.related('mailDomains')
      .query()
      .where('id', params.id)
      .firstOrFail()

    await domain?.delete()

    return response.redirect().back()
  }
}
