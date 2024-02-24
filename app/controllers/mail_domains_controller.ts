import bindOrganization from '#decorators/bind_organization'
import Driver from '#drivers/driver'
import Organization from '#models/organization'
import { storeDomainValidator } from '#validators/store_domain'
import type { HttpContext } from '@adonisjs/core/http'

export default class DomainsController {
  private readonly driver = Driver.getDriver()

  @bindOrganization
  async index({ view }: HttpContext, organization: Organization) {
    const domains = await organization.related('mailDomains').query()
    return view.render('pages/dashboard/domains/index', { domains })
  }

  @bindOrganization
  async store({ request, response }: HttpContext, organization: Organization) {
    const { domain } = await request.validateUsing(storeDomainValidator)

    try {
      const dnsRecords = await this.driver.mails!.addDomain(domain)
      const createdDomain = await organization.related('mailDomains').create({
        domain,
        expectedDnsRecords: dnsRecords,
      })
      await createdDomain!.save()

      return response.redirect().toRoute('dashboard.domains.show', { id: createdDomain.id })
    } catch (error) {
      return response.badRequest('Failed to add domain')
    }
  }

  @bindOrganization
  async show({ params, view, response }: HttpContext, organization: Organization) {
    const domain = await organization
      .related('mailDomains')
      .query()
      .where('id', params.id)
      .firstOrFail()

    if (!domain) {
      return response.notFound()
    }

    return view.render('pages/dashboard/domains/show', { domain })
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
