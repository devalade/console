import IDriver from '#drivers/idriver'
import BlankApplicationsService from './blank_applications_service.js'
import BlankDatabasesService from './blank_databases_service.js'
import BlankDeploymentsService from './blank_deployments_service.js'
import BlankStorageBucketsService from './blank_storage_buckets_service.js'

export default class BlankDriver implements IDriver {
  public applications = new BlankApplicationsService()
  public databases = new BlankDatabasesService()
  public deployments = new BlankDeploymentsService()
  public storageBuckets = new BlankStorageBucketsService()

  initializeDriver() {}
}
