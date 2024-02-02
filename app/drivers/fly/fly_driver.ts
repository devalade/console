import IDriver from '#drivers/idriver'
import FlyApplicationsService from './fly_applications_service.js'
import FlyDatabasesService from './fly_databases_service.js'
import FlyDeploymentsService from './fly_deployments_service.js'

export default class FlyDriver implements IDriver {
  public applications: FlyApplicationsService
  public databases: FlyDatabasesService
  public deployments: FlyDeploymentsService

  constructor() {
    this.applications = new FlyApplicationsService()
    this.databases = new FlyDatabasesService()
    this.deployments = new FlyDeploymentsService()
  }

  initializeDriver() {}
}
