import { IDriverDeploymentsService } from '#drivers/idriver'
import Application from '#models/application'
import Deployment, { DeploymentStatus } from '#models/deployment'
import Organization from '#models/organization'
import Project from '#models/project'
import logger from '@adonisjs/core/services/logger'
import FlyApi from './api/fly_api.js'
import FlyDeploymentsConfigurationBuilder from './fly_deployments_configuration_builder.js'
import emitter from '@adonisjs/core/services/emitter'

export default class FlyDeploymentsService implements IDriverDeploymentsService {
  #flyDeploymentsConfigurationBuilder: FlyDeploymentsConfigurationBuilder
  #flyApi: FlyApi

  constructor() {
    this.#flyApi = new FlyApi()
    this.#flyDeploymentsConfigurationBuilder = new FlyDeploymentsConfigurationBuilder(this.#flyApi)
  }

  async igniteBuilder(
    _organization: Organization,
    _project: Project,
    application: Application,
    deployment: Deployment
  ) {
    const flyBuilderName = this.#flyApi.getFlyApplicationName(application.slug, true)
    const builderConfiguration =
      this.#flyDeploymentsConfigurationBuilder.prepareBuilderConfiguration(deployment)
    const createdMachine = await this.#flyApi.machines.createMachine(flyBuilderName, {
      config: builderConfiguration,
    })
    deployment.currentFlyMachineBuilderId = createdMachine.id
    await deployment.save()
  }

  async igniteApplication(
    _organization: Organization,
    _project: Project,
    application: Application,
    deployment: Deployment
  ) {
    const flyApplicationName = this.#flyApi.getFlyApplicationName(application.slug)
    const applicationConfiguration =
      this.#flyDeploymentsConfigurationBuilder.prepareApplicationConfiguration(application)
    const createdMachine = await this.#flyApi.machines.createMachine(flyApplicationName, {
      config: applicationConfiguration,
    })

    deployment.currentFlyMachineId = createdMachine.id
    await deployment.save()

    await this.#monitorStartingDeployment(flyApplicationName, application, deployment)
  }

  async #monitorStartingDeployment(
    flyApplicationName: string,
    application: Application,
    deployment: Deployment
  ) {
    // Await for state started.
    logger.info(`Waiting for machine ${deployment.currentFlyMachineId} to be started.`)
    await this.#flyApi.machines.waitForMachineToBeStarted(
      flyApplicationName,
      deployment.currentFlyMachineId!
    )

    // Every 5 seconds for a maximum of 1 minute, check the status of the machine.
    let counter = 0

    const interval = setInterval(async () => {
      const machine = await this.#flyApi.machines.getMachine(
        flyApplicationName,
        deployment.currentFlyMachineId!
      )
      if (!machine) {
        return
      }

      /**
       * If the application does not have any healthcheck (i.e. no PORT),
       * and the machine is created, we can consider the deployment as successful.
       */
      if (machine!.checks.length === 0) {
        emitter.emit('deployments:success', [application, deployment])
        await this.#deletePreviousMachine(application, deployment)
        clearInterval(interval)
        return
      }

      const lastCheck = machine.checks[machine.checks.length - 1]

      if (lastCheck.status === 'passing') {
        emitter.emit('deployments:success', [application, deployment])
        emitter.emit(`fly:log:${flyApplicationName}`, {
          message: 'Health check is now passing.',
          timestamp: new Date().toISOString(),
        })
        await this.#deletePreviousMachine(application, deployment)
        clearInterval(interval)

        return
      }

      logger.info('Last check ' + lastCheck.status)

      counter++

      if (counter >= 12) {
        emitter.emit('deployments:failure', [application, deployment])
        clearInterval(interval)

        return
      }
    }, 5000)
  }

  /**
   * This function is responsible of deleting the previous running machines of successful deployments.
   */
  async #deletePreviousMachine(application: Application, deployment: Deployment) {
    const runningDeployment = await application
      .related('deployments')
      .query()
      .whereNot('id', deployment.id)
      .where('flyMachineDeleted', false)
      .where('status', DeploymentStatus.Success)
      .first()
    if (!runningDeployment) {
      return
    }

    const flyAppName = this.#flyApi.getFlyApplicationName(application.slug)

    await this.#flyApi.machines.deleteMachine(flyAppName, runningDeployment.currentFlyMachineId!)

    deployment.flyMachineDeleted = true
    await deployment.save()
  }

  shouldMonitorHealthcheck(
    _organization: Organization,
    _project: Project,
    application: Application,
    _deployment: Deployment
  ) {
    return !!application.environmentVariables.PORT
  }
}
