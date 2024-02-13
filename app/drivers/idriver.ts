import type { Response } from '@adonisjs/core/http'
import Application from '#models/application'
import Database from '#models/database'
import Deployment from '#models/deployment'
import { DnsEntries } from '#types/dns'
import Certificate, { CertificateStatus } from '#models/certificate'
import Organization from '#models/organization'
import Project from '#models/project'

export default interface IDriver {
  initializeDriver(): void | Promise<void>

  applications: IDriverApplicationsService
  databases: IDriverDatabasesService
  deployments: IDriverDeploymentsService
}

export interface IDriverApplicationsService {
  createApplication(
    organization: Organization,
    project: Project,
    application: Application
  ): void | Promise<void>

  deleteApplication(
    organization: Organization,
    project: Project,
    application: Application
  ): void | Promise<void>

  streamLogs(
    organization: Organization,
    project: Project,
    application: Application,
    response: Response,
    scope: 'application' | 'builder'
  ): void | Promise<void>

  createCertificate(
    organization: Organization,
    project: Project,
    application: Application,
    hostname: string
  ): DnsEntries | Promise<DnsEntries>

  checkDnsConfiguration(
    organization: Organization,
    project: Project,
    application: Application,
    certificate: Certificate
  ): CertificateStatus | Promise<CertificateStatus>

  deleteCertificate(
    organization: Organization,
    project: Project,
    application: Application,
    hostname: string
  ): void | Promise<void>
}

export interface IDriverDatabasesService {
  createDatabase(
    organization: Organization,
    project: Project,
    database: Database
  ): void | Promise<void>

  deleteDatabase(
    organization: Organization,
    project: Project,
    database: Database
  ): void | Promise<void>
}

export interface IDriverDeploymentsService {
  igniteBuilder(
    organization: Organization,
    project: Project,
    application: Application,
    deployment: Deployment
  ): void | Promise<void>

  igniteApplication(
    organization: Organization,
    project: Project,
    application: Application,
    deployment: Deployment
  ): void | Promise<void>

  shouldMonitorHealthcheck(
    organization: Organization,
    project: Project,
    application: Application,
    deployment: Deployment
  ): boolean | Promise<boolean>
}
