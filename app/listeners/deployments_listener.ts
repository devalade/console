import Driver from '#drivers/driver'
import Application from '#models/application'
import Deployment, { DeploymentStatus } from '#models/deployment'
import OctokitService from '#services/octokit_service'
import { inject } from '@adonisjs/core'

@inject()
export default class DeploymentsListener {
  constructor(private octokitService: OctokitService) {}

  async onCreated([application, deployment]: [Application, Deployment]) {
    const driver = Driver.getDriver()
    await driver.deployments.igniteBuilder(application, deployment)
  }

  async onSuccess([_, deployment]: [Application, Deployment]) {
    /**
     * Mark deployment as success, and save it.
     */
    deployment.status = DeploymentStatus.Success
    await deployment.save()

    /**
     * If the deployment's origin is GitHub, let's mark the GitHub check as success.
     */
    if (deployment.origin === 'github') {
      await this.octokitService.markSuccess(deployment)
    }
  }

  async onFailure([_, deployment]: [Application, Deployment]) {
    /**
     * Mark deployment as failed, and save it.
     */
    deployment.status = DeploymentStatus.DeploymentFailed
    await deployment.save()

    /**
     * If the deployment's origin is GitHub, let's mark the GitHub check as failed.
     */
    if (deployment.origin === 'github') {
      await this.octokitService.markFailure(deployment)
    }
  }
}
