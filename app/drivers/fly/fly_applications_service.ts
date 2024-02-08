import Application from '#models/application'
import type { Response } from '@adonisjs/core/http'
import type { IDriverApplicationsService } from '#drivers/idriver'
import env from '#start/env'
import FlyApi from './api/fly_api.js'
import { AddressType } from './api/fly_networks_api.js'
import Certificate, { CertificateStatus } from '#models/certificate'
import { DnsEntries } from '#types/dns'
import emitter from '@adonisjs/core/services/emitter'

export default class FlyApplicationsService implements IDriverApplicationsService {
  private readonly flyApi: FlyApi = new FlyApi()

  async createApplication(application: Application) {
    /**
     * Create Fly.io applications for both the actual Software Citadel application and builder.
     */
    const builderName = this.flyApi.getFlyApplicationName(application.slug, true)
    await this.flyApi.apps.createApplication({
      app_name: builderName,
      org_slug: env.get('FLY_ORG', 'personal'),
    })

    const applicationName = this.flyApi.getFlyApplicationName(application.slug)
    await this.flyApi.apps.createApplication({
      app_name: applicationName,
      org_slug: env.get('FLY_ORG', 'personal'),
    })

    /**
     * Then, we allocate a shared IPV4 and a dedicated IPV6 address for the application.
     * We need these addresses to expose the application to the internet.
     */
    application.sharedIpv4 = await this.flyApi.networks.allocateSharedIpAddress({
      appId: applicationName,
      type: AddressType.shared_v4,
    })
    application.ipv6 = await this.flyApi.networks.allocateIpAddress({
      appId: applicationName,
      type: AddressType.v6,
    })
    await application.save()
  }

  async deleteApplication(application: Application) {
    const applicationName = this.flyApi.getFlyApplicationName(application.slug)
    const builderName = this.flyApi.getFlyApplicationName(application.slug, true)

    await this.flyApi.apps.deleteApplication(applicationName)
    await this.flyApi.apps.deleteApplication(builderName)
  }

  async streamLogs(application: Application, response: Response, scope: 'application' | 'builder') {
    const flyApplicationName = this.flyApi.getFlyApplicationName(
      application.slug,
      scope === 'builder'
    )
    emitter.on(`fly:log:${flyApplicationName}`, ({ message, timestamp }) => {
      response.response.write(`data: ${timestamp} | ${message}\n\n`)
      response.response.flushHeaders()
    })
  }

  async createCertificate(application: Application, hostname: string): Promise<DnsEntries> {
    const appId = this.flyApi.getFlyApplicationName(application.slug)
    await this.flyApi.certificates.addCertificate(appId, hostname)
    return [
      {
        type: 'A',
        name: hostname,
        value: application.sharedIpv4!,
      },
      {
        type: 'AAAA',
        name: hostname,
        value: application.ipv6!,
      },
    ]
  }

  checkDnsConfiguration(
    application: Application,
    certificate: Certificate
  ): Promise<CertificateStatus> {
    return this.flyApi.certificates.checkCertificate(application, certificate.domain)
  }

  async deleteCertificate(application: Application, hostname: string) {
    const appId = this.flyApi.getFlyApplicationName(application.slug)
    await this.flyApi.certificates.removeCertificate(appId, hostname)
  }
}
