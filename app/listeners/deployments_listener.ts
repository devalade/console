import Driver from '#drivers/driver'
import Application from '#models/application'
import Deployment, { DeploymentStatus } from '#models/deployment'
import Organization from '#models/organization'
import Project from '#models/project'
import OctokitService from '#services/octokit_service'
import { inject } from '@adonisjs/core'

@inject()
export default class DeploymentsListener {
  constructor(private octokitService: OctokitService) {}

  async onCreated([organization, project, application, deployment]: [
    Organization,
    Project,
    Application,
    Deployment,
  ]) {
    const driver = Driver.getDriver()
    await driver.deployments.igniteBuilder(organization, project, application, deployment)
  }

  async onSuccess([application, deployment]: [Application, Deployment]) {
    /**
     * Mark deployment as success, and save it.
     */
    deployment.status = DeploymentStatus.Success
    await deployment.save()

    /**
     * If the deployment's origin is GitHub, let's mark the GitHub check as success.
     */
    if (deployment.origin === 'github') {
      await this.octokitService.markSuccess(application, deployment)
    }
  }

  async onFailure([application, deployment]: [Application, Deployment]) {
    /**
     * Mark deployment as failed, and save it.
     */
    deployment.status = DeploymentStatus.DeploymentFailed
    await deployment.save()

    /**
     * If the deployment's origin is GitHub, let's mark the GitHub check as failed.
     */
    if (deployment.origin === 'github') {
      await this.octokitService.markFailure(application, deployment)
    }
  }
}
