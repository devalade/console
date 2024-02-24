import { IDriverApplicationsService } from '#drivers/idriver'
import Application from '#models/application'
import type { Response } from '@adonisjs/core/http'
import Certificate, { CertificateStatus } from '#models/certificate'
import { DnsEntries } from '#types/dns'
import Organization from '#models/organization'
import Project from '#models/project'

export default class BlankApplicationsService implements IDriverApplicationsService {
  createApplication(
    _organization: Organization,
    _project: Project,
    _application: Application
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
  deleteApplication(
    _organization: Organization,
    _project: Project,
    _application: Application
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
  streamLogs(
    _organization: Organization,
    _project: Project,
    _application: Application,
    _response: Response,
    _scope: 'application' | 'builder'
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
  createCertificate(
    _organization: Organization,
    _project: Project,
    _application: Application,
    _hostname: string
  ): DnsEntries | Promise<DnsEntries> {
    throw new Error('Method not implemented.')
  }
  checkDnsConfiguration(
    _organization: Organization,
    _project: Project,
    _application: Application,
    _certificate: Certificate
  ): CertificateStatus | Promise<CertificateStatus> {
    throw new Error('Method not implemented.')
  }
  deleteCertificate(
    _organization: Organization,
    _project: Project,
    _application: Application,
    _hostname: string
  ): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
}
