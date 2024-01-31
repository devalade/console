import Application from '#models/application'
import Database from '#models/database'
import Deployment from '#models/deployment'

export default interface IDriver {
  initializeDriver(): void | Promise<void>

  applications: IDriverApplicationsService
  databases: IDriverDatabasesService
  deployments: IDriverDeploymentsService
}

export interface IDriverApplicationsService {
  createApplication(application: Application): void | Promise<void>
  deleteApplication(application: Application): void | Promise<void>
}

export interface IDriverDatabasesService {
  createDatabase(database: Database): void | Promise<void>
  deleteDatabase(database: Database): void | Promise<void>
}

export interface IDriverDeploymentsService {
  igniteBuilder(application: Application, deployment: Deployment): void | Promise<void>
  igniteApplication(application: Application, deployment: Deployment): void | Promise<void>
}
