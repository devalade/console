import type { Response } from '@adonisjs/core/http'
import Application from '#models/application'
import Database from '#models/database'
import Deployment from '#models/deployment'
import { DnsEntries } from '#types/dns'
import Certificate, { CertificateStatus } from '#models/certificate'

export default interface IDriver {
  initializeDriver(): void | Promise<void>

  applications: IDriverApplicationsService
  databases: IDriverDatabasesService
  deployments: IDriverDeploymentsService
}

export interface IDriverApplicationsService {
  createApplication(application: Application): void | Promise<void>
  deleteApplication(application: Application): void | Promise<void>

  streamLogs(
    application: Application,
    response: Response,
    scope: 'application' | 'builder'
  ): void | Promise<void>

  createCertificate(application: Application, hostname: string): DnsEntries | Promise<DnsEntries>
  checkDnsConfiguration(
    application: Application,
    certificate: Certificate
  ): CertificateStatus | Promise<CertificateStatus>
  deleteCertificate(application: Application, hostname: string): void | Promise<void>
}

export interface IDriverDatabasesService {
  createDatabase(database: Database): void | Promise<void>
  deleteDatabase(database: Database): void | Promise<void>
}

export interface IDriverDeploymentsService {
  igniteBuilder(application: Application, deployment: Deployment): void | Promise<void>
  igniteApplication(application: Application, deployment: Deployment): void | Promise<void>
  shouldMonitorHealthcheck(
    application: Application,
    deployment: Deployment
  ): boolean | Promise<boolean>
}
