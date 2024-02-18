import { IDriverApplicationsService } from '#drivers/idriver'
import Application from '#models/application'
import type { Response } from '@adonisjs/core/http'
import Certificate, { CertificateStatus } from '#models/certificate'
import { DnsEntries } from '#types/dns'
import Organization from '#models/organization'
import Project from '#models/project'

export default class BlankApplicationsService implements IDriverApplicationsService {
  createApplication(
    organization: Organization,
    project: Project,
    application: Application
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
  deleteApplication(
    organization: Organization,
    project: Project,
    application: Application
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
  streamLogs(
    organization: Organization,
    project: Project,
    application: Application,
    response: Response,
    scope: 'application' | 'builder'
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
  createCertificate(
    organization: Organization,
    project: Project,
    application: Application,
    hostname: string
  ): DnsEntries | Promise<DnsEntries> {
    throw new Error('Method not implemented.')
  }
  checkDnsConfiguration(
    organization: Organization,
    project: Project,
    application: Application,
    certificate: Certificate
  ): CertificateStatus | Promise<CertificateStatus> {
    throw new Error('Method not implemented.')
  }
  deleteCertificate(
    organization: Organization,
    project: Project,
    application: Application,
    hostname: string
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
}
