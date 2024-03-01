import type { Response } from '@adonisjs/core/http'
import Application from '#models/application'
import Database from '#models/database'
import Deployment from '#models/deployment'
import { DnsEntries } from '#types/dns'
import Certificate, { CertificateStatus } from '#models/certificate'
import Organization from '#models/organization'
import Project from '#models/project'
import StorageBucket from '#models/storage_bucket'
import { StorageBucketFile } from '#types/storage'

export default interface IDriver {
  /**
   * This method should initialize the driver.
   * It is called when the console starts.
   * It should do things like defining feature flags, etc.
   */
  initializeDriver(): void | Promise<void>

  applications: IDriverApplicationsService
  databases: IDriverDatabasesService
  deployments: IDriverDeploymentsService
  storageBuckets?: IDriverStorageBucketsService
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

export interface IDriverStorageBucketsService {
  /**
   * This method should create a storage bucket,
   * and return the host, keyId and secretKey.
   * @param organization
   * @param project
   * @param name
   */
  createStorageBucket(
    organization: Organization,
    project: Project,
    name: string
  ):
    | { host: string; keyId: string; secretKey: string }
    | Promise<{ host: string; keyId: string; secretKey: string }>

  /**
   * This method should return the size of the storage bucket (in bytes).
   * @param organization
   * @param project
   * @param storageBucket
   */
  listFilesAndComputeSize(
    organization: Organization,
    project: Project,
    storageBucket: StorageBucket
  ):
    | { bucketSize: number; files: StorageBucketFile[] }
    | Promise<{ bucketSize: number; files: StorageBucketFile[] }>

  deleteStorageBucket(
    organization: Organization,
    project: Project,
    storageBucket: StorageBucket
  ): void | Promise<void>

  uploadFile(
    organization: Organization,
    project: Project,
    storageBucket: StorageBucket,
    filePath: string,
    tmpPath: string,
    contentType: string
  ): void | Promise<void>

  downloadFile(
    arg0: Organization,
    project: Project,
    storageBucket: StorageBucket,
    filename: any
  ): { file: string; contentType: string } | Promise<{ file: string; contentType: string }>

  deleteFile(
    organization: Organization,
    project: Project,
    bucket: StorageBucket,
    filename: string
  ): void | Promise<void>
}
