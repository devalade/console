import IDriver from '#drivers/idriver'
import DockerDatabasesService from './blank_databases_service.js'
import DockerApplicationsService from './blank_applications_service.js'
import DockerDeploymentsService from './blank_deployments_service.js'
import BlankApplicationsService from './blank_applications_service.js'
import BlankDatabasesService from './blank_databases_service.js'
import BlankDeploymentsService from './blank_deployments_service.js'

export default class BlankDriver implements IDriver {
  public applications: DockerApplicationsService
  public databases: DockerDatabasesService
  public deployments: DockerDeploymentsService

  constructor() {
    this.applications = new BlankApplicationsService()
    this.databases = new BlankDatabasesService()
    this.deployments = new BlankDeploymentsService()
  }

  initializeDriver() {
    throw new Error('Method not implemented.')
  }
}
