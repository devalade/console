import { IDriverDeploymentsService } from '#drivers/idriver'
import Application from '#models/application'
import Deployment from '#models/deployment'
import FlyApi from './api/fly_api.js'
import FlyDeploymentsConfigurationBuilder from './fly_deployments_configuration_builder.js'

export default class FlyDeploymentsService implements IDriverDeploymentsService {
  private readonly flyDeploymentsConfigurationBuilder: FlyDeploymentsConfigurationBuilder
  private readonly flyApi: FlyApi
  constructor() {
    this.flyApi = new FlyApi()
    this.flyDeploymentsConfigurationBuilder = new FlyDeploymentsConfigurationBuilder(this.flyApi)
  }

  async igniteBuilder(application: Application, deployment: Deployment) {
    const flyBuilderName = this.flyApi.getFlyApplicationName(application.slug, true)
    const builderConfiguration =
      this.flyDeploymentsConfigurationBuilder.prepareBuilderConfiguration(deployment)
    const createdMachine = await this.flyApi.machines.createMachine(flyBuilderName, {
      config: builderConfiguration,
    })
    deployment.currentFlyMachineBuilderId = createdMachine.id
    await deployment.save()
  }

  async igniteApplication(application: Application, deployment: Deployment) {
    const flyApplicationName = this.flyApi.getFlyApplicationName(application.slug)
    const applicationConfiguration =
      this.flyDeploymentsConfigurationBuilder.prepareApplicationConfiguration(application)
    const createdMachine = await this.flyApi.machines.createMachine(flyApplicationName, {
      config: applicationConfiguration,
    })
    deployment.currentFlyMachineId = createdMachine.id
    await deployment.save()
  }

  shouldMonitorHealthcheck(application: Application, _deployment: Deployment) {
    return !!application.environmentVariables.PORT
  }
}
