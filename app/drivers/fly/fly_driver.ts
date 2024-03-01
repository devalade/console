import IDriver from '#drivers/idriver'
import DrapeauService from '#services/drapeau_service'
import FlyApplicationsService from './fly_applications_service.js'
import FlyDatabasesService from './fly_databases_service.js'
import FlyDeploymentsService from './fly_deployments_service.js'
import FlyDevMachinesService from './fly_dev_machines_service.js'

export default class FlyDriver implements IDriver {
  applications = new FlyApplicationsService()
  databases = new FlyDatabasesService()
  deployments = new FlyDeploymentsService()
  devMachines = new FlyDevMachinesService()

  initializeDriver() {
    DrapeauService.defineFeatureFlag('resources_configurator', () => true)
    DrapeauService.defineFeatureFlag('volumes_configurator', () => true)
    DrapeauService.defineFeatureFlag('storage_buckets', () => true)
  }
}
